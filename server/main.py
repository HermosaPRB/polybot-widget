"""
PolyWidget API — Multi-User Backend

Open API server that returns Polymarket P&L data for any wallet.
No API key needed — anyone can query any public wallet.

Usage:
    pip install -r requirements.txt
    python main.py
"""

import os
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

import polymarket

# ─── Config ───────────────────────────────────────────────────────────────────

load_dotenv()
PORT = int(os.getenv("PORT", "8000"))

# ─── App ──────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="PolyWidget API",
    description="Polymarket P&L data for any wallet",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/")
async def root():
    """Health check."""
    return {
        "service": "PolyWidget API",
        "status": "ok",
        "version": "2.0.0",
    }


@app.get("/pnl")
async def get_pnl(
    wallet: str = Query(..., description="Polymarket wallet address (0x...)")
):
    """
    Returns P&L data for any Polymarket wallet.

    Query params:
        wallet: Public wallet address (0x...)

    Returns:
        JSON with total P&L, realized, unrealized, and per-position breakdown.
    """
    # ── Validate wallet ──
    wallet = wallet.strip()
    if not wallet.startswith("0x") or len(wallet) != 42:
        raise HTTPException(
            status_code=400,
            detail="Invalid wallet address. Must be a 42-character 0x address.",
        )

    # ── Fetch P&L ──
    try:
        data = await polymarket.get_pnl(wallet)
        return data
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Error fetching data from Polymarket: {str(e)}",
        )


# ─── Run directly ────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=True)
