import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  EyeIcon, EyeSlashIcon, UserIcon, EnvelopeIcon, PhoneIcon,
  MapPinIcon, LockClosedIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AppContext';
import { login, signup } from '../services/auth';

/* -------------------------------------------------------------------------- */

const states = [
  'Andhra Pradesh','Assam','Bihar','Chhattisgarh','Gujarat','Haryana',
  'Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana',
  'Uttar Pradesh','West Bengal'
];

const crops = [
  'Wheat','Rice','Cotton','Sugarcane','Maize','Bajra','Jowar',
  'Barley','Gram','Arhar','Moong','Urad','Mustard','Groundnut',
  'Sesame','Sunflower','Soybean','Potato','Onion','Tomato'
];

/* -------------------------------------------------------------------------- */

const Auth = () => {
  const { setUser } = useAuth();
  const [mode, setMode]           = useState('login');     // login | signup
  const [showPwd, setShowPwd]     = useState(false);
  const [busy, setBusy]           = useState(false);
  const [errors, setErrors]       = useState({});
  const [form, setForm]           = useState({
    name:'', email:'', phone:'', password:'', confirmPassword:'',
    location:'', farmSize:'', primaryCrops:[]
  });

  /* ---------------------------------------------------------------------- */
  const onChange = e => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm(p => ({
        ...p,
        primaryCrops: checked
          ? [...p.primaryCrops, value]
          : p.primaryCrops.filter(c => c !== value)
      }));
    } else setForm(p => ({ ...p, [name]: value }));

    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  /* ------------------------------ validation ---------------------------- */
  const validate = () => {
    const e = {};
    if (mode === 'signup') {
      if (!form.name.trim())  e.name  = 'Name required';
      if (!form.phone.trim()) e.phone = 'Phone required';
      else if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Invalid phone';
      if (!form.location)     e.location = 'State required';
      if (form.password !== form.confirmPassword)
        e.confirmPassword = 'Passwords do not match';
    }
    if (!form.email.trim())      e.email = 'Email required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Invalid email';
    if (!form.password)          e.password = 'Password required';
    else if (form.password.length < 6)
      e.password = 'Min 6 characters';

    setErrors(e);
    return !Object.keys(e).length;
  };

  /* ------------------------------ submit -------------------------------- */
  const submit = async e => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setBusy(true);
      const res =
        mode === 'login'
          ? await login({ email: form.email,   password: form.password })
          : await signup({
              name: form.name, email: form.email, phone: form.phone,
              password: form.password, location: form.location,
              farmSize: form.farmSize, primaryCrops: form.primaryCrops
            });

      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Authentication failed' });
    } finally {
      setBusy(false);
    }
  };

  /* ------------------------------ ui ------------------------------------ */
  const Field = ({ icon: Icon, error, ...rest }) => (
    <div>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />}
        <input
          {...rest}
          className={`w-full pl-9 pr-3 py-2.5 rounded-xl border
                      focus:ring-2 focus:ring-emerald-500
                      ${error ? 'border-red-400' : 'border-gray-300'}
                      placeholder:text-sm bg-white/80 backdrop-blur-sm`}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );

  /* ---------------------------------------------------------------------- */
  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gradient-to-br from-green-50 via-white to-emerald-50
                    px-3 py-6">
      <motion.section
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white/90 backdrop-blur-lg
                   rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8"
      >
        {/* Logo + heading */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 h-14 w-14 rounded-xl
                          bg-gradient-to-br from-amber-400 to-amber-600
                          flex items-center justify-center text-2xl shadow-lg">
            🌾
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
            {mode === 'login' ? 'Welcome Back!' : 'Join Krishi Sahayak'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            {mode === 'login'
              ? 'Sign in to your farming dashboard'
              : 'Create your account to get started'}
          </p>
        </div>

        {/* toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6 text-sm">
          {['login','signup'].map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-lg transition-all
                          ${mode === m
                            ? 'bg-white shadow text-emerald-600 font-semibold'
                            : 'text-gray-500 hover:text-gray-800'}`}
            >
              {m === 'login' ? 'Login' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* form */}
        <form onSubmit={submit} className="space-y-4 text-sm">
          <AnimatePresence mode="wait">
            {mode === 'signup' && (
              <motion.div
                key="signup-extra"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: .25 }}
                className="space-y-4"
              >
                <Field
                  name="name" placeholder="Full name"
                  value={form.name} onChange={onChange}
                  icon={UserIcon} error={errors.name}
                />
                <Field
                  name="phone" placeholder="10-digit mobile"
                  value={form.phone} onChange={onChange}
                  icon={PhoneIcon} error={errors.phone}
                />
                {/* state */}
                <div>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      name="location" value={form.location} onChange={onChange}
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border
                                  focus:ring-2 focus:ring-emerald-500
                                  ${errors.location ? 'border-red-400' : 'border-gray-300'}
                                  bg-white/80 backdrop-blur-sm`}
                    >
                      <option value="">Select state</option>
                      {states.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location}</p>}
                </div>

                {/* farm size */}
                <select
                  name="farmSize" value={form.farmSize} onChange={onChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300
                             bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 text-gray-700"
                >
                  <option value="">Farm size (optional)</option>
                  <option value="small">Small (0-2 acres)</option>
                  <option value="medium">Medium (2-10)</option>
                  <option value="large">Large (10+)</option>
                </select>

                {/* crops */}
                <details className="rounded-xl bg-gray-50 p-3">
                  <summary className="cursor-pointer font-medium text-gray-700">
                    Primary crops (optional)
                  </summary>
                  <div className="grid grid-cols-2 gap-2 mt-2 max-h-28 overflow-y-auto pr-1">
                    {crops.map(c => (
                      <label key={c} className="flex items-center text-xs">
                        <input type="checkbox" value={c}
                          checked={form.primaryCrops.includes(c)}
                          onChange={onChange}
                          className="h-4 w-4 text-emerald-600 mr-2 rounded border-gray-300" />
                        {c}
                      </label>
                    ))}
                  </div>
                </details>
              </motion.div>
            )}
          </AnimatePresence>

          {/* essentials */}
          <Field
            name="email" type="email" placeholder="Email address"
            value={form.email} onChange={onChange}
            icon={EnvelopeIcon} error={errors.email}
          />

          {/* password */}
          <div>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                name="password" placeholder="Password"
                type={showPwd ? 'text' : 'password'}
                value={form.password} onChange={onChange}
                className={`w-full pl-9 pr-11 py-2.5 rounded-xl border
                            focus:ring-2 focus:ring-emerald-500
                            ${errors.password ? 'border-red-400' : 'border-gray-300'}
                            bg-white/80 backdrop-blur-sm`}
              />
              <button type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPwd ? <EyeSlashIcon className="h-4 w-4"/> : <EyeIcon className="h-4 w-4"/>}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>

          {/* confirm */}
          <AnimatePresence>
            {mode === 'signup' && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: .25 }}
              >
                <Field
                  name="confirmPassword" type="password"
                  placeholder="Confirm password"
                  value={form.confirmPassword} onChange={onChange}
                  icon={LockClosedIcon} error={errors.confirmPassword}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* submit error */}
          {errors.submit && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              {errors.submit}
            </div>
          )}

          {/* button */}
          <motion.button
            whileHover={{ scale: busy ? 1 : 1.03 }}
            whileTap={{ scale: busy ? 1 : 0.97 }}
            type="submit" disabled={busy}
            className="w-full flex items-center justify-center gap-2
                       py-2.5 rounded-xl font-semibold text-white
                       bg-gradient-to-r from-emerald-600 to-green-600
                       hover:from-emerald-700 hover:to-green-700
                       disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {busy && (
              <span className="animate-spin h-4 w-4 rounded-full border-2 border-white border-t-transparent"></span>
            )}
            {busy
              ? (mode === 'login' ? 'Signing in...' : 'Creating ...')
              : (mode === 'login' ? 'Sign In'      : 'Create Account')}
          </motion.button>

          {/* footer link */}
          <p className="text-center text-xs text-gray-600">
            {mode === 'login' ? "New here? " : 'Have an account? '}
            <button type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="font-semibold text-emerald-600 hover:text-emerald-800">
              {mode === 'login' ? 'Create one' : 'Log in'}
            </button>
          </p>
        </form>
      </motion.section>
    </div>
  );
};

export default Auth;
