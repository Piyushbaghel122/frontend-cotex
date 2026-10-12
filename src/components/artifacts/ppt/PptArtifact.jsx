import React from 'react';
import { Download, Presentation, Layout, MonitorPlay, Sparkles } from 'lucide-react';

export default function PptArtifact({ file, artifact }) {
  let dataUrl = "";
  if (file?.content?.startsWith("data:application/vnd")) {
    dataUrl = file.content;
  } else if (file?.content?.includes("data:application/vnd.openxmlformats")) {
    const match = file.content.match(/data:application\/vnd[A-Za-z0-9+/=;,-]+/);
    if (match) dataUrl = match[0];
  } else if (file?.content && !file.content.includes(" ") && file.content.length > 200) {
    dataUrl = `data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${file.content.trim()}`;
  }

  const fileName = file?.name || artifact?.title || "presentation.pptx";

  const handleDownload = () => {
    if (dataUrl) {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = fileName.endsWith(".pptx") ? fileName : `${fileName}.pptx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("Presentation file data is preparing or not ready.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0c10] text-slate-200">
      {/* Top Bar */}
      <div className="h-12 px-4 border-b border-white/[0.08] bg-[#13151c] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Presentation size={14} />
          </div>
          <span className="text-xs font-semibold text-slate-100 truncate max-w-[220px]">
            {fileName}
          </span>
        </div>

        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
        >
          <Download size={13} />
          <span>Download PPTX</span>
        </button>
      </div>

      {/* Main Presentation Showcase */}
      <div className="flex-1 overflow-auto p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-xl bg-[#13151c] border border-white/[0.08] rounded-2xl p-6 shadow-2xl flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <MonitorPlay size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">{fileName}</h3>
                <p className="text-xs text-slate-400">PowerPoint Presentation (16:9 Wide Layout)</p>
              </div>
            </div>
            <span className="text-[10px] font-semibold uppercase px-2 py-1 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
              5 Slides Deck
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex flex-col items-center text-center">
              <Layout size={18} className="text-indigo-400 mb-1" />
              <span className="text-[11px] font-medium text-slate-300">Slide 1-2</span>
              <span className="text-[9px] text-slate-500">Cover & Context</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex flex-col items-center text-center">
              <Sparkles size={18} className="text-amber-400 mb-1" />
              <span className="text-[11px] font-medium text-slate-300">Slide 3-4</span>
              <span className="text-[9px] text-slate-500">Tech Architecture</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex flex-col items-center text-center">
              <Presentation size={18} className="text-emerald-400 mb-1" />
              <span className="text-[11px] font-medium text-slate-300">Slide 5</span>
              <span className="text-[9px] text-slate-500">Results & Roadmap</span>
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download size={15} />
            <span>Download PowerPoint (.pptx)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
