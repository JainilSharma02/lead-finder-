import { Star, Phone, Globe, MapPin, ExternalLink, MessageCircle, Check, X as XIcon } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const statusStyles = {
  new: 'bg-surface-raised text-foreground-muted',
  contacted: 'bg-primary/20 text-primary',
  ignored: 'bg-red-500/20 text-red-500',
};

const LeadsTable = ({ leads, selectedIds, onToggleSelect, onToggleSelectAll, onOpenWhatsApp, onUpdateStatus, onFocusLead, loading }) => {
  const allSelected = leads.length > 0 && leads.every((l) => selectedIds.has(l._id));

  if (loading) {
    return (
      <div className="card-matte p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-surface-raised/50" />
        ))}
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="card-matte flex flex-col items-center justify-center p-12 text-center">
        <div className="mb-4 rounded-full bg-surface-raised p-4">
          <Phone className="h-8 w-8 text-foreground-muted/50" />
        </div>
        <h3 className="text-lg font-bold text-foreground">No leads found</h3>
        <p className="mt-2 text-sm text-foreground-muted">
          Try adjusting your search filters or searching for a different area.
        </p>
      </div>
    );
  }

  return (
    <div className="card-matte overflow-hidden bg-surface relative">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-surface-border bg-surface/50">
              <th className="w-12 px-4 py-4">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  className="h-4 w-4 cursor-pointer rounded border-surface-border text-primary focus:ring-primary focus:ring-offset-surface"
                />
              </th>
              <th className="label-caps px-4 py-4">Business</th>
              <th className="label-caps px-4 py-4">Contact</th>
              <th className="label-caps px-4 py-4">Website</th>
              <th className="label-caps px-4 py-4">Location</th>
              <th className="label-caps px-4 py-4">Status</th>
              <th className="label-caps px-4 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {leads.map((lead, idx) => {
              const isSelected = selectedIds.has(lead._id);
              return (
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.5) }}
                  key={lead._id}
                  onClick={() => onFocusLead?.(lead)}
                  className={clsx(
                    'group transition-colors cursor-pointer',
                    isSelected ? 'bg-primary/5' : 'hover:bg-surface-raised/50'
                  )}
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => { e.stopPropagation(); onToggleSelect(lead._id); }}
                      className="h-4 w-4 cursor-pointer rounded border-surface-border text-primary focus:ring-primary focus:ring-offset-surface"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{lead.businessName}</p>
                      <div className="mt-1 flex items-center gap-2">
                        {lead.category && (
                          <span className="text-xs text-foreground-muted">{lead.category}</span>
                        )}
                        {lead.rating && (
                          <div className="flex items-center gap-1 text-xs font-medium text-accent">
                            <Star className="h-3 w-3 fill-accent stroke-none" />
                            {lead.rating}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {lead.phone ? (
                      <div className="flex flex-col gap-1">
                        <a
                          href={`tel:${lead.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1"
                        >
                          <Phone className="h-3 w-3 text-primary" />
                          {lead.phone}
                        </a>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                          <MessageCircle className="h-2.5 w-2.5" /> WhatsApp Ready
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <a
                          href={`https://www.google.com/search?q=${encodeURIComponent(lead.businessName + ' ' + (lead.address || '') + ' phone number')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-primary/70 hover:text-primary transition-colors underline underline-offset-2 flex items-center gap-1"
                        >
                          <Phone className="h-3 w-3" />
                          Find Number →
                        </a>
                        <span className="text-[10px] text-foreground-muted/50 italic">Not in OSM</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {lead.website ? (
                      <a
                        href={lead.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-foreground-muted hover:text-primary transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Globe className="h-3.5 w-3.5" />
                        <span className="max-w-[120px] truncate">
                          {lead.website.replace(/^https?:\/\/(www\.)?/, '')}
                        </span>
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <span className="text-foreground-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 max-w-[200px]">
                      <MapPin className="h-3.5 w-3.5 text-foreground-muted shrink-0" />
                      <span className="text-sm text-foreground-muted truncate">
                        {lead.address || 'Location hidden'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={clsx('px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider', statusStyles[lead.status])}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {lead.mapsLink && (
                        <a
                          href={lead.mapsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-foreground-muted hover:bg-surface-raised hover:text-foreground transition-colors"
                          title="View on Maps"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MapPin className="h-4 w-4" />
                        </a>
                      )}
                      <a
                          href={
                            lead.whatsappNumber
                              ? `https://wa.me/${lead.whatsappNumber}?text=${encodeURIComponent('Hello ' + lead.businessName + ', I wanted to connect with you.')}`
                              : `https://www.google.com/search?q=${encodeURIComponent(lead.businessName + ' ' + (lead.address || '') + ' whatsapp number')}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className={`p-1.5 rounded-lg transition-colors flex items-center ${
                            lead.whatsappNumber
                              ? 'text-emerald-400 hover:bg-emerald-400/10'
                              : 'text-foreground-muted/40 hover:bg-surface-raised hover:text-foreground-muted'
                          }`}
                          title={lead.whatsappNumber ? 'Open WhatsApp' : 'Search WhatsApp number on Google'}
                        >
                          <MessageCircle className="h-4.5 w-4.5" />
                        </a>
                      <button
                        onClick={(e) => { e.stopPropagation(); onUpdateStatus(lead._id, lead.status === 'contacted' ? 'new' : 'contacted'); }}
                        className="p-1.5 rounded-lg text-foreground-muted hover:bg-surface-raised hover:text-foreground transition-colors"
                        title={lead.status === 'contacted' ? 'Mark uncontacted' : 'Mark contacted'}
                      >
                        {lead.status === 'contacted' ? <XIcon className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsTable;
