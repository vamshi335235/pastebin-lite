
'use client';
import { useState } from 'react';
import { Loader2, Copy, Check, ExternalLink, Clock, Eye, FileText, Sparkles } from 'lucide-react';

export default function Home() {
  const [content, setContent] = useState('');
  const [ttl, setTtl] = useState<number | ''>('');
  const [maxViews, setMaxViews] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ id: string, url: string } | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/pastes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content,
          ttl_seconds: ttl ? Number(ttl) : undefined,
          max_views: maxViews ? Number(maxViews) : undefined
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create paste');

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 text-center space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400 mb-4 shadow-[0_0_30px_rgba(52,211,153,0.3)]">
            <Sparkles className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Paste Ready!</h2>
            <p className="text-neutral-300">Your secure link has been generated.</p>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-xl p-3 flex items-center gap-3">
            <input readOnly value={result.url} className="bg-transparent flex-1 text-sm text-neutral-200 px-2 outline-none font-mono" />
            <button onClick={copyToClipboard} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-white shadow-sm" aria-label="Copy URL">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <a href={result.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-white/10">
              <ExternalLink className="w-4 h-4" />
              View Now
            </a>
            <button onClick={() => { setResult(null); setContent(''); setTtl(''); setMaxViews(''); }} className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-medium text-sm hover:bg-white/10 transition-colors">
              Create New
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 selection:bg-indigo-500/30">
      <div className="w-full max-w-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-indigo-500/20 rounded-2xl">
              <FileText className="w-8 h-8 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-3 bg-gradient-to-br from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            Pastebin Lite
          </h1>
          <p className="text-neutral-400 text-lg">Secure. Ephemeral. Simple.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-indigo-300/80 ml-1">Paste Content</label>
            <div className="relative group">
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write something amazing..."
                className="w-full h-64 bg-black/20 border border-white/5 hover:border-white/10 focus:border-indigo-500/50 rounded-2xl p-6 text-base font-mono text-neutral-200 resize-none outline-none transition-all placeholder:text-neutral-600 shadow-inner"
              />
              <div className="absolute bottom-4 right-6 text-xs font-medium text-neutral-600 pointer-events-none bg-black/40 px-2 py-1 rounded-md">
                {content.length} chars
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/20 p-4 rounded-2xl border border-white/5 space-y-3">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-300/80">
                <Clock className="w-4 h-4" />
                Auto-Expire (Seconds)
              </label>
              <input
                type="number"
                min="1"
                value={ttl}
                onChange={(e) => setTtl(e.target.value === '' ? '' : parseInt(e.target.value))}
                placeholder="Never"
                className="w-full bg-transparent border-b border-white/10 focus:border-indigo-500 py-2 text-lg text-white outline-none transition-colors placeholder:text-neutral-700"
              />
            </div>
            <div className="bg-black/20 p-4 rounded-2xl border border-white/5 space-y-3">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-300/80">
                <Eye className="w-4 h-4" />
                View Limit
              </label>
              <input
                type="number"
                min="1"
                value={maxViews}
                onChange={(e) => setMaxViews(e.target.value === '' ? '' : parseInt(e.target.value))}
                placeholder="Unlimited"
                className="w-full bg-transparent border-b border-white/10 focus:border-indigo-500 py-2 text-lg text-white outline-none transition-colors placeholder:text-neutral-700"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/20 text-red-200 text-sm p-4 rounded-xl text-center font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg focus:ring-4 focus:ring-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Create Secure Paste'}
          </button>
        </form>
      </div>
    </div>
  );
}
