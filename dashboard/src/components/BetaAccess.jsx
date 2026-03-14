import { motion } from 'framer-motion';
import './BetaAccess.css';

export default function BetaAccess({ onGetStarted }) {
    return (
        <section id="beta" className="beta-access">
            <div className="container">
                <motion.div
                    className="beta-card card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="beta-content">
                        <span className="badge badge-accent mono">Beta Access</span>
                        <h2 className="beta-title">Start <span className="text-gradient">Tracking Now</span></h2>
                        <p className="beta-desc">
                            Connect your Polymarket wallet to instantly see all your trades in one place.
                            No credit card, no sign-up forms — just pure data.
                        </p>
                        <div className="beta-actions">
                            <button className="btn btn-primary btn-lg" onClick={onGetStarted}>
                                Connect Wallet
                            </button>
                        </div>
                        <p className="beta-terms mono text-dim text-sm">
                            Takes &lt; 5 seconds.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
