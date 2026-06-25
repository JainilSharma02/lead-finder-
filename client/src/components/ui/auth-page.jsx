import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './button';
import { Input } from './input';
import {
  AppleIcon,
  AtSignIcon,
  ChevronLeftIcon,
  GithubIcon,
  Grid2x2PlusIcon,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function AuthPage({ 
  title = "Sign In or Join Now!", 
  subtitle = "Login or create your account.",
  children,
  type = "login"
}) {
  return (
    <main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2 bg-background font-mono">
      {/* Left Decoration Panel */}
      <div className="bg-surface relative hidden h-full flex-col border-r border-surface-soft p-12 lg:flex overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] bg-[repeating-linear-gradient(0deg,white_0px,white_1px,transparent_1px,transparent_3px)]" />
        
        <div className="z-10 flex items-center gap-4">
          <div className="p-2.5 bg-primary rounded-lg text-black transform rotate-45">
             <Target className="size-6 transform -rotate-45" />
          </div>
          <p className="text-2xl font-display font-black tracking-tighter uppercase italic">
            LF_PRO <span className="text-primary">// TACTICAL</span>
          </p>
        </div>
        
        <div className="z-10 mt-auto max-w-md">
          <blockquote className="space-y-6">
            <p className="text-2xl font-bold leading-tight text-foreground tracking-tight">
              &ldquo;This platform has accelerated our lead reconnaissance by 400%. The tactical overview is unmatched.&rdquo;
            </p>
            <footer className="flex items-center gap-3">
               <div className="w-8 h-[2px] bg-primary" />
               <span className="text-sm font-black uppercase tracking-[0.3em] text-primary">JAINIL SHARMA // CORE OPS</span>
            </footer>
          </blockquote>
        </div>

        <div className="absolute inset-0 z-0">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="relative flex min-h-screen flex-col justify-center p-8 lg:p-24 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-full h-full -z-10 opacity-20 pointer-events-none">
           <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] rounded-full bg-primary/10 blur-[120px]" />
           <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-secondary/5 blur-[100px]" />
        </div>

        <Link to="/" className="absolute top-8 left-8">
          <Button variant="ghost" size="sm" className="gap-2 text-foreground-faint hover:text-primary">
            <ChevronLeftIcon className="size-4" />
            HOME_CORE
          </Button>
        </Link>

        <div className="mx-auto w-full max-w-sm space-y-10">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="p-2 bg-primary rounded-lg text-black transform rotate-45">
               <Target className="size-5 transform -rotate-45" />
            </div>
            <p className="text-xl font-black tracking-tighter uppercase italic">LF_PRO</p>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-display font-black tracking-tighter uppercase italic text-foreground leading-none">
              {title.split(' ')[0]} <span className="text-primary italic">{title.split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="text-sm font-bold text-foreground-faint uppercase tracking-widest leading-relaxed">
              {subtitle}
            </p>
          </div>

          <div className="space-y-3">
            <Button variant="secondary" className="w-full justify-start gap-4 h-14 border-surface-soft hover:border-primary/40 transition-all group">
              <GoogleIcon className="size-5 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">CONTINUE_WITH_GOOGLE</span>
            </Button>
            <Button variant="secondary" className="w-full justify-start gap-4 h-14 border-surface-soft hover:border-secondary/40 transition-all group">
              <AppleIcon className="size-5 text-secondary group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">CONTINUE_WITH_APPLE</span>
            </Button>
          </div>

          <AuthSeparator />

          {children}

          <p className="text-[10px] font-bold text-foreground-faint uppercase tracking-[0.1em] mt-8 leading-relaxed opacity-60">
            By initializing access, you agree to our{' '}
            <a href="#" className="text-primary underline underline-offset-4 decoration-primary/20 hover:decoration-primary transition-all">TERMINAL_TERMS</a>
            {' '}and{' '}
            <a href="#" className="text-primary underline underline-offset-4 decoration-primary/20 hover:decoration-primary transition-all">DATA_PROTOCOL</a>.
          </p>
        </div>
      </div>
    </main>
  );
}

function FloatingPaths({ position }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(0,245,212,${0.05 + i * 0.01})`,
    width: 0.5 + i * 0.02,
  }));

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="h-full w-full opacity-30"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="#FFFFFF"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.01}
            initial={{ pathLength: 0.3, opacity: 0.3 }}
            animate={{
              pathLength: 1,
              opacity: [0.1, 0.3, 0.1],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </svg>
    </div>
  );
}

const GoogleIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12.479,14.265v-3.279h11.049c0.108,0.571,0.164,1.247,0.164,1.979c0,2.46-0.672,5.502-2.84,7.669   C18.744,22.829,16.051,24,12.483,24C5.869,24,0.308,18.613,0.308,12S5.869,0,12.483,0c3.659,0,6.265,1.436,8.223,3.307L18.392,5.62   c-1.404-1.317-3.307-2.341-5.913-2.341C7.65,3.279,3.873,7.171,3.873,12s3.777,8.721,8.606,8.721c3.132,0,4.916-1.258,6.059-2.401   c0.927-0.927,1.537-2.251,1.777-4.059L12.479,14.265z" />
  </svg>
);

const AuthSeparator = () => {
  return (
    <div className="flex w-full items-center justify-center gap-4 py-2">
      <div className="bg-surface-soft h-[1px] flex-1" />
      <span className="text-[9px] font-black text-foreground-faint uppercase tracking-[0.4em]">MANUAL_LINK</span>
      <div className="bg-surface-soft h-[1px] flex-1" />
    </div>
  );
};
