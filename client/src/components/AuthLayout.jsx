import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FadeIn } from './common/Motion';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden flex items-center justify-center p-6">
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-background font-bold text-sm">L</div>
            <span className="font-display font-bold text-lg tracking-tight text-foreground">Lead Finder Pro</span>
          </Link>
          
          <FadeIn direction="up">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">{title}</h1>
            {subtitle && <p className="text-foreground-muted">{subtitle}</p>}
          </FadeIn>
        </div>

        <FadeIn delay={0.2} direction="up" className="card-matte p-8 shadow-2xl">
          {children}
        </FadeIn>

        <p className="mt-8 text-center text-xs text-foreground-muted">
          By continuing, you agree to our terms of service and privacy policy. 
          Lead Finder Pro uses the Google Places API for business discovery.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
