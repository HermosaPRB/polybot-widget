import { motion } from 'framer-motion';
import './Footer.css';

export default function Footer({ onOpenAuth }) {
    return (
        <footer className="footer">
            <div className="container">
                <motion.div
                    className="footer-cta"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="footer-cta-content">
                        <h2>Ready to see your stats?</h2>
                        <p>Join the beta and connect your wallet in seconds.</p>
                    </div>
                    <button className="btn btn-primary btn-lg" onClick={onOpenAuth}>
                        Connect Wallet
                    </button>
                </motion.div>

                <div className="footer-bottom">
                    <div className="footer-brand">
                        <div className="logo mono">
                            <span className="text-gradient">■</span> POLYWIDGET
                        </div>
                        <p className="text-secondary mt-3">
                            The easiest way to track your Polymarket portfolio. Built for traders, by traders.
                        </p>
                    </div>

                    <div className="footer-links">
                        <div className="link-column">
                            <h4>Product</h4>
                            <a href="#features">How it Works</a>
                            <a href="#beta">Beta Access</a>
                            <a href="#faq">FAQ</a>
                        </div>

                        <div className="link-column">
                            <h4>Legal</h4>
                            <a href="#">Terms of Service</a>
                            <a href="#">Privacy Policy</a>
                            <a href="#">Disclaimer</a>
                        </div>
                    </div>
                </div>

                <div className="footer-legal">
                    <p className="text-dim text-sm text-center">
                        © {new Date().getFullYear()} PolyWidget by PolyBot. All rights reserved. <br />
                        Not affiliated with Polymarket.
                    </p>
                </div>
            </div>
        </footer>
    );
}
