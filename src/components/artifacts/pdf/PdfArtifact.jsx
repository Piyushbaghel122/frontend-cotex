import React, { useState } from 'react';
import { Download, FileText, ExternalLink, Check, Copy, ZoomIn, ZoomOut } from 'lucide-react';

export default function PdfArtifact({ file, artifact }) {
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(100);

  // Extract base64 / dataUrl from content if present
  let dataUrl = "";
  if (file?.content?.startsWith("data:application/pdf")) {
    dataUrl = file.content;
  } else if (file?.content?.includes("data:application/pdf;base64,")) {
    const match = file.content.match(/data:application\/pdf;base64,[A-Za-z0-9+/=]+/);
    if (match) dataUrl = match[0];
  } else if (file?.content && !file.content.includes(" ") && file.content.length > 200) {
    dataUrl = `data:application/pdf;base64,${file.content.trim()}`;
  }

  const fileName = file?.name || artifact?.title || "document.pdf";

  const handleDownload = () => {
    if (dataUrl) {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("PDF data not available for download.");
    }
  };

  const handleOpenNewTab = () => {
    if (dataUrl) {
      const win = window.open();
      if (win) {
        win.document.write(`<iframe src="${dataUrl}" frameborder="0" style="border:0; top:0; left:0; bottom:0; right:0; width:100%; height:100%;" allowfullscreen></iframe>`);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0c10] text-slate-200">
      {/* Top Toolbar */}
      <div className="h-12 px-4 border-b border-white/[0.08] bg-[#13151c] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
            <FileText size={14} />
          </div>
          <span className="text-xs font-semibold text-slate-100 truncate max-w-[200px]">
            {fileName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(prev => Math.max(prev - 10, 50))}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer border-none bg-transparent"
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
          <span className="text-[11px] text-slate-400 font-medium">{zoom}%</span>
          <button
            onClick={() => setZoom(prev => Math.min(prev + 10, 150))}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer border-none bg-transparent"
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>

          {dataUrl && (
            <button
              onClick={handleOpenNewTab}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer border-none bg-transparent"
              title="Open in new tab"
            >
              <ExternalLink size={14} />
            </button>
          )}

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            <Download size={13} />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* PDF View Canvas */}
      <div className="flex-1 overflow-auto p-4 flex flex-col items-center justify-center bg-[#0d0f14]">
        {dataUrl ? (
          <div
            className="w-full h-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden transition-transform duration-150"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
          >
            <iframe
              src={dataUrl}
              title={fileName}
              className="w-full h-full border-none"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8 bg-[#13151c] border border-white/[0.08] rounded-2xl max-w-md">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-3">
              <FileText size={28} />
            </div>
            <h4 className="text-sm font-semibold text-slate-100 mb-1">{fileName}</h4>
            <p className="text-xs text-slate-400 mb-4">
              Real-time generated document ready for preview and download.
            </p>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Download size={14} />
              <span>Download Generated PDF</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
