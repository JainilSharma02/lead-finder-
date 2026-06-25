import React, { useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Search, 
  Users, 
  MessageSquare, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  BarChart3,
  Globe,
  Database,
  ArrowUpRight,
  Plus,
  Minus,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { FadeIn, Stagger, StaggerItem, Magnetic, Reveal, CountUp } from '../components/common/Motion';

const LandingPage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="bg-transparent text-foreground selection:bg-primary/30">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-surface-border bg-background/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-background font-bold">L</div>
            <span className="font-display font-bold text-xl tracking-tight">Lead Finder Pro</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-foreground-muted hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-foreground-muted hover:text-foreground transition-colors">How it Works</a>
            <a href="#pricing" className="text-sm text-foreground-muted hover:text-foreground transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-foreground-muted hover:text-foreground">Log in</Link>
            <Magnetic>
              <Link to="/register" className="btn-primary">
                Start Free <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Magnetic>
          </div>
        </div>
      </nav>

      <section className="relative pt-40 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <FadeIn>
            <span className="label-caps mb-4 inline-block px-3 py-1 border border-primary/20 rounded-full bg-primary/5">
              Automated the grind, Never the send
            </span>
          </FadeIn>
          
          <Reveal delay={0.2}>
            <h1 className="text-5xl md:text-8xl font-display font-bold mb-8 tracking-tighter">
              Stop Copy-Pasting. <br /> 
              <span className="text-primary italic">Start Closing.</span>
            </h1>
          </Reveal>

          <FadeIn delay={0.4}>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-foreground-muted mb-12 leading-relaxed">
              Sales ki manual mehnat ko smart work mein badlo. 
              Find leads on Google Maps, organize them, and reach out on WhatsApp without the spam risk.
            </p>
          </FadeIn>

          <FadeIn delay={0.6}>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Magnetic>
                <Link to="/register" className="btn-primary text-base px-8 py-4">
                  Launch Lead Finder <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Magnetic>
              <Link to="/login" className="btn-ghost text-base">
                View Demo Dashboard
              </Link>
            </div>
          </FadeIn>

          {/* Product Mockup Floating */}
          <FadeIn delay={0.8} direction="up" className="mt-24">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="card-matte p-2 overflow-hidden rotate-x-6">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426" 
                  alt="Dashboard Preview" 
                  className="rounded-lg shadow-2xl opacity-80"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="py-12 border-y border-surface-border bg-surface/30">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-12 md:gap-24 items-center grayscale opacity-50">
          <div className="flex items-center gap-2 font-display font-bold text-xl uppercase tracking-tighter">OpenStreetMap Data</div>
          <div className="flex items-center gap-2 font-display font-bold text-xl uppercase tracking-tighter">Free Search Ecosystem</div>
          <div className="flex items-center gap-2 font-display font-bold text-xl uppercase tracking-tighter">No API Key Required</div>
          <div className="flex items-center gap-2 font-display font-bold text-xl uppercase tracking-tighter">Privacy Focused</div>
        </div>
      </section>

      {/* Pain-Point Transition */}
      <section className="py-32 relative">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-16">The old way is killing your time</h2>
          </FadeIn>
          <div className="space-y-4">
            <Stagger staggerDelay={0.2}>
              <StaggerItem direction="left">
                <div className="flex items-center gap-4 p-6 rounded-lg bg-surface/50 border border-red-500/10 line-through opacity-40">
                  <div className="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center text-red-500 text-sm">1</div>
                  <p className="text-foreground-muted">Google Maps copy-paste manual work for hours</p>
                </div>
              </StaggerItem>
              <StaggerItem direction="left">
                <div className="flex items-center gap-4 p-6 rounded-lg bg-surface/50 border border-red-500/10 line-through opacity-40">
                  <div className="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center text-red-500 text-sm">2</div>
                  <p className="text-foreground-muted">Entering each lead into a messy Excel sheet</p>
                </div>
              </StaggerItem>
              <StaggerItem direction="left">
                <div className="flex items-center gap-4 p-6 rounded-lg bg-surface/50 border border-red-500/10 line-through opacity-40">
                  <div className="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center text-red-500 text-sm">3</div>
                  <p className="text-foreground-muted">Typing individual WhatsApp messages manually</p>
                </div>
              </StaggerItem>
            </Stagger>
          </div>
        </div>
      </section>

      {/* 3 Pillars - Features */}
      <section id="features" className="py-32 bg-surface/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <FadeIn delay={0.1}>
              <div className="card-matte p-8 h-full border-t-2 border-t-primary">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Smart Lead Discovery</h3>
                <p className="text-foreground-muted leading-relaxed">
                  Bas keyword aur location dalo. Maps ka saara public data seedha aapki screen par. No manual scraping needed.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="card-matte p-8 h-full">
                <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center text-foreground-muted mb-6">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Organized Workflow</h3>
                <p className="text-foreground-muted leading-relaxed">
                  Status track karo: Kise call kiya, kise message bheja, aur kiska reply baaki hai. Like a personal CRM manager.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="card-matte p-8 h-full">
                <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center text-foreground-muted mb-6">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Safe Outreach</h3>
                <p className="text-foreground-muted leading-relaxed">
                  Tool drafts the message. You tap to send. Account safe, productivity 3x fast.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Signature Scroll-Pinned Section */}
      <section id="how-it-works" className="relative py-32 bg-transparent overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 text-center">
            <FadeIn>
              <span className="label-caps text-primary mb-4 block">The signature workflow</span>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">How it works</h2>
            </FadeIn>
          </div>

          <div className="space-y-32">
            {/* Step 1 */}
            <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
              <FadeIn direction="left">
                <span className="text-primary font-display font-bold text-6xl mb-6 block opacity-20">01</span>
                <h3 className="text-3xl md:text-4xl font-bold mb-6">Smart Lead Discovery</h3>
                <p className="text-lg text-foreground-muted mb-8 italic">
                  "Hours of manual Google-Maps copy-paste ko minutes mein khatam karna."
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Search by keyword & location</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Real business data from Google Places</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>No manual scraping required</span>
                  </div>
                </div>
              </FadeIn>
              <FadeIn direction="right" className="relative">
                <div className="card-matte p-6 bg-surface-raised/50 border-primary/20">
                  <div className="flex items-center gap-2 mb-6 border-b border-surface-border pb-4">
                    <Search className="w-4 h-4 text-primary" />
                    <div className="h-8 flex-1 bg-surface rounded flex items-center px-3 text-xs text-foreground-muted">
                      Software Companies in Mumbai...
                    </div>
                    <div className="px-4 py-1.5 bg-primary text-background text-xs font-bold rounded">Scan</div>
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex gap-4 p-3 rounded bg-surface/50 animate-pulse">
                        <div className="w-10 h-10 rounded bg-surface-raised" />
                        <div className="space-y-2 flex-1">
                          <div className="w-1/2 h-2 bg-surface-raised rounded" />
                          <div className="w-1/3 h-2 bg-surface-border rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
              <FadeIn direction="right" className="md:order-2">
                <span className="text-primary font-display font-bold text-6xl mb-6 block opacity-20">02</span>
                <h3 className="text-3xl md:text-4xl font-bold mb-6">Organized Workflow (Mini-CRM)</h3>
                <p className="text-lg text-foreground-muted mb-8 italic">
                  "Track karna zaroori hai kaun 'New' hai aur kise 'Contacted' kar liya."
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Status pills for easy tracking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Multi-select bulk actions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Personal sales manager vibe</span>
                  </div>
                </div>
              </FadeIn>
              <FadeIn direction="left" className="md:order-1 relative">
                <div className="card-matte p-6 bg-surface-raised/50 border-primary/20">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-4 rounded bg-surface/80 border border-primary/20">
                      <div className="text-xs text-foreground-muted mb-1">New Leads</div>
                      <div className="text-2xl font-bold">142</div>
                    </div>
                    <div className="p-4 rounded bg-surface/80">
                      <div className="text-xs text-foreground-muted mb-1">Contacted</div>
                      <div className="text-2xl font-bold">89</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 rounded bg-surface/50 border border-surface-border flex items-center justify-between">
                      <span className="text-sm">Innovate Systems</span>
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">NEW</span>
                    </div>
                    <div className="p-3 rounded bg-surface/50 border border-surface-border flex items-center justify-between opacity-50">
                      <span className="text-sm">Global Tech</span>
                      <span className="px-2 py-0.5 rounded-full bg-surface-border text-foreground-muted text-[10px] font-bold">CONTACTED</span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Step 3 */}
            <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
              <FadeIn direction="left">
                <span className="text-primary font-display font-bold text-6xl mb-6 block opacity-20">03</span>
                <h3 className="text-3xl md:text-4xl font-bold mb-6">Safe WhatsApp Outreach</h3>
                <p className="text-lg text-foreground-muted mb-8 italic">
                  "Tool drafts, you send manually — speed bhi, account safety bhi."
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Personalized name drafts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>ToS compliant outreach</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Zero automation ban risk</span>
                  </div>
                </div>
              </FadeIn>
              <FadeIn direction="right" className="relative">
                <div className="card-matte p-6 bg-surface-raised/50 border-primary/20">
                  <div className="p-4 rounded bg-surface/80 mb-6 font-mono text-xs leading-relaxed">
                    Hi <span className="text-primary">Innovate Systems</span>, I found your business on Maps and would love to discuss...
                  </div>
                  <div className="flex justify-center">
                    <div className="btn-primary w-full group relative overflow-hidden">
                      <span className="relative z-10 flex items-center gap-2">
                        Draft in WhatsApp <MessageSquare className="w-4 h-4" />
                      </span>
                      <div className="absolute inset-0 bg-primary-dark translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-surface/10">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-foreground-muted">Everything you need to know about Lead Finder Pro</p>
          </div>
          
          <div className="space-y-4">
            {[
              {
                q: "Is it safe for my WhatsApp account?",
                a: "Yes. Lead Finder Pro does NOT automatically send messages. It drafts a personalized message for you and opens it in WhatsApp. You review and hit send manually, which complies with WhatsApp's terms of service."
              },
              {
                q: "Do I need a credit card or API key?",
                a: "No! Lead Finder Pro is now connected to the OpenStreetMap ecosystem. You can find real leads globally without any hidden costs or credit card requirements."
              },
              {
                q: "Can I export my leads?",
                a: "Absolutely. You can export any lead list to CSV or Excel with one click for use in your other tools."
              },
              {
                q: "How many leads can I find?",
                a: "Depends on your plan. The free tier allows you to explore the tool with a limited set of results. Pro unlocks unlimited searches via the Google Places API."
              }
            ].map((faq, idx) => (
              <details key={idx} className="group card-matte overflow-hidden bg-background">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-semibold">{faq.q}</span>
                  <span className="w-8 h-8 rounded-full bg-surface-raised flex items-center justify-center transition-transform group-open:rotate-180">
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </summary>
                <div className="px-6 pb-6 text-foreground-muted animate-fade-in">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 border-t border-surface-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                <CountUp end={100} suffix="k+" />
              </div>
              <p className="label-caps">Leads Found</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                <CountUp end={3} suffix="x" />
              </div>
              <p className="label-caps">Faster Hiring</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                <CountUp end={500} suffix="+" />
              </div>
              <p className="label-caps">Happy Clients</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                <CountUp end={99} suffix=".9%" />
              </div>
              <p className="label-caps">Focus Efficiency</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-primary/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-matte-radial opacity-50" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <FadeIn>
            <h2 className="text-4xl md:text-7xl font-display font-bold mb-12 tracking-tight">
              Ready to <span className="text-primary italic">work smart?</span>
            </h2>
            <Magnetic>
              <Link to="/register" className="btn-primary text-xl px-12 py-6">
                Create Free Account <ArrowRight className="w-6 h-6 ml-3" />
              </Link>
            </Magnetic>
            <p className="mt-8 text-foreground-muted">No credit card required. Build your first lead list in 60 seconds.</p>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-surface-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:row justify-between items-center gap-12">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-background font-bold">L</div>
              <span className="font-display font-bold text-xl tracking-tight">Lead Finder Pro</span>
            </div>
            <div className="flex gap-8 text-sm text-foreground-muted">
              <a href="#" className="hover:text-foreground">Privacy Policy</a>
              <a href="#" className="hover:text-foreground">Terms of Use</a>
              <a href="#" className="hover:text-foreground">Contact</a>
            </div>
            <p className="text-xs text-neutral-600">Built for high-performance outreach. No attribution required.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
