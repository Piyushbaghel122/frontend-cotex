import { useState } from 'react';
import { Code2, Eye, Copy, Check } from 'lucide-react';
import { motion } from 'motion/react';
import Editor from '@monaco-editor/react';

export default function CodingArtifact({ artifact }) {
  const [tab, setTab] = useState("preview");
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied] = useState(false);

  const files = artifact?.files || [];
  const file = files[activeFile] || files[0];
  const htmlFile = files.find(f => f.name === "index.html");
  const cssFile = files.find(f => f.name === "style.css");
  const jsFile = files.find(f => f.name === "script.js");

  const canPreview = Boolean(htmlFile);

  const previewDoc = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    ${cssFile?.content || ""}
  </style>
</head>
<body>
  ${htmlFile?.content || ""}
  <script>
    ${jsFile?.content || ""}
  </script>
</body>
</html>`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(file?.content || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const detectLanguage = (fileName = "") => {
    const name = fileName.toLowerCase();
    if (name.endsWith(".html")) return "html";
    if (name.endsWith(".css")) return "css";
    if (name.endsWith(".js")) return "javascript";
    if (name.endsWith(".jsx")) return "javascript";
    if (name.endsWith(".ts") || name.endsWith(".tsx")) return "typescript";
    if (name.endsWith(".json")) return "json";
    if (name.endsWith(".py")) return "python";
    return "plaintext";
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0f14] text-slate-200">
      {/* Header Tabs */}
      <div className="h-12 px-4 border-b border-white/[0.06] flex items-center justify-between shrink-0 bg-[#13151c]">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 shrink-0">
            <Code2 className="text-indigo-400" size={13} />
          </div>
          <span className="text-xs font-semibold text-slate-200 truncate">
            {artifact?.title || "Code Workspace"}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] rounded-lg transition-colors cursor-pointer border-none bg-transparent"
            title="Copy current file"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>

          {canPreview && (
            <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] p-0.5 rounded-lg">
              <button
                onClick={() => setTab("preview")}
                className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                  tab === "preview" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <Eye size={12} /> Live Preview
              </button>
              <button
                onClick={() => setTab("code")}
                className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                  tab === "code" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <Code2 size={12} /> Code
              </button>
            </div>
          )}
        </div>
      </div>

      {/* File Tabs Bar */}
      {tab === "code" && (
        <div className="flex h-9 border-b border-white/[0.06] overflow-x-auto bg-[#0a0c10] shrink-0">
          {files.map((f, index) => (
            <button
              key={f.name || index}
              onClick={() => setActiveFile(index)}
              className={`px-3.5 py-1.5 text-xs font-medium whitespace-nowrap border-r border-white/[0.05] relative cursor-pointer bg-transparent transition-colors ${
                activeFile === index ? "text-indigo-400 bg-white/[0.02]" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {f?.name}
              {activeFile === index && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {tab === "preview" && canPreview ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <iframe
              title="Interactive Live Preview"
              srcDoc={previewDoc}
              sandbox="allow-scripts allow-modals"
              className="w-full h-full bg-white border-none"
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <Editor
              theme="vs-dark"
              language={detectLanguage(file?.name)}
              value={file?.content || ""}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 13,
                wordWrap: "on",
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 14 },
                lineNumbers: "on",
                renderLineHighlight: "none"
              }}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
