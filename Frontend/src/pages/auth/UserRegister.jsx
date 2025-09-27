import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth-shared.css';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../config/axios.config';
import toastService from '../../services/toast.service';

const UserRegister = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const firstName = e.target.firstName.value;
        const lastName = e.target.lastName.value;
        const email = e.target.email.value;
        const password = e.target.password.value;

        // Basic validation
        if (!firstName.trim() || !lastName.trim() || !email || !password) {
            toastService.error('Please fill in all fields');
            return;
        }

        if (!email.includes('@')) {
            toastService.error('Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
            toastService.error('Password must be at least 6 characters long');
            return;
        }

        try {
            setLoading(true);

            const response = await apiRequest.withToasts(
                () => apiRequest.post('/auth/user/register', {
                    fullName: firstName.trim() + " " + lastName.trim(),
                    email,
                    password
                }),
                {
                    loading: 'Creating your account...',
                    success: 'Account created successfully! Please login to continue.',
                }
            );

            console.log('Registration successful:', response.data);
            navigate("/user/login");

        } catch (error) {
            console.error('Registration failed:', error);
            // Error toast is handled by axios interceptor
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-card" role="region" aria-labelledby="user-register-title">
                <header>
                    <h1 id="user-register-title" className="auth-title">Create your account</h1>
                    <p className="auth-subtitle">Join to explore and enjoy delicious meals.</p>
                </header>
                <nav className="auth-alt-action" style={{ marginTop: '-4px' }}>
                    <strong style={{ fontWeight: 600 }}>Switch:</strong> <Link to="/user/register">User</Link> • <Link to="/food-partner/register">Food partner</Link>
                </nav>
                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    <div className="two-col">
                        <div className="field-group">
                            <label htmlFor="firstName">First Name</label>
                            <input id="firstName" name="firstName" placeholder="Jane" autoComplete="given-name" />
                        </div>
                        <div className="field-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input id="lastName" name="lastName" placeholder="Doe" autoComplete="family-name" />
                        </div>
                    </div>
                    <div className="field-group">
                        <label htmlFor="email">Email</label>
                        <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
                    </div>
                    <div className="field-group">
                        <label htmlFor="password">Password</label>
                        <input id="password" name="password" type="password" placeholder="••••••••" autoComplete="new-password" />
                    </div>
                    <button className="auth-submit" type="submit" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                <div className="auth-alt-action">
                    Already have an account? <Link to="/user/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
};  

export default UserRegister;