'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, Search, Sun, Moon, Cloud, CloudRain, Zap,
  Github, Twitter, Youtube, Globe, BookOpen, Music,
  Terminal, Coffee, Heart, Star, Sparkles, ChevronRight,
  Plus, X, GripVertical
} from 'lucide-react';

interface LinkItem {
  id: string;
  label: string;
  url: string;
  icon: string;
}

type Theme = 'cosmic' | 'emerald' | 'sunset' | 'ocean';

const THEMES: Record<Theme, { bg: string; accent: string; surface: string }> = {
  cosmic: { bg: '#050507', accent: '#818cf8', surface: '#101010' },
  emerald: { bg: '#050507', accent: '#00d992', surface: '#101010' },
  sunset: { bg: '#0a0505', accent: '#ff6363', surface: '#151010' },
  ocean: { bg: '#05080a', accent: '#00d4ff', surface: '#0d1111' },
};

const DEFAULT_LINKS: LinkItem[] = [
  { id: '1', label: 'GitHub', url: 'https://github.com', icon: 'github' },
  { id: '2', label: 'Twitter', url: 'https://x.com', icon: 'twitter' },
  { id: '3', label: 'YouTube', url: 'https://youtube.com', icon: 'youtube' },
  { id: '4', label: 'Google Scholar', url: 'https://scholar.google.com', icon: 'book' },
  { id: '5', label: 'arXiv', url: 'https://arxiv.org', icon: 'book' },
  { id: '6', label: 'OpenAlex', url: 'https://openalex.org', icon: 'globe' },
  { id: '7', label: 'Lexicon', url: 'https://algojogacor.github.io/lexicon-papers/', icon: 'book' },
  { id: '8', label: 'Æther', url: 'https://algojogacor.github.io/aether-cosmos/', icon: 'sparkles' },
];

const iconMap: Record<string, React.ReactNode> = {
  github: <Github size={16} />,
  twitter: <Twitter size={16} />,
  youtube: <Youtube size={16} />,
  book: <BookOpen size={16} />,
  globe: <Globe size={16} />,
  music: <Music size={16} />,
  terminal: <Terminal size={16} />,
  coffee: <Coffee size={16} />,
  heart: <Heart size={16} />,
  star: <Star size={16} />,
  sparkles: <Sparkles size={16} />,
};

