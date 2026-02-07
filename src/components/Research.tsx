"use client";

import { useState, useEffect } from "react";
import EditableContent from "./EditableContent";
import { useAuth } from "@/hooks/useAuth";
import { getApiBase } from "@/lib/apiBase";

export default function Research() {
  const { authenticated } = useAuth();
  const [researchData, setResearchData] = useState<{
    title: string;
    titleKo: string;
    description: string;
    descriptionKo: string;
    titleHtml?: string;
    descriptionHtml?: string;
    categories: Array<{ title: string; titleKo: string; description: string; descriptionKo: string; link: string; icon: string }>;
  }>({
    title: "Research",
    titleKo: "연구 분야",
    description: "We develop high-performance and durable electrocatalysts and electrodes for electrochemical energy conversion systems including fuel cells, water electrolysis, and metal-air batteries.",
    descriptionKo: "연료전지, 수전해, 금속-공기 전지 등 전기화학 에너지 전환 시스템을 위한 고활성·고내구 전기촉매 및 전극 개발 연구를 수행합니다.",
    categories: [
      {
        title: "Green Energy Materials",
        titleKo: "그린 에너지 소재",
        description: "Research on sustainable energy materials for hydrogen production, storage, and conversion.",
        descriptionKo: "수소 생산, 저장 및 변환을 위한 지속가능한 에너지 소재 연구.",
        link: "/research/green-energy-materials",
      icon: "⚡",
    },
    {
        title: "AI & Computational Chemistry",
        titleKo: "AI 및 계산 화학",
        description: "Machine learning and computational methods for materials design and discovery.",
        descriptionKo: "소재 설계 및 발견을 위한 머신러닝 및 계산 방법론.",
        link: "/research/ai-computational-chemistry",
      icon: "🤖",
    },
    ],
  });

  const loadData = async () => {
    try {
      const res = await fetch(`${getApiBase()}/api/content`);
      const data = await res.json();
      if (data.research) {
        try {
          const parsed = JSON.parse(data.research);
          setResearchData(prev => ({ ...prev, ...parsed }));
        } catch (e) {
          console.error("Failed to parse research data");
        }
      }
    } catch (error) {
      console.error("Failed to load research data", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (field: string, value: string) => {
    const updatedData = { ...researchData, [field]: value };
    
    // 먼저 상태를 업데이트하여 UI에 즉시 반영
    setResearchData(updatedData);
    
    const response = await fetch(`${getApiBase()}/api/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ research: JSON.stringify(updatedData) }),
    });
    if (!response.ok) {
      // 실패 시 이전 상태로 복원
      setResearchData(researchData);
      throw new Error("Failed to save");
    }
    
    // 저장 후 데이터 다시 로드하여 서버와 동기화
    // 약간의 지연을 두어 EditableContent가 먼저 업데이트되도록 함
    setTimeout(async () => {
      await loadData();
    }, 50);
  };

  const handleCategorySave = async (index: number, field: string, value: string) => {
    const updatedCategories = [...researchData.categories];
    updatedCategories[index] = { ...updatedCategories[index], [field]: value };
    const updatedData = { ...researchData, categories: updatedCategories };
    
    // 먼저 상태를 업데이트하여 UI에 즉시 반영
    setResearchData(updatedData);
    
    const response = await fetch(`${getApiBase()}/api/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ research: JSON.stringify(updatedData) }),
    });
    if (!response.ok) {
      // 실패 시 이전 상태로 복원
      setResearchData(researchData);
      throw new Error("Failed to save");
    }
    
    // 저장 후 데이터 다시 로드하여 서버와 동기화
    // 약간의 지연을 두어 EditableContent가 먼저 업데이트되도록 함
    setTimeout(async () => {
      await loadData();
    }, 50);
  };

  return (
    <section id="research" className="py-16 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <EditableContent
            contentKey="research-title"
            defaultValue={researchData?.titleHtml?.trim() ? (() => {
              let h = researchData.titleHtml.replace(/<h2(\s[^>]*)?>/i, '<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">');
              const spanRegex = /<span(\s[^>]*)?>/gi;
              let lastSpan: RegExpExecArray | null = null;
              let m: RegExpExecArray | null;
              while ((m = spanRegex.exec(h)) !== null) lastSpan = m;
              if (lastSpan) h = h.slice(0, lastSpan.index) + '<span class="block text-2xl md:text-3xl text-gray-600 font-normal mt-2">' + h.slice(lastSpan.index + lastSpan[0].length);
              return h;
            })() : `<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">${researchData?.title || "Research"}<span class="block text-2xl md:text-3xl text-gray-600 font-normal mt-2">${researchData?.titleKo || "연구 분야"}</span></h2>`}
            onSave={async (content) => {
              let contentWithClasses = content.replace(/<h2(\s[^>]*)?>/i, '<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">');
              const spanRegex = /<span(\s[^>]*)?>/gi;
              let lastSpan: RegExpExecArray | null = null;
              let m: RegExpExecArray | null;
              while ((m = spanRegex.exec(contentWithClasses)) !== null) lastSpan = m;
              if (lastSpan) contentWithClasses = contentWithClasses.slice(0, lastSpan.index) + '<span class="block text-2xl md:text-3xl text-gray-600 font-normal mt-2">' + contentWithClasses.slice(lastSpan.index + lastSpan[0].length);
              const tempDiv = document.createElement("div");
              tempDiv.innerHTML = contentWithClasses;
              const titleElement = tempDiv.querySelector("h2");
              const titleKoElement = tempDiv.querySelector("span");
              const titleText = (titleElement?.childNodes[0]?.textContent ?? researchData.title)?.trim() || researchData.title;
              const titleKoText = (titleKoElement?.textContent ?? researchData.titleKo)?.trim() || researchData.titleKo;
              const updatedData = { ...researchData, titleHtml: contentWithClasses, title: titleText, titleKo: titleKoText };
              setResearchData(updatedData);
              const response = await fetch(`${getApiBase()}/api/content`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ research: JSON.stringify(updatedData) }),
              });
              if (!response.ok) {
                setResearchData(researchData);
                throw new Error("Failed to save");
              }
            }}
            isAuthenticated={authenticated}
          />
          <EditableContent
            contentKey="research-description"
            defaultValue={researchData?.descriptionHtml?.trim() ? researchData.descriptionHtml : `<p class="text-base text-gray-600 max-w-2xl mx-auto">${researchData?.description || "We develop high-performance and durable electrocatalysts and electrodes for electrochemical energy conversion systems including fuel cells, water electrolysis, and metal-air batteries."}<br /><span class="text-sm text-gray-500">${researchData?.descriptionKo || "연료전지, 수전해, 금속-공기 전지 등 전기화학 에너지 전환 시스템을 위한 고활성·고내구 전기촉매 및 전극 개발 연구를 수행합니다."}</span></p>`}
            onSave={async (content) => {
              const tempDiv = document.createElement("div");
              tempDiv.innerHTML = content;
              const pEl = tempDiv.querySelector("p");
              const spanEl = tempDiv.querySelector("span");
              let descriptionText = (pEl?.textContent ?? researchData.description)?.trim() || researchData.description;
              if (pEl && spanEl) {
                const clone = pEl.cloneNode(true) as HTMLElement;
                clone.querySelector("span")?.remove();
                clone.querySelectorAll("br").forEach(b => b.remove());
                descriptionText = (clone.textContent || "").trim() || researchData.description;
              }
              const descriptionKoText = (spanEl?.textContent ?? researchData.descriptionKo)?.trim() || researchData.descriptionKo;
              const updatedData = { ...researchData, descriptionHtml: content, description: descriptionText, descriptionKo: descriptionKoText };
              setResearchData(updatedData);
              const response = await fetch(`${getApiBase()}/api/content`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ research: JSON.stringify(updatedData) }),
              });
              if (!response.ok) {
                setResearchData(researchData);
                throw new Error("Failed to save");
              }
            }}
            isAuthenticated={authenticated}
          />
        </div>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(researchData?.categories || []).map((category, index) => (
            <div
              key={index}
                className="p-6 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 bg-white group"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl flex-shrink-0">
                    <EditableContent
                      contentKey={`research-category-${index}-icon`}
                      defaultValue={`<span>${category?.icon || "⚡"}</span>`}
                      onSave={async (content) => {
                        const tempDiv = document.createElement("div");
                        tempDiv.innerHTML = content;
                        const text = tempDiv.textContent || tempDiv.innerText || "";
                        await handleCategorySave(index, "icon", text);
                      }}
                      isAuthenticated={authenticated}
                    />
                  </div>
                  <div className="flex-1">
                    <EditableContent
                      contentKey={`research-category-${index}-title`}
                      defaultValue={`<h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">${category?.title || ""}</h3>`}
                      onSave={async (content) => {
                        const tempDiv = document.createElement("div");
                        tempDiv.innerHTML = content;
                        const text = tempDiv.textContent || tempDiv.innerText || "";
                        await handleCategorySave(index, "title", text);
                      }}
                      isAuthenticated={authenticated}
                    />
                    <EditableContent
                      contentKey={`research-category-${index}-titleKo`}
                      defaultValue={`<p class="text-sm text-gray-500 mb-3 font-medium">${category?.titleKo || ""}</p>`}
                      onSave={async (content) => {
                        const tempDiv = document.createElement("div");
                        tempDiv.innerHTML = content;
                        const text = tempDiv.textContent || tempDiv.innerText || "";
                        await handleCategorySave(index, "titleKo", text);
                      }}
                      isAuthenticated={authenticated}
                    />
                    <EditableContent
                      contentKey={`research-category-${index}-description`}
                      defaultValue={`<p class="text-sm text-gray-700 mb-2 leading-relaxed">${category?.description || ""}</p>`}
                      onSave={async (content) => {
                        const tempDiv = document.createElement("div");
                        tempDiv.innerHTML = content;
                        const text = tempDiv.textContent || tempDiv.innerText || "";
                        await handleCategorySave(index, "description", text);
                      }}
                      isAuthenticated={authenticated}
                    />
                    <EditableContent
                      contentKey={`research-category-${index}-descriptionKo`}
                      defaultValue={`<p class="text-xs text-gray-600 leading-relaxed mb-3">${category?.descriptionKo || ""}</p>`}
                      onSave={async (content) => {
                        const tempDiv = document.createElement("div");
                        tempDiv.innerHTML = content;
                        const text = tempDiv.textContent || tempDiv.innerText || "";
                        await handleCategorySave(index, "descriptionKo", text);
                      }}
                      isAuthenticated={authenticated}
                    />
                    <div className="mt-2">
                      <a 
                        href={category?.link || "#"} 
                        className="text-blue-600 font-medium text-sm group-hover:underline inline-flex items-center"
                        onClick={(e) => {
                          if (authenticated) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <EditableContent
                          contentKey={`research-category-${index}-link-text`}
                          defaultValue={`<span>Learn more →</span>`}
                          onSave={async (content) => {
                            // 링크 텍스트만 편집 가능
                          }}
                          isAuthenticated={authenticated}
                        />
                      </a>
                      {authenticated && (
                        <div className="mt-2">
                          <EditableContent
                            contentKey={`research-category-${index}-link-url`}
                            defaultValue={`<span class="text-xs text-gray-500">링크: ${category?.link || ""}</span>`}
                            onSave={async (content) => {
                              const tempDiv = document.createElement("div");
                              tempDiv.innerHTML = content;
                              const text = tempDiv.textContent || tempDiv.innerText || "";
                              const linkMatch = text.match(/링크:\s*(.+)/);
                              if (linkMatch && linkMatch[1]) {
                                await handleCategorySave(index, "link", linkMatch[1].trim());
                              }
                            }}
                            isAuthenticated={authenticated}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}




