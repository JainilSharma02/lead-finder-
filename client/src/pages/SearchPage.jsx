import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchIcon, Loader2, Sparkles, Filter, Map, LayoutList } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';
import LeadsTable from '../components/LeadsTable';
import SelectionBar from '../components/SelectionBar';
import ComposerPanel from '../components/ComposerPanel';
import LeadMap from '../components/Map/LeadMap';
import { leadsApi } from '../api/leads';
import { FadeIn } from '../components/common/Motion';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchIdParam = searchParams.get('searchId');

  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [platform, setPlatform] = useState('google_scrape');
  
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [composerOpen, setComposerOpen] = useState(false);
  
  // "hatke" View Toggle: 'split', 'list', 'map'
  const [viewMode, setViewMode] = useState('split');
  const [focusedLead, setFocusedLead] = useState(null);

  useEffect(() => {
    if (searchIdParam) {
      loadSearchHistory(searchIdParam);
    }
  }, [searchIdParam]);

  const loadSearchHistory = async (id) => {
    setLoading(true);
    try {
      const res = await leadsApi.getLeads({ searchId: id });
      setLeads(res.data.leads || []);
      setHasSearched(true);
    } catch (err) {
      toast.error('Failed to load past search');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keyword.trim() || !location.trim()) {
      toast.error('Keyword and Location are required');
      return;
    }
    
    setLoading(true);
    setHasSearched(true);
    setLeads([]);
    setSelectedIds(new Set());
    setFocusedLead(null);
    setSearchParams({});
    
    try {
      const res = await leadsApi.search({ keyword, location, platform });
      setLeads(res.data.leads || []);
      toast.success(`Found ${res.data.leads.length} leads!`);
    } catch (err) {
      console.error(err);
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === leads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(leads.map(l => l._id)));
    }
  }, [selectedIds, leads]);

  return (
    <DashboardLayout>
      <div className={`mx-auto w-full ${viewMode === 'split' ? 'max-w-[1600px] h-[calc(100vh-80px)] flex flex-col' : 'max-w-7xl'}`}>
        <header className="mb-6 flex-shrink-0">
          <FadeIn direction="none" className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-2">
                Lead Intelligence <Sparkles className="w-5 h-5 text-primary" />
              </h1>
              <p className="mt-1 text-foreground-muted">Discover businesses and map your outreach territory.</p>
            </div>
            
            {hasSearched && (
              <div className="flex bg-surface-raised p-1 rounded-lg border border-surface-border">
                <button 
                  onClick={() => setViewMode('list')} 
                  className={`p-2 rounded-md flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'list' ? 'bg-surface border border-surface-border shadow-sm text-primary' : 'text-foreground-muted hover:text-foreground'}`}
                >
                  <LayoutList className="w-4 h-4" /> List
                </button>
                <button 
                  onClick={() => setViewMode('split')} 
                  className={`p-2 rounded-md flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'split' ? 'bg-surface border border-surface-border shadow-sm text-primary' : 'text-foreground-muted hover:text-foreground'}`}
                >
                  <Map className="w-4 h-4" /> Split View
                </button>
                <button 
                  onClick={() => setViewMode('map')} 
                  className={`p-2 rounded-md flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'map' ? 'bg-surface border border-surface-border shadow-sm text-primary' : 'text-foreground-muted hover:text-foreground'}`}
                >
                  <Map className="w-4 h-4" /> Map
                </button>
              </div>
            )}
          </FadeIn>
        </header>

        {/* Search Panel */}
        <FadeIn delay={0.1} direction="up" className="card-matte p-4 mb-6 relative overflow-hidden flex-shrink-0 border-primary/20 bg-surface-raised/50">
          <div className="absolute top-0 right-0 p-32 bg-primary/5 blur-[100px] pointer-events-none rounded-full" />
          
          <form onSubmit={handleSearch} className="relative z-10 flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <label htmlFor="keyword" className="label-caps mb-1.5 block">
                Target Objective
              </label>
              <div className="relative">
                <SearchIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/70" />
                <input
                  id="keyword"
                  type="text"
                  placeholder="e.g. Plumbers, Digital Agencies"
                  className="input-field pl-10 border-primary/20 bg-surface focus:border-primary"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex-1">
              <label htmlFor="location" className="label-caps mb-1.5 block">
                Deployment Zone
              </label>
              <div className="relative">
                <Map className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/70" />
                <input
                  id="location"
                  type="text"
                  placeholder="e.g. London, Austin TX"
                  className="input-field pl-10 border-primary/20 bg-surface focus:border-primary"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full md:w-48">
              <label htmlFor="platform" className="label-caps mb-1.5 block">
                Intelligence Source
              </label>
              <div className="relative">
                <select
                  id="platform"
                  className="input-field appearance-none pr-10 border-primary/20 bg-surface focus:border-primary"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                >
                  <option value="google">Google Maps Rapid</option>
                  <option value="google_scrape">Google Maps Deep Scrape</option>
                </select>
                <Filter className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="btn-primary h-11 px-8 min-w-[150px] shadow-[0_0_20px_rgba(34,211,216,0.3)] hover:shadow-[0_0_30px_rgba(34,211,216,0.5)]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="animate-pulse font-bold tracking-widest">SCANNING</span>
                </div>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  INITIATE SCAN
                </>
              )}
            </button>
          </form>
        </FadeIn>

        {/* Results Area */}
        {hasSearched && (
          <FadeIn delay={0.2} direction="up" className={`flex-1 min-h-0 ${viewMode === 'split' ? 'flex gap-6' : 'flex flex-col gap-6'}`}>
            
            {/* List View Component */}
            {(viewMode === 'list' || viewMode === 'split') && (
              <div className={`${viewMode === 'split' ? 'w-1/2 overflow-auto pr-2 custom-scrollbar' : 'w-full'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-display font-bold text-foreground">
                    Acquired Targets {leads.length > 0 && <span className="text-primary text-sm font-bold ml-2">[{leads.length} found]</span>}
                  </h2>
                </div>
                <LeadsTable 
                  leads={leads}
                  selectedIds={selectedIds}
                  onToggleSelect={toggleSelect}
                  onToggleSelectAll={toggleSelectAll}
                  loading={loading}
                  onFocusLead={setFocusedLead}
                  onOpenWhatsApp={(lead) => {
                    setSelectedIds(new Set([lead._id]));
                    setComposerOpen(true);
                  }}
                  onUpdateStatus={async (id, status) => {
                    setLeads(l => l.map(lead => lead._id === id ? { ...lead, status } : lead));
                    try { await leadsApi.updateStatus(id, status); } catch (e) { toast.error('Failed to update status'); }
                  }}
                />
              </div>
            )}

            {/* Map View Component */}
            {(viewMode === 'map' || viewMode === 'split') && (
              <div className={`${viewMode === 'split' ? 'w-1/2 h-full' : 'w-full h-[600px]'} relative rounded-2xl overflow-hidden border border-surface-border shadow-2xl`}>
                <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-surface to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-surface to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none" />
                
                <LeadMap 
                  leads={leads} 
                  focusLead={focusedLead} 
                  className="w-full h-full"
                />
              </div>
            )}
          </FadeIn>
        )}
      </div>

      <SelectionBar
        count={selectedIds.size}
        onClear={() => setSelectedIds(new Set())}
        onCompose={() => setComposerOpen(true)}
        onExportCsv={() => toast.success('CSV Export initiated')}
        onExportExcel={() => toast.success('Excel Export initiated')}
      />

      {composerOpen && (
        <ComposerPanel
          leads={leads.filter((l) => selectedIds.has(l._id))}
          template="Hello {{businessName}}, I am a professional website developer. I can create modern websites, e-commerce stores, business websites, and web applications. If you are interested in improving your online presence, please reply to discuss your requirements."
          onClose={() => setComposerOpen(false)}
          onMarkContacted={async (id) => {
            setLeads(l => l.map(lead => lead._id === id ? { ...lead, status: 'contacted' } : lead));
            try { await leadsApi.updateStatus(id, 'contacted'); } catch (e) {}
          }}
          onUpdateTemplate={() => {}}
        />
      )}
    </DashboardLayout>
  );
};

export default SearchPage;
