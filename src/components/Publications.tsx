"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { recentPublications, publications } from "@/data/publications";
import EditableContent from "./EditableContent";
import { useAuth } from "@/hooks/useAuth";
import { getApiBase } from "@/lib/apiBase";
import { getJournalDisplayName } from "@/lib/journalNames";

export default function Publications() {
  const { authenticated } = useAuth();
  // 초기 상태를 ref로 저장하여 loadData()에서 참조할 수 있도록 함
  const initialPublicationsData = {
    title: "Selected Publications",
    titleKo: "주요 논문",
    description: "Recent publications in electrocatalysts, fuel cells, water electrolysis, and energy materials.",
    descriptionKo: "전기촉매, 연료전지, 수전해, 에너지 소재 분야의 최근 논문입니다.",
    selectedNumbers: recentPublications.map(pub => pub.number), // 기본값: 최근 논문들
  };
  
  const [publicationsData, setPublicationsData] = useState(initialPublicationsData);
  const [allPublications, setAllPublications] = useState(publications);
  const [isDataLoaded, setIsDataLoaded] = useState(false); // 데이터 로드 완료 여부

  const loadData = async () => {
    try {
      const res = await fetch(`${getApiBase()}/api/content`);
      const data = await res.json();

      // 논문 목록: 저널 페이지와 동기화 (journalPublications 배열)
      if (data.journalPublications) {
        try {
          const parsed = JSON.parse(data.journalPublications);
          if (Array.isArray(parsed)) {
            setAllPublications(parsed);
          }
        } catch (e) {
          console.error("Failed to parse journalPublications", e);
        }
      }

      // Selected Publications 설정(제목, 설명, selectedNumbers)
      if (data.publications) {
        try {
          const parsed = JSON.parse(data.publications);
          // publications는 Selected Publications 설정(제목, 설명, selectedNumbers)용 객체
          if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            setPublicationsData(prev => {
              const serverDescriptionKo = parsed.descriptionKo && parsed.descriptionKo.trim();
              const serverTitle = parsed.title && parsed.title.trim();
              const serverTitleKo = parsed.titleKo && parsed.titleKo.trim();
              const serverDescription = parsed.description && parsed.description.trim();
              return {
                ...prev,
                ...parsed,
                title: serverTitle ? serverTitle : prev.title,
                titleKo: serverTitleKo ? serverTitleKo : prev.titleKo,
                description: serverDescription ? serverDescription : prev.description,
                descriptionKo: serverDescriptionKo ? serverDescriptionKo : prev.descriptionKo,
                selectedNumbers: parsed.selectedNumbers || prev.selectedNumbers,
              };
            });
          }
          setIsDataLoaded(true);
        } catch (e) {
          console.error("Failed to parse publications data", e);
          setIsDataLoaded(true);
        }
      } else {
        setIsDataLoaded(true);
      }
    } catch (error) {
      console.error("Failed to load publications data", error);
      setIsDataLoaded(true);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (field: string, value: any) => {
    const updatedData = { ...publicationsData, [field]: value };
    
    // 먼저 상태를 업데이트하여 UI에 즉시 반영
    setPublicationsData(updatedData);
    
    const response = await fetch(`${getApiBase()}/api/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ publications: JSON.stringify(updatedData) }),
    });
    if (!response.ok) {
      // 실패 시 이전 상태로 복원
      setPublicationsData(publicationsData);
      throw new Error("Failed to save");
    }
    
    // 저장 후 데이터 다시 로드하여 서버와 동기화
    // 약간의 지연을 두어 EditableContent가 먼저 업데이트되도록 함
    setTimeout(async () => {
      await loadData();
    }, 50);
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

  // 서식 유지: 저장된 HTML이 있으면 사용, 없으면 plain text로 구성
  const titleDefaultValue = useMemo(() => {
    const html = (publicationsData as { titleHtml?: string }).titleHtml;
    if (html && html.trim() !== "") return html;
    return `<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">${publicationsData?.title || "Selected Publications"}<span class="block text-2xl md:text-3xl text-gray-600 font-normal mt-2">${publicationsData?.titleKo || "주요 논문"}</span></h2>`;
  }, [publicationsData?.title, publicationsData?.titleKo, (publicationsData as { titleHtml?: string }).titleHtml]);
  
  const descriptionDefaultValue = useMemo(() => {
    const html = (publicationsData as { descriptionHtml?: string }).descriptionHtml;
    if (html && html.trim() !== "") return html;
    const description = publicationsData?.description?.trim() || "Recent publications in electrocatalysts, fuel cells, water electrolysis, and energy materials.";
    const descriptionKo = publicationsData?.descriptionKo?.trim() || "전기촉매, 연료전지, 수전해, 에너지 소재 분야의 최근 논문입니다.";
    return `<p class="text-base text-gray-600 max-w-2xl mx-auto">${description}<br /><span class="text-sm text-gray-500">${descriptionKo}</span></p>`;
  }, [publicationsData?.description, publicationsData?.descriptionKo, (publicationsData as { descriptionHtml?: string }).descriptionHtml]);

  return (
    <section id="publications" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <EditableContent
            contentKey="publications-title"
            defaultValue={titleDefaultValue}
            onSave={async (content) => {
              const tempDiv = document.createElement("div");
              tempDiv.innerHTML = content;
              const titleElement = tempDiv.querySelector("h2");
              const titleKoElement = tempDiv.querySelector("span");
              const titleText = (titleElement?.childNodes[0]?.textContent ?? publicationsData.title)?.trim() || publicationsData.title;
              const titleKoText = (titleKoElement?.textContent ?? publicationsData.titleKo)?.trim() || publicationsData.titleKo;
              const updatedData = {
                ...publicationsData,
                titleHtml: content,
                title: titleText,
                titleKo: titleKoText,
              };
              const response = await fetch(`${getApiBase()}/api/content`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ publications: JSON.stringify(updatedData) }),
              });
              if (!response.ok) throw new Error("Failed to save");
              setPublicationsData(updatedData);
            }}
            isAuthenticated={authenticated}
          />
          {isDataLoaded && (
            <EditableContent
              contentKey="publications-description"
              defaultValue={descriptionDefaultValue}
            onSave={async (content) => {
              const tempDiv = document.createElement("div");
              tempDiv.innerHTML = content;
              let descriptionText = "";
              let descriptionKoText = "";
              const pElements = tempDiv.querySelectorAll("p");
              if (pElements.length >= 2) {
                descriptionText = pElements[0].textContent || (pElements[0] as HTMLElement).innerText || "";
                descriptionKoText = Array.from(pElements).slice(1)
                  .map(p => p.textContent || (p as HTMLElement).innerText || "")
                  .filter(t => t.trim().length > 0)
                  .join(" ");
              } else if (pElements.length === 1) {
                const pElement = pElements[0];
                const spanElement = pElement.querySelector("span.text-sm.text-gray-500") ?? pElement.querySelector("span");
                if (spanElement) {
                  descriptionKoText = spanElement.textContent || (spanElement as HTMLElement).innerText || "";
                  const pClone = pElement.cloneNode(true) as HTMLElement;
                  pClone.querySelector("span")?.remove();
                  pClone.querySelectorAll("br").forEach(br => br.remove());
                  descriptionText = pClone.textContent || pClone.innerText || "";
                } else {
                  const pClone = pElement.cloneNode(true) as HTMLElement;
                  const parts = pClone.innerHTML.split(/<br\s*\/?>/i);
                  if (parts.length >= 2) {
                    const firstPart = document.createElement("div");
                    firstPart.innerHTML = parts[0];
                    descriptionText = firstPart.textContent || firstPart.innerText || "";
                    const secondPart = document.createElement("div");
                    secondPart.innerHTML = parts.slice(1).join("<br>");
                    descriptionKoText = secondPart.textContent || secondPart.innerText || "";
                  } else {
                    descriptionText = pClone.textContent || pClone.innerText || "";
                  }
                }
              }
              if (!descriptionText && !descriptionKoText) {
                const fullText = (tempDiv.textContent || tempDiv.innerText || "").trim();
                const lines = fullText.split(/\n+/).map(l => l.trim()).filter(l => l.length > 0);
                if (lines.length >= 2) {
                  descriptionText = lines[0];
                  descriptionKoText = lines.slice(1).join(" ");
                } else if (lines.length === 1) descriptionText = lines[0];
              }
              const updatedData = {
                ...publicationsData,
                descriptionHtml: content,
                description: descriptionText.trim() || publicationsData.description,
                descriptionKo: descriptionKoText.trim() || publicationsData.descriptionKo,
              };
              const response = await fetch(`${getApiBase()}/api/content`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ publications: JSON.stringify(updatedData) }),
              });
              if (!response.ok) throw new Error("Failed to save");
              setPublicationsData(updatedData);
            }}
            isAuthenticated={authenticated}
            />
          )}
          {!isDataLoaded && (
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              {publicationsData?.description || "Recent publications in electrocatalysts, fuel cells, water electrolysis, and energy materials."}
            <br />
              <span className="text-sm text-gray-500">
                {publicationsData?.descriptionKo || "전기촉매, 연료전지, 수전해, 에너지 소재 분야의 최근 논문입니다."}
            </span>
          </p>
          )}
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
                        <span className="font-bold text-gray-700">{getJournalDisplayName(pub.journal) || pub.journal}</span> ({pub.year})
                      </p>
                      {pub.status === "submitted" && (
                        <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                          Submitted
                        </span>
                      )}
                    </div>
                    {pub.if && (
                      <p className="text-xs text-gray-500 mb-2">
                        IF: {pub.if} {pub.jcrRanking && `(JCR: ${pub.jcrRanking.endsWith("%") ? pub.jcrRanking : pub.jcrRanking + "%"})`}
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
          <Link
            href="/achievements/journals"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            View All Publications →
          </Link>
        </div>
      </div>
    </section>
  );
}
