"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { getApiBase } from "@/lib/apiBase";

interface EditableImageProps {
  src: string;
  alt: string;
  contentKey: string;
  onSave: (url: string) => Promise<void>;
  isAuthenticated: boolean;
  className?: string;
  fill?: boolean;
  sizes?: string;
}

export default function EditableImage({
  src,
  alt,
  contentKey,
  onSave,
  isAuthenticated,
  className = "",
  fill = false,
  sizes,
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
      const response = await fetch(`${getApiBase()}/api/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const msg = (data as { error?: string }).error || response.statusText;
        alert(`업로드 실패 (${response.status}): ${msg}\n\n로그인 상태·NAS의 public/uploads 쓰기 권한을 확인하세요.`);
        return;
      }
      if (data.success) {
        const url = (data.url as string).startsWith("http")
          ? (data.url as string)
          : (data.url as string).startsWith("/")
            ? (data.url as string)
            : getApiBase() + (data.url as string);
        setImageSrc(url);
        try {
          await onSave(url);
        } catch (saveErr) {
          console.error("Save image URL error:", saveErr);
          setImageSrc(src);
          alert("이미지는 업로드됐지만 저장에 실패했습니다. NAS에서 data/ 폴더 쓰기 권한을 확인하세요.");
        }
      } else {
        alert((data as { error?: string }).error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("업로드 요청 실패. 네트워크와 주소를 확인하세요.");
    } finally {
      setUploading(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // 갤러리/멤버/업로드 이미지 구분 (basePath 포함 경로 포함)
  const isGalleryImage = imageSrc && imageSrc.includes("/images/gallery/");
  const isMemberImage = imageSrc && (imageSrc.includes("/images/members/") || imageSrc.includes("/images/alumni/"));
  const isUploadImage = imageSrc && (imageSrc.includes("/uploads/") || imageSrc.includes("/agem_homepage/uploads/"));
  const isPngImage = imageSrc && imageSrc.toLowerCase().endsWith('.png');
  const showPlaceholder = !imageSrc || imageSrc === "" || imageError || (isMemberImage && !imageSrc.match(/\.(jpg|jpeg|png|gif|webp)$/i)) || (isGalleryImage && !imageSrc.match(/\.(jpg|jpeg|png|gif|webp)$/i));
  // 브라우저에서 상대 경로를 절대 URL로 (basePath/다른 도메인에서 로드 안 되는 경우 방지)
  const displaySrc = typeof window !== "undefined" && imageSrc && imageSrc.startsWith("/") ? window.location.origin + imageSrc : imageSrc;

  if (!isAuthenticated) {
    return (
      <div className={className}>
        {showPlaceholder ? (
          <div className={`${className} bg-gray-200 flex items-center justify-center rounded-lg`}>
            <span className="text-gray-400 text-4xl">{isGalleryImage ? "📸" : "👤"}</span>
          </div>
        ) : isPngImage && isMemberImage ? (
          <img
            src={displaySrc}
            alt={alt}
            className={className}
            onError={handleImageError}
            onLoad={() => setImageLoaded(true)}
          />
        ) : fill ? (
          <Image
            src={displaySrc}
            alt={alt}
            fill
            sizes={sizes}
            className={className}
            onError={handleImageError}
            onLoad={() => setImageLoaded(true)}
            unoptimized={isMemberImage || isUploadImage}
            priority={imageSrc.includes("/images/alumni/")}
          />
        ) : (
          <Image
            src={displaySrc}
            alt={alt}
            width={isMemberImage ? 200 : 500}
            height={isMemberImage ? 200 : 500}
            className={className}
            onError={handleImageError}
            onLoad={() => setImageLoaded(true)}
            unoptimized={isMemberImage || isUploadImage}
            priority={imageSrc.includes("/images/alumni/")}
          />
        )}
      </div>
    );
  }

  return (
    <div className="relative group w-full h-full">
      {showPlaceholder ? (
        <div className={`w-full h-full bg-gray-200 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-400 transition-colors`}>
          <span className="text-gray-400 text-4xl mb-2">{isGalleryImage ? "📸" : "👤"}</span>
          <span className="text-xs text-gray-500">{isGalleryImage ? "이미지 없음" : "사진 없음"}</span>
        </div>
      ) : isPngImage && isMemberImage ? (
        fill ? (
          <img
            src={displaySrc}
            alt={alt}
            className={`${className} w-full h-full`}
            onError={handleImageError}
            onLoad={() => setImageLoaded(true)}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <img
            src={displaySrc}
            alt={alt}
            className={className}
            onError={handleImageError}
            onLoad={() => setImageLoaded(true)}
          />
        )
      ) : fill ? (
        <Image
          src={displaySrc}
          alt={alt}
          fill
          sizes={sizes}
          className={className}
          onError={handleImageError}
          onLoad={() => setImageLoaded(true)}
          unoptimized={isMemberImage || isUploadImage}
          priority={imageSrc.includes("/images/alumni/") || imageSrc.includes("/images/members/professor")}
        />
      ) : (
        <Image
          src={displaySrc}
          alt={alt}
          width={isMemberImage ? 200 : 500}
          height={isMemberImage ? 200 : 500}
          className={className}
          onError={handleImageError}
          onLoad={() => setImageLoaded(true)}
          unoptimized={isMemberImage || isUploadImage}
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

