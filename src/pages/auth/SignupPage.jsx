// SignupPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../../services/authService';
import CustomerLayout from '../../components/layout/CustomerLayout';
import { UserPlus, User, Mail, Phone, Key, CheckCircle, ShieldAlert, MapPin, Building } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';

export const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    city: '',
    latitude: '',
    longitude: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    }

    if (!formData.email) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Delivery address is required.';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrorMessage('');

    try {
      await signup(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2550);
    } catch (err) {
      console.error('Signup error:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerLayout>
      <div className="relative min-h-screen flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8 overflow-hidden bg-[#070b13] text-slate-100 -mx-4 -my-8 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-orange-500/5 blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none z-0" />

        <div className="relative z-10 w-full sm:mx-auto sm:w-full sm:max-w-md space-y-6">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <span className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-orange-500/25">
                DF
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Create your account
            </h2>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
              Or{' '}
              <Link to="/login" className="text-orange-400 hover:text-orange-300 font-extrabold transition-colors">
                sign in to your existing account
              </Link>
            </p>
          </div>

          <div className="w-full">
            <Card isDarkMode={true} className="p-8 sm:p-10 border-slate-800/80 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
              {success ? (
                <div className="text-center py-8 space-y-4">
                  <div className="inline-flex p-3 bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 rounded-full">
                    <CheckCircle className="h-10 w-10 animate-bounce" />
                  </div>
                  <h3 className="text-lg font-black text-white">Account Created!</h3>
                  <p className="text-xs text-slate-450 leading-relaxed font-semibold">
                    Thank you for signing up. Redirecting you to the sign in page...
                  </p>
                </div>
              ) : (
                <>
                  {errorMessage && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/5 border border-red-500/20 flex items-start space-x-2 text-red-400 text-xs font-bold leading-relaxed">
                      <ShieldAlert className="h-4.5 w-4.5 text-red-500 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* Name */}
                    <Input
                      label="Full Name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Sami ullah"
                      icon={User}
                      error={errors.name}
                    />

                    {/* Email */}
                    <Input
                      label="Email Address"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. customer@dineflow.com"
                      icon={Mail}
                      error={errors.email}
                    />

                    {/* Password */}
                    <Input
                      label="Password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      icon={Key}
                      error={errors.password}
                    />

                    {/* Phone */}
                    <Input
                      label="Phone Number (optional)"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +923001234567"
                      icon={Phone}
                    />

                    {/* Delivery Address */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Delivery Address
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={2}
                        className={`block w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 bg-[#090d16]/40 backdrop-blur-sm transition-all duration-200 ${
                          errors.address
                            ? 'border-red-300 focus:ring-red-950/30 focus:border-red-500'
                            : 'border-slate-800 focus:ring-orange-950/30 focus:border-orange-500'
                        }`}
                        placeholder="House / Street details..."
                      />
                      {errors.address && <p className="text-xs text-red-400 font-bold">{errors.address}</p>}
                    </div>

                    {/* City */}
                    <Input
                      label="City"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Islamabad"
                      icon={Building}
                      error={errors.city}
                    />

                    {/* Submit */}
                    <div className="pt-2">
                      <Button
                        type="submit"
                        loading={loading}
                        className="w-full py-3.5 text-xs uppercase tracking-widest font-black"
                      >
                        {loading ? 'Creating account...' : 'Register'}
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default SignupPage;
