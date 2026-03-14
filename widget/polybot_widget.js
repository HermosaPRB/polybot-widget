// ╔══════════════════════════════════════════════════════════════════════╗
// ║  PolyBot Widget — Polymarket P&L for iOS Home Screen               ║
// ║  Scriptable App (https://scriptable.app)                           ║
// ║                                                                    ║
// ║  Setup:                                                            ║
// ║  1. Install Scriptable from the App Store                          ║
// ║  2. Create a new script and paste this entire file                 ║
// ║  3. Edit the CONFIG below with your server URL and API key         ║
// ║  4. Add a Scriptable widget to your home screen                    ║
// ║  5. Long-press the widget → Edit Widget → choose this script      ║
// ╚══════════════════════════════════════════════════════════════════════╝

// ─── CONFIG (edit this!) ─────────────────────────────────────────────────────

const CONFIG = {
  SERVER_URL: "https://polybot-api.onrender.com",  // PolyBot API server
  WALLET: "0xYOUR_WALLET_ADDRESS",                 // Your Polymarket wallet (0x...)
};

// ─── THEME ───────────────────────────────────────────────────────────────────

const THEME = {
  bg:       new Color("#0D0F14"),      // Dark background
  card:     new Color("#161921"),      // Card surface
  green:    new Color("#00E676"),      // Positive P&L
  red:      new Color("#FF5252"),      // Negative P&L
  accent:   new Color("#818CF8"),      // Branding accent (purple)
  text:     new Color("#FFFFFF"),      // Primary text
  textDim:  new Color("#8B8FA3"),      // Secondary/dim text
  textMid:  new Color("#C5C8D6"),      // Mid-contrast text
};

