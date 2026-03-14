import { useState } from 'react';
import { motion } from 'framer-motion';
import './SetupGuide.css';

const WIDGET_SCRIPT_URL = 'https://raw.githubusercontent.com/HermosaPRB/polybot-widget/main/widget/polybot_widget.js';

const steps = [
    {
        number: '01',
        title: 'Install Scriptable',
        description: 'Download the free Scriptable app from the App Store. It lets you run JavaScript-powered widgets on your home screen.',
        action: {
            label: 'Open App Store',
            url: 'https://apps.apple.com/app/scriptable/id1405459188',
        },
    },
    {
        number: '02',
        title: 'Copy the Widget Script',
        description: 'Tap the button below to copy the PolyBot widget script. Then open Scriptable, tap "+", and paste it in.',
        action: {
            label: 'Copy Script',
            type: 'copy',
        },
    },
    {
        number: '03',
        title: 'Add Your Wallet Address',
        description: 'In the script, find the CONFIG section at the top and replace 0xYOUR_WALLET_ADDRESS with your Polymarket wallet address.',
        codePreview: `const CONFIG = {\n  SERVER_URL: "https://polybot-api.onrender.com",\n  WALLET: "0xYOUR_WALLET_ADDRESS",  // <-- paste here\n};`,
    },
    {
        number: '04',
        title: 'Add Widget to Home Screen',
        description: 'Long-press your home screen, tap "+", search for "Scriptable", choose Small or Medium, then long-press the widget and select your PolyBot script.',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 },
    },
};

const stepVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: 'easeOut' },
    },
};

export default function SetupGuide() {
    const [copied, setCopied] = useState(false);
    const [scriptLoading, setScriptLoading] = useState(false);

    const copyScript = async () => {
        setScriptLoading(true);
        try {
            const resp = await fetch(WIDGET_SCRIPT_URL);
            if (!resp.ok) throw new Error('Failed to fetch');
            const script = await resp.text();
            await navigator.clipboard.writeText(script);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        } catch {
            // Fallback: copy a message directing them to the script
            await navigator.clipboard.writeText(
                `Visit ${WIDGET_SCRIPT_URL} to get the PolyBot widget script.`
            );
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        } finally {
            setScriptLoading(false);
        }
    };

    return (
        <section id="setup" className="setup-guide">
            <div className="container">
                <motion.div
                    className="setup-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="badge badge-accent mono">Setup Guide</span>
                    <h2 className="setup-title">
                        Get your widget in{' '}
                        <span className="text-gradient">under 2 minutes</span>
                    </h2>
                    <p className="setup-subtitle">
                        Four quick steps to get your Polymarket P&L on your iPhone home screen.
                        No account needed.
                    </p>
                </motion.div>

                <motion.div
                    className="setup-steps"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                >
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            className="setup-step card"
                            variants={stepVariants}
                        >
                            <div className="step-number-wrapper">
                                <span className="step-number mono text-gradient">
                                    {step.number}
                                </span>
                                {idx < steps.length - 1 && (
                                    <div className="step-connector" />
                                )}
                            </div>

                            <div className="step-content">
                                <h3 className="step-title">{step.title}</h3>
                                <p className="step-desc">{step.description}</p>

                                {step.codePreview && (
                                    <pre className="step-code mono">
                                        <code>{step.codePreview}</code>
                                    </pre>
                                )}

                                {step.action && step.action.type === 'copy' && (
                                    <button
                                        className={`btn ${copied ? 'btn-copied' : 'btn-primary'}`}
                                        onClick={copyScript}
                                        disabled={scriptLoading}
                                    >
                                        {scriptLoading
                                            ? 'Loading...'
                                            : copied
                                            ? 'Copied!'
                                            : 'Copy Script to Clipboard'}
                                    </button>
                                )}

                                {step.action && step.action.url && (
                                    <a
                                        href={step.action.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-secondary"
                                    >
                                        {step.action.label} &rarr;
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
