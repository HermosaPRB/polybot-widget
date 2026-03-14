import { motion } from 'framer-motion';
import './Features.css';

const features = [
    {
        title: 'Instant Updates',
        description: 'We connect directly to Polymarket to give you live prices. No waiting for charts to refresh.',
        icon: '⚡',
    },
    {
        title: 'All Wallets in One Place',
        description: 'Have multiple wallets? PolyWidget adds them all up into one simple, clean dashboard view.',
        icon: '🔗',
    },
    {
        title: 'Easy P&L Tracking',
        description: 'See exactly how much money you’ve made (or lost) on active bets, separate from your settled cash.',
        icon: '📊',
    },
    {
        title: 'Home Screen Widgets',
        description: 'Keep an eye on your portfolio without opening an app using our free iOS widgets.',
        icon: '📱',
    },
    {
        title: 'Price Alerts (Coming Soon)',
        description: 'Tell us what price you’re watching, and we’ll send you a notification when it hits.',
        icon: '🔔',
    },
    {
        title: 'Trade History',
        description: 'Look back at your past bets to see what markets you win on most often.',
        icon: '📈',
    }
];

// Scroll animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' }
    }
};

export default function Features() {
    return (
        <section id="features" className="features">
            <div className="container">
                <motion.div
                    className="features-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="badge badge-accent mono">How it Works</span>
                    <h2 className="features-title">Everything you need to track your bets.</h2>
                    <p className="features-subtitle">
                        We built a tool that takes the headache out of tracking prediction markets.
                        So you can focus on trading.
                    </p>
                </motion.div>

                <motion.div
                    className="features-grid"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {features.map((feature, idx) => (
                        <motion.div key={idx} className="feature-card card" variants={cardVariants}>
                            <div className="feature-icon-wrapper">
                                <span className="feature-icon">{feature.icon}</span>
                            </div>
                            <h3 className="feature-card-title">{feature.title}</h3>
                            <p className="feature-card-desc">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
