import  { useState } from 'react';
import { useSelector } from 'react-redux';
import { AnimatePresence, easeInOut, motion } from "motion/react";
import { PanelRightClose, PanelRightOpen, X, Code2, FileText, Presentation, Film, Globe, MessageSquare } from 'lucide-react';
import PdfArtifact from './artifacts/pdf/PdfArtifact';
import PptArtifact from './artifacts/ppt/PptArtifact';
import VideoArtifact from './artifacts/video/VideoArtifact';
import ImageArtifact from './artifacts/image/ImageArtifact';
import CodingArtifact from './artifacts/coding/CodingArtifact';
import SearchArtifact from './artifacts/search/SearchArtifact';
import ChatArtifact from './artifacts/chat/ChatArtifact';


function Artifact() {
  const [collapsed, setCollapsed] = useState(false);
  const { artifacts } = useSelector(state => state.message);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!artifacts || artifacts.length === 0) return null;

  const currentArtifact = artifacts[0];
  const artifactType = (currentArtifact?.type || "").toLowerCase();
  const firstFile = currentArtifact?.files?.[0];
  const fileName = (firstFile?.name || "").toLowerCase();

  const isPdf = artifactType === "pdf" || fileName.endsWith(".pdf");
  const isPpt = artifactType === "ppt" || fileName.endsWith(".pptx");
  const isVideo = artifactType === "video" || fileName.endsWith(".mp4");
  const isImage = artifactType === "image" || fileName.endsWith(".png") || fileName.endsWith(".jpg") || fileName.endsWith(".jpeg") || fileName.endsWith(".webp");
  const isSearch = artifactType === "search";
  const isChat = artifactType === "chat";

  const getArtifactIcon = () => {
    if (isPdf) return <FileText className="text-red-400" size={14} />;
    if (isPpt) return <Presentation className="text-amber-400" size={14} />;
    if (isVideo) return <Film className="text-purple-400" size={14} />;
    if (isImage) return <Code2 className="text-pink-400" size={14} />;
    if (isSearch) return <Globe className="text-blue-400" size={14} />;
    if (isChat) return <MessageSquare className="text-indigo-400" size={14} />;
    return <Code2 className="text-indigo-400" size={14} />;
  };

  const renderArtifactContent = () => {
    if (isPdf) {
      return <PdfArtifact file={firstFile} artifact={currentArtifact} />;
    }
    if (isPpt) {
      return <PptArtifact file={firstFile} artifact={currentArtifact} />;
    }
    if (isVideo) {
      return <VideoArtifact file={firstFile} artifact={currentArtifact} />;
    }
    if (isImage) {
      return <ImageArtifact file={firstFile} artifact={currentArtifact} />;
    }
    if (isSearch) {
      return <SearchArtifact file={firstFile} artifact={currentArtifact} />;
    }
    if (isChat) {
      return <ChatArtifact file={firstFile} artifact={currentArtifact} />;
    }
    return <CodingArtifact artifact={currentArtifact} />;
  };

  const PanelContent = ({ onClose }) => {
    return (
      <div className="flex flex-col h-full bg-[#0d0f14] overflow-hidden">
        {/* Top Header Controls for Panel */}
        <div className="h-10 px-3 border-b border-white/[0.06] bg-[#111319] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-5 h-5 rounded flex items-center justify-center bg-white/[0.04]">
              {getArtifactIcon()}
            </div>
            <span className="text-[11px] font-semibold text-slate-300 truncate">
              {currentArtifact?.title || "Artifact Preview"}
            </span>
          </div>

          <button
            onClick={onClose ?? (() => setCollapsed(true))}
            className="flex items-center justify-center w-6 h-6 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer border-none bg-transparent"
            title="Collapse Panel"
          >
            {onClose ? <X size={14} /> : <PanelRightClose size={14} />}
          </button>
        </div>

        {/* Dynamic Dedicated Artifact Viewer */}
        <div className="flex-1 overflow-hidden">
          {renderArtifactContent()}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-24 right-4 z-40 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[12px] font-medium shadow-lg shadow-indigo-500/20 border-none cursor-pointer transition-colors duration-150"
      >
        {getArtifactIcon()}
        <span>View Artifact</span>
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="lg:hidden fixed inset-y-0 right-0 z-50 w-[90vw] max-w-[460px] border-l border-white/[0.06] overflow-hidden"
            >
              <PanelContent onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Panel */}
      <motion.div
        initial={{ width: 440 }}
        animate={{ width: collapsed ? 48 : 440 }}
        transition={{
          duration: 0.25,
          ease: easeInOut
        }}
        className="hidden lg:flex h-full border-l border-white/[0.06] flex-col overflow-hidden shrink-0"
      >
        {!collapsed ? (
          <PanelContent />
        ) : (
          <div className="flex h-full bg-[#0d0f14] flex-col items-center py-3 gap-3 shrink-0">
            <button
              onClick={() => setCollapsed(false)}
              className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer border-none bg-transparent"
              title="Expand Panel"
            >
              <PanelRightOpen size={16} />
            </button>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div
                className="text-[10px] font-medium text-slate-500 tracking-widest uppercase whitespace-nowrap"
                style={{
                  writingMode: "vertical-lr",
                  transform: "rotate(180deg)"
                }}
              >
                {currentArtifact?.title || "Artifact"}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}

export default Artifact;
