import React, { useState } from 'react';
import '../../styles/auth-shared.css';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../config/axios.config';
import toastService from '../../services/toast.service';

const UserLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const email = e.target.email.value;
    const password = e.target.password.value;

    // Basic validation
    if (!email || !password) {
      toastService.error('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      toastService.error('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      
      const response = await apiRequest.withToasts(
        () => apiRequest.post('/auth/user/login', { email, password }),
        {
          loading: 'Signing in...',
          success: 'Welcome back! 🎉',
        }
      );

      console.log('Login successful:', response.data);
      navigate("/"); // Redirect to home after login
      
    } catch (error) {
      console.error('Login failed:', error);
      // Error toast is handled by axios interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" role="region" aria-labelledby="user-login-title">
        <header>
          <h1 id="user-login-title" className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to continue your food journey.</p>
        </header>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="••••••••" autoComplete="current-password" />
          </div>
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="auth-alt-action">
          New here? <a href="/user/register">Create account</a>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;