const FONTS = {
  title:     Font.boldSystemFont(11),
  pnlLarge:  Font.boldMonospacedSystemFont(28),
  pnlMed:    Font.boldMonospacedSystemFont(22),
  pnlSmall:  Font.mediumMonospacedSystemFont(13),
  label:     Font.mediumSystemFont(10),
  labelBold: Font.boldSystemFont(10),
  small:     Font.regularSystemFont(9),
  posTitle:  Font.mediumSystemFont(11),
  posValue:  Font.boldMonospacedSystemFont(12),
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function formatPnl(value) {
  const prefix = value >= 0 ? "+$" : "-$";
  return prefix + Math.abs(value).toFixed(2);
}

function pnlColor(value) {
  return value >= 0 ? THEME.green : THEME.red;
}

function truncate(str, maxLen) {
  if (str.length <= maxLen) return str;
  return str.substring(0, maxLen - 1) + "…";
}

function timeAgo(isoString) {
  const now = new Date();
  const then = new Date(isoString);
  const mins = Math.floor((now - then) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

// ─── FETCH DATA ──────────────────────────────────────────────────────────────

async function fetchPnlData() {
  const url = `${CONFIG.SERVER_URL}/pnl?wallet=${CONFIG.WALLET}`;
  const req = new Request(url);
  req.timeoutInterval = 10;

  try {
    const data = await req.loadJSON();
    return data;
  } catch (e) {
    return null;
  }
}

// ─── SMALL WIDGET ────────────────────────────────────────────────────────────

function buildSmallWidget(data) {
  const w = new ListWidget();
  w.backgroundColor = THEME.bg;
  w.setPadding(14, 14, 14, 14);

  // ── Header ──
  const headerStack = w.addStack();
  headerStack.layoutHorizontally();
  headerStack.centerAlignContent();

  const dot = headerStack.addText("◆");
  dot.font = Font.boldSystemFont(10);
  dot.textColor = THEME.accent;

  headerStack.addSpacer(5);

  const brandText = headerStack.addText("POLYBOT");
  brandText.font = Font.boldSystemFont(11);
  brandText.textColor = THEME.textMid;

  headerStack.addSpacer();

  w.addSpacer(6);

  // ── Label ──
  const label = w.addText("Total P&L");
  label.font = FONTS.label;
  label.textColor = THEME.textDim;

  w.addSpacer(4);

  // ── P&L Value ──
  if (!data) {
    const errText = w.addText("Connection error");
    errText.font = FONTS.pnlSmall;
    errText.textColor = THEME.red;
  } else {
    const pnlText = w.addText(formatPnl(data.total_pnl));
    pnlText.font = FONTS.pnlLarge;
    pnlText.textColor = pnlColor(data.total_pnl);
    pnlText.minimumScaleFactor = 0.6;
  }

  w.addSpacer(4);

  // ── Breakdown ──
  if (data) {
    const breakStack = w.addStack();
    breakStack.layoutHorizontally();

    const realLabel = breakStack.addText("R: ");
    realLabel.font = FONTS.small;
    realLabel.textColor = THEME.textDim;

    const realVal = breakStack.addText(formatPnl(data.total_realized));
    realVal.font = Font.boldMonospacedSystemFont(9);
    realVal.textColor = pnlColor(data.total_realized);

    breakStack.addSpacer(8);

    const unrLabel = breakStack.addText("U: ");
    unrLabel.font = FONTS.small;
    unrLabel.textColor = THEME.textDim;

    const unrVal = breakStack.addText(formatPnl(data.total_unrealized));
    unrVal.font = Font.boldMonospacedSystemFont(9);
    unrVal.textColor = pnlColor(data.total_unrealized);
  }

  w.addSpacer();

  // ── Footer ──
  const footerStack = w.addStack();
  footerStack.layoutHorizontally();

  const posCount = footerStack.addText(
    data ? `${data.position_count} positions` : "—"
  );
  posCount.font = FONTS.small;
  posCount.textColor = THEME.textDim;

  footerStack.addSpacer();

  if (data && data.updated_at) {
    const updated = footerStack.addText(timeAgo(data.updated_at));
    updated.font = FONTS.small;
    updated.textColor = THEME.textDim;
  }

  return w;
}

// ─── MEDIUM WIDGET ───────────────────────────────────────────────────────────

function buildMediumWidget(data) {
  const w = new ListWidget();
  w.backgroundColor = THEME.bg;
  w.setPadding(12, 14, 12, 14);

  // ── Top Row: Brand + Total P&L ──
  const topStack = w.addStack();
  topStack.layoutHorizontally();
  topStack.centerAlignContent();

  // Brand
  const brandStack = topStack.addStack();
  brandStack.layoutHorizontally();
  brandStack.centerAlignContent();

  const dot = brandStack.addText("◆");
  dot.font = Font.boldSystemFont(9);
  dot.textColor = THEME.accent;
  brandStack.addSpacer(4);

  const brandText = brandStack.addText("POLYBOT");
  brandText.font = Font.boldSystemFont(10);
  brandText.textColor = THEME.textMid;

  topStack.addSpacer();

  // Total P&L (right side)
  if (data) {
    const pnlStack = topStack.addStack();
    pnlStack.layoutVertically();

    const pnlLabel = pnlStack.addText("TOTAL P&L");
    pnlLabel.font = Font.boldSystemFont(8);
    pnlLabel.textColor = THEME.textDim;
    pnlLabel.rightAlignText();

    const pnlVal = pnlStack.addText(formatPnl(data.total_pnl));
    pnlVal.font = FONTS.pnlMed;
    pnlVal.textColor = pnlColor(data.total_pnl);
    pnlVal.rightAlignText();
    pnlVal.minimumScaleFactor = 0.6;
  }

  w.addSpacer(6);

  // ── Divider ──
  const dividerStack = w.addStack();
  dividerStack.layoutHorizontally();
  dividerStack.addSpacer();
  const divider = dividerStack.addText("─".repeat(40));
  divider.font = Font.regularSystemFont(6);
  divider.textColor = new Color("#2A2D3A");
  dividerStack.addSpacer();

  w.addSpacer(4);

  // ── Positions List (top 4) ──
  if (!data) {
    const errText = w.addText("Unable to connect to server");
    errText.font = FONTS.posTitle;
    errText.textColor = THEME.red;
  } else if (data.positions.length === 0) {
    const emptyText = w.addText("No open positions");
    emptyText.font = FONTS.posTitle;
    emptyText.textColor = THEME.textDim;
  } else {
    const topPositions = data.positions.slice(0, 4);

    for (let i = 0; i < topPositions.length; i++) {
      const pos = topPositions[i];

      const row = w.addStack();
      row.layoutHorizontally();
      row.centerAlignContent();

      // Outcome indicator dot
      const indicator = row.addText("●");
      indicator.font = Font.boldSystemFont(6);
      indicator.textColor = pnlColor(pos.unrealized_pnl);

      row.addSpacer(5);

      // Title
      const titleText = row.addText(truncate(pos.title, 28));
      titleText.font = FONTS.posTitle;
      titleText.textColor = THEME.text;
      titleText.lineLimit = 1;

      row.addSpacer();

      // Unrealized P&L
      const pnlText = row.addText(formatPnl(pos.unrealized_pnl));
      pnlText.font = FONTS.posValue;
      pnlText.textColor = pnlColor(pos.unrealized_pnl);
      pnlText.rightAlignText();

      if (i < topPositions.length - 1) {
        w.addSpacer(3);
      }
    }
  }

  w.addSpacer();

  // ── Footer ──
  const footerStack = w.addStack();
  footerStack.layoutHorizontally();

  if (data) {
    // Realized / Unrealized breakdown
    const realText = footerStack.addText(
      `R: ${formatPnl(data.total_realized)}  U: ${formatPnl(data.total_unrealized)}`
    );
    realText.font = Font.mediumMonospacedSystemFont(8);
    realText.textColor = THEME.textDim;
  }

  footerStack.addSpacer();

  if (data && data.updated_at) {
    const updated = footerStack.addText(timeAgo(data.updated_at));
    updated.font = FONTS.small;
    updated.textColor = THEME.textDim;
  }

  return w;
}

// ─── ERROR WIDGET ────────────────────────────────────────────────────────────

function buildErrorWidget(message) {
  const w = new ListWidget();
  w.backgroundColor = THEME.bg;
  w.setPadding(14, 14, 14, 14);

  const headerStack = w.addStack();
  headerStack.layoutHorizontally();
  headerStack.centerAlignContent();

  const dot = headerStack.addText("◆");
  dot.font = Font.boldSystemFont(10);
  dot.textColor = THEME.red;
  headerStack.addSpacer(5);

  const brandText = headerStack.addText("POLYBOT");
  brandText.font = Font.boldSystemFont(11);
  brandText.textColor = THEME.textMid;

  w.addSpacer();

  const errText = w.addText(message);
  errText.font = FONTS.posTitle;
  errText.textColor = THEME.red;
  errText.centerAlignText();

  w.addSpacer();

  const hintText = w.addText("Check CONFIG in script");
  hintText.font = FONTS.small;
  hintText.textColor = THEME.textDim;
  hintText.centerAlignText();

  return w;
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  // Validate config
  if (
    CONFIG.WALLET === "0xYOUR_WALLET_ADDRESS" ||
    !CONFIG.WALLET.startsWith("0x") ||
    CONFIG.WALLET.length !== 42
  ) {
    const w = buildErrorWidget("Set your wallet\naddress in CONFIG");
    if (config.runsInWidget) {
      Script.setWidget(w);
    } else {
      await w.presentMedium();
    }
    Script.complete();
    return;
  }

  // Fetch data
  const data = await fetchPnlData();

  // Build widget based on family
  let widget;
  const family = config.widgetFamily;

  if (family === "medium") {
    widget = buildMediumWidget(data);
  } else {
    // Default to small
    widget = buildSmallWidget(data);
  }

  // Display
  if (config.runsInWidget) {
    Script.setWidget(widget);
  } else {
    // Preview when running in Scriptable app
    if (family === "medium") {
      await widget.presentMedium();
    } else {
      await widget.presentSmall();
    }
  }

  Script.complete();
}

await main();
