import { useState } from 'react';
import './AuthModal.css';

export default function AuthModal({ isOpen, onClose }) {
    const [wallet, setWallet] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const trimmed = wallet.trim();

        // Basic 0x format validation
        if (!trimmed.startsWith('0x') || trimmed.length !== 42) {
            setError('Please enter a valid wallet address (0x... , 42 characters)');
            return;
        }

        setIsSubmitting(true);

        // Short delay for UX, then redirect to dashboard with the wallet in the URL
        setTimeout(() => {
            setIsSubmitting(false);
            window.location.href = `/dashboard?wallet=${trimmed}`;
        }, 600);
    };

    return (
        <div className="auth-overlay" onClick={onClose}>
            <div className="auth-modal" onClick={e => e.stopPropagation()}>
                <button className="auth-close" onClick={onClose}>&times;</button>

                <div className="auth-header">
                    <h2>Connect Wallet</h2>
                    <p className="text-secondary">Paste your public Polymarket wallet address to view your P&L.</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Wallet Address</label>
                        <input
                            type="text"
                            className="input mono"
                            placeholder="0x..."
                            value={wallet}
                            onChange={(e) => setWallet(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <button
                        type="submit"
                        className="btn btn-primary btn-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Loading...' : 'View My P&L'}
                    </button>
                </form>
            </div>
        </div>
    );
}
