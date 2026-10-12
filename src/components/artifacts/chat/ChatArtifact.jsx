import  { useState } from 'react';
import { MessageSquare, Copy, Check, Sparkles } from 'lucide-react';

export default function ChatArtifact({ artifact, file }) {
  const [copied, setCopied] = useState(false);
  const title = file?.name || artifact?.title || "Communication & Prompt Blueprint";
  const content = file?.content || artifact?.content || "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content || title);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0c10] text-slate-200">
      <div className="h-12 px-4 border-b border-white/[0.08] bg-[#13151c] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <MessageSquare size={14} />
          </div>
          <span className="text-xs font-semibold text-slate-100 truncate max-w-[220px]">
            {title}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          <span>{copied ? "Copied" : "Copy Blueprint"}</span>
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6 flex flex-col items-center">
        <div className="w-full max-w-xl bg-[#13151c] border border-white/[0.08] rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Structured Communication Output</span>
          </div>
          
          <h3 className="text-base font-bold text-slate-100">{title}</h3>
          <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans bg-white/[0.02] p-4 rounded-xl border border-white/[0.04]">
            {content || "Detailed blueprint compiled and structured for professional communication."}
          </div>
        </div>
      </div>
    </div>
  );
}
