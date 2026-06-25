import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../components/AuthLayout';
import { authApi } from '../api/auth';
import { FadeIn } from '../components/common/Motion';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authApi.resetPassword(token, password);
      localStorage.setItem('lfp_token', data.token);
      localStorage.setItem('lfp_user', JSON.stringify(data.user));
      toast.success('Password updated');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'This reset link is invalid or has expired');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Choose a new password" subtitle="Make it something you haven't used before.">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="password" className="label-caps mb-2 block">
            New Password
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
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirm" className="label-caps mb-2 block">
            Confirm Password
          </label>
          <div className="relative group">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted group-focus-within:text-primary transition-colors" />
            <input
              id="confirm"
              type={showPassword ? 'text' : 'password'}
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              className="input-field pl-10"
              autoComplete="new-password"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full h-11">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Update Password <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-foreground-muted">
        <Link to="/login" className="font-bold text-primary hover:text-primary-dark transition-colors">
          Back to Sign In
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
