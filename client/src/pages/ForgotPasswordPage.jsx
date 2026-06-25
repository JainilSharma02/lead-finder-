import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, MailCheck, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../components/AuthLayout';
import { authApi } from '../api/auth';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout title="Check your inbox">
        <div className="flex flex-col items-center text-center py-4">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 shadow-[0_0_20px_rgba(34,211,216,0.1)]">
            <MailCheck className="h-8 w-8 text-primary" />
          </div>
          <p className="text-sm text-foreground-muted leading-relaxed">
            If an account exists for <span className="font-bold text-foreground">{email}</span>, we've sent a
            link to reset your password. It expires in 30 minutes.
          </p>
          <Link to="/login" className="btn-primary mt-10 w-full">
            Back to Sign In
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset your password" subtitle="Enter your email and we'll send you a recovery link.">
      <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="name@company.com"
              className="input-field pl-10"
              autoComplete="email"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full h-11">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Send Link <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-foreground-muted">
        Remembered it?{' '}
        <Link to="/login" className="font-bold text-primary hover:text-primary-dark transition-colors">
          Log in instead
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
