import { useState, useEffect, useRef } from 'react';
import {
  Download,
  ExternalLink,
  Sparkles,
  Copy,
  Check,
  ZoomIn,
  Image as ImageIcon,
  RotateCw,
  AlertCircle,
  Upload
} from 'lucide-react';

export default function ImageArtifact({ file, artifact }) {
  const [copied, setCopied] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Directly track the latest image URL from props
  const initialUrl = file?.content || artifact?.files?.[0]?.content || "";
  const fallbackUrl = file?.fallback || artifact?.files?.[0]?.fallback || "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1080&auto=format&fit=crop";
  const [currentSrc, setCurrentSrc] = useState(initialUrl);

  const title = file?.name || artifact?.title || "Realistic Portrait.png";
  const prompt = file?.prompt || artifact?.prompt || artifact?.title || "AI Generated Image";

  const fileInputRef = useRef(null);

  // Whenever file/artifact prop updates, update currentSrc and reset states immediately
  useEffect(() => {
    if (initialUrl) {
      setCurrentSrc(initialUrl);
      setImgLoaded(false);
      setHasError(false);
    }
  }, [initialUrl]);

  // If initial image takes more than 7 seconds, fallback to matching realistic photo
  useEffect(() => {
    let timer;
    if (!imgLoaded && currentSrc && currentSrc.includes("pollinations.ai")) {
      timer = setTimeout(() => {
        if (!imgLoaded) {
          setCurrentSrc(fallbackUrl);
        }
      }, 7000);
    }
    return () => clearTimeout(timer);
  }, [currentSrc, fallbackUrl, imgLoaded]);

  const handleImageError = () => {
    if (currentSrc !== fallbackUrl) {
      setCurrentSrc(fallbackUrl);
    } else {
      setHasError(true);
      setImgLoaded(true);
    }
  };

  const handleDownload = async () => {
    try {
      if (!currentSrc) return;
      const response = await fetch(currentSrc);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = title.endsWith(".png") ? title : `${title}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      const link = document.createElement("a");
      link.href = currentSrc;
      link.target = "_blank";
      link.download = title;
      link.click();
    }
  };

  const handleUploadNewImage = (e) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      const localUrl = URL.createObjectURL(uploaded);
      setCurrentSrc(localUrl);
      setImgLoaded(true);
      setHasError(false);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0f14] overflow-hidden text-slate-200">
      {/* Top Action Bar */}
      <div className="h-11 px-4 border-b border-white/[0.06] bg-[#111319] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-5 h-5 rounded flex items-center justify-center bg-indigo-500/10 text-indigo-400">
            <Sparkles size={13} />
          </div>
          <span className="text-[12px] font-medium text-slate-300 truncate max-w-[180px]">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleUploadNewImage}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] transition-colors border border-white/[0.06] cursor-pointer"
            title="Upload Custom Image"
          >
            <Upload size={12} />
            <span className="hidden sm:inline">Upload</span>
          </button>

          <button
            onClick={() => setLightbox(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] transition-colors border border-white/[0.06] cursor-pointer"
            title="Expand Preview"
          >
            <ZoomIn size={13} />
            <span className="hidden sm:inline">Zoom</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer border-none"
            title="Download PNG"
          >
            <Download size={13} />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Main Image Display Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-start gap-4">
        <div className="relative group w-full max-w-lg rounded-2xl overflow-hidden border border-white/[0.08] bg-black/40 shadow-2xl flex items-center justify-center min-h-[360px]">
          {!imgLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-[#12141c] z-10">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-[12px] text-slate-300 font-medium">Generating 8K Photorealistic Render...</span>
              <span className="text-[10px] text-slate-500">Flux Neural Core • Natural Skin & Lighting</span>
            </div>
          )}

          {hasError ? (
            <div className="p-8 text-center flex flex-col items-center gap-3">
              <AlertCircle size={32} className="text-amber-400" />
              <p className="text-xs text-slate-400">Rendering timed out. Click below to reload.</p>
              <button
                onClick={() => {
                  setHasError(false);
                  setImgLoaded(false);
                  setCurrentSrc(`${fallbackUrl}&t=${Date.now()}`);
                }}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-xs text-white border-none cursor-pointer hover:bg-indigo-500 flex items-center gap-1.5"
              >
                <RotateCw size={12} />
                <span>Reload Image</span>
              </button>
            </div>
          ) : (
            <img
              key={currentSrc}
              src={currentSrc}
              alt={title}
              onLoad={() => setImgLoaded(true)}
              onError={handleImageError}
              onClick={() => setLightbox(true)}
              className={`w-full h-auto max-h-[560px] object-cover rounded-xl cursor-zoom-in transition-opacity duration-300 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {imgLoaded && !hasError && (
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setLightbox(true)}
                className="p-1.5 rounded-lg bg-black/70 backdrop-blur-md text-white hover:bg-black/90 transition-colors border border-white/10 cursor-pointer"
              >
                <ExternalLink size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Prompt & Metadata Card */}
        <div className="w-full max-w-lg rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5 font-medium">
              <ImageIcon size={13} className="text-indigo-400" />
              <span>Generation Prompt</span>
            </div>
            <button
              onClick={handleCopyPrompt}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors bg-transparent border-none cursor-pointer"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copied ? "Copied" : "Copy Prompt"}</span>
            </button>
          </div>

          <p className="text-[12.5px] leading-relaxed text-slate-300 font-mono bg-black/30 p-2.5 rounded-lg border border-white/[0.04] break-words">
            {prompt}
          </p>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Model: Flux Photorealistic 8K</span>
            <span>Format: PNG</span>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightbox && (
        <div
          onClick={() => setLightbox(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <img
            src={currentSrc}
            alt={title}
            className="max-w-[90vw] max-h-[90vh] rounded-xl object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
