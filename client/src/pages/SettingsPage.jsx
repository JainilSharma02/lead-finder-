import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Save, MessageSquareText, Sun, Moon, User, Layout, CreditCard, Sparkles } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { authApi } from '../api/auth';
import { renderTemplate } from '../utils/messageTemplate';
import { FadeIn, Stagger, StaggerItem } from '../components/common/Motion';

const SAMPLE_LEAD = { businessName: 'Bright Web Studio', address: 'Bandra West, Mumbai', category: 'web design' };

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [template, setTemplate] = useState(user?.messageTemplate || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!template.trim()) {
      toast.error('Template cannot be empty');
      return;
    }
    setSaving(true);
    try {
      await authApi.updateMessageTemplate(template);
      updateUser({ messageTemplate: template });
      toast.success('Default template saved');
    } catch {
      toast.error('Could not save template');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <header className="mb-10">
        <FadeIn direction="none">
          <h1 className="text-3xl font-display font-bold text-foreground">Settings</h1>
          <p className="mt-1 text-foreground-muted">Configure your outreach engine and account preferences.</p>
        </FadeIn>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <FadeIn delay={0.1} direction="up">
            <div className="card-matte p-8 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <MessageSquareText className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Global Outreach Template</h2>
                  <p className="text-xs text-foreground-muted">The engine's default starting message.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-xs text-foreground-muted mb-4 leading-relaxed">
                    This template loads automatically for every lead. Use <code className="px-1.5 py-0.5 rounded bg-surface-raised font-bold text-primary">{"{{businessName}}"}</code> to inject company names dynamically.
                  </p>
                  <textarea
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    rows={8}
                    className="input-field text-sm leading-relaxed p-4 bg-surface/50 font-medium"
                    placeholder="Hello {{businessName}}, I saw your listing on..."
                  />
                </div>

                <button onClick={handleSave} disabled={saving} className="btn-primary w-full sm:w-auto px-8 shadow-lg shadow-primary/20">
                  {saving ? (
                    <span className="flex items-center gap-2">Saving...</span>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Master Template
                    </>
                  )}
                </button>

                <div className="pt-8 border-t border-surface-border">
                  <div className="flex items-center justify-between mb-4">
                    <p className="label-caps">Real-time Preview</p>
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase bg-primary/10 px-2 py-1 rounded">
                      <Sparkles className="w-3 h-3" />
                      Live Mockup
                    </div>
                  </div>
                  <div className="rounded-2xl border border-surface-border bg-surface-raised/40 p-6 text-sm leading-relaxed text-foreground-muted italic font-medium shadow-inner">
                    {renderTemplate(template, SAMPLE_LEAD) || "Master template is currently empty."}
                  </div>
                  <p className="mt-3 text-[10px] text-foreground-muted/50 uppercase font-black tracking-widest text-center">
                    Sample Data: {SAMPLE_LEAD.businessName}
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        <div className="space-y-8">
          <FadeIn delay={0.2} direction="up">
            <div className="card-matte p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-surface-raised border border-surface-border flex items-center justify-center text-foreground-muted">
                  <Layout className="h-4 w-4" />
                </div>
                <h2 className="text-sm font-bold text-foreground">Appearance</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex flex-col items-center gap-3 rounded-xl border p-5 transition-all ${
                    theme === 'light' 
                      ? 'border-primary bg-primary/5 text-primary' 
                      : 'border-surface-border bg-surface-raised/50 text-foreground-muted hover:border-foreground-muted/30'
                  }`}
                >
                  <Sun className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Light</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex flex-col items-center gap-3 rounded-xl border p-5 transition-all ${
                    theme === 'dark' 
                      ? 'border-primary bg-primary/5 text-primary' 
                      : 'border-surface-border bg-surface-raised/50 text-foreground-muted hover:border-foreground-muted/30'
                  }`}
                >
                  <Moon className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Dark</span>
                </button>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.3} direction="up">
            <div className="card-matte p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-surface-raised border border-surface-border flex items-center justify-center text-foreground-muted">
                  <CreditCard className="h-4 w-4" />
                </div>
                <h2 className="text-sm font-bold text-foreground">Account & Plan</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-primary/20 bg-primary/5 flex items-center justify-center text-primary font-black text-lg">
                    {user?.name?.[0]?.toUpperCase() || <User className="h-5 w-5" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{user?.name}</p>
                    <p className="text-xs text-foreground-muted truncate">{user?.email}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black text-primary uppercase">Current Tier</span>
                    <span className="px-2 py-0.5 rounded-full bg-primary text-background text-[10px] font-black uppercase">Professional</span>
                  </div>
                  <p className="text-xs text-foreground font-bold italic mt-2">Unlimited business lead scans enabled.</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
