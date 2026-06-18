/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, DragEvent } from "react";
import { UploadCloud, Crop, X, Check, ZoomIn, Sliders, RefreshCw, Square, Image as ImageIcon } from "lucide-react";

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (base64Data: string) => void;
  aspectRatioPreset?: "square" | "portrait"; // square = 1:1, portrait = 3:4 for masterpieces
  title?: string;
}

export default function ImageCropperModal({
  isOpen,
  onClose,
  onCropComplete,
  aspectRatioPreset = "square",
  title = "Bespoke Image Cropper",
}: ImageCropperModalProps) {
  const [imgSource, setImgSource] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [offsetX, setOffsetX] = useState<number>(50); // % of center
  const [offsetY, setOffsetY] = useState<number>(50); // % of center
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [imageUrlPaste, setImageUrlPaste] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Reset states on opening
  useEffect(() => {
    if (isOpen) {
      setImgSource(null);
      setZoom(1);
      setOffsetX(50);
      setOffsetY(50);
      setImageUrlPaste("");
    }
  }, [isOpen]);

  // Load pasting URL or files
  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImgSource(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handlePasteUrl = () => {
    if (imageUrlPaste.trim()) {
      setImgSource(imageUrlPaste.trim());
    }
  };

  // Perform canvas crop operation
  const applyCrop = () => {
    if (!imageRef.current || !previewCanvasRef.current) return;
    setIsProcessing(true);

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imageRef.current;
    
    // Set output dimensions based on presets
    // squares for headshots, portrait 3:4 for masterpieces
    const targetWidth = aspectRatioPreset === "square" ? 400 : 450;
    const targetHeight = aspectRatioPreset === "square" ? 400 : 600;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, targetWidth, targetHeight);

    // Calculate source bounds to crop
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    // Determine sizes relative to output aspect ratio
    const outputAspect = targetWidth / targetHeight;
    const inputAspect = imgWidth / imgHeight;

    let sWidth = imgWidth;
    let sHeight = imgHeight;

    if (inputAspect > outputAspect) {
      // Input is wider
      sWidth = imgHeight * outputAspect;
    } else {
      // Input is taller
      sHeight = imgWidth / outputAspect;
    }

    // Apply zoom scaling factor
    sWidth = sWidth / zoom;
    sHeight = sHeight / zoom;

    // Center offset parameters
    // Convert 0-100 offsets to center bounds
    const maxShiftX = imgWidth - sWidth;
    const maxShiftY = imgHeight - sHeight;

    // Interpolate offset coordinates safely
    const sX = maxShiftX * (offsetX / 100);
    const sY = maxShiftY * (offsetY / 100);

    // Draw slice onto canvas
    ctx.drawImage(
      img,
      Math.max(0, Math.min(imgWidth - sWidth, sX)),
      Math.max(0, Math.min(imgHeight - sHeight, sY)),
      sWidth,
      sHeight,
      0,
      0,
      targetWidth,
      targetHeight
    );

    // Output Data URL
    try {
      const croppedBase64 = canvas.toDataURL("image/jpeg", 0.9);
      onCropComplete(croppedBase64);
      onClose();
    } catch (err) {
      console.error("Canvas export failed:", err);
      alert("Cross-Origin URL restricted from canvas processing. Please upload a local file instead!");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  const targetRatioLabel = aspectRatioPreset === "square" ? "1:1 SQUARE (Avatar)" : "3:4 PORTRAIT (Masterpiece)";

  return (
    <div
      id="cropper-modal-overlay"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 text-white font-sans text-left"
    >
      <div
        id="cropper-modal-box"
        className="w-full max-w-2xl bg-[#0f0f0f] border border-white/10 rounded-none overflow-hidden flex flex-col"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-black">
          <div className="flex items-center gap-2">
            <Crop className="w-4 h-4 text-[#C5A059]" />
            <h3 className="text-sm font-mono uppercase tracking-wider font-extrabold text-white">
              {title}
            </h3>
          </div>
          <button
            id="cropper-close-btn"
            onClick={onClose}
            className="p-1 hover:bg-white/5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1 max-h-[75vh] overflow-y-auto">
          {/* Output requirement notice */}
          <div className="p-3 bg-neutral-900 border border-white/5 text-[10px] font-mono text-neutral-400 flex items-center justify-between">
            <span>TARGET FORMAT: <strong className="text-white">{targetRatioLabel}</strong></span>
            <Square className="w-3.5 h-3.5 text-[#C5A059]" />
          </div>

          {!imgSource ? (
            <div className="space-y-4">
              {/* Dropzone */}
              <div
                id="cropper-dropzone"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border border-dashed p-10 text-center cursor-pointer rounded-none transition-colors duration-200 ${
                  isDragOver
                    ? "border-[#C5A059] bg-[#C5A059]/5"
                    : "border-white/15 hover:border-[#C5A059]/60 hover:bg-white/[0.01]"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <UploadCloud className="w-10 h-10 text-neutral-500 mx-auto mb-3" />
                <h4 className="text-xs font-mono uppercase tracking-wider font-bold">
                  Drag & Drop Image Profile File
                </h4>
                <p className="text-[10px] text-neutral-500 mt-1.5">
                  Supports JPEG, PNG • Automatic client-side canvas processing
                </p>
              </div>

              {/* Paste URL */}
              <div className="p-4 bg-neutral-900/50 border border-white/5 space-y-3">
                <span className="text-[10px] font-mono uppercase text-neutral-500 tracking-wider block">
                  Or Paste External Image URL
                </span>
                <div className="flex gap-2">
                  <input
                    id="cropper-pasted-url"
                    type="text"
                    value={imageUrlPaste}
                    onChange={(e) => setImageUrlPaste(e.target.value)}
                    placeholder="e.g. https://images.unsplash.com/photo-..."
                    className="flex-1 bg-black border border-white/10 px-3 py-2 text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                  <button
                    id="cropper-paste-submit"
                    onClick={handlePasteUrl}
                    className="px-4 py-2 bg-[#C5A569] hover:bg-white text-black text-xs font-bold uppercase transition-colors"
                  >
                    Load
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Image Editor Viewport */}
              <div className="md:col-span-8 space-y-4 flex flex-col justify-between">
                <div className="relative aspect-square md:aspect-[4/3] bg-neutral-950 border border-white/10 overflow-hidden flex items-center justify-center">
                  <img
                    ref={(el) => {
                      imageRef.current = el;
                    }}
                    src={imgSource}
                    alt="Source Crop workbench"
                    crossOrigin="anonymous"
                    className="max-h-full max-w-full object-contain opacity-50 select-none pointer-events-none"
                    style={{
                      transform: `scale(${zoom}) translate(${(offsetX - 50) * 0.4}px, ${(offsetY - 50) * 0.4}px)`,
                    }}
                  />

                  {/* High contrast overlay cropping viewfinder */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      className={`border-2 border-[#C5A059] shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] pointer-events-none relative ${
                        aspectRatioPreset === "square" ? "w-44 h-44" : "w-40 h-60"
                      }`}
                    >
                      {/* Grid Alignment Reticle */}
                      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30">
                        <div className="border-r border-b border-dashed border-white" />
                        <div className="border-r border-b border-dashed border-white" />
                        <div className="border-b border-dashed border-white" />
                        <div className="border-r border-b border-dashed border-white" />
                        <div className="border-r border-b border-dashed border-white" />
                        <div className="border-b border-dashed border-white" />
                        <div className="border-r border-dashed border-white" />
                        <div className="border-r border-dashed border-white" />
                        <div />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  id="cropper-different-img-btn"
                  onClick={() => setImgSource(null)}
                  className="text-[10px] font-mono text-neutral-500 hover:text-white uppercase tracking-widest flex items-center gap-1.5 cursor-pointer self-start"
                >
                  <RefreshCw className="w-3 h-3" />
                  Select Different Image
                </button>
              </div>

              {/* Adjustments Workbench panel */}
              <div className="md:col-span-4 space-y-5">
                <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-widest font-bold flex items-center gap-1.5 border-b border-white/5 pb-1">
                  <Sliders className="w-3.5 h-3.5" />
                  Workbench Controls
                </span>

                {/* Slider Scale / zoom */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                    <span>ZOOM / SCALE</span>
                    <span className="text-white">{(zoom * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    id="slider-zoom"
                    type="range"
                    min="1"
                    max="3"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full accent-[#C5A059] cursor-pointer"
                  />
                </div>

                {/* Offset center X */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                    <span>ALIGN HORIZONTAL (X)</span>
                    <span className="text-white">{offsetX}%</span>
                  </div>
                  <input
                    id="slider-offsetX"
                    type="range"
                    min="10"
                    max="90"
                    value={offsetX}
                    onChange={(e) => setOffsetX(parseInt(e.target.value))}
                    className="w-full accent-[#C5A059] cursor-pointer"
                  />
                </div>

                {/* Offset center Y */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                    <span>ALIGN VERTICAL (Y)</span>
                    <span className="text-white">{offsetY}%</span>
                  </div>
                  <input
                    id="slider-offsetY"
                    type="range"
                    min="10"
                    max="90"
                    value={offsetY}
                    onChange={(e) => setOffsetY(parseInt(e.target.value))}
                    className="w-full accent-[#C5A059] cursor-pointer"
                  />
                </div>

                <div className="p-3 bg-neutral-900 text-[10px] font-sans text-neutral-400 rounded-none leading-relaxed border border-white/5">
                  💡 Move the sliders to fit the face or masterpiece artwork outline inside the golden crop bounding box.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hidden crop processor Canvas */}
        <canvas ref={previewCanvasRef} className="hidden" />

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/5 bg-black flex justify-between items-center gap-4">
          <button
            id="cropper-cancel"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-xs font-mono uppercase tracking-widest text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            id="cropper-confirm"
            disabled={!imgSource || isProcessing}
            onClick={applyCrop}
            className={`px-5 py-2.5 bg-[#C5A059] hover:bg-white text-black text-xs font-mono font-black uppercase tracking-widest transition-colors flex items-center gap-2 cursor-pointer ${
              (!imgSource || isProcessing) && "opacity-50 cursor-not-allowed"
            }`}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5 text-black" />
                Apply Crop
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
