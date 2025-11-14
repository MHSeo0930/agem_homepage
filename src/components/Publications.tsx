"use client";

import { useState, useEffect } from "react";
import { recentPublications, publications } from "@/data/publications";
import EditableContent from "./EditableContent";
import { useAuth } from "@/hooks/useAuth";

export default function Publications() {
  const { authenticated } = useAuth();
  const [publicationsData, setPublicationsData] = useState({
    title: "Selected Publications",
    titleKo: "주요 논문",
    description: "Recent publications in electrocatalysts, fuel cells, water electrolysis, and energy materials.",
    descriptionKo: "전기촉매, 연료전지, 수전해, 에너지 소재 분야의 최근 논문입니다.",
    selectedNumbers: recentPublications.map(pub => pub.number), // 기본값: 최근 논문들
  });
  const [allPublications] = useState(publications);

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.publications) {
          try {
            const parsed = JSON.parse(data.publications);
            setPublicationsData(prev => ({
              ...prev,
              ...parsed,
              selectedNumbers: parsed.selectedNumbers || prev.selectedNumbers,
            }));
          } catch (e) {
            console.error("Failed to parse publications data");
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (field: string, value: any) => {
    const updatedData = { ...publicationsData, [field]: value };
    setPublicationsData(updatedData);
    
    const response = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publications: JSON.stringify(updatedData) }),
    });
    if (!response.ok) throw new Error("Failed to save");
  };

  const handleToggleSelection = async (number: number) => {
    const currentSelected = publicationsData.selectedNumbers || [];
    const newSelected = currentSelected.includes(number)
      ? currentSelected.filter(n => n !== number)
      : [...currentSelected, number];
    
    await handleSave("selectedNumbers", newSelected);
  };

  // 선택된 논문만 필터링
  const selectedPublications = allPublications.filter(pub => 
    (publicationsData.selectedNumbers || []).includes(pub.number)
  );

  return (
    <section id="publications" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <EditableContent
            contentKey="publications-title"
            defaultValue={`<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">${publicationsData?.title || "Selected Publications"}<span class="block text-2xl md:text-3xl text-gray-600 font-normal mt-2">${publicationsData?.titleKo || "주요 논문"}</span></h2>`}
            onSave={async (content) => {
              const tempDiv = document.createElement("div");
              tempDiv.innerHTML = content;
              const titleElement = tempDiv.querySelector("h2");
              const titleKoElement = tempDiv.querySelector("span");
              if (titleElement) {
                const titleText = titleElement.childNodes[0]?.textContent || "";
                const titleKoText = titleKoElement?.textContent || "";
                await handleSave("title", titleText);
                await handleSave("titleKo", titleKoText);
              }
            }}
            isAuthenticated={authenticated}
          />
          <EditableContent
            contentKey="publications-description"
            defaultValue={`<p class="text-base text-gray-600 max-w-2xl mx-auto">${publicationsData?.description || "Recent publications in electrocatalysts, fuel cells, water electrolysis, and energy materials."}<br /><span class="text-sm text-gray-500">${publicationsData?.descriptionKo || "전기촉매, 연료전지, 수전해, 에너지 소재 분야의 최근 논문입니다."}</span></p>`}
            onSave={async (content) => {
              const tempDiv = document.createElement("div");
              tempDiv.innerHTML = content;
              const descriptionText = tempDiv.childNodes[0]?.textContent || "";
              const descriptionKoElement = tempDiv.querySelector("span");
              const descriptionKoText = descriptionKoElement?.textContent || "";
              await handleSave("description", descriptionText);
              await handleSave("descriptionKo", descriptionKoText);
            }}
            isAuthenticated={authenticated}
          />
        </div>
        {authenticated && (
          <div className="max-w-6xl mx-auto mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                표시할 논문을 선택하세요 (현재 {selectedPublications.length}개 선택됨)
              </p>
              <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
                {allPublications
                  .sort((a, b) => b.number - a.number) // 번호 내림차순 정렬 (최신순)
                  .map((pub) => {
                    const isSelected = (publicationsData.selectedNumbers || []).includes(pub.number);
                    return (
                      <label
                        key={pub.number}
                        className={`inline-flex items-center px-3 py-1 rounded-md text-xs cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-blue-100 text-blue-700 border border-blue-300"
                            : "bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelection(pub.number)}
                          className="mr-2"
                        />
                        #{pub.number}
                      </label>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedPublications.length > 0 ? (
              selectedPublications.map((pub, index) => (
                <div
                  key={pub.number}
                  className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden relative group"
                >
                  {authenticated && (
                    <button
                      onClick={() => handleToggleSelection(pub.number)}
                      className="absolute top-2 right-2 z-20 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                      title="선택 해제"
                    >
                      ✕
                    </button>
                  )}
                  {/* 논문 정보 */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        #{pub.number}
                      </span>
                      {pub.role && (
                        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                          {pub.role}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2 leading-tight line-clamp-2">
                      {pub.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {pub.authors}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <p className="text-sm text-gray-500">
                        <span className="font-bold text-gray-700">{pub.journal}</span> ({pub.year})
                      </p>
                      {pub.status === "submitted" && (
                        <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                          Submitted
                        </span>
                      )}
                    </div>
                    {pub.if && (
                      <p className="text-xs text-gray-500 mb-2">
                        IF: {pub.if} {pub.jcrRanking && `(JCR: ${pub.jcrRanking})`}
                      </p>
                    )}
                    {pub.specialNote && (
                      <p className="text-xs text-purple-600 mb-2">
                        ⭐ {pub.specialNote}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500 py-8">
                선택된 논문이 없습니다.
              </div>
            )}
          </div>
        </div>
        <div className="text-center mt-8">
          <a
            href="/achievements/journals"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            View All Publications →
          </a>
        </div>
      </div>
    </section>
  );
}
