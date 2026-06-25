import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, MessageCircleMore, Hourglass, Search as SearchIcon, ArrowRight, History, Sparkles } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import { leadsApi } from '../api/leads';
import { FadeIn } from '../components/common/Motion';

const DashboardPage = () => {
  const [stats, setStats] = useState({ total: 0, contacted: 0, remaining: 0, ignored: 0 });
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, searchesRes] = await Promise.all([leadsApi.stats(), leadsApi.searchHistory()]);
        setStats(statsRes.data.stats);
        setSearches(searchesRes.data.searches.slice(0, 5));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const chartData = [
    { name: 'Contacted', value: stats.contacted, color: '#22D3D8' },
    { name: 'Remaining', value: stats.remaining, color: '#1A1A1D' },
    { name: 'Ignored', value: stats.ignored, color: '#2B2B2F' },
  ].filter((d) => d.value > 0);

  return (
    <DashboardLayout>
      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <FadeIn direction="none">
            <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
            <p className="mt-1 text-foreground-muted">Your lead pipeline at a glance.</p>
          </FadeIn>
        </div>
        <FadeIn direction="none" delay={0.1}>
          <Link to="/search" className="btn-primary shadow-xl shadow-primary/10">
            <SearchIcon className="h-4 w-4" />
            New lead search
          </Link>
        </FadeIn>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard label="Total leads found" value={loading ? 0 : stats.total} icon={Users} delay={0.1} />
        <StatCard
          label="Leads contacted"
          value={loading ? 0 : stats.contacted}
          icon={MessageCircleMore}
          accent="primary"
          delay={0.2}
        />
        <StatCard
          label="Leads remaining"
          value={loading ? 0 : stats.remaining}
          icon={Hourglass}
          delay={0.3}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Progress chart */}
        <FadeIn delay={0.4} direction="up" className="lg:col-span-2">
          <div className="card-matte p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <p className="label-caps">Outreach progress</p>
              <Sparkles className="w-4 h-4 text-primary opacity-50" />
            </div>
            
            {stats.total === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center p-8">
                <div className="w-12 h-12 rounded-full bg-surface-raised flex items-center justify-center mb-4">
                  <SearchIcon className="w-6 h-6 text-foreground-muted/30" />
                </div>
                <p className="text-sm text-foreground-muted">No leads yet — run a search to get started.</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-center">
                <div className="relative h-48 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={chartData} 
                        dataKey="value" 
                        innerRadius={60} 
                        outerRadius={80} 
                        paddingAngle={4}
                        animationBegin={500}
                        animationDuration={1500}
                      >
                        {chartData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: '#141416', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, color: '#F2F2F0' }}
                        itemStyle={{ color: '#F2F2F0' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-3xl font-display font-bold text-foreground">
                      {stats.total ? Math.round((stats.contacted / stats.total) * 100) : 0}%
                    </p>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Success</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {chartData.map((d) => (
                     <div key={d.name} className="flex items-center gap-2 p-2 rounded-lg bg-surface-raised/50 border border-surface-border">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: d.color }} />
                      <span className="text-[10px] font-bold text-foreground uppercase tracking-tight">{d.name}</span>
                      <span className="ml-auto text-xs font-medium text-foreground-muted">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </FadeIn>

        {/* Recent searches */}
        <FadeIn delay={0.5} direction="up" className="lg:col-span-3">
          <div className="card-matte p-6 h-full">
            <div className="mb-6 flex items-center justify-between">
              <p className="label-caps">Recent searches</p>
              <History className="h-4 w-4 text-foreground-muted" />
            </div>

            {searches.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center gap-4 text-center">
                <div className="w-12 h-12 rounded-full bg-surface-raised flex items-center justify-center">
                  <SearchIcon className="w-6 h-6 text-foreground-muted/30" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Nothing searched yet</p>
                  <Link to="/search" className="text-xs font-bold text-primary hover:text-primary-dark">
                    Run your first search →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {searches.map((s) => (
                  <Link
                    key={s._id}
                    to={`/search?searchId=${s._id}`}
                    className="group flex items-center justify-between rounded-xl p-4 transition-all border border-transparent hover:border-surface-border hover:bg-surface-raised"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-surface-raised border border-surface-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <SearchIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                          {s.keyword} <span className="text-foreground-muted/50 mx-1">in</span> {s.location}
                        </p>
                        <p className="text-[10px] font-bold text-foreground-muted uppercase tracking-tight">
                          {s.resultCount} results · {new Date(s.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-foreground-muted group-hover:text-foreground group-hover:translate-x-1 transition-all">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
