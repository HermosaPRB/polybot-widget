import { motion } from 'framer-motion';
import Scene3D from './Scene3D';
import './Hero.css';

// Animation variants for staggered reveal
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
};

export default function Hero({ onGetStarted }) {
    return (
        <section className="hero">
            {/* 3D Scene Background */}
            <Scene3D />

            <div className="container hero-content">
                <motion.div
                    className="hero-text-content"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div className="hero-badge" variants={itemVariants}>
                        <span className="badge badge-accent mono">PolyWidget Beta</span>
                    </motion.div>

                    <motion.h1 className="hero-title" variants={itemVariants}>
                        Track your Polymarket portfolio, <span className="text-gradient">made easy.</span>
                    </motion.h1>

                    <motion.p className="hero-subtitle" variants={itemVariants}>
                        See all your active positions, realized gains, and live prices in one beautiful dashboard. Just connect your wallet — no setup required.
                    </motion.p>

                    <motion.div className="hero-actions" variants={itemVariants}>
                        <button className="btn btn-primary btn-lg" onClick={onGetStarted}>
                            Connect Wallet
                        </button>
                        <a href="#features" className="btn btn-secondary btn-lg">
                            See How It Works
                        </a>
                    </motion.div>

                    <motion.div className="hero-stats" variants={itemVariants}>
                        <div className="hero-stat">
                            <span className="hero-stat-value mono text-primary">$2.4M+</span>
                            <span className="hero-stat-label mono text-dim">Volume Tracked</span>
                        </div>
                        <div className="hero-stat-divider"></div>
                        <div className="hero-stat">
                            <span className="hero-stat-value mono text-primary">1,200+</span>
                            <span className="hero-stat-label mono text-dim">Traders</span>
                        </div>
                        <div className="hero-stat-divider"></div>
                        <div className="hero-stat">
                            <span className="hero-stat-value mono text-primary">Live</span>
                            <span className="hero-stat-label mono text-dim">Data Sync</span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
