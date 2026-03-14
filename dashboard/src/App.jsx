import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import BetaAccess from './components/BetaAccess';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import SetupGuide from './components/SetupGuide';
import PnlDashboard from './pages/PnlDashboard';

function LandingPage({ onSignup }) {
  return (
    <>
      <Hero onGetStarted={onSignup} />
      <Features />
      <SetupGuide />
      <BetaAccess onGetStarted={onSignup} />
      <FAQ />
      <Footer />
    </>
  );
}

export default function App() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <BrowserRouter>
      <Navbar onSignupClick={() => setShowAuth(true)} />
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />

      <Routes>
        <Route path="/" element={<LandingPage onSignup={() => setShowAuth(true)} />} />
        <Route path="/dashboard" element={<PnlDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
