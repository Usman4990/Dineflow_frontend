// LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login as apiLogin } from '../../services/authService';
import CustomerLayout from '../../components/layout/CustomerLayout';
import { LogIn, Key, Mail, ShieldAlert } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Find previous attempted page or fallback to defaults
  const from = location.state?.from?.pathname || '/menu';

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await apiLogin({ email, password });

      if (response.otpRequired) {
        navigate('/verify-otp', {
          state: {
            email: response.email,
            from: from
          }
        });
        return;
      }

      // Update global context
      login(response.user, response.token);

      // Redirect based on role
      if (response.user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage(err.response?.data?.message || 'Login failed. Please verify credentials and database connections.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerLayout>
      <div className="relative min-h-[80vh] flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8 overflow-hidden bg-[#070b13] text-slate-100 -mx-4 -my-8 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        
        {/* Glow Spots */}
        <div className="absolute top-1/4 left-1/4 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full bg-orange-500/5 blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none z-0" />

        <div className="relative z-10 w-full sm:mx-auto sm:w-full sm:max-w-md space-y-6">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <span className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-orange-500/25">
                DF
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Welcome back to DineFlow
            </h2>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
              Or{' '}
              <Link to="/signup" className="text-orange-400 hover:text-orange-300 font-extrabold transition-colors">
                create a new customer account
              </Link>
            </p>
          </div>

          <div className="w-full">
            <Card isDarkMode={true} className="p-8 sm:p-10 border-slate-800/80 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/5 border border-red-500/20 flex items-start space-x-2 text-red-400 text-xs font-bold leading-relaxed">
                  <ShieldAlert className="h-4.5 w-4.5 text-red-500 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Email */}
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((p) => ({ ...p, email: '' }));
                  }}
                  placeholder="e.g. customer@dineflow.com"
                  icon={Mail}
                  error={errors.email}
                />

                {/* Password */}
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((p) => ({ ...p, password: '' }));
                  }}
                  placeholder="••••••••"
                  icon={Key}
                  error={errors.password}
                />

                {/* Submit */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    loading={loading}
                    className="w-full py-3.5 text-xs uppercase tracking-widest font-black"
                  >
                    {loading ? 'Checking credentials...' : 'Log In'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default LoginPage;
