import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Navbar.css';

export default function Navbar({ onSignupClick }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            className={`navbar ${scrolled ? 'scrolled' : ''}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="container navbar-container">

                <a href="/" className="navbar-brand">
                    <span className="navbar-logo-icon mono text-gradient">■</span>
                    <span className="navbar-logo-text mono">POLYWIDGET</span>
                </a>

                {/* Desktop Nav */}
                <div className="navbar-links desktop-only">
                    <a href="#features">Specs</a>
                    <a href="#setup">Setup</a>
                    <a href="#faq">FAQ</a>
                </div>

                <div className="navbar-actions desktop-only">
                    <button className="btn btn-primary" onClick={onSignupClick}>
                        Connect
                    </button>
                </div>

                {/* Mobile menu toggle */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Mobile Nav */}
            {mobileMenuOpen && (
                <motion.div
                    className="mobile-menu"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                >
                    <a href="#features" onClick={() => setMobileMenuOpen(false)}>Specs</a>
                    <a href="#setup" onClick={() => setMobileMenuOpen(false)}>Setup</a>
                    <a href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
                    <div className="mobile-actions">
                        <button className="btn btn-primary btn-full" onClick={() => {
                            setMobileMenuOpen(false);
                            onSignupClick();
                        }}>
                            Connect Terminal
                        </button>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
}
