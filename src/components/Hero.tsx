"use client";

import { useState, useEffect } from "react";
import EditableContent from "./EditableContent";
import { useAuth } from "@/hooks/useAuth";

export default function Hero() {
  const { authenticated } = useAuth();
  const [labName, setLabName] = useState("<h1 class=\"text-4xl md:text-6xl font-bold text-gray-900 mb-4\">AI & Green Energy Material Lab.</h1><p class=\"text-2xl md:text-3xl text-gray-700 font-semibold mb-2\">인공지능 그린에너지 소재 연구실</p><p class=\"text-base md:text-lg text-gray-600\">Pukyong National University<span class=\"block text-sm text-gray-500 mt-1\">부경대학교 나노융합공학과</span></p>");
  const [researchDesc, setResearchDesc] = useState("<p class=\"text-gray-700 leading-relaxed mb-2\">We develop high-performance and durable electrocatalysts and electrodes for electrochemical energy conversion systems including fuel cells, water electrolysis, and metal-air batteries.</p><p class=\"text-gray-600 leading-relaxed text-sm\">연료전지, 수전해, 금속-공기 전지 등 전기화학 에너지 전환 시스템을 위한 고활성·고내구 전기촉매 및 전극 개발 연구를 수행합니다.</p>");

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.hero) setLabName(data.hero);
        if (data.research) setResearchDesc(data.research);
      });
  }, []);

  const handleSave = async (key: string, content: string) => {
    const response = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [key]: content }),
    });
    if (!response.ok) throw new Error("Failed to save");
  };

  return (
    <section className="relative w-full bg-white py-16 md:py-24 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* 연구실 이름 - 가장 위에 강조 */}
          <div className="text-center mb-12">
            <EditableContent
              contentKey="hero"
              defaultValue={labName}
              onSave={(content) => handleSave("hero", content)}
              isAuthenticated={authenticated}
            />
          </div>
          
          {/* 연구 소개 */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                Research Interests
                <span className="block text-base text-gray-600 font-normal mt-1">
                  연구 분야
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center md:text-left">
                  <EditableContent
                    contentKey="research"
                    defaultValue={researchDesc}
                    onSave={(content) => handleSave("research", content)}
                    isAuthenticated={authenticated}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

