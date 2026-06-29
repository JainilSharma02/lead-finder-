import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Facebook, Instagram, Linkedin, ChevronDown, Star, Phone, Mail, MapPin, ArrowRight, Zap, Shield, Clock, Users, BookOpen, Target, Award, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

/* ─── Inline CSS Injection ─────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@700;800;900&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: 'Inter', sans-serif; background: #050814; color: #fff; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #050814; }
    ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #6366f1, #f97316); border-radius: 99px; }

    .glass {
      background: rgba(255,255,255,0.04);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.10);
    }
    .glass-card {
      background: rgba(255,255,255,0.05);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255,255,255,0.10);
      border-radius: 20px;
      transition: all 0.3s ease;
    }
    .glass-card:hover {
      background: rgba(255,255,255,0.09);
      border-color: rgba(99,102,241,0.5);
      transform: translateY(-6px);
      box-shadow: 0 24px 60px rgba(99,102,241,0.2);
    }

    .gradient-text {
      background: linear-gradient(135deg, #818cf8 0%, #f97316 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .gradient-text-alt {
      background: linear-gradient(135deg, #34d399 0%, #06b6d4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .btn-primary {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      border: none;
      padding: 14px 32px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn-primary::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, #8b5cf6, #6366f1);
      opacity: 0;
      transition: opacity 0.3s;
    }
    .btn-primary:hover::after { opacity: 1; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 16px 40px rgba(99,102,241,0.4); }
    .btn-primary > * { position: relative; z-index: 1; }

    .btn-outline {
      background: transparent;
      color: #a5b4fc;
      border: 1.5px solid rgba(165,180,252,0.4);
      padding: 14px 32px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn-outline:hover {
      border-color: #6366f1;
      background: rgba(99,102,241,0.1);
      transform: translateY(-2px);
    }

    .section-tag {
      display: inline-block;
      background: rgba(99,102,241,0.15);
      border: 1px solid rgba(99,102,241,0.3);
      color: #a5b4fc;
      padding: 6px 16px;
      border-radius: 99px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 16px;
    }

    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      pointer-events: none;
    }

    .nav-link {
      background: none;
      border: none;
      color: rgba(255,255,255,0.65);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      padding: 6px 4px;
      transition: color 0.2s;
      font-family: 'Inter', sans-serif;
    }
    .nav-link:hover { color: #fff; }

    .stat-number {
      font-family: 'Poppins', sans-serif;
      font-weight: 800;
      font-size: 3rem;
      background: linear-gradient(135deg, #818cf8, #f97316);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    input, textarea, select {
      width: 100%;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 12px;
      padding: 14px 18px;
      color: #fff;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s, background 0.2s;
    }
    input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.35); }
    input:focus, textarea:focus, select:focus {
      border-color: #6366f1;
      background: rgba(99,102,241,0.08);
    }
    select option { background: #0f1023; color: #fff; }

    .course-card-inner {
      padding: 32px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 99px;
      font-size: 12px;
      font-weight: 600;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-16px); }
    }
    @keyframes spin-slow { to { transform: rotate(360deg); } }
    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 20px rgba(99,102,241,0.3); }
      50% { box-shadow: 0 0 50px rgba(99,102,241,0.7); }
    }

    .float-anim { animation: float 4s ease-in-out infinite; }
    .pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }

    .hero-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: center;
      min-height: 100vh;
      padding: 120px 40px 80px;
      max-width: 1280px;
      margin: 0 auto;
    }
    @media (max-width: 900px) {
      .hero-grid { grid-template-columns: 1fr; padding: 100px 20px 60px; text-align: center; }
      .hero-ctas { justify-content: center !important; }
      .hero-badges { justify-content: center !important; }
    }

    .section-wrapper {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 40px;
    }
    @media (max-width: 768px) {
      .section-wrapper { padding: 0 20px; }
    }

    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
    @media (max-width: 960px) {
      .grid-3 { grid-template-columns: repeat(2, 1fr); }
      .grid-4 { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 640px) {
      .grid-3, .grid-4, .grid-2 { grid-template-columns: 1fr; }
    }

    .divider {
      width: 64px;
      height: 4px;
      background: linear-gradient(90deg, #6366f1, #f97316);
      border-radius: 99px;
      margin: 16px auto 0;
    }

    .faq-item {
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 12px;
      transition: border-color 0.3s;
    }
    .faq-item:hover { border-color: rgba(99,102,241,0.4); }
    .faq-question {
      width: 100%;
      background: rgba(255,255,255,0.03);
      border: none;
      color: #fff;
      padding: 20px 24px;
      text-align: left;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      font-family: 'Inter', sans-serif;
      transition: background 0.2s;
    }
    .faq-question:hover { background: rgba(99,102,241,0.08); }
    .faq-answer {
      padding: 0 24px 20px;
      color: rgba(255,255,255,0.65);
      line-height: 1.7;
    }
  `}</style>
);

/* ─── Animated Counter ──────────────────────────────────────────────── */
const Counter = ({ target, suffix = '+' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 60;
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(start));
    }, 20);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ─── FAQ Item ──────────────────────────────────────────────────────── */
