import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, ExternalLink, ChevronLeft, ChevronRight, Pencil, Sparkles, CheckCircle2 } from 'lucide-react';
import { renderTemplate, buildWhatsAppUrl, isValidWhatsAppPhone } from '../utils/messageTemplate';

const ComposerPanel = ({ leads, template, onClose, onMarkContacted, onUpdateTemplate }) => {
  const [index, setIndex] = useState(0);
  const [editedMessage, setEditedMessage] = useState('');
  const [editingTemplate, setEditingTemplate] = useState(false);
  const [draftTemplate, setDraftTemplate] = useState(template);

  const lead = leads[index];

  useEffect(() => {
    if (lead) setEditedMessage(renderTemplate(template, lead));
  }, [lead, template]);

  useEffect(() => {
    setDraftTemplate(template);
  }, [template]);

  if (!lead) return null;

  const activePhone = lead.whatsappNumber || lead.phone;
  const phoneValid = isValidWhatsAppPhone(activePhone);

  const handleOpenWhatsApp = () => {
    const url = buildWhatsAppUrl(activePhone, editedMessage);
    window.open(url, '_blank', 'noopener,noreferrer');
    onMarkContacted(lead._id);
  };

  const goNext = () => setIndex((i) => Math.min(i + 1, leads.length - 1));
  const goPrev = () => setIndex((i) => Math.max(i - 1, 0));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2000] flex justify-end">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 35 }}
          className="relative flex h-full w-full max-w-lg flex-col bg-surface border-l border-surface-border shadow-[0_0_100px_rgba(0,0,0,0.5)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-surface-border px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Review & Personalize</h3>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
                  {index + 1} of {leads.length} in queue
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg text-foreground-muted hover:bg-surface-raised transition-colors" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Lead Navigation */}
          {leads.length > 1 && (
            <div className="flex items-center justify-between border-b border-surface-border bg-surface-raised/30 px-6 py-3">
              <button 
                onClick={goPrev} 
                disabled={index === 0} 
                className="p-1.5 rounded-full text-foreground-muted hover:text-primary hover:bg-primary/10 disabled:opacity-20 transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-[10px] font-black uppercase text-foreground tracking-tight">
                {lead.businessName}
              </span>
              <button 
                onClick={goNext} 
                disabled={index === leads.length - 1} 
                className="p-1.5 rounded-full text-foreground-muted hover:text-primary hover:bg-primary/10 disabled:opacity-20 transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
            {/* Lead Info Card */}
            <div className="card-matte p-4 bg-surface-raised/50 border-primary/10">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-bold text-foreground">{lead.businessName}</h4>
                  <p className="text-xs text-foreground-muted mt-1">{lead.phone || 'No phone number available'}</p>
                </div>
                {phoneValid && (
                  <div className="flex items-center gap-1 text-[10px] font-black text-emerald-400 uppercase">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </div>
                )}
              </div>
              {!phoneValid && lead.phone && (
                <div className="mt-3 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-400">
                  ⚠️ This format might be invalid for WhatsApp. Use a full country code (e.g., +91).
                </div>
              )}
            </div>

            {/* Message Editing Area */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="label-caps">Message Content</label>
                <button
                  onClick={() => setEditingTemplate((e) => !e)}
                  className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase hover:bg-primary/10 px-2 py-1 rounded transition-all"
                >
                  <Pencil className="h-3 w-3" />
                  {editingTemplate ? 'Close Master' : 'Edit Master'}
                </button>
              </div>

              <AnimatePresence>
                {editingTemplate && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="card-matte p-4 bg-surface-raised/30 mb-4 space-y-3">
                      <p className="text-[10px] font-bold text-foreground-muted opacity-60">
                        MASTER TEMPLATE (Updates for all leads)
                      </p>
                      <textarea
                        value={draftTemplate}
                        onChange={(e) => setDraftTemplate(e.target.value)}
                        rows={3}
                        className="input-field text-sm"
                        placeholder="Hello {{businessName}}, I saw..."
                      />
                      <button
                        onClick={() => {
                          onUpdateTemplate(draftTemplate);
                          setEditedMessage(renderTemplate(draftTemplate, lead));
                          setEditingTemplate(false);
                        }}
                        className="w-full py-2 bg-foreground text-background rounded-lg text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all"
                      >
                        Update Master
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative group">
                <div className="absolute -top-3 right-3 px-2 bg-surface text-[10px] font-black text-primary border border-primary/20 rounded z-10 flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-2.5 h-2.5" />
                  Live Preview
                </div>
                <textarea
                  value={editedMessage}
                  onChange={(e) => setEditedMessage(e.target.value)}
                  rows={10}
                  className="input-field text-sm leading-relaxed p-5 pt-7 min-h-[300px] border-primary/20 bg-surface focus:border-primary/50 transition-all font-medium"
                  placeholder="Draft your personalized message here..."
                />
                <div className="absolute bottom-3 right-3 text-[10px] font-black text-foreground-muted uppercase tracking-tighter opacity-50">
                  {editedMessage.length} CHRS
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-surface-border px-8 py-6 bg-surface">
            <button
              onClick={handleOpenWhatsApp}
              disabled={!lead.phone}
              className="btn-primary w-full h-14 !shadow-[0_10px_30px_rgba(34,211,216,0.2)]"
            >
              <MessageCircle className="h-5 w-5" />
              OPEN WHATSAPP
              <ExternalLink className="h-4 w-4 ml-1 opacity-50" />
            </button>
            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold text-foreground-muted uppercase tracking-widest">
              <span className="w-1 h-1 rounded-full bg-primary" />
              Personalize, Send, and Repeat
              <span className="w-1 h-1 rounded-full bg-primary" />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ComposerPanel;
