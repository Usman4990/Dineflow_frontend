// VerifyOtpPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { verifyOtp, resendOtp } from '../../services/authService';
import CustomerLayout from '../../components/layout/CustomerLayout';
import { ShieldCheck, Mail, ShieldAlert, ArrowLeft, Send, RefreshCw } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';

export const VerifyOtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  // Retrieve state passed from LoginPage
  const prefilledEmail = location.state?.email || '';
  const from = location.state?.from || '/menu';

  const [email, setEmail] = useState(prefilledEmail);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [cooldown, setCooldown] = useState(60);

  const timerRef = useRef(null);

  // Set up resend cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      timerRef.current = setTimeout(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [cooldown]);

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!otp) {
      newErrors.otp = 'Verification code is required.';
    } else if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      newErrors.otp = 'OTP must be a 6-digit number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOtpChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
      if (errors.otp) setErrors((prev) => ({ ...prev, otp: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await verifyOtp({ email: email.trim(), otp: otp.trim() });
      setSuccessMessage('Verification successful! Logging in...');

      setTimeout(() => {
        login(response.user, response.token);

        if (response.user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }, 1000);
    } catch (err) {
      console.error('OTP verification error:', err);
      setErrorMessage(err.response?.data?.message || 'Verification failed. Please check your OTP and try again.');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;

    if (!email) {
      setErrors((prev) => ({ ...prev, email: 'Email address is required to resend OTP.' }));
      return;
    }

    setResending(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await resendOtp({ email: email.trim() });
      setSuccessMessage('A new verification code has been sent to your email.');
      setCooldown(60);
    } catch (err) {
      console.error('Resend OTP error:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to resend verification code. Please try again.');
    } finally {
      setResending(false);
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
              Verify Your Identity
            </h2>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
              Enter the 6-digit verification code sent to your email
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

              {successMessage && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-start space-x-2 text-emerald-400 text-xs font-bold leading-relaxed">
                  <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Email Address */}
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((p) => ({ ...p, email: '' }));
                  }}
                  disabled={!!prefilledEmail}
                  placeholder="e.g. customer@dineflow.com"
                  icon={Mail}
                  error={errors.email}
                />

                {/* OTP Input */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    name="otp"
                    value={otp}
                    onChange={handleOtpChange}
                    maxLength={6}
                    placeholder="000000"
                    disabled={loading}
                    className={`block w-full px-4 py-3.5 text-center text-3xl font-mono tracking-[0.4em] focus:tracking-[0.4em] border rounded-2xl focus:outline-none focus:ring-2 bg-[#090d16]/40 backdrop-blur-sm transition-all duration-200 uppercase ${
                      errors.otp
                        ? 'border-red-500 focus:ring-red-950/30 focus:border-red-500'
                        : 'border-slate-800 focus:ring-orange-950/30 focus:border-orange-500'
                    }`}
                  />
                  {errors.otp && <p className="text-xs text-center text-red-400 font-bold mt-1.5">{errors.otp}</p>}
                </div>

                {/* Submit Actions */}
                <div className="space-y-3 pt-2">
                  <Button
                    type="submit"
                    loading={loading}
                    disabled={otp.length !== 6}
                    className="w-full py-3.5 text-xs uppercase tracking-widest font-black"
                  >
                    {loading ? 'Verifying...' : 'Verify Code'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResend}
                    disabled={cooldown > 0 || resending}
                    className="w-full py-3 text-xs uppercase tracking-widest"
                  >
                    {resending ? (
                      <span className="flex items-center space-x-1.5 justify-center">
                        <RefreshCw className="animate-spin h-3.5 w-3.5" />
                        <span>Resending...</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1.5 justify-center">
                        <Send className="h-3.5 w-3.5 text-orange-400" />
                        <span>
                          {cooldown > 0 ? `Resend (${cooldown}s)` : 'Resend Code'}
                        </span>
                      </span>
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-8 border-t border-slate-800/80 pt-4 text-center">
                <Link to="/login" className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-orange-400 transition-colors">
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                  Back to Login
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default VerifyOtpPage;
