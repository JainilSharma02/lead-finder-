import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const passwordChecks = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'Contains a number', valid: /\d/.test(password) },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Start finding and organizing leads in minutes.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="label-caps mb-2 block">
            Full Name
          </label>
          <div className="relative group">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted group-focus-within:text-primary transition-colors" />
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jordan Patel"
              className="input-field pl-10"
              autoComplete="name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="label-caps mb-2 block">
            Email Address
          </label>
          <div className="relative group">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted group-focus-within:text-primary transition-colors" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="input-field pl-10"
              autoComplete="email"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="label-caps mb-2 block">
            Password
          </label>
          <div className="relative group">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted group-focus-within:text-primary transition-colors" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field pl-10 pr-10"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-foreground-muted hover:text-foreground transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {password.length > 0 && (
            <div className="mt-3 flex flex-col gap-1.5">
              {passwordChecks.map((check) => (
                <div key={check.label} className="flex items-center gap-2 text-xs">
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full transition-colors ${
                      check.valid ? 'bg-primary text-background' : 'bg-surface-raised'
                    }`}
                  >
                    {check.valid && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                  </span>
                  <span className={check.valid ? 'text-primary' : 'text-foreground-muted'}>{check.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full h-11">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Create Account <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-foreground-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-primary hover:text-primary-dark transition-colors">
          Log in instead
        </Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;
