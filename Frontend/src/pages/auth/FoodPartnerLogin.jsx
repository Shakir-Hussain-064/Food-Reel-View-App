import React, { useState } from 'react';
import '../../styles/auth-shared.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const FoodPartnerLogin = () => {
  const navigate = useNavigate();
  const { loginFoodPartner, error } = useAuth();
  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const foodPartner = await loginFoodPartner(email, password);
      navigate("/food-partner/" + foodPartner._id); // Redirect to food partner profile page after login
    } catch (err) {
      console.error(err);
      setLoginError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" role="region" aria-labelledby="partner-login-title">
        <header>
          <h1 id="partner-login-title" className="auth-title">Partner login</h1>
          <p className="auth-subtitle">Access your dashboard and manage orders.</p>
        </header>
        {loginError && <div className="auth-error">{loginError}</div>}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="business@example.com" autoComplete="email" />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Password" autoComplete="current-password" />
          </div>
          <button className="auth-submit" type="submit">Sign In</button>
        </form>
        <div className="auth-alt-action">
          New partner? <a href="/food-partner/register">Create an account</a>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;