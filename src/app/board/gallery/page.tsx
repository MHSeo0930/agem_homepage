"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getApiBase } from "@/lib/apiBase";
import EditableContent from "@/components/EditableContent";
import EditableImage from "@/components/EditableImage";
import Image from "next/image";

export default function GalleryPage() {
  const { authenticated } = useAuth();
  const [selectedImage, setSelectedImage] = useState<{ src: string; title: string; titleKo: string } | null>(null);
  const [galleryItems, setGalleryItems] = useState([
    // Page 1 (최신)
    {
      id: "gallery-1",
      number: 1,
      title: "250930 happy birthday",
      titleKo: "250930 happy birthday",
      image: "/images/gallery/250930-happy-birthday.jpg",
    },
    {
      id: "gallery-2",
      number: 2,
      title: "250824-25 Workshop with KIMS",
      titleKo: "250824-25 Workshop with KIMS",
      image: "/images/gallery/250824-25-workshop-kims.jpg",
    },
    {
      id: "gallery-3",
      number: 3,
      title: "250822 Graudation",
      titleKo: "250822 졸업식",
      image: "/images/gallery/250822-graduation.jpg",
    },
    {
      id: "gallery-4",
      number: 4,
      title: "250709 Sajik Baseball Stadium",
      titleKo: "250709 사직야구장",
      image: "/images/gallery/250709-sajik-baseball-stadium.jpg",
    },
    {
      id: "gallery-5",
      number: 5,
      title: "247th ECS Meeting (Montreal, Canada)",
      titleKo: "247th ECS Meeting (Montreal, Canada)",
      image: "/images/gallery/247th-ecs-meeting.jpg",
    },
    {
      id: "gallery-6",
      number: 6,
      title: "25 춘계한국전기화학회 (제주도)",
      titleKo: "25 춘계한국전기화학회 (제주도)",
      image: "/images/gallery/25-spring-electrochemistry.jpg",
    },
    {
      id: "gallery-7",
      number: 7,
      title: "2025 대한화학회 동계 심포지엄 (강원도 홍천 소노캄)",
      titleKo: "2025 대한화학회 동계 심포지엄 (강원도 홍천 소노캄)",
      image: "/images/gallery/2025-winter-symposium.jpg",
    },
    {
      id: "gallery-8",
      number: 8,
      title: "241108 Happy birthday",
      titleKo: "241108 Happy birthday",
      image: "/images/gallery/241108-happy-birthday.jpg",
    },
    {
      id: "gallery-9",
      number: 9,
      title: "24 추계표면공학회",
      titleKo: "24 추계표면공학회",
      image: "/images/gallery/24-fall-surface-chemistry.jpg",
    },
    // Page 2
    {
      id: "gallery-10",
      number: 10,
      title: "연구실 단체 벚꽃 사진",
      titleKo: "연구실 단체 벚꽃 사진",
      image: "/images/gallery/lab-cherry-blossom.jpg",
    },
    {
      id: "gallery-11",
      number: 11,
      title: "2022' 춘계 한국표면공학회 with Prof. Han's group",
      titleKo: "2022' 춘계 한국표면공학회 with Prof. Han's group",
      image: "/images/gallery/2022-spring-surface-chemistry.jpg",
    },
    {
      id: "gallery-12",
      number: 12,
      title: "제 2회 그린에너지 소부장 섬머스쿨 초청 발표",
      titleKo: "제 2회 그린에너지 소부장 섬머스쿨 초청 발표",
      image: "/images/gallery/green-energy-summer-school.jpg",
    },
    {
      id: "gallery-13",
      number: 13,
      title: "at Uni. of Waterloo",
      titleKo: "at Uni. of Waterloo",
      image: "/images/gallery/waterloo-1.jpg",
    },
    {
      id: "gallery-14",
      number: 14,
      title: "2019' 전기화학회",
      titleKo: "2019' 전기화학회",
      image: "/images/gallery/2019-electrochemistry.jpg",
    },
    {
      id: "gallery-15",
      number: 15,
      title: "2021 한국부식방식학회 초청발표",
      titleKo: "2021 한국부식방식학회 초청발표",
      image: "/images/gallery/2021-corrosion-society.jpg",
    },
    {
      id: "gallery-16",
      number: 16,
      title: "at Uni. of Alberta",
      titleKo: "at Uni. of Alberta",
      image: "/images/gallery/alberta.jpg",
    },
    {
      id: "gallery-17",
      number: 17,
      title: "at MacMaster Uni.",
      titleKo: "at MacMaster Uni.",
      image: "/images/gallery/mcmaster.jpg",
    },
    {
      id: "gallery-18",
      number: 18,
      title: "at Uni. of Waterloo",
      titleKo: "at Uni. of Waterloo",
      image: "/images/gallery/waterloo-2.jpg",
    },
    // Page 3
    {
      id: "gallery-19",
      number: 19,
      title: "at CSIR",
      titleKo: "at CSIR",
      image: "/images/gallery/csir.jpg",
    },
    {
      id: "gallery-20",
      number: 20,
      title: "2018' 출연연 우수직원 이사장 표창",
      titleKo: "2018' 출연연 우수직원 이사장 표창",
      image: "/images/gallery/2018-excellent-employee.jpg",
    },
    {
      id: "gallery-21",
      number: 21,
      title: "at Uni. of Waterloo",
      titleKo: "at Uni. of Waterloo",
      image: "/images/gallery/waterloo-3.jpg",
    },
    {
      id: "gallery-22",
      number: 22,
      title: "그룹사진",
      titleKo: "그룹사진",
      image: "/images/gallery/group-photo.jpg",
    },
  ]);

  const loadData = async () => {
    try {
      const res = await fetch(`${getApiBase()}/api/content`);
      const data = await res.json();
      if (data.gallery) {
        try {
          const parsed = JSON.parse(data.gallery);
          setGalleryItems(parsed);
        } catch (e) {
          console.error("Failed to parse gallery data");
        }
      }
    } catch (error) {
      console.error("Failed to load gallery data", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };
    if (selectedImage) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [selectedImage]);

  const handleSave = async (galleryId: string, field: string, value: string) => {
    const updatedGallery = galleryItems.map((item) =>
      item.id === galleryId ? { ...item, [field]: value } : item
    );
    
    // 먼저 상태를 업데이트하여 UI에 즉시 반영
    setGalleryItems(updatedGallery);
    
    const response = await fetch(`${getApiBase()}/api/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ gallery: JSON.stringify(updatedGallery) }),
    });
    if (!response.ok) {
      // 실패 시 이전 상태로 복원
      setGalleryItems(galleryItems);
      throw new Error("Failed to save");
    }
    
    // 저장 후 데이터 다시 로드하여 서버와 동기화
    // 약간의 지연을 두어 EditableContent가 먼저 업데이트되도록 함
    setTimeout(async () => {
      await loadData();
    }, 50);
  };

  const handleImageSave = async (galleryId: string, imageUrl: string) => {
    await handleSave(galleryId, "image", imageUrl);
  };

  const handleAddGallery = async () => {
    const maxNumber = galleryItems.length > 0 ? Math.max(...galleryItems.map(g => g.number)) : 0;
    const newGallery = {
      id: `gallery-${Date.now()}`,
      number: maxNumber + 1,
      title: "New Gallery Item",
      titleKo: "새 갤러리 항목",
      image: "/images/gallery/new-gallery.jpg",
    };
    const updatedGallery = [newGallery, ...galleryItems].sort((a, b) => b.number - a.number);
    setGalleryItems(updatedGallery);
    
    const response = await fetch(`${getApiBase()}/api/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ gallery: JSON.stringify(updatedGallery) }),
    });
    if (!response.ok) throw new Error("Failed to add gallery");
    
    // 저장 후 데이터 다시 로드
    await loadData();
  };

  const handleDeleteGallery = async (galleryId: string) => {
    if (!confirm("이 갤러리 항목을 삭제하시겠습니까?")) return;
    
    const updatedGallery = galleryItems.filter((item) => item.id !== galleryId);
    setGalleryItems(updatedGallery);
    
    const response = await fetch(`${getApiBase()}/api/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ gallery: JSON.stringify(updatedGallery) }),
    });
    if (!response.ok) throw new Error("Failed to delete gallery");
    
    // 저장 후 데이터 다시 로드
    await loadData();
  };

  const sortedItems = [...galleryItems].sort((a, b) => a.number - b.number);
  const totalItems = galleryItems.length;

  return (
    <div className="flex flex-col">
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Gallery
              <span className="block text-3xl md:text-4xl text-gray-600 font-normal mt-2">
                갤러리
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Photos and images from lab activities and events.
              <br />
              <span className="text-base text-gray-500">
                연구실 활동 및 행사 사진입니다.
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Total: {galleryItems.length} items
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {authenticated && (
              <div className="mb-6 flex justify-end">
                <button
                  onClick={handleAddGallery}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  + 갤러리 추가
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedItems.map((item, index) => {
                // 아래쪽(마지막) 항목이 #1이 되도록 역순 번호 계산
                const displayNumber = totalItems - index;
                return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden relative group"
                >
                  {authenticated && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGallery(item.id);
                      }}
                      className="absolute top-2 right-2 z-20 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                      title="갤러리 삭제"
                    >
                      ✕
                    </button>
                  )}
                  <div 
                    className="aspect-[4/3] bg-gray-100 relative overflow-hidden rounded-t-xl cursor-pointer"
                    onClick={(e) => {
                      // 편집 버튼 클릭이 아닌 경우에만 모달 열기
                      const target = e.target as HTMLElement;
                      if (!target.closest('button') && !target.closest('input')) {
                        setSelectedImage({
                          src: item.image,
                          title: item.title,
                          titleKo: item.titleKo,
                        });
                      }
                    }}
                  >
                    {authenticated ? (
                      <div className="w-full h-full" onClick={(e) => e.stopPropagation()}>
                        <EditableImage
                          src={item.image}
                          alt={item.title}
                          contentKey={`gallery-${item.id}-image`}
                          onSave={(url) => handleImageSave(item.id, url)}
                          isAuthenticated={authenticated}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={() => {
                          // 이미지 로드 실패 시 플레이스홀더 표시
                        }}
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-blue-600">#{displayNumber}</span>
                    </div>
                    <EditableContent
                      contentKey={`gallery-${item.id}-title`}
                      defaultValue={`<h3 class="text-lg font-semibold text-gray-900 mb-1">${item.title}</h3>`}
                      onSave={async (content) => {
                        const tempDiv = document.createElement("div");
                        tempDiv.innerHTML = content;
                        const text = tempDiv.textContent || tempDiv.innerText || "";
                        await handleSave(item.id, "title", text);
                      }}
                      isAuthenticated={authenticated}
                    />
                    <EditableContent
                      contentKey={`gallery-${item.id}-titleKo`}
                      defaultValue={`<p class="text-sm text-gray-600">${item.titleKo}</p>`}
                      onSave={async (content) => {
                        const tempDiv = document.createElement("div");
                        tempDiv.innerHTML = content;
                        const text = tempDiv.textContent || tempDiv.innerText || "";
                        await handleSave(item.id, "titleKo", text);
                      }}
                      isAuthenticated={authenticated}
                    />
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 이미지 모달 */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 transition-all"
              aria-label="닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <div className="relative w-full h-full max-w-6xl max-h-[80vh] flex items-center justify-center">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  fill
                  className="object-contain"
                  sizes="90vw"
                  priority
                />
              </div>
              <div className="mt-4 text-center text-white max-w-2xl">
                <h3 className="text-xl font-semibold mb-1">{selectedImage.title}</h3>
                <p className="text-sm text-gray-300">{selectedImage.titleKo}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
