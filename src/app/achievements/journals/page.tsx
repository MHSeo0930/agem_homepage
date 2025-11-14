"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import EditableContent from "@/components/EditableContent";
import { publications as initialPublications } from "@/data/publications";

export default function JournalsPage() {
  const { authenticated } = useAuth();
  const [publications, setPublications] = useState(initialPublications);

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.publications) {
          try {
            const parsed = JSON.parse(data.publications);
            setPublications(parsed);
          } catch (e) {
            console.error("Failed to parse publications data");
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (pubNumber: number, field: string, value: string) => {
    const updatedPublications = publications.map((pub) =>
      pub.number === pubNumber ? { ...pub, [field]: value } : pub
    );
    setPublications(updatedPublications);
    
    const response = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publications: JSON.stringify(updatedPublications) }),
    });
    if (!response.ok) throw new Error("Failed to save");
  };

  const handleAddPublication = async () => {
    const maxNumber = publications.length > 0 ? Math.max(...publications.map(p => p.number)) : 0;
    const newPublication = {
      number: maxNumber + 1,
      role: undefined,
      authors: "Authors",
      title: "New Publication Title",
      journal: "Journal Name",
      year: new Date().getFullYear(),
      status: undefined,
      if: undefined,
      jcrRanking: undefined,
      specialNote: undefined,
    };
    const updatedPublications = [newPublication, ...publications].sort((a, b) => b.number - a.number);
    setPublications(updatedPublications);
    
    const response = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publications: JSON.stringify(updatedPublications) }),
    });
    if (!response.ok) throw new Error("Failed to add publication");
  };

  const handleDeletePublication = async (pubNumber: number) => {
    if (!confirm("이 논문을 삭제하시겠습니까?")) return;
    
    const updatedPublications = publications.filter((pub) => pub.number !== pubNumber);
    setPublications(updatedPublications);
    
    const response = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publications: JSON.stringify(updatedPublications) }),
    });
    if (!response.ok) throw new Error("Failed to delete publication");
  };

  return (
    <div className="flex flex-col">
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Journal Publications
              <span className="block text-3xl md:text-4xl text-gray-600 font-normal mt-2">
                학술지 논문
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Published journal articles in electrocatalysts, fuel cells, water electrolysis, and energy materials.
              <br />
              <span className="text-base text-gray-500">
                전기촉매, 연료전지, 수전해, 에너지 소재 분야의 학술지 논문입니다.
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Total: {publications.length} publications
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {authenticated && (
              <div className="mb-6 flex justify-end">
                <button
                  onClick={handleAddPublication}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  + 논문 추가
                </button>
              </div>
            )}
            <div className="space-y-6">
              {publications.sort((a, b) => b.number - a.number).map((pub) => (
                <div
                  key={pub.number}
                  className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 relative group"
                >
                  {authenticated && (
                    <button
                      onClick={() => handleDeletePublication(pub.number)}
                      className="absolute top-2 right-2 z-20 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                      title="논문 삭제"
                    >
                      ✕
                    </button>
                  )}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-blue-600">#{pub.number}</span>
                      {pub.role && (
                        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                          {pub.role}
                        </span>
                      )}
                      {pub.status === "submitted" && (
                        <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
                          Submitted
                        </span>
                      )}
                    </div>
                    {pub.specialNote && (
                      <span className="text-xs text-purple-600 font-medium">
                        ⭐ {pub.specialNote}
                      </span>
                    )}
                  </div>
                  
                  {/* 제목 편집 가능 */}
                  <EditableContent
                    contentKey={`pub-${pub.number}-title`}
                    defaultValue={`<h3 class="text-lg md:text-xl font-semibold text-gray-900 mb-2 leading-tight">${pub.title}</h3>`}
                    onSave={async (content) => {
                      // HTML에서 텍스트만 추출하여 저장
                      const tempDiv = document.createElement("div");
                      tempDiv.innerHTML = content;
                      const text = tempDiv.textContent || tempDiv.innerText || "";
                      await handleSave(pub.number, "title", text);
                      // publications 업데이트하여 다음 편집 시 올바른 defaultValue 사용
                      const updatedPublications = publications.map((p) =>
                        p.number === pub.number ? { ...p, title: text } : p
                      );
                      setPublications(updatedPublications);
                    }}
                    isAuthenticated={authenticated}
                  />
                  
                  {/* 저자 편집 가능 */}
                  <EditableContent
                    contentKey={`pub-${pub.number}-authors`}
                    defaultValue={`<p class="text-sm text-gray-700 mb-2">${pub.authors}</p>`}
                    onSave={async (content) => {
                      // HTML에서 텍스트만 추출하여 저장
                      const tempDiv = document.createElement("div");
                      tempDiv.innerHTML = content;
                      const text = tempDiv.textContent || tempDiv.innerText || "";
                      await handleSave(pub.number, "authors", text);
                      // publications 업데이트하여 다음 편집 시 올바른 defaultValue 사용
                      const updatedPublications = publications.map((p) =>
                        p.number === pub.number ? { ...p, authors: text } : p
                      );
                      setPublications(updatedPublications);
                    }}
                    isAuthenticated={authenticated}
                  />
                  
                  {/* 저널 정보 편집 가능 */}
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
                    <EditableContent
                      contentKey={`pub-${pub.number}-journal`}
                      defaultValue={`<span class="font-medium">${pub.journal}</span>`}
                      onSave={async (content) => {
                        // HTML에서 텍스트만 추출하여 저장
                        const tempDiv = document.createElement("div");
                        tempDiv.innerHTML = content;
                        const text = tempDiv.textContent || tempDiv.innerText || "";
                        await handleSave(pub.number, "journal", text);
                        // publications 업데이트하여 다음 편집 시 올바른 defaultValue 사용
                        const updatedPublications = publications.map((p) =>
                          p.number === pub.number ? { ...p, journal: text } : p
                        );
                        setPublications(updatedPublications);
                      }}
                      isAuthenticated={authenticated}
                    />
                    <EditableContent
                      contentKey={`pub-${pub.number}-year`}
                      defaultValue={`<span>(${pub.year})</span>`}
                      onSave={async (content) => {
                        // HTML에서 텍스트만 추출하여 저장
                        const tempDiv = document.createElement("div");
                        tempDiv.innerHTML = content;
                        const text = tempDiv.textContent || tempDiv.innerText || "";
                        const year = parseInt(text.replace(/[^0-9]/g, '')) || pub.year;
                        await handleSave(pub.number, "year", year.toString());
                        // publications 업데이트하여 다음 편집 시 올바른 defaultValue 사용
                        const updatedPublications = publications.map((p) =>
                          p.number === pub.number ? { ...p, year: year } : p
                        );
                        setPublications(updatedPublications);
                      }}
                      isAuthenticated={authenticated}
                    />
                    {pub.if && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        IF: {pub.if}
                      </span>
                    )}
                    {pub.jcrRanking && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        JCR: {pub.jcrRanking}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
