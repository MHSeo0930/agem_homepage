"use client";

import { useState, useEffect, useMemo } from "react";
import EditableContent from "@/components/EditableContent";
import { useAuth } from "@/hooks/useAuth";
import { getApiBase } from "@/lib/apiBase";

export default function GreenEnergyMaterialsPage() {
  const { authenticated } = useAuth();
  const [pageData, setPageData] = useState({
    title: "Green Energy Materials",
    titleKo: "그린 에너지 소재",
    description: "Development of high-performance and durable electrocatalysts and electrodes for electrochemical energy conversion systems.",
    descriptionKo: "전기화학 에너지 전환 시스템을 위한 고활성·고내구 전기촉매 및 전극 개발 연구.",
    researchTopics: [
      {
        title: "Fuel Cells",
        titleKo: "연료전지",
        description: "Development of high-performance and durable electrocatalysts and electrodes for fuel cell applications. Research focuses on oxygen reduction reaction (ORR) and hydrogen oxidation reaction (HOR) catalysts.",
        descriptionKo: "연료전지 응용을 위한 고활성·고내구 전기촉매 및 전극 개발. 산소환원반응(ORR) 및 수소산화반응(HOR) 촉매 연구에 집중합니다.",
        icon: "⚡",
      },
      {
        title: "Water Electrolysis",
        titleKo: "수전해",
        description: "Development of advanced electrocatalysts for water electrolysis systems including anion exchange membrane (AEM) and proton exchange membrane (PEM) electrolyzers. Focus on hydrogen evolution reaction (HER) and oxygen evolution reaction (OER) catalysts.",
        descriptionKo: "음이온 교환막(AEM) 및 양이온 교환막(PEM) 전해조를 포함한 수전해 시스템용 고급 전기촉매 개발. 수소발생반응(HER) 및 산소발생반응(OER) 촉매에 집중합니다.",
        icon: "💧",
      },
      {
        title: "Metal-Air Batteries",
        titleKo: "금속-공기 전지",
        description: "Research on electrocatalysts and electrodes for metal-air battery systems. Development of bifunctional catalysts for both oxygen reduction and evolution reactions.",
        descriptionKo: "금속-공기 전지 시스템용 전기촉매 및 전극 연구. 산소환원 및 발생반응 모두에 대한 이기능성 촉매 개발.",
        icon: "🔋",
      },
    ],
  });
  const [isDataLoaded, setIsDataLoaded] = useState(false); // 데이터 로드 완료 여부

  const loadData = async () => {
    try {
      const res = await fetch(`${getApiBase()}/api/content`);
      const data = await res.json();
      if (data.greenEnergyMaterials) {
        try {
          const parsed = JSON.parse(data.greenEnergyMaterials);
          if (parsed && typeof parsed === 'object') {
            setPageData(prev => {
              // 서버에서 가져온 값이 빈 문자열이면 현재 상태 유지 (덮어쓰지 않음)
              const serverTitle = parsed.title && parsed.title.trim();
              const serverTitleKo = parsed.titleKo && parsed.titleKo.trim();
              const serverDescription = parsed.description && parsed.description.trim();
              const serverDescriptionKo = parsed.descriptionKo && parsed.descriptionKo.trim();
              
              return {
                ...prev,
                ...parsed,
                // 서버 값이 빈 문자열이면 현재 상태 유지, 아니면 서버 값 사용
                title: serverTitle ? serverTitle : prev.title,
                titleKo: serverTitleKo ? serverTitleKo : prev.titleKo,
                description: serverDescription ? serverDescription : prev.description,
                descriptionKo: serverDescriptionKo ? serverDescriptionKo : prev.descriptionKo,
                researchTopics: parsed.researchTopics || prev.researchTopics,
              };
            });
          }
          setIsDataLoaded(true); // 데이터 로드 완료
        } catch (e) {
          console.error("Failed to parse green energy materials data", e);
          setIsDataLoaded(true); // 에러가 발생해도 로드 완료로 표시
        }
      } else {
        setIsDataLoaded(true); // 데이터가 없어도 로드 완료로 표시
      }
    } catch (error) {
      console.error("Failed to load green energy materials data", error);
      setIsDataLoaded(true); // 에러가 발생해도 로드 완료로 표시
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (field: string, value: string) => {
    const updatedData = { ...pageData, [field]: value };
    
    // API에 먼저 저장
    const response = await fetch(`${getApiBase()}/api/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ greenEnergyMaterials: JSON.stringify(updatedData) }),
    });
    if (!response.ok) {
      throw new Error("Failed to save");
    }
    
    // 저장 성공 후 상태 업데이트 (저장한 데이터로 즉시 반영)
    // loadData()를 호출하지 않음 - 저장한 데이터를 직접 사용하여 덮어쓰기 방지
    setPageData(updatedData);
  };

  const handleTopicSave = async (index: number, field: string, value: string) => {
    const updatedTopics = [...pageData.researchTopics];
    updatedTopics[index] = { ...updatedTopics[index], [field]: value };
    const updatedData = { ...pageData, researchTopics: updatedTopics };
    
    // API에 먼저 저장
    const response = await fetch(`${getApiBase()}/api/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ greenEnergyMaterials: JSON.stringify(updatedData) }),
    });
    if (!response.ok) {
      throw new Error("Failed to save");
    }
    
    // 저장 성공 후 상태 업데이트 (저장한 데이터로 즉시 반영)
    // loadData()를 호출하지 않음 - 저장한 데이터를 직접 사용하여 덮어쓰기 방지
    setPageData(updatedData);
  };

  // titleDefaultValue를 useMemo로 메모이제이션하여 안정적인 참조 유지
  const titleDefaultValue = useMemo(() => {
    const title = pageData?.title?.trim() || "Green Energy Materials";
    const titleKo = pageData?.titleKo?.trim() || "그린 에너지 소재";
    return `<h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">${title}<span class="block text-3xl md:text-4xl text-gray-600 font-normal mt-2">${titleKo}</span></h1>`;
  }, [pageData?.title, pageData?.titleKo]);

  // descriptionDefaultValue를 useMemo로 메모이제이션하여 안정적인 참조 유지
  const descriptionDefaultValue = useMemo(() => {
    const description = pageData?.description?.trim() || "Development of high-performance and durable electrocatalysts and electrodes for electrochemical energy conversion systems.";
    const descriptionKo = pageData?.descriptionKo?.trim() || "전기화학 에너지 전환 시스템을 위한 고활성·고내구 전기촉매 및 전극 개발 연구.";
    return `<p class="text-lg text-gray-600 max-w-2xl mx-auto">${description}<br /><span class="text-base text-gray-500">${descriptionKo}</span></p>`;
  }, [pageData?.description, pageData?.descriptionKo]);

  return (
    <div className="flex flex-col">
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            {isDataLoaded && (
              <EditableContent
                contentKey="green-energy-materials-title"
                defaultValue={titleDefaultValue}
                onSave={async (content) => {
                  try {
                    const tempDiv = document.createElement("div");
                    tempDiv.innerHTML = content;
                    const titleElement = tempDiv.querySelector("h1");
                    const titleKoElement = tempDiv.querySelector("span");
                    if (titleElement) {
                      const titleText = titleElement.childNodes[0]?.textContent || "";
                      const titleKoText = titleKoElement?.textContent || "";
                      
                      // 두 필드를 한 번에 저장
                      const updatedData = { 
                        ...pageData, 
                        title: titleText.trim(),
                        titleKo: titleKoText.trim()
                      };
                      
                      // API에 먼저 저장
                      const response = await fetch(`${getApiBase()}/api/content`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ greenEnergyMaterials: JSON.stringify(updatedData) }),
                      });
                      
                      if (!response.ok) {
                        throw new Error("Failed to save");
                      }
                      
                      // 저장 성공 후 상태 업데이트 (저장한 데이터로 즉시 반영)
                      // loadData()를 호출하지 않음 - 저장한 데이터를 직접 사용하여 덮어쓰기 방지
                      setPageData(updatedData);
                    }
                  } catch (error) {
                    console.error("Error saving title:", error);
                    alert("저장 중 오류가 발생했습니다.");
                  }
                }}
                isAuthenticated={authenticated}
              />
            )}
            {isDataLoaded && (
              <EditableContent
                contentKey="green-energy-materials-description"
                defaultValue={descriptionDefaultValue}
                onSave={async (content) => {
                  try {
                    const tempDiv = document.createElement("div");
                    tempDiv.innerHTML = content;
                    
                    let descriptionText = "";
                    let descriptionKoText = "";
                    
                    // 방법 1: p 태그들을 직접 파싱
                    const pElements = tempDiv.querySelectorAll("p");
                    console.log('[DEBUG] p 태그 개수:', pElements.length);
                    
                    if (pElements.length > 1) {
                      // 여러 p 태그가 있으면 첫 번째는 영어, 나머지는 한국어
                      descriptionText = pElements[0].textContent || pElements[0].innerText || "";
                      descriptionKoText = Array.from(pElements).slice(1).map(p => p.textContent || p.innerText || "").join(" ").trim();
                      console.log('[DEBUG] 여러 p 태그에서 추출:', { descriptionText, descriptionKoText });
                    } else if (pElements.length === 1) {
                      const pElement = pElements[0];
                      // span.text-sm.text-gray-500 또는 일반 span 찾기
                      const spanElement = pElement.querySelector("span.text-base.text-gray-500") || pElement.querySelector("span");
                      
                      if (spanElement) {
                        // span에서 한국어 추출
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
                      ...pageData, 
                      description: descriptionText.trim(),
                      descriptionKo: descriptionKoText.trim()
                    };
                  
                    // API에 먼저 저장
                    const response = await fetch(`${getApiBase()}/api/content`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ greenEnergyMaterials: JSON.stringify(updatedData) }),
                    });
                    
                    if (!response.ok) {
                      const errorText = await response.text();
                      console.error("API 저장 실패:", errorText);
                      throw new Error("Failed to save");
                    }
                    
                    // 저장 성공 후 상태 업데이트 (저장한 데이터로 즉시 반영)
                    // loadData()를 호출하지 않음 - 저장한 데이터를 직접 사용하여 덮어쓰기 방지
                    setPageData(updatedData);
                    
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
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pageData.researchTopics.map((topic, index) => (
                <div
                  key={index}
                  className="p-8 rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
                >
                  <div className="text-5xl mb-6">
                    <EditableContent
                      contentKey={`green-energy-topic-${index}-icon`}
                      defaultValue={`<span>${topic.icon}</span>`}
                      onSave={async (content) => {
                        const tempDiv = document.createElement("div");
                        tempDiv.innerHTML = content;
                        const text = tempDiv.textContent || tempDiv.innerText || "";
                        await handleTopicSave(index, "icon", text);
                      }}
                      isAuthenticated={authenticated}
                    />
                  </div>
                  <EditableContent
                    contentKey={`green-energy-topic-${index}-title`}
                    defaultValue={`<h3 class="text-xl font-semibold text-gray-900 mb-3">${topic.title}</h3>`}
                    onSave={async (content) => {
                      const tempDiv = document.createElement("div");
                      tempDiv.innerHTML = content;
                      const text = tempDiv.textContent || tempDiv.innerText || "";
                      await handleTopicSave(index, "title", text);
                    }}
                    isAuthenticated={authenticated}
                  />
                  <EditableContent
                    contentKey={`green-energy-topic-${index}-titleKo`}
                    defaultValue={`<p class="text-sm text-gray-500 mb-4 font-medium">${topic.titleKo}</p>`}
                    onSave={async (content) => {
                      const tempDiv = document.createElement("div");
                      tempDiv.innerHTML = content;
                      const text = tempDiv.textContent || tempDiv.innerText || "";
                      await handleTopicSave(index, "titleKo", text);
                    }}
                    isAuthenticated={authenticated}
                  />
                  <EditableContent
                    contentKey={`green-energy-topic-${index}-description`}
                    defaultValue={`<p class="text-gray-700 mb-3 leading-relaxed">${topic.description}</p>`}
                    onSave={async (content) => {
                      const tempDiv = document.createElement("div");
                      tempDiv.innerHTML = content;
                      const text = tempDiv.textContent || tempDiv.innerText || "";
                      await handleTopicSave(index, "description", text);
                    }}
                    isAuthenticated={authenticated}
                  />
                  <EditableContent
                    contentKey={`green-energy-topic-${index}-descriptionKo`}
                    defaultValue={`<p class="text-sm text-gray-600 leading-relaxed">${topic.descriptionKo}</p>`}
                    onSave={async (content) => {
                      const tempDiv = document.createElement("div");
                      tempDiv.innerHTML = content;
                      const text = tempDiv.textContent || tempDiv.innerText || "";
                      await handleTopicSave(index, "descriptionKo", text);
                    }}
                    isAuthenticated={authenticated}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
