import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ─── Animated Aurora Background ─── */
const AuroraBackground = () => (
  <div style={{
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0,
    background: '#0f172a',
    overflow: 'hidden'
  }}>
    <div style={{
      position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
      background: 'radial-gradient(circle at 50% 50%, rgba(74, 184, 160, 0.15), transparent 60%), radial-gradient(circle at 80% 20%, rgba(124, 92, 191, 0.15), transparent 50%), radial-gradient(circle at 20% 80%, rgba(59, 155, 212, 0.15), transparent 50%)',
      animation: 'auroraAnim 15s ease-in-out infinite alternate',
      filter: 'blur(60px)'
    }} />
    <style>{`
      @keyframes auroraAnim {
        0% { transform: rotate(0deg) scale(1); }
        50% { transform: rotate(180deg) scale(1.2); }
        100% { transform: rotate(360deg) scale(1); }
      }
    `}</style>
  </div>
);

/* ─── Login Page ─── */
const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);

  const { signIn, signUp, signInWithGithub } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      let res;
      if (isLogin) {
        res = await signIn({ email, password });
        // If login fails because account doesn't exist, auto-signup
        if (res.error && res.error.message.toLowerCase().includes('incorrect email')) {
          res = await signUp({ email, password });
        }
      } else {
        res = await signUp({ email, password });
        // If signup fails with 400/409 because email exists, auto-login
        if (res.error && res.error.message.toLowerCase().includes('already registered')) {
          res = await signIn({ email, password });
        }
      }
      
      if (res && res.error) throw res.error;
      
      navigate('/datasets');
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleGithub = async () => {
    try {
      const { error } = await signInWithGithub();
      if (error) throw error;
    } catch (err) { setError(err.message); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        * { box-sizing: border-box; }

        .lp-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          font-family: 'Inter', sans-serif;
        }

        /* ── Card: Apple liquid glass — LIGHT ── */
        .lp-card {
          position: relative;
          z-index: 10;
          display: flex;
          width: 100%;
          max-width: 1060px;
          min-height: 580px;
          border-radius: 32px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(48px) saturate(180%);
          -webkit-backdrop-filter: blur(48px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.85);
          box-shadow:
            0 2px 0 rgba(255, 255, 255, 0.9) inset,
            0 0 0 1px rgba(180, 200, 240, 0.2),
            0 24px 64px rgba(100, 130, 200, 0.12),
            0 4px 20px rgba(150, 180, 255, 0.08);
        }

        /* ── Left panel ── */
        .lp-left {
          flex: 1.15;
          padding: 56px 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: linear-gradient(145deg,
            rgba(230, 244, 255, 0.6) 0%,
            rgba(240, 235, 255, 0.5) 50%,
            rgba(230, 247, 243, 0.4) 100%);
          border-right: 1px solid rgba(255, 255, 255, 0.7);
        }

        .lp-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 16px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(100, 160, 240, 0.25);
          color: #4f83cc;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 28px;
          width: fit-content;
          box-shadow: 0 2px 8px rgba(100,140,220,0.1);
        }

        .lp-left h1 {
          font-size: 38px;
          font-weight: 800;
          line-height: 1.18;
          color: #1a2740;
          margin: 0 0 18px;
        }

        .lp-left h1 span {
          background: linear-gradient(135deg, #3b9bd4, #7c5cbf, #4ab8a0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .lp-left p {
          color: #617087;
          font-size: 15px;
          line-height: 1.75;
          margin: 0 0 40px;
        }

        .lp-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .lp-stat {
          padding: 15px 18px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 2px 10px rgba(100, 140, 200, 0.07);
        }

        .lp-stat-val {
          font-size: 18px;
          font-weight: 800;
          background: linear-gradient(135deg, #3b9bd4, #7c5cbf);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .lp-stat-label {
          font-size: 11px;
          color: #8fa3bc;
          margin-top: 3px;
          font-weight: 500;
          letter-spacing: 0.03em;
        }

        /* ── Right form panel ── */
        .lp-right {
          flex: 1;
          padding: 56px 50px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: rgba(255, 255, 255, 0.45);
        }

        .lp-right h2 {
          font-size: 28px;
          font-weight: 800;
          color: #1a2740;
          margin: 0 0 6px;
        }

        .lp-right > p {
          color: #7a8fa8;
          font-size: 14px;
          margin: 0 0 30px;
        }

        .lp-field { margin-bottom: 18px; }

        .lp-field label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #4e657c;
          margin-bottom: 8px;
        }

        .lp-input {
          width: 100%;
          padding: 13px 16px;
          background: rgba(255, 255, 255, 0.85);
          border: 1.5px solid rgba(200, 215, 235, 0.7);
          border-radius: 14px;
          font-size: 15px;
          color: #1a2740;
          outline: none;
          font-family: 'Inter', sans-serif;
          transition: border 0.2s, box-shadow 0.2s, background 0.2s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04) inset;
        }

        .lp-input::placeholder { color: #a8bdd0; }

        .lp-input:focus {
          background: #ffffff;
          border-color: #6ab0e4;
          box-shadow: 0 0 0 4px rgba(100, 170, 230, 0.15);
        }

        .lp-btn-primary {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #3b9bd4 0%, #7c5cbf 60%, #4ab8a0 100%);
          background-size: 200% 200%;
          animation: lpGrad 5s ease infinite;
          color: white;
          border: none;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          letter-spacing: 0.02em;
          font-family: 'Inter', sans-serif;
          margin-top: 4px;
          box-shadow: 0 4px 18px rgba(60,130,210,0.25);
        }

        @keyframes lpGrad {
          0%   { background-position: 0%   50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0%   50%; }
        }

        .lp-btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(60,130,210,0.35);
        }
        .lp-btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }

        .lp-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 22px 0;
          color: #b0c2d4;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
        }

        .lp-divider::before, .lp-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(160, 190, 220, 0.3);
        }

        .lp-btn-github {
          width: 100%;
          padding: 13px 16px;
          background: rgba(255, 255, 255, 0.85);
          color: #2d3a4a;
          border: 1.5px solid rgba(200, 215, 235, 0.7);
          border-radius: 14px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .lp-btn-github:hover {
          background: #ffffff;
          border-color: rgba(100, 160, 220, 0.4);
          box-shadow: 0 4px 18px rgba(80,140,200,0.12);
          transform: translateY(-1px);
        }

        .lp-toggle {
          text-align: center;
          margin-top: 22px;
          font-size: 13px;
          color: #7a8fa8;
        }

        .lp-toggle a {
          color: #4b90cc;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
        }
        .lp-toggle a:hover { text-decoration: underline; }

        .lp-error {
          padding: 12px 14px;
          border-radius: 12px;
          background: rgba(254, 235, 235, 0.9);
          border: 1px solid rgba(220, 100, 100, 0.2);
          color: #b94040;
          font-size: 13px;
          margin-bottom: 16px;
        }

        @media (max-width: 840px) {
          .lp-card  { flex-direction: column; min-height: unset; }
          .lp-left  { padding: 40px 36px; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.7); }
          .lp-right { padding: 36px; }
          .lp-left h1 { font-size: 30px; }
        }
      `}</style>

      <AuroraBackground />

      <div className="lp-page">
        <div className="lp-card">

          {/* Left */}
          <div className="lp-left">
            <div className="lp-badge">⚛ Quantum-Inspired Engine</div>

            <h1>Sort Smarter with <span>AAQ Algorithm</span></h1>

            <p>
              Adaptive Amplitude QuickSort uses quantum-inspired amplitude interference 
              for near-optimal pivot selection — benchmarked live against 5 classical algorithms.
            </p>

            <div className="lp-stats">
              <div className="lp-stat">
                <div className="lp-stat-val">O(n log n)</div>
                <div className="lp-stat-label">Avg. Complexity</div>
              </div>
              <div className="lp-stat">
                <div className="lp-stat-val">5 Algos</div>
                <div className="lp-stat-label">Live Benchmark</div>
              </div>
              <div className="lp-stat">
                <div className="lp-stat-val">CSV / XLSX</div>
                <div className="lp-stat-label">Dataset Support</div>
              </div>
              <div className="lp-stat">
                <div className="lp-stat-val">Real-time</div>
                <div className="lp-stat-label">Quantum Metrics</div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="lp-right">
            <h2>{isLogin ? 'Welcome back' : 'Create account'}</h2>
            <p>{isLogin ? 'Sign in to access your quantum workspace.' : "Get started — it's completely free."}</p>

            {error && <div className="lp-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="lp-field">
                <label>Email address</label>
                <input
                  type="email"
                  className="lp-input"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="lp-field">
                <label>Password</label>
                <input
                  type="password"
                  className="lp-input"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="lp-btn-primary" disabled={loading}>
                {loading ? 'Processing…' : isLogin ? 'Sign In →' : 'Create Account →'}
              </button>
            </form>

            <div className="lp-divider">OR CONTINUE WITH</div>

            <button type="button" className="lp-btn-github" onClick={handleGithub}>
              <svg height="20" width="20" viewBox="0 0 16 16" fill="#2d3a4a">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              Continue with GitHub
            </button>

            <div className="lp-toggle">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <a onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </a>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default LoginPage;