const FAQItem = ({ q, a, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="faq-item"
    >
      <button className="faq-question" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={20} color={open ? '#818cf8' : 'rgba(255,255,255,0.4)'} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="faq-answer">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ─── Section Header ─────────────────────────────────────────────────── */
const SectionHeader = ({ tag, title, subtitle }) => (
  <div style={{ textAlign: 'center', marginBottom: '60px' }}>
    <span className="section-tag">{tag}</span>
    <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, fontFamily: 'Poppins', lineHeight: 1.2, marginBottom: '16px' }}>
      {title}
    </h2>
    <div className="divider" />
    {subtitle && (
      <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '17px', marginTop: '20px', maxWidth: '560px', margin: '20px auto 0' }}>
        {subtitle}
      </p>
    )}
  </div>
);

/* ─── Main Component ─────────────────────────────────────────────────── */
const AayaamEducation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(p => (p + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'Courses', id: 'courses' },
    { name: 'Why Us', id: 'why-us' },
    { name: 'Faculty', id: 'faculty' },
    { name: 'Results', id: 'results' },
    { name: 'FAQ', id: 'faq' },
    { name: 'Contact', id: 'contact' },
  ];

  const courses = [
    { title: 'JEE Main', icon: '🎯', tag: 'Most Popular', tagColor: '#f97316', desc: 'Complete preparation for JEE Main with daily practice, mock tests & doubt sessions.', duration: '1–2 Years', color: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.4)' },
    { title: 'JEE Advanced', icon: '⚡', tag: 'Elite', tagColor: '#8b5cf6', desc: 'Advanced problem solving, conceptual clarity, and IIT-level preparation.', duration: '2 Years', color: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.4)' },
    { title: 'NEET', icon: '🔬', tag: 'Medical', tagColor: '#10b981', desc: 'Biology, Physics & Chemistry mastery for top medical college admissions.', duration: '1–2 Years', color: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)' },
    { title: 'Class 11', icon: '📚', tag: 'Foundation', tagColor: '#f59e0b', desc: 'Build strong fundamentals in all science subjects for board & entrance exams.', duration: '1 Year', color: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)' },
    { title: 'Class 12', icon: '🎓', tag: 'Board + Entrance', tagColor: '#ec4899', desc: 'Simultaneous board preparation and competitive exam coaching.', duration: '1 Year', color: 'rgba(236,72,153,0.15)', border: 'rgba(236,72,153,0.4)' },
    { title: 'Foundation', icon: '🏆', tag: 'Class 8–10', tagColor: '#06b6d4', desc: 'Early preparation with Olympiad training and competitive mindset.', duration: '1–2 Years', color: 'rgba(6,182,212,0.15)', border: 'rgba(6,182,212,0.4)' },
  ];

  const features = [
    { icon: <Zap size={28} color="#818cf8" />, title: 'Expert Faculty', desc: '50+ IIT/NIT alumni teachers with decade+ experience in competitive coaching' },
    { icon: <Target size={28} color="#f97316" />, title: 'Smart Study Plans', desc: 'Personalized curriculum tailored to each student\'s strengths and weaknesses' },
    { icon: <Shield size={28} color="#10b981" />, title: 'Doubt Support', desc: '24/7 doubt-solving with dedicated sessions for every concept' },
    { icon: <TrendingUp size={28} color="#06b6d4" />, title: 'Progress Analytics', desc: 'Real-time performance tracking with detailed reports for students & parents' },
    { icon: <Clock size={28} color="#f59e0b" />, title: 'Mock Tests', desc: 'Weekly JEE/NEET pattern tests with detailed analysis and rank prediction' },
    { icon: <Award size={28} color="#ec4899" />, title: 'Career Mentoring', desc: 'Personal guidance from IIT/AIIMS toppers for career planning' },
  ];

  const faculty = [
    { name: 'Dr. Rajesh Kumar', subject: 'Physics', exp: '12 Yrs', qual: 'Ph.D IIT Bombay', emoji: '👨‍🔬', color: 'rgba(99,102,241,0.2)' },
    { name: 'Priya Sharma', subject: 'Chemistry', exp: '10 Yrs', qual: 'M.Tech NIT Surat', emoji: '👩‍🔬', color: 'rgba(16,185,129,0.2)' },
    { name: 'Amit Patel', subject: 'Mathematics', exp: '8 Yrs', qual: 'B.Tech IIT Delhi', emoji: '👨‍💻', color: 'rgba(245,158,11,0.2)' },
    { name: 'Neha Singh', subject: 'Biology', exp: '9 Yrs', qual: 'M.Sc Delhi Univ.', emoji: '👩‍⚕️', color: 'rgba(236,72,153,0.2)' },
  ];

  const testimonials = [
    { name: 'Arjun Verma', exam: 'JEE Main 2024', rank: 'AIR 245', rating: 5, review: 'Aayaam Education completely transformed my preparation. The structured study approach and personalised attention from faculty made all the difference. Every doubt was solved within hours!' },
    { name: 'Priya Gupta', exam: 'NEET 2024', rank: 'AIR 342', rating: 5, review: 'Best decision of my life! The faculty here explains Biology and Chemistry in such a unique way that concepts stick forever. The weekly mock tests built my confidence massively.' },
    { name: 'Rohan Singh', exam: 'JEE Advanced 2024', rank: 'AIR 89', rating: 5, review: 'From AIR 2300 in JEE Main to AIR 89 in Advanced — Aayaam\'s advanced modules and dedicated faculty pushed me beyond my limits. Forever grateful!' },
    { name: 'Ananya Patel', exam: 'NEET 2024', rank: 'AIR 178', rating: 5, review: 'The doubt sessions at 11 PM, the motivation from teachers, and the structured revision plans — everything about Aayaam is perfect. Got into AIIMS Ahmedabad!' },
  ];

  const faqs = [
    { q: 'What exams do you prepare students for?', a: 'We offer coaching for JEE Main, JEE Advanced, NEET, Class 11–12 Science (CBSE/GSEB), and Foundation courses for Class 8–10.' },
    { q: 'What is the typical batch size?', a: 'We deliberately keep batches small — 15 to 20 students — to ensure every student gets personalised attention and their doubts are addressed in class.' },
    { q: 'Is study material provided?', a: 'Absolutely! We provide comprehensive printed study material, digital resources, chapter-wise practice sheets, and access to our online portal with recorded lectures.' },
    { q: 'How can parents monitor progress?', a: 'We send bi-weekly performance reports, conduct monthly parent-teacher meetings, and maintain an online dashboard where parents can view attendance, test scores, and teacher feedback.' },
    { q: 'How often are mock tests conducted?', a: 'Mock tests are conducted every week in JEE/NEET pattern. Monthly grand tests simulate the actual exam environment. Detailed analysis reports are shared after each test.' },
    { q: 'What are the fees and payment options?', a: 'Fees vary based on the course duration and level. We offer flexible EMI options and scholarships based on merit. Please contact us or visit our centre for a detailed fee structure.' },
  ];

  const stats = [
    { value: 5000, label: 'Students Trained', icon: <Users size={32} color="#818cf8" /> },
    { value: 2500, label: 'Selections', icon: <Target size={32} color="#f97316" /> },
    { value: 50, label: 'Expert Teachers', icon: <BookOpen size={32} color="#10b981" /> },
    { value: 10, label: 'Years Experience', icon: <Award size={32} color="#f59e0b" /> },
  ];

  return (
    <>
      <GlobalStyles />
      <div style={{ background: '#050814', color: '#fff', minHeight: '100vh', overflowX: 'hidden' }}>

        {/* ═══ NAVBAR ═══ */}
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
            padding: '0 40px',
            height: '72px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: scrollY > 30 ? '1px solid rgba(255,255,255,0.08)' : 'none',
            background: scrollY > 30 ? 'rgba(5,8,20,0.85)' : 'transparent',
            backdropFilter: scrollY > 30 ? 'blur(20px)' : 'none',
            transition: 'all 0.3s ease',
          }}
        >
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.04 }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => scrollTo('home')}>
            <div style={{
              width: 38, height: 38,
              background: 'linear-gradient(135deg, #6366f1, #f97316)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', fontWeight: 900, fontFamily: 'Poppins',
            }}>A</div>
            <div>
              <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '18px', lineHeight: 1 }}>AAYAAM</div>
              <div style={{ fontSize: '9px', letterSpacing: '0.2em', color: '#f97316', fontWeight: 700 }}>EDUCATION</div>
            </div>
          </motion.div>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="desktop-nav">
            {navItems.map(item => (
              <button key={item.id} className="nav-link" onClick={() => scrollTo(item.id)}>{item.name}</button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="btn-primary" style={{ padding: '10px 24px', fontSize: '14px' }} onClick={() => scrollTo('contact')}>
              <span>Free Demo</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '8px', cursor: 'pointer', color: '#fff', display: 'flex' }}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </motion.nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                position: 'fixed', top: '72px', left: 0, right: 0, zIndex: 99,
                background: 'rgba(5,8,20,0.97)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                padding: '20px 40px',
              }}
            >
              {navItems.map(item => (
                <button
                  key={item.id}
                  className="nav-link"
                  onClick={() => scrollTo(item.id)}
                  style={{ display: 'block', padding: '12px 0', width: '100%', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                >
                  {item.name}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ HERO ═══ */}
        <section id="home" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Orbs */}
          <div className="orb" style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)', top: -100, left: -100 }} />
          <div className="orb" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(249,115,22,0.2) 0%, transparent 70%)', top: 100, right: -50 }} />
          <div className="orb" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)', bottom: 0, left: '40%' }} />

          <div className="hero-grid">
            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="section-tag" style={{ marginBottom: '24px' }}
              >
                🏆 Surat's Top Coaching Institute
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                style={{ fontFamily: 'Poppins', fontWeight: 900, fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.1, marginBottom: '24px' }}
              >
                Crack{' '}
                <span className="gradient-text">JEE & NEET</span>
                {' '}with Expert Guidance
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                style={{ color: 'rgba(255,255,255,0.6)', fontSize: '17px', lineHeight: 1.8, marginBottom: '36px', maxWidth: '500px' }}
              >
                Join 5000+ successful students at Aayaam Education. Structured study plans, experienced IIT/NIT faculty, and personalised mentorship — your dream college awaits.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                className="hero-ctas"
                style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '48px' }}
              >
                <button className="btn-primary pulse-glow" onClick={() => scrollTo('contact')}>
                  <span>Enroll Now</span>
                  <ArrowRight size={16} />
                </button>
                <button className="btn-outline" onClick={() => scrollTo('courses')}>
                  <span>Explore Courses</span>
                </button>
              </motion.div>

              {/* Mini Stats */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
                className="hero-badges"
                style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}
              >
                {[['5000+', 'Students'], ['2500+', 'Selections'], ['10+', 'Years']].map(([num, label]) => (
                  <div key={label}>
                    <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '24px', background: 'linear-gradient(135deg, #818cf8, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{num}</div>
                    <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px' }}>{label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              style={{ position: 'relative', height: 480, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {/* Central glowing circle */}
              <div className="float-anim" style={{
                width: 320, height: 320,
                background: 'radial-gradient(circle at 40% 40%, rgba(99,102,241,0.3), rgba(249,115,22,0.15), transparent 70%)',
                border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '80px',
                position: 'relative',
              }}>
                📚
                {/* Orbiting badges */}
                {[
                  { top: -20, left: 80, bg: 'rgba(99,102,241,0.85)', text: 'JEE ✓', delay: 0 },
                  { top: 60, right: -30, bg: 'rgba(16,185,129,0.85)', text: 'NEET ✓', delay: 0.5 },
                  { bottom: 20, left: -20, bg: 'rgba(249,115,22,0.85)', text: 'AIR 89 🎯', delay: 1 },
                  { bottom: 80, right: 10, bg: 'rgba(236,72,153,0.85)', text: '5000+ 🏆', delay: 1.5 },
                ].map((b, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, delay: b.delay, repeat: Infinity }}
                    style={{
                      position: 'absolute',
                      top: b.top, bottom: b.bottom, left: b.left, right: b.right,
                      background: b.bg,
                      borderRadius: '20px',
                      padding: '8px 14px',
                      fontSize: '13px',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                    }}
                  >
                    {b.text}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ WHY CHOOSE US ═══ */}
        <section id="why-us" style={{ padding: '100px 0', background: 'rgba(255,255,255,0.02)' }}>
          <div className="section-wrapper">
            <SectionHeader
              tag="Why Aayaam"
              title={<>Why Students Choose <span className="gradient-text">Aayaam Education</span></>}
              subtitle="Everything you need to crack JEE & NEET — under one roof"
            />
            <div className="grid-3">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-card"
                  style={{ padding: '32px' }}
                >
                  <div style={{
                    width: 56, height: 56,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '20px',
                  }}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '10px' }}>{f.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', lineHeight: 1.7 }}>{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ COURSES ═══ */}
        <section id="courses" style={{ padding: '100px 0' }}>
          <div className="section-wrapper">
            <SectionHeader
              tag="Our Programs"
              title={<>Courses Designed for <span className="gradient-text-alt">Top Selections</span></>}
              subtitle="Comprehensive preparation programs for every competitive exam"
            />
            <div className="grid-3">
              {courses.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    background: c.color,
                    border: `1px solid ${c.border}`,
                    borderRadius: '20px',
                    padding: '32px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  whileHover={{ y: -8, boxShadow: `0 24px 48px ${c.border}50` }}
                >
                  <span style={{
                    position: 'absolute', top: '20px', right: '20px',
                    background: c.tagColor + '25',
                    border: `1px solid ${c.tagColor}60`,
                    color: c.tagColor,
                    padding: '4px 12px',
                    borderRadius: '99px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}>{c.tag}</span>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>{c.icon}</div>
                  <h3 style={{ fontWeight: 800, fontSize: '22px', marginBottom: '10px', fontFamily: 'Poppins' }}>{c.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>{c.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px' }}>⏱ {c.duration}</span>
                    <button style={{ background: 'none', border: 'none', color: c.tagColor, fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Learn More <ArrowRight size={13} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ STATS ═══ */}
        <section id="results" style={{ padding: '80px 0', background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(249,115,22,0.05) 100%)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="section-wrapper">
            <div className="grid-4">
              {stats.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{ textAlign: 'center', padding: '40px 20px' }}
                >
                  <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
                  <div className="stat-number">
                    <Counter target={s.value} />
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '8px', fontSize: '15px' }}>{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FACULTY ═══ */}
        <section id="faculty" style={{ padding: '100px 0' }}>
          <div className="section-wrapper">
            <SectionHeader
              tag="Meet the Team"
              title={<>Learn from <span className="gradient-text">Expert Faculty</span></>}
              subtitle="IIT & NIT alumni dedicated to transforming your academic journey"
            />
            <div className="grid-4">
              {faculty.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card"
                  style={{ padding: '32px', textAlign: 'center' }}
                >
                  <div style={{
                    width: 80, height: 80, margin: '0 auto 20px',
                    background: f.color,
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '36px',
                    border: '2px solid rgba(255,255,255,0.1)',
                  }}>{f.emoji}</div>
                  <h3 style={{ fontWeight: 700, fontSize: '17px', marginBottom: '6px' }}>{f.name}</h3>
                  <p style={{ color: '#818cf8', fontWeight: 600, fontSize: '14px', marginBottom: '12px' }}>{f.subject}</p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '99px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{f.exp}</span>
                    <span style={{ background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '99px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{f.qual}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ TESTIMONIALS ═══ */}
        <section id="testimonials" style={{ padding: '100px 0', background: 'rgba(255,255,255,0.02)' }}>
          <div className="section-wrapper" style={{ maxWidth: '900px' }}>
            <SectionHeader
              tag="Success Stories"
              title={<>Students Who <span className="gradient-text">Made It Big</span></>}
            />
            <div style={{ position: 'relative' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.4 }}
                  className="glass-card"
                  style={{ padding: '48px', marginBottom: '32px' }}
                >
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '24px' }}>
                    {Array(5).fill(0).map((_, i) => (
                      <Star key={i} size={20} fill="#f97316" color="#f97316" />
                    ))}
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px', lineHeight: 1.8, marginBottom: '32px', fontStyle: 'italic' }}>
                    "{testimonials[activeTestimonial].review}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: 50, height: 50, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1, #f97316)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: '20px',
                      }}>
                        {testimonials[activeTestimonial].name[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '16px' }}>{testimonials[activeTestimonial].name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px' }}>{testimonials[activeTestimonial].exam}</div>
                      </div>
                    </div>
                    <div style={{
                      background: 'rgba(99,102,241,0.15)',
                      border: '1px solid rgba(99,102,241,0.35)',
                      borderRadius: '20px',
                      padding: '8px 20px',
                      color: '#818cf8',
                      fontWeight: 700,
                      fontSize: '14px',
                    }}>
                      🎯 {testimonials[activeTestimonial].rank}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Dots */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    style={{
                      width: i === activeTestimonial ? 32 : 8,
                      height: 8,
                      borderRadius: '99px',
                      background: i === activeTestimonial ? '#6366f1' : 'rgba(255,255,255,0.2)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section id="faq" style={{ padding: '100px 0' }}>
          <div className="section-wrapper" style={{ maxWidth: '800px' }}>
            <SectionHeader
              tag="FAQ"
              title={<>Have <span className="gradient-text">Questions?</span></>}
              subtitle="Everything you need to know about Aayaam Education"
            />
            {faqs.map((f, i) => (
              <FAQItem key={i} q={f.q} a={f.a} index={i} />
            ))}
          </div>
        </section>

        {/* ═══ CONTACT ═══ */}
        <section id="contact" style={{ padding: '100px 0', background: 'rgba(255,255,255,0.02)' }}>
          <div className="section-wrapper" style={{ maxWidth: '1000px' }}>
            <SectionHeader
              tag="Contact Us"
              title={<>Book Your <span className="gradient-text">Free Demo Class</span></>}
              subtitle="Take the first step towards your dream college today"
            />

            <div className="grid-2" style={{ alignItems: 'start' }}>
              {/* Info */}
              <div>
                <div style={{ marginBottom: '32px' }}>
                  {[
                    { icon: <Phone size={20} color="#818cf8" />, label: 'Phone', value: '+91 9876 543 210', href: 'tel:+919876543210' },
                    { icon: <Mail size={20} color="#f97316" />, label: 'Email', value: 'info@aayaam.com', href: 'mailto:info@aayaam.com' },
                    { icon: <MapPin size={20} color="#10b981" />, label: 'Location', value: 'Surat, Gujarat, India', href: '#' },
                  ].map((c, i) => (
                    <motion.a
                      key={i}
                      href={c.href}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '16px',
                        padding: '18px 20px', borderRadius: '14px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        marginBottom: '12px',
                        textDecoration: 'none', color: '#fff',
                        transition: 'background 0.2s',
                      }}
                    >
                      <div style={{ width: 42, height: 42, background: 'rgba(255,255,255,0.06)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {c.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '2px' }}>{c.label}</div>
                        <div style={{ fontWeight: 600, fontSize: '15px' }}>{c.value}</div>
                      </div>
                    </motion.a>
                  ))}
                </div>

                {/* Social */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  {[<Facebook size={18} />, <Instagram size={18} />, <Linkedin size={18} />].map((icon, i) => (
                    <motion.a
                      key={i}
                      href="#"
                      whileHover={{ y: -4, scale: 1.1 }}
                      style={{
                        width: 44, height: 44,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.10)',
                        borderRadius: '12px',
                        color: 'rgba(255,255,255,0.6)',
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                      }}
                    >
                      {icon}
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Form */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card"
                style={{ padding: '36px' }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <input type="text" placeholder="Your Name" />
                  <input type="email" placeholder="Email Address" />
                </div>
                <input type="tel" placeholder="Phone Number" style={{ marginBottom: '14px' }} />
                <select style={{ marginBottom: '14px' }}>
                  <option>Select Course</option>
                  <option>JEE Main</option>
                  <option>JEE Advanced</option>
                  <option>NEET</option>
                  <option>Class 11</option>
                  <option>Class 12</option>
                  <option>Foundation</option>
                </select>
                <textarea placeholder="Your Message (optional)" rows={4} style={{ marginBottom: '20px' }} />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '16px' }}
                >
                  <span>Book Free Demo Class</span>
                  <ArrowRight size={16} />
                </motion.button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer style={{ background: '#020510', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '60px 0 30px' }}>
          <div className="section-wrapper">
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '48px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #6366f1, #f97316)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontFamily: 'Poppins' }}>A</div>
                  <div>
                    <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '16px' }}>AAYAAM</div>
                    <div style={{ fontSize: '8px', letterSpacing: '0.2em', color: '#f97316', fontWeight: 700 }}>EDUCATION</div>
                  </div>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', lineHeight: 1.8, maxWidth: '280px' }}>
                  Empowering students to crack JEE, NEET & Board exams with expert guidance and proven strategies since 2014.
                </p>
              </div>
              {[
                { title: 'Programs', links: ['JEE Main', 'JEE Advanced', 'NEET', 'Foundation'] },
                { title: 'Company', links: ['About Us', 'Faculty', 'Results', 'Contact'] },
                { title: 'Support', links: ['FAQ', 'Privacy Policy', 'Terms', 'Refund Policy'] },
              ].map((col) => (
                <div key={col.title}>
                  <h4 style={{ fontWeight: 700, fontSize: '15px', marginBottom: '16px' }}>{col.title}</h4>
                  <ul style={{ listStyle: 'none' }}>
                    {col.links.map(l => (
                      <li key={l} style={{ marginBottom: '10px' }}>
                        <a href="#" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                          onMouseEnter={e => e.target.style.color = '#fff'}
                          onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}
                        >{l}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>© 2024 Aayaam Education. All rights reserved. | Surat, Gujarat</p>
              <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>The Transformers 🚀</p>
            </div>
          </div>
        </footer>

        {/* ═══ FLOATING BUTTONS ═══ */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{ position: 'fixed', bottom: '32px', right: '32px', display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 50 }}
        >
          <motion.a
            href="https://wa.me/919876543210"
            whileHover={{ scale: 1.12, y: -3 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: 54, height: 54, borderRadius: '50%',
              background: 'linear-gradient(135deg, #25d366, #128c7e)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(37,211,102,0.4)',
            }}
            title="WhatsApp"
          >💬</motion.a>
          <motion.a
            href="tel:+919876543210"
            whileHover={{ scale: 1.12, y: -3 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: 54, height: 54, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
            }}
            title="Call Us"
          >📞</motion.a>
        </motion.div>

        {/* Scroll to top */}
        <AnimatePresence>
          {scrollY > 400 && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              whileHover={{ scale: 1.1 }}
              style={{
                position: 'fixed', bottom: '110px', right: '32px', zIndex: 50,
                width: 44, height: 44, borderRadius: '12px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff', fontSize: '18px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >↑</motion.button>
          )}
        </AnimatePresence>

      </div>
    </>
  );
};

export default AayaamEducation;