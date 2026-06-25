import { useState } from 'react';
import { Search, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const SearchBar = ({ onSearch, loading }) => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!keyword.trim() || !location.trim()) return;
    onSearch(keyword.trim(), location.trim());
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      onSubmit={handleSubmit}
      className="card-matte p-1.5 flex flex-col sm:flex-row gap-1 relative z-20 group focus-within:border-primary/50 focus-within:shadow-[0_0_50px_rgba(34,211,216,0.1)] transition-all"
    >
      <div className="flex-1 flex items-center gap-3 px-4 py-2 rounded-lg bg-surface/50 focus-within:bg-background transition-colors">
        <Search className="h-4 w-4 shrink-0 text-foreground-muted group-focus-within:text-primary transition-colors" />
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Business Keyword (e.g. Software Companies)"
          className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-foreground-muted/40 outline-none"
        />
      </div>

      <div className="hidden sm:block w-px h-8 bg-surface-border self-center" />

      <div className="flex-1 flex items-center gap-3 px-4 py-2 rounded-lg bg-surface/50 focus-within:bg-background transition-colors">
        <MapPin className="h-4 w-4 shrink-0 text-foreground-muted group-focus-within:text-primary transition-colors" />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location (e.g. Mumbai, India)"
          className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-foreground-muted/40 outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !keyword.trim() || !location.trim()}
        className="btn-primary min-w-[140px] font-black uppercase tracking-widest text-xs h-12"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-background animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1 h-1 rounded-full bg-background animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1 h-1 rounded-full bg-background animate-bounce" />
          </div>
        ) : (
          <>
            Find leads
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </>
        )}
      </button>
    </motion.form>
  );
};

export default SearchBar;
