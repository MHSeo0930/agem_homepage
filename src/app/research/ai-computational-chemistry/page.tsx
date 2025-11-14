"use client";

import { useState, useEffect } from "react";
import EditableContent from "@/components/EditableContent";
import { useAuth } from "@/hooks/useAuth";

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

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.aiComputationalChemistry) {
          try {
            const parsed = JSON.parse(data.aiComputationalChemistry);
            setPageData(parsed);
          } catch (e) {
            console.error("Failed to parse AI computational chemistry data");
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (field: string, value: string) => {
    const updatedData = { ...pageData, [field]: value };
    setPageData(updatedData);
    
    const response = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aiComputationalChemistry: JSON.stringify(updatedData) }),
    });
    if (!response.ok) throw new Error("Failed to save");
  };

  const handleTopicSave = async (index: number, field: string, value: string) => {
    const updatedTopics = [...pageData.researchTopics];
    updatedTopics[index] = { ...updatedTopics[index], [field]: value };
    const updatedData = { ...pageData, researchTopics: updatedTopics };
    setPageData(updatedData);
    
    const response = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aiComputationalChemistry: JSON.stringify(updatedData) }),
    });
    if (!response.ok) throw new Error("Failed to save");
  };

  return (
    <div className="flex flex-col">
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <EditableContent
              contentKey="ai-computational-chemistry-title"
              defaultValue={`<h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">${pageData.title}<span class="block text-3xl md:text-4xl text-gray-600 font-normal mt-2">${pageData.titleKo}</span></h1>`}
              onSave={async (content) => {
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = content;
                const titleElement = tempDiv.querySelector("h1");
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
              contentKey="ai-computational-chemistry-description"
              defaultValue={`<p class="text-lg text-gray-600 max-w-2xl mx-auto">${pageData.description}<br /><span class="text-base text-gray-500">${pageData.descriptionKo}</span></p>`}
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
