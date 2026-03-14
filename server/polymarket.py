"""
Polymarket API client and P&L calculation engine.

Fetches wallet positions from the Polymarket Data API,
which includes current prices and P&L calculations.
Also fetches daily activity to calculate daily P&L.
"""

import time
import httpx
from datetime import datetime, timezone

# ─── API Endpoints ────────────────────────────────────────────────────────────

DATA_API_BASE = "https://data-api.polymarket.com"

# ─── Per-Wallet Cache ─────────────────────────────────────────────────────────

CACHE_TTL = 120  # 2 minutes
_cache: dict[str, dict] = {}


def _cache_is_valid(wallet: str) -> bool:
    entry = _cache.get(wallet.lower())
    return (
        entry is not None
        and entry["data"] is not None
        and (time.time() - entry["timestamp"]) < CACHE_TTL
    )


def _get_cache(wallet: str):
    entry = _cache.get(wallet.lower())
    return entry["data"] if entry else None


def _set_cache(wallet: str, data) -> None:
    _cache[wallet.lower()] = {
        "data": data,
        "timestamp": time.time(),
    }


def invalidate_cache(wallet: str = None) -> None:
    if wallet:
        _cache.pop(wallet.lower(), None)
    else:
        _cache.clear()


# ─── Data API: Fetch Positions ───────────────────────────────────────────────

async def fetch_positions(wallet: str) -> list[dict]:
    url = f"{DATA_API_BASE}/positions"
    params = {
        "user": wallet.lower(),
        "sizeThreshold": "0.01",
        "limit": "100",
    }
    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.get(url, params=params)
        resp.raise_for_status()
        return resp.json()


# ─── Data API: Fetch Today's Activity ────────────────────────────────────────

async def fetch_daily_activity(wallet: str) -> list[dict]:
    """Fetch today's trades to compute daily P&L."""
    today_start = datetime.combine(
        datetime.now(timezone.utc).date(),
        datetime.min.time(),
    ).replace(tzinfo=timezone.utc)
    start_ts = int(today_start.timestamp())

    all_activity = []
    offset = 0
    limit = 100

    async with httpx.AsyncClient(timeout=15.0) as client:
        # Paginate through today's activity
        while True:
            resp = await client.get(
                f"{DATA_API_BASE}/activity",
                params={
                    "user": wallet.lower(),
                    "start": str(start_ts),
                    "limit": str(limit),
                    "offset": str(offset),
                },
            )
            resp.raise_for_status()
            batch = resp.json()
            if not batch:
                break
            all_activity.extend(batch)
            if len(batch) < limit:
                break
            offset += limit

    return all_activity


# ─── Calculate Daily P&L ─────────────────────────────────────────────────────

def calc_daily_pnl(activity: list[dict]) -> dict:
    """
    Calculate daily trading volume and approximate daily P&L from activity.
    Returns { daily_volume, daily_trades, daily_buys, daily_sells }
    """
    total_volume = 0.0
    buy_volume = 0.0
    sell_volume = 0.0
    trade_count = 0

    for act in activity:
        if act.get("type") != "TRADE":
            continue
        usdc = float(act.get("usdcSize", 0))
        total_volume += usdc
        trade_count += 1
        if act.get("side") == "BUY":
            buy_volume += usdc
        else:
            sell_volume += usdc

    return {
        "daily_volume": round(total_volume, 2),
        "daily_trades": trade_count,
        "daily_buys": round(buy_volume, 2),
        "daily_sells": round(sell_volume, 2),
    }


# ─── Build Response from Data API ─────────────────────────────────────────────

def build_response(raw_positions: list[dict]) -> dict:
    positions = []
    total_realized = 0.0
    total_unrealized = 0.0
    total_initial_value = 0.0

    for pos in raw_positions:
        size = float(pos.get("size", 0))
        if size <= 0:
            continue

        avg_price = float(pos.get("avgPrice", 0))
        current_price = float(pos.get("curPrice", 0))
        realized = float(pos.get("realizedPnl", 0))
        unrealized = float(pos.get("cashPnl", 0))
        percent_pnl = float(pos.get("percentPnl", 0))
        initial_value = float(pos.get("initialValue", 0))

        cost_basis = round(size * avg_price, 2)
        current_value = round(size * current_price, 2)

        title = pos.get("title", "Unknown Market")
        outcome = pos.get("outcome", "Unknown")

        positions.append({
            "title": str(title)[:80],
            "outcome": outcome,
            "size": round(size, 4),
            "avg_price": round(avg_price, 4),
            "current_price": round(current_price, 4),
            "cost_basis": round(cost_basis, 2),
            "current_value": round(current_value, 2),
            "unrealized_pnl": round(unrealized, 2),
            "realized_pnl": round(realized, 2),
            "percent_pnl": round(percent_pnl, 2),
        })

        total_realized += realized
        total_unrealized += unrealized
        total_initial_value += initial_value

    positions.sort(key=lambda p: abs(p["unrealized_pnl"]), reverse=True)

    total_pnl = total_realized + total_unrealized
    total_percent = round((total_pnl / total_initial_value * 100), 2) if total_initial_value > 0 else 0

    return {
        "total_pnl": round(total_pnl, 2),
        "total_realized": round(total_realized, 2),
        "total_unrealized": round(total_unrealized, 2),
        "total_percent": total_percent,
        "position_count": len(positions),
        "positions": positions,
    }


# ─── Top-Level: Get Full P&L Payload ─────────────────────────────────────────

async def get_pnl(wallet: str) -> dict:
    if _cache_is_valid(wallet):
        return _get_cache(wallet)

    import asyncio

    # Fetch positions and daily activity in parallel
    raw_positions, daily_activity = await asyncio.gather(
        fetch_positions(wallet),
        fetch_daily_activity(wallet),
    )

    # Build response
    result = build_response(raw_positions)

    # Add daily stats
    result.update(calc_daily_pnl(daily_activity))

    # Add metadata
    result["wallet"] = wallet
    result["updated_at"] = datetime.now(timezone.utc).isoformat()

    # Cache
    _set_cache(wallet, result)
    return result
