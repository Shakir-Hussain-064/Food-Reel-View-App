import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth-shared.css';

const ChooseRegister = () => {
  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" role="region" aria-labelledby="choose-register-title">
        <header>
          <h1 id="choose-register-title" className="auth-title">Register/Sign-in</h1>
          <p className="auth-subtitle">Pick how you want to join the platform.</p>
        </header>
        <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
          
          <Link to="/user/register" className="auth-submit" style={{textDecoration:'none', background:'var(--color-surface-alt)', color:'var(--color-text)', border:'1px solid var(--color-border)'}}>
            Register as User
          </Link>
          <Link to="/food-partner/register" className="auth-submit" style={{textDecoration:'none', background:'var(--color-surface-alt)', color:'var(--color-text)', border:'1px solid var(--color-border)'}}>
            Register as food partner
          </Link>
          <Link to="/user/login" className="auth-submit" style={{textDecoration:'none', background:'var(--color-surface-alt)', color:'var(--color-text)', border:'1px solid var(--color-border)'}}>
            Sign in as User
          </Link>
          <Link to="/food-partner/login" className="auth-submit" style={{textDecoration:'none', background:'var(--color-surface-alt)', color:'var(--color-text)', border:'1px solid var(--color-border)'}}>
            Sign in as food-Partner
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChooseRegister;