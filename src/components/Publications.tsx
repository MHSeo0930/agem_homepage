"use client";

import { useState, useEffect, useMemo } from "react";
import { recentPublications, publications } from "@/data/publications";
import EditableContent from "./EditableContent";
import { useAuth } from "@/hooks/useAuth";

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
  const [allPublications] = useState(publications);
  const [isDataLoaded, setIsDataLoaded] = useState(false); // 데이터 로드 완료 여부

  const loadData = async () => {
    try {
      const res = await fetch("/api/content");
      const data = await res.json();
      if (data.publications) {
        try {
          const parsed = JSON.parse(data.publications);
          
          // 서버에서 가져온 데이터로 업데이트
          // 빈 문자열이나 undefined인 필드는 이전 값을 유지
          // 서버에 빈 문자열이 저장되어 있으면 현재 상태를 유지 (덮어쓰지 않음)
          setPublicationsData(prev => {
            // 서버에서 가져온 값이 빈 문자열이면 현재 상태 유지
            const serverDescriptionKo = parsed.descriptionKo && parsed.descriptionKo.trim();
            const serverTitle = parsed.title && parsed.title.trim();
            const serverTitleKo = parsed.titleKo && parsed.titleKo.trim();
            const serverDescription = parsed.description && parsed.description.trim();
            
            return {
              ...prev,
              ...parsed,
              // 서버 값이 빈 문자열이면 현재 상태 유지, 아니면 서버 값 사용
              title: serverTitle ? serverTitle : prev.title,
              titleKo: serverTitleKo ? serverTitleKo : prev.titleKo,
              description: serverDescription ? serverDescription : prev.description,
              descriptionKo: serverDescriptionKo ? serverDescriptionKo : prev.descriptionKo,
              selectedNumbers: parsed.selectedNumbers || prev.selectedNumbers,
            };
          });
          setIsDataLoaded(true); // 데이터 로드 완료
        } catch (e) {
          console.error("Failed to parse publications data", e);
          setIsDataLoaded(true); // 에러가 발생해도 로드 완료로 표시
        }
      } else {
        setIsDataLoaded(true); // 데이터가 없어도 로드 완료로 표시
      }
    } catch (error) {
      console.error("Failed to load publications data", error);
      setIsDataLoaded(true); // 에러가 발생해도 로드 완료로 표시
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (field: string, value: any) => {
    const updatedData = { ...publicationsData, [field]: value };
    
    // 먼저 상태를 업데이트하여 UI에 즉시 반영
    setPublicationsData(updatedData);
    
    const response = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

  // defaultValue를 useMemo로 메모이제이션하여 불필요한 재생성 방지
  const titleDefaultValue = useMemo(() => 
    `<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">${publicationsData?.title || "Selected Publications"}<span class="block text-2xl md:text-3xl text-gray-600 font-normal mt-2">${publicationsData?.titleKo || "주요 논문"}</span></h2>`,
    [publicationsData?.title, publicationsData?.titleKo]
  );
  
  const descriptionDefaultValue = useMemo(() => {
    // 빈 문자열도 체크하여 기본값 사용 방지
    const description = publicationsData?.description?.trim() || "Recent publications in electrocatalysts, fuel cells, water electrolysis, and energy materials.";
    const descriptionKo = publicationsData?.descriptionKo?.trim() || "전기촉매, 연료전지, 수전해, 에너지 소재 분야의 최근 논문입니다.";
    return `<p class="text-base text-gray-600 max-w-2xl mx-auto">${description}<br /><span class="text-sm text-gray-500">${descriptionKo}</span></p>`;
  }, [publicationsData?.description, publicationsData?.descriptionKo]);

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
              if (titleElement) {
                const titleText = titleElement.childNodes[0]?.textContent || "";
                const titleKoText = titleKoElement?.textContent || "";
                
                // 두 필드를 한 번에 저장
                const updatedData = { 
                  ...publicationsData, 
                  title: titleText.trim(),
                  titleKo: titleKoText.trim()
                };
                
                // API에 먼저 저장
                const response = await fetch("/api/content", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ publications: JSON.stringify(updatedData) }),
                });
                if (!response.ok) {
                  throw new Error("Failed to save");
                }
                
                // 저장 성공 후 상태 업데이트 (저장한 데이터로 즉시 반영)
                // loadData()를 호출하지 않음 - 저장한 데이터를 직접 사용하여 덮어쓰기 방지
                setPublicationsData(updatedData);
              }
            }}
            isAuthenticated={authenticated}
          />
          {isDataLoaded && (
            <EditableContent
              contentKey="publications-description"
              defaultValue={descriptionDefaultValue}
            onSave={async (content) => {
              try {
                console.log('[DEBUG] onSave 호출, content:', content);
                
                // 새로운 저장 로직: Quill에서 편집한 내용을 올바르게 추출
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = content;
                
                let descriptionText = "";
                let descriptionKoText = "";
                
                // 방법 1: 여러 p 태그가 있는 경우 (Quill이 줄바꿈을 p 태그로 변환)
                const pElements = tempDiv.querySelectorAll("p");
                console.log('[DEBUG] pElements 개수:', pElements.length);
                
                if (pElements.length >= 2) {
                  // 첫 번째 p: 영어
                  descriptionText = pElements[0].textContent || pElements[0].innerText || "";
                  // 나머지 p: 한국어 (합치기)
                  descriptionKoText = Array.from(pElements).slice(1)
                    .map(p => p.textContent || (p as HTMLElement).innerText || "")
                    .filter(text => text.trim().length > 0)
                    .join(" ");
                  console.log('[DEBUG] 여러 p 태그에서 추출:', { descriptionText, descriptionKoText });
                } else if (pElements.length === 1) {
                  // 하나의 p 태그 안에 span이 있는 경우 (기존 HTML 구조)
                  const pElement = pElements[0];
                  
                  // span 태그 찾기 (한국어)
                  let spanElement = pElement.querySelector("span.text-sm.text-gray-500") as HTMLElement;
                  if (!spanElement) {
                    spanElement = pElement.querySelector("span") as HTMLElement;
                  }
                  
                  if (spanElement) {
                    descriptionKoText = spanElement.textContent || spanElement.innerText || "";
                    // p 태그에서 span 제외한 텍스트 (영어)
                    const pClone = pElement.cloneNode(true) as HTMLElement;
                    const spanInP = pClone.querySelector("span");
                    if (spanInP) {
                      spanInP.remove();
                    }
                    const brTags = pClone.querySelectorAll("br");
                    brTags.forEach(br => br.remove());
                    descriptionText = pClone.textContent || pClone.innerText || "";
                    console.log('[DEBUG] p 태그 내 span에서 추출:', { descriptionText, descriptionKoText });
                  } else {
                    // span이 없으면 BR 태그로 분리
                    const pClone = pElement.cloneNode(true) as HTMLElement;
                    const brTags = pClone.querySelectorAll("br");
                    
                    if (brTags.length > 0) {
                      // BR 태그를 기준으로 분리
                      const parts = pClone.innerHTML.split(/<br\s*\/?>/i);
                      if (parts.length >= 2) {
                        const firstPart = document.createElement("div");
                        firstPart.innerHTML = parts[0];
                        descriptionText = firstPart.textContent || firstPart.innerText || "";
                        
                        const secondPart = document.createElement("div");
                        secondPart.innerHTML = parts.slice(1).join("<br>");
                        descriptionKoText = secondPart.textContent || secondPart.innerText || "";
                        console.log('[DEBUG] BR 태그로 분리:', { descriptionText, descriptionKoText });
                      } else {
                        descriptionText = pClone.textContent || pClone.innerText || "";
                      }
                    } else {
                      descriptionText = pClone.textContent || pClone.innerText || "";
                    }
                  }
                }
                
                // 방법 2: 전체 텍스트를 줄바꿈으로 분리 (위 방법들이 실패한 경우)
                if (!descriptionText || !descriptionKoText) {
                  console.log('[DEBUG] 방법 1 실패, 방법 2 시도');
                  const fullText = tempDiv.textContent || tempDiv.innerText || "";
                  console.log('[DEBUG] 전체 텍스트:', fullText);
                  
                  // 줄바꿈으로 분리 (연속된 빈 줄 제거)
                  const lines = fullText.split(/\n+/).map(line => line.trim()).filter(line => line.length > 0);
                  console.log('[DEBUG] 분리된 줄들:', lines);
                  
                  if (lines.length >= 2) {
                    descriptionText = descriptionText || lines[0];
                    descriptionKoText = descriptionKoText || lines.slice(1).join(" ");
                  } else if (lines.length === 1) {
                    descriptionText = descriptionText || lines[0];
                  }
                }
                
                console.log('[DEBUG] 최종 추출 결과:', {
                  description: descriptionText,
                  descriptionKo: descriptionKoText
                });
                
                // 최종 검증
                const updatedData = { 
                  ...publicationsData, 
                  description: descriptionText.trim(),
                  descriptionKo: descriptionKoText.trim()
                };
              
                // API에 먼저 저장
                const response = await fetch("/api/content", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ publications: JSON.stringify(updatedData) }),
                });
                
                if (!response.ok) {
                  const errorText = await response.text();
                  console.error("API 저장 실패:", errorText);
                  throw new Error("Failed to save");
                }
                
                // 저장 성공 후 상태 업데이트 (저장한 데이터로 즉시 반영)
                setPublicationsData(updatedData);
                
                console.log("저장 완료:", {
                  description: updatedData.description,
                  descriptionKo: updatedData.descriptionKo
                });
              } catch (error) {
                console.error("저장 중 오류 발생:", error);
                alert("저장 중 오류가 발생했습니다. 콘솔을 확인하세요.");
                throw error;
              }
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
