"use client";

import React, { useState } from "react";
import { UploadCloud, CheckCircle2, ExternalLink, Loader2, FileText, AlertCircle, Copy, Check } from "lucide-react";
import { uploadFileToIPFS, getIPFSGatewayUrl, formatIPFSDisplay } from "../lib/ipfs";

export default function IPFSUploader({
  label = "Upload Document to Pinata IPFS",
  assetType = "GENERAL",
  value = "",
  onChange = () => {},
  accept = ".pdf,.doc,.docx,.png,.jpg,.jpeg,.json",
  helperText = "Pinned to Pinata IPFS Cloud storage",
}) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [provider, setProvider] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError("");
      setFileName(file.name);
      setFileSize(file.size);

      const result = await uploadFileToIPFS(file, assetType);
      setProvider(result.provider || "Pinata IPFS");
      onChange(result.ipfsUri);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to upload file to Pinata IPFS.");
    } finally {
      setUploading(false);
    }
  }

  function copyCID() {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const gatewayUrl = value ? getIPFSGatewayUrl(value) : "";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <label className="text-slate-300 font-medium flex items-center space-x-1.5">
          <UploadCloud className="h-3.5 w-3.5 text-emerald-400" />
          <span>{label}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Pinata IPFS
          </span>
        </label>
        <span className="text-[10px] text-slate-500">{helperText}</span>
      </div>

      <div className="glass-panel p-3.5 rounded-xl border-dashed border-white/15 hover:border-emerald-500/40 transition">
        {!value && !uploading ? (
          <label className="flex flex-col items-center justify-center cursor-pointer py-3 text-center group">
            <UploadCloud className="h-6 w-6 text-slate-400 group-hover:text-emerald-400 transition mb-1.5" />
            <span className="text-xs text-slate-300 font-semibold group-hover:text-white transition">
              Select file to pin to Pinata IPFS
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5">
              Supports PDF transcripts, Deed surveys, Carbon audits, and GeoJSON
            </span>
            <input
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        ) : uploading ? (
          <div className="flex items-center justify-center space-x-2 py-3 text-xs text-emerald-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Pinning {fileName} ({Math.round(fileSize / 1024)} KB) to Pinata IPFS Cloud...</span>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                <FileText className="h-4 w-4" />
              </div>
              <div className="truncate">
                <div className="flex items-center space-x-2">
                  <p className="font-semibold text-white truncate text-[11px]">{fileName || "Document pinned to IPFS"}</p>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                    {provider || "Pinata Cloud"}
                  </span>
                </div>
                <p className="font-mono text-emerald-400 text-[10px] truncate">{formatIPFSDisplay(value)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0 ml-3">
              <button
                type="button"
                onClick={copyCID}
                title="Copy IPFS URI"
                className="p-1.5 rounded-lg glass-pill hover:bg-white/10 text-slate-400 hover:text-white transition"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              </button>

              {gatewayUrl && (
                <a
                  href={gatewayUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1 glass-pill hover:bg-white/[0.08] text-cyan-300 text-[11px] px-2.5 py-1 rounded-lg transition"
                >
                  <span>Pinata Gateway</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}

              <label className="text-[10px] text-slate-400 hover:text-white cursor-pointer underline">
                Replace
                <input
                  type="file"
                  accept={accept}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-2 text-[11px] text-rose-400 flex items-center space-x-1">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
