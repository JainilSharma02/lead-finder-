import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Download, X, FileSpreadsheet, FileText, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const SelectionBar = ({ count, onCompose, onExportCsv, onExportExcel, onClear }) => {
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 40, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 40, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-8 left-1/2 z-40 lg:left-[calc(50%+8rem)]"
        >
          <div className="flex items-center gap-4 rounded-2xl border border-surface-border bg-surface px-5 py-3 shadow-2xl">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                {count}
              </span>
              <span className="text-sm font-medium text-foreground">Selected</span>
            </div>

            <div className="h-6 w-px bg-surface-border" />

            <button
              onClick={onCompose}
              className="btn-primary py-2 px-4 shadow-lg shadow-primary/20"
            >
              <MessageCircle className="h-4 w-4" />
              Message
            </button>

            <div className="relative">
              <button
                onClick={() => setExportOpen((o) => !o)}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-foreground-muted hover:bg-surface-raised hover:text-foreground transition-colors border border-transparent"
              >
                <Download className="h-4 w-4" />
                Export
                <ChevronUp className={`h-4 w-4 transition-transform ${exportOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {exportOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: -4, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-full left-0 mb-2 w-48 overflow-hidden rounded-xl border border-surface-border bg-surface-raised p-1.5 shadow-xl"
                  >
                    <button
                      onClick={() => {
                        onExportCsv();
                        setExportOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-foreground-muted hover:bg-surface hover:text-foreground transition-colors"
                    >
                      <FileText className="h-4 w-4 text-primary" />
                      Export to CSV
                    </button>
                    <button
                      onClick={() => {
                        onExportExcel();
                        setExportOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-foreground-muted hover:bg-surface hover:text-foreground transition-colors"
                    >
                      <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                      Export to Excel
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-6 w-px bg-surface-border" />

            <button 
              onClick={onClear} 
              className="rounded-lg p-2 text-foreground-muted hover:bg-surface-raised hover:text-red-400 transition-colors" 
              aria-label="Clear selection"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SelectionBar;
