"use client";

import { useState, useEffect } from "react";
import EditableContent from "./EditableContent";
import { useAuth } from "@/hooks/useAuth";

export default function Hero() {
  const { authenticated } = useAuth();
  const [labName, setLabName] = useState("<h1 class=\"text-4xl md:text-6xl font-bold text-gray-900 mb-4\">AI & Green Energy Material Lab.</h1><p class=\"text-2xl md:text-3xl text-gray-700 font-semibold mb-2\">인공지능 그린에너지 소재 연구실</p><p class=\"text-base md:text-lg text-gray-600\">Pukyong National University<span class=\"block text-sm text-gray-500 mt-1\">부경대학교 나노융합공학과</span></p>");

  const loadData = async () => {
    try {
      const res = await fetch("/api/content");
      const data = await res.json();
      if (data.hero) setLabName(data.hero);
    } catch (error) {
      console.error("Failed to load hero data", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (key: string, content: string) => {
    // 먼저 상태를 업데이트하여 UI에 즉시 반영
    const previousLabName = labName;
    if (key === "hero") {
      setLabName(content);
    }
    
    const response = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [key]: content }),
    });
    if (!response.ok) {
      // 실패 시 이전 상태로 복원
      setLabName(previousLabName);
      throw new Error("Failed to save");
    }
    
    // 저장 후 데이터 다시 로드하여 서버와 동기화
    // 약간의 지연을 두어 EditableContent가 먼저 업데이트되도록 함
    setTimeout(async () => {
      await loadData();
    }, 50);
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
          
        </div>
      </div>
    </section>
  );
}




