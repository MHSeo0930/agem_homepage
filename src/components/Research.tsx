"use client";

import { useState, useEffect } from "react";
import EditableContent from "./EditableContent";
import { useAuth } from "@/hooks/useAuth";

export default function Research() {
  const { authenticated } = useAuth();
  const [researchData, setResearchData] = useState({
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

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.research) {
          try {
            const parsed = JSON.parse(data.research);
            setResearchData(parsed);
          } catch (e) {
            console.error("Failed to parse research data");
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (field: string, value: string) => {
    const updatedData = { ...researchData, [field]: value };
    setResearchData(updatedData);
    
    const response = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ research: JSON.stringify(updatedData) }),
    });
    if (!response.ok) throw new Error("Failed to save");
  };

  const handleCategorySave = async (index: number, field: string, value: string) => {
    const updatedCategories = [...researchData.categories];
    updatedCategories[index] = { ...updatedCategories[index], [field]: value };
    const updatedData = { ...researchData, categories: updatedCategories };
    setResearchData(updatedData);
    
    const response = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ research: JSON.stringify(updatedData) }),
    });
    if (!response.ok) throw new Error("Failed to save");
  };

  return (
    <section id="research" className="py-16 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <EditableContent
            contentKey="research-title"
            defaultValue={`<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">${researchData?.title || "Research"}<span class="block text-2xl md:text-3xl text-gray-600 font-normal mt-2">${researchData?.titleKo || "연구 분야"}</span></h2>`}
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
            contentKey="research-description"
            defaultValue={`<p class="text-base text-gray-600 max-w-2xl mx-auto">${researchData?.description || "We develop high-performance and durable electrocatalysts and electrodes for electrochemical energy conversion systems including fuel cells, water electrolysis, and metal-air batteries."}<br /><span class="text-sm text-gray-500">${researchData?.descriptionKo || "연료전지, 수전해, 금속-공기 전지 등 전기화학 에너지 전환 시스템을 위한 고활성·고내구 전기촉매 및 전극 개발 연구를 수행합니다."}</span></p>`}
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

