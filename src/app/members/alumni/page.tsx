"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getApiBase } from "@/lib/apiBase";
import EditableContent from "@/components/EditableContent";
import EditableImage from "@/components/EditableImage";

export default function AlumniPage() {
  const { authenticated } = useAuth();
  const [alumni, setAlumni] = useState([
    {
      id: "jee-min-hwang",
      name: "Jee Min Hwang",
      nameKo: "황지민",
      position: "Principal Researcher",
      positionKo: "책임연구원",
      currentPosition: "LG Energy Solution",
      currentPositionKo: "LG에너지솔루션",
      email: "mail",
      tel: "--",
      image: "/images/alumni/jee-min-hwang.png",
    },
    {
      id: "jong-min-lee",
      name: "Jong Min Lee",
      nameKo: "이종민",
      position: "Researcher",
      positionKo: "연구원",
      currentPosition: "한국에너지기술연구원 (KIER)",
      currentPositionKo: "한국에너지기술연구원 (KIER)",
      email: "mail",
      tel: "--",
      image: "/images/alumni/jong-min-lee.jpg",
    },
    {
      id: "mun-seon-kang",
      name: "Mun Seon Kang",
      nameKo: "강문선",
      position: "Researcher",
      positionKo: "연구원",
      currentPosition: "LT Metal",
      currentPositionKo: "LT Metal",
      email: "mail",
      tel: "--",
      image: "/images/alumni/mun-seon-kang.png",
    },
    {
      id: "sung-young-yang",
      name: "Sung Young Yang",
      nameKo: "양성영",
      position: "Researcher",
      positionKo: "연구원",
      currentPosition: "Doosan Fuel Cell",
      currentPositionKo: "두산퓨얼셀",
      email: "mail",
      tel: "--",
      image: "/images/alumni/sung-young-yang.png",
    },
    {
      id: "song-jin",
      name: "Song Jin",
      nameKo: "진송",
      position: "Researcher",
      positionKo: "연구원",
      currentPosition: "한국재료연구원 (KIMS)",
      currentPositionKo: "한국재료연구원 (KIMS)",
      email: "mail",
      tel: "--",
      image: "/images/alumni/song-jin.jpg",
    },
  ]);

  const loadData = async () => {
    try {
      const res = await fetch(`${getApiBase()}/api/content`);
      const data = await res.json();
      if (data.alumni) {
        try {
          const parsed = JSON.parse(data.alumni);
          setAlumni(parsed);
        } catch (e) {
          console.error("Failed to parse alumni data");
        }
      }
    } catch (error) {
      console.error("Failed to load alumni data", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (alumnusId: string, field: string, value: string) => {
    const updatedAlumni = alumni.map((alumnus) =>
      alumnus.id === alumnusId ? { ...alumnus, [field]: value } : alumnus
    );
    
    // 먼저 상태를 업데이트하여 UI에 즉시 반영
    setAlumni(updatedAlumni);
    
    const response = await fetch(`${getApiBase()}/api/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alumni: JSON.stringify(updatedAlumni) }),
    });
    if (!response.ok) {
      // 실패 시 이전 상태로 복원
      setAlumni(alumni);
      throw new Error("Failed to save");
    }
    
    // 저장 후 데이터 다시 로드하여 서버와 동기화
    // 약간의 지연을 두어 EditableContent가 먼저 업데이트되도록 함
    setTimeout(async () => {
      await loadData();
    }, 50);
  };

  const handleImageSave = async (alumnusId: string, imageUrl: string) => {
    await handleSave(alumnusId, "image", imageUrl);
  };

  const handleAddAlumnus = async () => {
    const newAlumnus = {
      id: `alumnus-${Date.now()}`,
      name: "New Alumni",
      nameKo: "새 졸업생",
      position: "Researcher",
      positionKo: "연구원",
      currentPosition: "Company Name",
      currentPositionKo: "회사명",
      email: "mail",
      tel: "--",
      image: "/images/alumni/new-alumni.jpg",
    };
    const updatedAlumni = [...alumni, newAlumnus];
    setAlumni(updatedAlumni);
    
    const response = await fetch(`${getApiBase()}/api/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alumni: JSON.stringify(updatedAlumni) }),
    });
    if (!response.ok) throw new Error("Failed to add alumni");
    
    // 저장 후 데이터 다시 로드
    await loadData();
  };

  const handleDeleteAlumnus = async (alumnusId: string) => {
    if (!confirm("이 졸업생을 삭제하시겠습니까?")) return;
    
    const updatedAlumni = alumni.filter((alumnus) => alumnus.id !== alumnusId);
    setAlumni(updatedAlumni);
    
    const response = await fetch(`${getApiBase()}/api/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alumni: JSON.stringify(updatedAlumni) }),
    });
    if (!response.ok) throw new Error("Failed to delete alumni");
    
    // 저장 후 데이터 다시 로드
    await loadData();
  };

  return (
    <div className="flex flex-col">
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Alumni
              <span className="block text-3xl md:text-4xl text-gray-600 font-normal mt-2">
                졸업생
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our lab alumni and their current positions.
              <br />
              <span className="text-base text-gray-500">
                연구실 졸업생과 현재 근무처입니다.
              </span>
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
                  onClick={handleAddAlumnus}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  + 졸업생 추가
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {alumni.map((alumnus) => (
                <div
                  key={alumnus.id}
                  className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 relative group flex flex-col"
                >
                  {authenticated && (
                    <button
                      onClick={() => handleDeleteAlumnus(alumnus.id)}
                      className="absolute top-2 right-2 z-20 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                      title="졸업생 삭제"
                    >
                      ✕
                    </button>
                  )}
                  {/* 사진 편집 가능 */}
                  <div className="relative mb-5 flex justify-center">
                    <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 relative overflow-hidden rounded-lg bg-gray-200">
                      <EditableImage
                        src={alumnus.image}
                        alt={alumnus.name}
                        contentKey={`alumnus-${alumnus.id}-image`}
                        onSave={(url) => handleImageSave(alumnus.id, url)}
                        isAuthenticated={authenticated}
                        className="w-full h-full rounded-lg object-cover"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 text-center w-full">
                    {/* 이름 편집 가능 */}
                    <EditableContent
                      contentKey={`alumnus-${alumnus.id}-name`}
                      defaultValue={`<h3 class="text-xl font-semibold text-gray-900 text-center">${alumnus.name}</h3>`}
                      onSave={async (content) => {
                        const tempDiv = document.createElement("div");
                        tempDiv.innerHTML = content;
                        const text = tempDiv.textContent || tempDiv.innerText || "";
                        await handleSave(alumnus.id, "name", text);
                      }}
                      isAuthenticated={authenticated}
                    />
                    
                    {/* 한글 이름 편집 가능 */}
                    <EditableContent
                      contentKey={`alumnus-${alumnus.id}-nameKo`}
                      defaultValue={`<p class="text-sm text-gray-600 text-center">${alumnus.nameKo}</p>`}
                      onSave={async (content) => {
                        const tempDiv = document.createElement("div");
                        tempDiv.innerHTML = content;
                        const text = tempDiv.textContent || tempDiv.innerText || "";
                        await handleSave(alumnus.id, "nameKo", text);
                      }}
                      isAuthenticated={authenticated}
                    />
                    
                    {/* 직위 편집 가능 */}
                    <p className="text-sm font-medium text-indigo-600 text-center">
                      <EditableContent
                        contentKey={`alumnus-${alumnus.id}-position`}
                        defaultValue={`<span>${alumnus.position}</span>`}
                        onSave={async (content) => {
                          const tempDiv = document.createElement("div");
                          tempDiv.innerHTML = content;
                          const text = tempDiv.textContent || tempDiv.innerText || "";
                          await handleSave(alumnus.id, "position", text);
                        }}
                        isAuthenticated={authenticated}
                      />
                      <span className="text-gray-500 ml-1">(</span>
                      <EditableContent
                        contentKey={`alumnus-${alumnus.id}-positionKo`}
                        defaultValue={`<span class="text-gray-500">${alumnus.positionKo}</span>`}
                        onSave={async (content) => {
                          const tempDiv = document.createElement("div");
                          tempDiv.innerHTML = content;
                          const text = tempDiv.textContent || tempDiv.innerText || "";
                          await handleSave(alumnus.id, "positionKo", text);
                        }}
                        isAuthenticated={authenticated}
                      />
                      <span className="text-gray-500">)</span>
                    </p>
                    
                    {/* 현재 근무처 편집 가능 */}
                    <div className="pt-2 border-t border-gray-100 mt-2">
                      <p className="text-xs text-gray-500 mb-1 text-left">Position / 근무처</p>
                      <EditableContent
                        contentKey={`alumnus-${alumnus.id}-currentPosition`}
                        defaultValue={`<p class="text-sm text-gray-700 text-left break-words">${alumnus.currentPosition}</p>`}
                        onSave={async (content) => {
                          const tempDiv = document.createElement("div");
                          tempDiv.innerHTML = content;
                          const text = tempDiv.textContent || tempDiv.innerText || "";
                          await handleSave(alumnus.id, "currentPosition", text);
                        }}
                        isAuthenticated={authenticated}
                      />
                    </div>
                    
                    {/* 이메일 편집 가능 */}
                    <div className="text-left">
                      <EditableContent
                        contentKey={`alumnus-${alumnus.id}-email`}
                        defaultValue={alumnus.email !== "mail" ? `<a href="mailto:${alumnus.email}" class="text-xs text-indigo-600 hover:text-indigo-700 text-left">${alumnus.email}</a>` : `<span class="text-xs text-indigo-600 text-left">${alumnus.email}</span>`}
                        onSave={async (content) => {
                          const tempDiv = document.createElement("div");
                          tempDiv.innerHTML = content;
                          const text = tempDiv.textContent || tempDiv.innerText || "";
                          await handleSave(alumnus.id, "email", text);
                        }}
                        isAuthenticated={authenticated}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