export default function Home() {
  const [time, setTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [theme, setTheme] = useState<Theme>('cosmic');
  const [editing, setEditing] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now);
      const h = now.getHours();
      if (h < 12) setGreeting('Good morning');
      else if (h < 17) setGreeting('Good afternoon');
      else setGreeting('Good evening');
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('bento-links');
    if (stored) {
      try { setLinks(JSON.parse(stored)); } catch {}
    }
    if (!stored || JSON.parse(stored || '[]').length === 0) {
      setLinks(DEFAULT_LINKS);
      localStorage.setItem('bento-links', JSON.stringify(DEFAULT_LINKS));
    }
    const storedTheme = localStorage.getItem('bento-theme') as Theme;
    if (storedTheme) setTheme(storedTheme);
  }, []);

  const saveLinks = (newLinks: LinkItem[]) => {
    setLinks(newLinks);
    localStorage.setItem('bento-links', JSON.stringify(newLinks));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const addLink = () => {
    if (newLabel && newUrl) {
      const newLink: LinkItem = {
        id: Date.now().toString(),
        label: newLabel,
        url: newUrl.startsWith('http') ? newUrl : `https://${newUrl}`,
        icon: 'globe',
      };
      saveLinks([...links, newLink]);
      setNewLabel('');
      setNewUrl('');
    }
  };

  const removeLink = (id: string) => {
    saveLinks(links.filter(l => l.id !== id));
  };

  const t = THEMES[theme];
  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  const dateStr = time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-700"
      style={{ background: t.bg }}
    >
      {/* Theme Switcher */}
      <div className="fixed top-4 right-4 z-50 flex gap-1">
        {(Object.keys(THEMES) as Theme[]).map((th) => (
          <button
            key={th}
            onClick={() => { setTheme(th); localStorage.setItem('bento-theme', th); }}
            className={`w-3 h-3 rounded-full transition-all ${
              theme === th ? 'ring-2 ring-white/50 scale-125' : 'opacity-40 hover:opacity-70'
            }`}
            style={{ background: THEMES[th].accent }}
            aria-label={th}
          />
        ))}
      </div>

      {/* Clock Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <p className="text-sm text-steel/60 tracking-widest uppercase mb-3">{greeting}, Arya</p>
        <h1 className="text-7xl md:text-8xl font-light text-snow tracking-tighter mb-2 font-mono"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          {timeStr}
        </h1>
        <p className="text-sm text-steel/50 tracking-wide">{dateStr}</p>
      </motion.div>

      {/* Search */}
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onSubmit={handleSearch}
        className="w-full max-w-lg mb-12"
      >
        <div className="glass-panel flex items-center px-4 py-2.5">
          <Search size={16} className="text-steel/40 mr-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search the web..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-snow placeholder:text-steel/30"
          />
        </div>
      </motion.form>

      {/* Bento Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full max-w-2xl"
      >
        <AnimatePresence>
          {links.map((link, i) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="glass-panel p-4 flex flex-col items-center justify-center gap-2 text-center
                group hover:border-white/15 transition-all duration-200 cursor-pointer
                min-h-[90px] relative"
              style={{ borderColor: `rgba(255,255,255,0.05)` }}
            >
              {editing && (
                <button
                  onClick={(e) => { e.preventDefault(); removeLink(link.id); }}
                  className="absolute top-1.5 right-1.5 p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-coral/20 transition-all"
                >
                  <X size={10} className="text-coral/60" />
                </button>
              )}
              <div className="text-steel/50 group-hover:text-steel/80 transition-colors">
                {iconMap[link.icon] || <Globe size={16} />}
              </div>
              <span className="text-[11px] text-parchment/80 group-hover:text-snow transition-colors font-medium">
                {link.label}
              </span>
            </motion.a>
          ))}
        </AnimatePresence>

        {/* Add Link Button */}
        {editing ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-3 flex flex-col gap-2 min-h-[90px] col-span-2 sm:col-span-2"
          >
            <div className="flex gap-2">
              <input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Label"
                className="flex-1 bg-carbon/50 border border-warm-charcoal/30 rounded-md px-2 py-1.5 text-xs text-snow outline-none focus:border-emerald/50"
              />
              <input
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="URL"
                className="flex-1 bg-carbon/50 border border-warm-charcoal/30 rounded-md px-2 py-1.5 text-xs text-snow outline-none focus:border-emerald/50"
                onKeyDown={(e) => e.key === 'Enter' && addLink()}
              />
              <button onClick={addLink} className="btn-ghost text-xs px-3">Add</button>
            </div>
          </motion.div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="glass-panel p-4 flex flex-col items-center justify-center gap-2 text-center
              min-h-[90px] border-dashed border-steel/20 hover:border-emerald/30 transition-all"
          >
            <Plus size={18} className="text-steel/30" />
            <span className="text-[10px] text-steel/40">Add Link</span>
          </button>
        )}
      </motion.div>

      {/* Edit toggle */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={() => setEditing(!editing)}
        className="mt-6 text-[10px] text-steel/40 hover:text-steel/70 transition-colors tracking-wider uppercase"
      >
        {editing ? 'Done Editing' : 'Customize Links'}
      </motion.button>

      {/* Footer */}
      <div className="fixed bottom-4 left-0 right-0 text-center pointer-events-none">
        <p className="text-[9px] text-steel/20 tracking-widest uppercase">
          Bento · Built by Algojo
        </p>
      </div>
    </main>
  );
}
