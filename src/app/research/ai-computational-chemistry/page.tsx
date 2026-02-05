"use client";

import { useState, useEffect, useMemo } from "react";
import EditableContent from "@/components/EditableContent";
import { useAuth } from "@/hooks/useAuth";
import { getApiBase } from "@/lib/apiBase";

export default function AIComputationalChemistryPage() {
  const { authenticated } = useAuth();
  const [pageData, setPageData] = useState({
    title: "AI & Computational Chemistry",
    titleKo: "AI 및 계산 화학",
    description: "Machine learning and computational methods for materials design and discovery.",
    descriptionKo: "소재 설계 및 발견을 위한 머신러닝 및 계산 방법론.",
    researchTopics: [
      {
        title: "AI-Driven Interatomic Potentials",
        titleKo: "AI 기반 원자간 포텐셜",
        description: "We leverage machine learning to develop accurate interatomic potentials for materials simulation. Our neural network potentials enable quantum-accuracy simulations at fraction of computational cost.",
        descriptionKo: "머신러닝을 활용하여 정확한 원자간 포텐셜을 개발합니다. 신경망 포텐셜을 통해 계산 비용의 일부로 양자 정확도 시뮬레이션을 가능하게 합니다.",
        icon: "🤖",
      },
      {
        title: "Multiscale Modeling",
        titleKo: "멀티스케일 모델링",
        description: "Our multiscale modeling approach bridges quantum mechanics to continuum scales, enabling predictive design of energy materials from atomic to device level.",
        descriptionKo: "양자역학부터 연속체 스케일까지 연결하는 멀티스케일 모델링을 통해 원자 수준부터 장치 수준까지 에너지 소재의 예측 설계를 가능하게 합니다.",
        icon: "🔬",
      },
      {
        title: "High-Throughput Screening",
        titleKo: "고속 스크리닝",
        description: "Using machine learning and DFT calculations, we screen thousands of materials to identify optimal candidates for energy applications.",
        descriptionKo: "머신러닝과 DFT 계산을 활용하여 에너지 응용을 위한 최적의 후보 소재를 식별하기 위해 수천 개의 소재를 스크리닝합니다.",
        icon: "⚙️",
      },
    ],
  });
  const [isDataLoaded, setIsDataLoaded] = useState(false); // 데이터 로드 완료 여부

  const loadData = async () => {
    try {
      const res = await fetch(`${getApiBase()}/api/content`);
      const data = await res.json();
      if (data.aiComputationalChemistry) {
        try {
          const parsed = JSON.parse(data.aiComputationalChemistry);
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
          console.error("Failed to parse AI computational chemistry data", e);
          setIsDataLoaded(true); // 에러가 발생해도 로드 완료로 표시
        }
      } else {
        setIsDataLoaded(true); // 데이터가 없어도 로드 완료로 표시
      }
    } catch (error) {
      console.error("Failed to load AI computational chemistry data", error);
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
      body: JSON.stringify({ aiComputationalChemistry: JSON.stringify(updatedData) }),
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
      body: JSON.stringify({ aiComputationalChemistry: JSON.stringify(updatedData) }),
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
    const title = pageData?.title?.trim() || "AI & Computational Chemistry";
    const titleKo = pageData?.titleKo?.trim() || "AI 및 계산 화학";
    return `<h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">${title}<span class="block text-3xl md:text-4xl text-gray-600 font-normal mt-2">${titleKo}</span></h1>`;
  }, [pageData?.title, pageData?.titleKo]);

  // descriptionDefaultValue를 useMemo로 메모이제이션하여 안정적인 참조 유지
  const descriptionDefaultValue = useMemo(() => {
    const description = pageData?.description?.trim() || "Machine learning and computational methods for materials design and discovery.";
    const descriptionKo = pageData?.descriptionKo?.trim() || "소재 설계 및 발견을 위한 머신러닝 및 계산 방법론.";
    return `<p class="text-lg text-gray-600 max-w-2xl mx-auto">${description}<br /><span class="text-base text-gray-500">${descriptionKo}</span></p>`;
  }, [pageData?.description, pageData?.descriptionKo]);

  return (
    <div className="flex flex-col">
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            {isDataLoaded && (
              <EditableContent
                contentKey="ai-computational-chemistry-title"
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
                        body: JSON.stringify({ aiComputationalChemistry: JSON.stringify(updatedData) }),
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
                contentKey="ai-computational-chemistry-description"
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
                      // span.text-base.text-gray-500 또는 일반 span 찾기
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
                      body: JSON.stringify({ aiComputationalChemistry: JSON.stringify(updatedData) }),
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
                      contentKey={`ai-computational-topic-${index}-icon`}
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
                    contentKey={`ai-computational-topic-${index}-title`}
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
                    contentKey={`ai-computational-topic-${index}-titleKo`}
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
                    contentKey={`ai-computational-topic-${index}-description`}
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
                    contentKey={`ai-computational-topic-${index}-descriptionKo`}
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
