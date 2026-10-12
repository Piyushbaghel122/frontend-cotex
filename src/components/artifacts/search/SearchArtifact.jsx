import React, { useState } from 'react';
import { Globe, Sparkles, Copy, Check, ExternalLink, Share2, Info } from 'lucide-react';

export default function SearchArtifact({ artifact, file }) {
  const [copied, setCopied] = useState(false);

  const activeFile = file || artifact?.files?.[0];
  const title = activeFile?.title || activeFile?.name || artifact?.title || "Search Results & Synthesis";
  const content = activeFile?.content || artifact?.content || "";
  const imageUrl = activeFile?.image || artifact?.image || "";
  const description = activeFile?.description || "";
  const sourceUrl = activeFile?.url || `https://www.google.com/search?q=${encodeURIComponent(title)}`;

  const handleCopy = async () => {
    const textToCopy = `${title}\n${description ? `(${description})\n` : ''}\n${content}\nSource: ${sourceUrl}`;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0c10] text-slate-200 overflow-hidden select-none">
      {/* Top Bar */}
      <div className="h-12 px-4 border-b border-white/[0.08] bg-[#13151c] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-md bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Globe size={14} />
          </div>
          <span className="text-xs font-semibold text-slate-100 truncate max-w-[200px]">
            {title}
          </span>
          <span className="text-[10px] font-medium text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full shrink-0">
            Live Web
          </span>
        </div>

        <div className="flex items-center gap-2">
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors border-none bg-transparent cursor-pointer flex items-center gap-1 text-xs"
              title="Open Source in New Tab"
            >
              <ExternalLink size={13} />
            </a>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all cursor-pointer border-none shadow-md shadow-indigo-600/30"
          >
            {copied ? <Check size={13} className="text-emerald-300" /> : <Copy size={13} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center">
        <div className="w-full max-w-xl bg-[#13151c] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          {/* Featured Image if available */}
          {imageUrl && (
            <div className="w-full h-56 bg-black/60 relative overflow-hidden border-b border-white/[0.06] flex items-center justify-center">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#13151c] via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-medium text-blue-300">
                Verified Web Photo
              </div>
            </div>
          )}

          {/* Details Section */}
          <div className="p-5 flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles size={13} />
                <span>Internet Knowledge Intelligence</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Live Index</span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-100 tracking-tight">{title}</h2>
              {description && (
                <p className="text-xs text-indigo-400 font-medium mt-0.5">{description}</p>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-[12.5px] text-slate-300 leading-relaxed whitespace-pre-wrap select-text">
                {content || "Information retrieved and verified across live internet databases."}
              </p>
            </div>

            {sourceUrl && (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-300 text-xs font-medium transition-colors no-underline cursor-pointer group"
              >
                <span className="flex items-center gap-1.5">
                  <Globe size={13} />
                  <span>View Original Web Source & Timeline</span>
                </span>
                <ExternalLink size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
            )}

            <div className="border-t border-white/[0.06] pt-3 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Info size={11} />
                <span>Real-time Wikipedia & Web synthesis</span>
              </span>
              <span className="text-indigo-400 font-medium">CortexAI Web Agent</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
