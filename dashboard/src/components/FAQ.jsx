import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './FAQ.css';

const faqs = [
    {
        question: "Do I need to deposit any money?",
        answer: "No. PolyWidget simply reads your public data from the blockchain. We never ask for your private keys, and you can't deposit or trade through our app."
    },
    {
        question: "How is the data so fast?",
        answer: "We connect straight to Polymarket's data layer (Gamma) behind the scenes, so your dashboard updates in real-time without you ever having to refresh the page."
    },
    {
        question: "Is this safe to use?",
        answer: "100% safe. You only provide your public wallet address (like a username). We use that to find your trades and organize them neatly."
    },
    {
        question: "Is it free?",
        answer: "Yes! While we are in Beta, all features including live tracking and the mobile widgets are completely free to use."
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

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' }
    }
};

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section id="faq" className="faq">
            <div className="container">
                <motion.div
                    className="faq-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="badge badge-accent mono">Questions & Answers</span>
                    <h2 className="faq-title">Got questions?</h2>
                </motion.div>

                <motion.div
                    className="faq-list"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {faqs.map((faq, index) => {
                        const isOpen = index === openIndex;
                        return (
                            <motion.div
                                key={index}
                                className={`faq-item card ${isOpen ? 'active' : ''}`}
                                variants={itemVariants}
                                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                            >
                                <div className="faq-question">
                                    <h3>{faq.question}</h3>
                                    <span className={`faq-icon ${isOpen ? 'open' : ''}`}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </span>
                                </div>
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            className="faq-answer-wrapper"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="faq-answer">
                                                <p>{faq.answer}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
