import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './PnlDashboard.css';

// Backend API URL — change this when you deploy
const API_URL = 'http://localhost:8000';

function formatPnl(value) {
    const prefix = value >= 0 ? '+$' : '-$';
    return prefix + Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatPercent(value) {
    const prefix = value >= 0 ? '+' : '';
    return prefix + value.toFixed(2) + '%';
}

function formatPrice(value) {
    return (value * 100).toFixed(1) + '¢';
}

function pnlClass(value) {
    return value >= 0 ? 'pnl-positive' : 'pnl-negative';
}

export default function PnlDashboard() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const wallet = searchParams.get('wallet');

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [lastRefresh, setLastRefresh] = useState(null);

    useEffect(() => {
        if (!wallet) {
            navigate('/');
            return;
        }
        fetchData();
    }, [wallet]);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const resp = await fetch(`${API_URL}/pnl?wallet=${wallet}`);
            if (!resp.ok) {
                const errData = await resp.json();
                throw new Error(errData.detail || 'Failed to fetch data');
            }
            const json = await resp.json();
            setData(json);
            setLastRefresh(new Date());
        } catch (err) {
            setError(err.message || 'Could not connect to server.');
        } finally {
            setLoading(false);
        }
    };

    // Auto-refresh every 30 seconds
    useEffect(() => {
        if (!wallet) return;
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [wallet]);

    const timeSinceRefresh = () => {
        if (!lastRefresh) return '—';
        const seconds = Math.floor((new Date() - lastRefresh) / 1000);
        if (seconds < 60) return 'Just now';
        return `${Math.floor(seconds / 60)}m ago`;
    };

    // ── Loading State ──
    if (loading && !data) {
        return (
            <div className="dashboard">
                <div className="dash-loading container">
                    <div className="loading-spinner"></div>
                    <p className="text-secondary">Fetching your Polymarket positions...</p>
                    <p className="text-dim mono" style={{ fontSize: 13 }}>{wallet}</p>
                </div>
            </div>
        );
    }

    // ── Error State ──
    if (error && !data) {
        return (
            <div className="dashboard">
                <div className="dash-error container">
                    <div className="error-icon">⚠️</div>
                    <h2>Something went wrong</h2>
                    <p className="text-secondary">{error}</p>
                    <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                        <button className="btn btn-primary" onClick={fetchData}>Try Again</button>
                        <button className="btn btn-secondary" onClick={() => navigate('/')}>Go Back</button>
                    </div>
                </div>
            </div>
        );
    }

    if (!data) return null;

    // ── Dashboard ──
    return (
        <div className="dashboard">
            {/* Dashboard Header */}
            <div className="dash-header container">
                <div>
                    <h1 className="dash-title">Portfolio Dashboard</h1>
                    <p className="text-dim" style={{ fontSize: 13 }}>
                        Wallet: <span className="mono text-secondary">{data.wallet}</span>
                    </p>
                </div>
                <div className="dash-header-actions">
                    <span className="badge badge-green">● LIVE</span>
                    <button
                        className={`btn btn-secondary ${loading ? 'refreshing' : ''}`}
                        onClick={fetchData}
                        disabled={loading}
                    >
                        {loading ? '↻ Refreshing...' : '↻ Refresh'}
                    </button>
                </div>
            </div>

            {/* P&L Summary Cards */}
            <div className="dash-summary container">
                <div className="summary-card card summary-total">
                    <div className="summary-label">Total P&L</div>
                    <div className={`summary-value mono ${pnlClass(data.total_pnl)}`}>
                        {formatPnl(data.total_pnl)}
                    </div>
                    <div className={`summary-percent mono ${pnlClass(data.total_percent || 0)}`}>
                        {formatPercent(data.total_percent || 0)}
                    </div>
                    <div className="summary-sub text-dim">
                        {data.position_count} active positions
                    </div>
                </div>
                <div className="summary-card card">
                    <div className="summary-label">Realized</div>
                    <div className={`summary-value-sm mono ${pnlClass(data.total_realized)}`}>
                        {formatPnl(data.total_realized)}
                    </div>
                    <div className="summary-sub text-dim">Settled gains</div>
                </div>
                <div className="summary-card card">
                    <div className="summary-label">Unrealized</div>
                    <div className={`summary-value-sm mono ${pnlClass(data.total_unrealized)}`}>
                        {formatPnl(data.total_unrealized)}
                    </div>
                    <div className="summary-sub text-dim">Open positions</div>
                </div>
                <div className="summary-card card">
                    <div className="summary-label">Last Update</div>
                    <div className="summary-value-sm mono text-accent">
                        {timeSinceRefresh()}
                    </div>
                    <div className="summary-sub text-dim">Auto-refreshes</div>
                </div>
            </div>

            {/* Daily Stats Row */}
            <div className="dash-daily container">
                <div className="daily-card card">
                    <span className="daily-label">Today's Volume</span>
                    <span className="daily-value mono">${(data.daily_volume || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="daily-card card">
                    <span className="daily-label">Trades Today</span>
                    <span className="daily-value mono">{data.daily_trades || 0}</span>
                </div>
                <div className="daily-card card">
                    <span className="daily-label">Bought Today</span>
                    <span className="daily-value mono pnl-positive">${(data.daily_buys || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="daily-card card">
                    <span className="daily-label">Sold Today</span>
                    <span className="daily-value mono pnl-negative">${(data.daily_sells || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
            </div>

            {/* Positions Table */}
            {data.positions.length > 0 ? (
                <div className="dash-positions container">
                    <div className="positions-header">
                        <h2>Open Positions</h2>
                        <span className="text-dim" style={{ fontSize: 13 }}>{data.positions.length} positions</span>
                    </div>

                    <div className="positions-table card">
                        <div className="table-header">
                            <span className="col-market">Market</span>
                            <span className="col-outcome">Side</span>
                            <span className="col-size">Size</span>
                            <span className="col-entry">Entry</span>
                            <span className="col-current">Current</span>
                            <span className="col-value">Value</span>
                            <span className="col-pnl">P&L</span>
                            <span className="col-pct">%</span>
                        </div>

                        {data.positions.map((pos, i) => (
                            <div key={i} className="table-row">
                                <span className="col-market">
                                    <span className={`row-dot ${pnlClass(pos.unrealized_pnl)}`}>●</span>
                                    {pos.title}
                                </span>
                                <span className="col-outcome">
                                    <span className={`badge ${pos.outcome === 'Yes' ? 'badge-green' : 'badge-red'}`}>
                                        {pos.outcome}
                                    </span>
                                </span>
                                <span className="col-size mono">{pos.size.toLocaleString()}</span>
                                <span className="col-entry mono text-dim">{formatPrice(pos.avg_price)}</span>
                                <span className="col-current mono">{formatPrice(pos.current_price)}</span>
                                <span className="col-value mono">${pos.current_value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                <span className={`col-pnl mono ${pnlClass(pos.unrealized_pnl)}`}>
                                    {formatPnl(pos.unrealized_pnl)}
                                </span>
                                <span className={`col-pct mono ${pnlClass(pos.percent_pnl || 0)}`}>
                                    {formatPercent(pos.percent_pnl || 0)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="dash-empty container">
                    <p className="text-secondary">No open positions found for this wallet.</p>
                </div>
            )}
        </div>
    );
}
