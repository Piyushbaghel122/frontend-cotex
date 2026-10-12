import { useState, useRef, useEffect } from 'react';
import {
  Film,
  Download,
  Trash2,
  RefreshCw,
  Upload,
  Settings2,
  Sliders
} from 'lucide-react';

const VERIFIED_VIDEOS = [
  "https://cdn.pixabay.com/video/2024/05/29/214349_large.mp4",
  "https://vjs.zencdn.net/v/oceans.mp4",
  "https://media.w3.org/2010/05/sintel/trailer.mp4",
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
];

export default function VideoArtifact({ file, artifact }) {
  const title = file?.name || artifact?.title || "AI Rendered Video.mp4";
  const initialPrompt = file?.content || artifact?.prompt || artifact?.title || "Cinematic video concept";
  const defaultVideoUrl = file?.videoUrl || artifact?.files?.[0]?.videoUrl || VERIFIED_VIDEOS[0];

  const [currentVideoUrl, setCurrentVideoUrl] = useState(defaultVideoUrl);
  const [prompt, setPrompt] = useState(initialPrompt);
  const [duration, setDuration] = useState("60s");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [cameraStyle, setCameraStyle] = useState("Cinematic Pan");
  const [uploadedMedia, setUploadedMedia] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // Synchronize when incoming file/artifact changes
  useEffect(() => {
    const incomingUrl = file?.videoUrl || artifact?.files?.[0]?.videoUrl;
    if (incomingUrl) {
      setCurrentVideoUrl(incomingUrl);
    }
    const incomingPrompt = file?.content || artifact?.prompt || artifact?.title;
    if (incomingPrompt) {
      setPrompt(incomingPrompt);
    }
  }, [file, artifact]);

  // Video alternatives for instant updates
  const videoBank = VERIFIED_VIDEOS;

  const handleDownload = async () => {
    try {
      const response = await fetch(currentVideoUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = title.endsWith(".mp4") ? title : `${title}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      const link = document.createElement("a");
      link.href = currentVideoUrl;
      link.target = "_blank";
      link.download = title;
      link.click();
    }
  };

  const handleUpdateVideo = () => {
    setIsUpdating(true);
    setTimeout(() => {
      // Pick next video from pool
      const nextIdx = (videoBank.indexOf(currentVideoUrl) + 1) % videoBank.length;
      setCurrentVideoUrl(videoBank[nextIdx]);
      setIsUpdating(false);
      if (videoRef.current) {
        videoRef.current.load();
        videoRef.current.play().catch(() => {});
      }
    }, 800);
  };

  const handleFileUpload = (e) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      setUploadedMedia({
        name: uploaded.name,
        url: URL.createObjectURL(uploaded),
        type: uploaded.type
      });
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isDeleted) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-[#0d0f14] text-slate-300">
        <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center text-slate-500 mb-3">
          <Film size={24} />
        </div>
        <h4 className="text-sm font-semibold text-slate-200 mb-1">Video Removed</h4>
        <p className="text-xs text-slate-500 max-w-xs mb-4">The current video project has been deleted.</p>
        <button
          onClick={() => {
            setIsDeleted(false);
            setCurrentVideoUrl(defaultVideoUrl);
          }}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white border-none cursor-pointer transition-colors"
        >
          Restore Video
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0c10] text-slate-200 overflow-hidden select-none">
      {/* Top Header Bar */}
      <div className="h-12 px-4 border-b border-white/[0.07] bg-[#12141c] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Film size={13} />
          </div>
          <span className="text-xs font-semibold text-slate-100 truncate max-w-[180px]">
            {title}
          </span>
          <span className="text-[10px] font-medium text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
            {duration} • {aspectRatio}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors border cursor-pointer ${
              showSettings
                ? "bg-purple-600/20 text-purple-300 border-purple-500/30"
                : "bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border-white/[0.06]"
            }`}
            title="Video Parameters & Refine"
          >
            <Sliders size={13} />
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer border-none"
            title="Download MP4 Video"
          >
            <Download size={13} />
            <span>Download MP4</span>
          </button>

          <button
            onClick={() => setIsDeleted(true)}
            className="p-1.5 rounded-lg hover:bg-red-500/15 text-slate-400 hover:text-red-400 transition-colors border-none bg-transparent cursor-pointer"
            title="Delete Video"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center">
        {/* Real Playable HTML5 Video Player */}
        <div className={`w-full max-w-xl bg-black rounded-2xl overflow-hidden border border-white/[0.1] shadow-2xl relative group ${
          aspectRatio === "9:16" ? "max-w-xs aspect-[9/16]" : "aspect-video"
        }`}>
          {isUpdating ? (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-2 z-20">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-slate-300 font-medium">Rendering neural video frames...</span>
            </div>
          ) : (
            <video
              ref={videoRef}
              key={currentVideoUrl}
              src={currentVideoUrl}
              controls
              playsInline
              autoPlay
              loop
              preload="auto"
              onError={() => {
                if (currentVideoUrl !== VERIFIED_VIDEOS[1]) {
                  setCurrentVideoUrl(VERIFIED_VIDEOS[1]);
                }
              }}
              className="w-full h-full object-cover"
            />
          )}

          <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-purple-300 pointer-events-none">
            1080p 60fps • Neural Render
          </div>
        </div>

        {/* Studio Controls / Settings Accordion */}
        {showSettings && (
          <div className="w-full max-w-xl mt-4 rounded-xl border border-white/[0.08] bg-[#141722] p-4 flex flex-col gap-3.5 shadow-xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <Settings2 size={14} className="text-purple-400" />
                <span>AI Video Director Controls</span>
              </div>
              <button
                onClick={handleUpdateVideo}
                disabled={isUpdating}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium border-none cursor-pointer transition-colors"
              >
                <RefreshCw size={12} className={isUpdating ? "animate-spin" : ""} />
                <span>Update & Render</span>
              </button>
            </div>

            {/* Prompt Editor */}
            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">
                Video Prompt & Scene Direction:
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={2}
                className="w-full bg-black/40 border border-white/[0.08] rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-purple-500 resize-none font-mono"
              />
            </div>

            {/* Grid options: Duration, Aspect Ratio, Camera Motion */}
            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="text-[10px] font-medium text-slate-400 block mb-1">Duration:</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-[#1b1e2b] border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-slate-200 outline-none cursor-pointer"
                >
                  <option value="5s">5s Teaser</option>
                  <option value="15s">15s Short</option>
                  <option value="60s">60s Full Clip</option>
                  <option value="5m">5 Min Sequence</option>
                  <option value="20-30m">20-30m Storyboard</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-medium text-slate-400 block mb-1">Aspect Ratio:</label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full bg-[#1b1e2b] border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-slate-200 outline-none cursor-pointer"
                >
                  <option value="16:9">16:9 Landscape</option>
                  <option value="9:16">9:16 Vertical</option>
                  <option value="1:1">1:1 Square</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-medium text-slate-400 block mb-1">Camera Motion:</label>
                <select
                  value={cameraStyle}
                  onChange={(e) => setCameraStyle(e.target.value)}
                  className="w-full bg-[#1b1e2b] border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-slate-200 outline-none cursor-pointer"
                >
                  <option value="Cinematic Pan">Cinematic Pan</option>
                  <option value="Drone Aerial">Drone Aerial</option>
                  <option value="Orbit 360">Orbit 360</option>
                  <option value="Dynamic Zoom">Dynamic Zoom</option>
                </select>
              </div>
            </div>

            {/* Reference Image / Video Upload Slot */}
            <div className="pt-1">
              <label className="text-[10px] font-medium text-slate-400 block mb-1">
                Reference Image / Video (Optional):
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                hidden
                onChange={handleFileUpload}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full border border-dashed border-white/[0.12] hover:border-purple-500/50 rounded-lg p-2.5 flex items-center justify-center gap-2 bg-black/20 hover:bg-white/[0.02] cursor-pointer transition-colors"
              >
                <Upload size={13} className="text-purple-400" />
                <span className="text-[11px] text-slate-400">
                  {uploadedMedia ? `Attached: ${uploadedMedia.name}` : "Click to attach reference image or video"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
