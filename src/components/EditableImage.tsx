"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface EditableImageProps {
  src: string;
  alt: string;
  contentKey: string;
  onSave: (url: string) => Promise<void>;
  isAuthenticated: boolean;
  className?: string;
}

export default function EditableImage({
  src,
  alt,
  contentKey,
  onSave,
  isAuthenticated,
  className = "",
}: EditableImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이미지가 로드되었는지 확인
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageSrc(src);
    setImageError(false);
    setImageLoaded(false);
  }, [src]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setImageSrc(data.url);
        await onSave(data.url);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // 갤러리 이미지인지 확인 (gallery 경로 포함 시)
  const isGalleryImage = imageSrc && imageSrc.includes("/images/gallery/");
  const isMemberImage = imageSrc && (imageSrc.includes("/images/members/") || imageSrc.includes("/images/alumni/"));
  const isPngImage = imageSrc && imageSrc.toLowerCase().endsWith('.png');
  const showPlaceholder = !imageSrc || imageSrc === "" || imageError || (isMemberImage && !imageSrc.match(/\.(jpg|jpeg|png|gif|webp)$/i)) || (isGalleryImage && !imageSrc.match(/\.(jpg|jpeg|png|gif|webp)$/i));

  if (!isAuthenticated) {
    return (
      <div className={className}>
        {showPlaceholder ? (
          <div className={`${className} bg-gray-200 flex items-center justify-center rounded-lg`}>
            <span className="text-gray-400 text-4xl">{isGalleryImage ? "📸" : "👤"}</span>
          </div>
        ) : isPngImage && isMemberImage ? (
          <img
            src={imageSrc}
            alt={alt}
            className={className}
            onError={handleImageError}
            onLoad={() => setImageLoaded(true)}
          />
        ) : (
          <Image
            src={imageSrc}
            alt={alt}
            width={isMemberImage ? 200 : 500}
            height={isMemberImage ? 200 : 500}
            className={className}
            onError={handleImageError}
            onLoad={() => setImageLoaded(true)}
            unoptimized={imageSrc.includes("/images/alumni/") || imageSrc.includes("/images/members/")}
            priority={imageSrc.includes("/images/alumni/")}
          />
        )}
      </div>
    );
  }

  return (
    <div className="relative group">
      {showPlaceholder ? (
        <div className={`${className} bg-gray-200 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-400 transition-colors`}>
          <span className="text-gray-400 text-4xl mb-2">{isGalleryImage ? "📸" : "👤"}</span>
          <span className="text-xs text-gray-500">{isGalleryImage ? "이미지 없음" : "사진 없음"}</span>
        </div>
      ) : isPngImage && isMemberImage ? (
        <img
          src={imageSrc}
          alt={alt}
          className={className}
          onError={handleImageError}
          onLoad={() => setImageLoaded(true)}
        />
      ) : (
        <Image
          src={imageSrc}
          alt={alt}
          width={isMemberImage ? 200 : 500}
          height={isMemberImage ? 200 : 500}
          className={className}
          onError={handleImageError}
          onLoad={() => setImageLoaded(true)}
          unoptimized={imageSrc.includes("/images/alumni/") || imageSrc.includes("/images/members/")}
          priority={imageSrc.includes("/images/alumni/")}
        />
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-opacity disabled:opacity-50 shadow-lg z-10"
        title={showPlaceholder ? "사진 업로드" : "사진 변경"}
      >
        {uploading ? "업로드 중..." : showPlaceholder ? "사진 업로드" : "사진 변경"}
      </button>
      {/* 클릭 영역 확대 - placeholder일 때 전체 영역 클릭 가능 */}
      {showPlaceholder && (
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-0"
          aria-label="사진 업로드"
        />
      )}
    </div>
  );
}

