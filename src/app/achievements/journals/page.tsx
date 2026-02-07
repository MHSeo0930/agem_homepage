"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getApiBase } from "@/lib/apiBase";
import EditableContent from "@/components/EditableContent";
import { publications as initialPublications } from "@/data/publications";

// 엑셀 편집 컴포넌트
function ExcelEditor({ data, onDataChange, onSave }: { data: any[]; onDataChange: (data: any[]) => void; onSave: (data: any[]) => Promise<void> }) {
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);

  const columns = ["Journal Name", "IF", "JCR %"];

  const handleCellClick = (row: number, col: string) => {
    const currentValue = data[row]?.[col] || "";
    setEditingCell({ row, col });
    setEditValue(String(currentValue));
  };

  const handleCellBlur = () => {
    if (editingCell) {
      const updatedData = [...data];
      if (!updatedData[editingCell.row]) {
        updatedData[editingCell.row] = {};
      }
      
      if (editingCell.col === "IF") {
        const numValue = parseFloat(editValue);
        updatedData[editingCell.row][editingCell.col] = isNaN(numValue) ? "" : numValue;
      } else {
        updatedData[editingCell.row][editingCell.col] = editValue;
      }
      
      onDataChange(updatedData);
      setEditingCell(null);
      setEditValue("");
    }
  };

  const handleAddRow = () => {
    onDataChange([...data, { "Journal Name": "", "IF": "", "JCR %": "" }]);
  };

  const handleDeleteRow = (index: number) => {
    if (confirm("이 행을 삭제하시겠습니까?")) {
      const updatedData = data.filter((_, i) => i !== index);
      onDataChange(updatedData);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(data);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          저널 이름을 입력하고 IF와 JCR %를 기록하세요. 저장하면 publications에 자동으로 반영됩니다.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleAddRow}
            className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
          >
            + 행 추가
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "저장 중..." : "💾 저장 및 Publications 업데이트"}
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {columns.map((col) => (
                <th key={col} className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                  {col}
                </th>
              ))}
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700 w-20">
                삭제
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                  데이터가 없습니다. 행을 추가하거나 엑셀 파일을 업로드하세요.
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td
                      key={col}
                      className="border border-gray-300 px-4 py-2"
                      onClick={() => handleCellClick(rowIndex, col)}
                    >
                      {editingCell?.row === rowIndex && editingCell?.col === col ? (
                        <input
                          type={col === "IF" ? "number" : "text"}
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleCellBlur}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleCellBlur();
                            } else if (e.key === "Escape") {
                              setEditingCell(null);
                              setEditValue("");
                            }
                          }}
                          className="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                      ) : (
                        <div className="min-h-[24px] cursor-pointer hover:bg-blue-50 px-2 py-1 rounded">
                          {row[col] || <span className="text-gray-400">클릭하여 편집</span>}
                        </div>
                      )}
                    </td>
                  ))}
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => handleDeleteRow(rowIndex)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function JournalsPage() {
  const { authenticated } = useAuth();
  const [publications, setPublications] = useState(initialPublications);
  const [pageData, setPageData] = useState({
    title: "Journal Publications",
    titleKo: "학술지 논문",
    description: "Published journal articles in electrocatalysts, fuel cells, water electrolysis, and energy materials.",
    descriptionKo: "전기촉매, 연료전지, 수전해, 에너지 소재 분야의 학술지 논문입니다.",
  });
  const [isDataLoaded, setIsDataLoaded] = useState(false); // 데이터 로드 완료 여부
  const [excelData, setExcelData] = useState<any[]>([]); // 엑셀 데이터

  const loadData = async () => {
    try {
      const res = await fetch(`${getApiBase()}/api/content`);
      const data = await res.json();
      if (data.journalPublications) {
        try {
          const parsed = JSON.parse(data.journalPublications);
          // 배열인지 확인
          if (Array.isArray(parsed)) {
            setPublications(parsed);
          }
        } catch (e) {
          console.error("Failed to parse journal publications data");
        }
      } else if (data.publications) {
        // 기존 publications 키가 있는 경우 (배열인지 확인)
        try {
          const parsed = JSON.parse(data.publications);
          // 배열인 경우에만 사용 (Publications 컴포넌트는 객체를 저장하므로 제외)
          if (Array.isArray(parsed)) {
            setPublications(parsed);
          }
        } catch (e) {
          console.error("Failed to parse publications data");
        }
      }
      
      // 페이지 데이터 로드
      if (data.journalsPage) {
        try {
          const parsed = JSON.parse(data.journalsPage);
          if (parsed && typeof parsed === 'object') {
            setPageData(prev => {
              // 서버에서 가져온 값이 빈 문자열이면 현재 상태 유지 (덮어쓰지 않음)
              const serverTitle = parsed.title && parsed.title.trim();
              const serverTitleKo = parsed.titleKo && parsed.titleKo.trim();
              const serverDescription = parsed.description && parsed.description.trim();
              const serverDescriptionKo = parsed.descriptionKo && parsed.descriptionKo.trim();
              
              return {
                ...prev,
                // 서버 값이 빈 문자열이면 현재 상태 유지, 아니면 서버 값 사용
                title: serverTitle ? serverTitle : prev.title,
                titleKo: serverTitleKo ? serverTitleKo : prev.titleKo,
                description: serverDescription ? serverDescription : prev.description,
                descriptionKo: serverDescriptionKo ? serverDescriptionKo : prev.descriptionKo,
              };
            });
          }
          setIsDataLoaded(true); // 데이터 로드 완료
        } catch (e) {
          console.error("Failed to parse journals page data", e);
          setIsDataLoaded(true); // 에러가 발생해도 로드 완료로 표시
        }
      } else {
        setIsDataLoaded(true); // 데이터가 없어도 로드 완료로 표시
      }
    } catch (error) {
      console.error("Failed to load journal publications data", error);
      setIsDataLoaded(true); // 에러가 발생해도 로드 완료로 표시
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 엑셀 데이터 로드 (로그인 시에만)
  useEffect(() => {
    if (authenticated) {
      const loadExcelData = async () => {
        try {
          const response = await fetch(`${getApiBase()}/api/excel`);
          const result = await response.json();
          if (result.success) {
            setExcelData(result.data || []);
          }
        } catch (error) {
          console.error("Failed to load excel data:", error);
        }
      };
      loadExcelData();
    }
  }, [authenticated]);

  const handleSave = async (pubNumber: number, field: string, value: string | number) => {
    // 배열이 아닌 경우 처리
    if (!Array.isArray(publications)) {
      console.error("Publications is not an array");
      return;
    }
    
    const updatedPublications = publications.map((pub) => {
      if (pub.number === pubNumber) {
        // 빈 문자열인 경우 필드 제거
        if (value === "" || value === null || value === undefined) {
          // 필드 제거를 위해 객체를 복사하고 해당 필드 삭제
          const rest = { ...pub };
          delete rest[field as keyof typeof pub];
          return rest;
        }
        // 필드 업데이트
        return { ...pub, [field]: value };
      }
      return pub;
    });
    setPublications(updatedPublications);
    
    const response = await fetch(`${getApiBase()}/api/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ journalPublications: JSON.stringify(updatedPublications) }),
    });
    if (!response.ok) throw new Error("Failed to save");
    
    // 저장 후 데이터 다시 로드
    await loadData();
  };

  const handleAddPublication = async () => {
    // 배열이 아닌 경우 처리
    if (!Array.isArray(publications)) {
      console.error("Publications is not an array");
      return;
    }
    
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
    
    const response = await fetch(`${getApiBase()}/api/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ journalPublications: JSON.stringify(updatedPublications) }),
    });
    if (!response.ok) throw new Error("Failed to add publication");
    
    // 저장 후 데이터 다시 로드
    await loadData();
  };

  const handleDeletePublication = async (pubNumber: number) => {
    if (!confirm("이 논문을 삭제하시겠습니까?")) return;
    
    // 배열이 아닌 경우 처리
    if (!Array.isArray(publications)) {
      console.error("Publications is not an array");
      return;
    }
    
    const updatedPublications = publications.filter((pub) => pub.number !== pubNumber);
    setPublications(updatedPublications);
    
    const response = await fetch(`${getApiBase()}/api/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ journalPublications: JSON.stringify(updatedPublications) }),
    });
    if (!response.ok) throw new Error("Failed to delete publication");
    
    // 저장 후 데이터 다시 로드
    await loadData();
  };

  // titleDefaultValue를 useMemo로 메모이제이션하여 안정적인 참조 유지
  const titleDefaultValue = useMemo(() => {
    const title = pageData?.title?.trim() || "Journal Publications";
    const titleKo = pageData?.titleKo?.trim() || "학술지 논문";
    return `<h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">${title}<span class="block text-3xl md:text-4xl text-gray-600 font-normal mt-2">${titleKo}</span></h1>`;
  }, [pageData?.title, pageData?.titleKo]);

  // descriptionDefaultValue를 useMemo로 메모이제이션하여 안정적인 참조 유지
  const descriptionDefaultValue = useMemo(() => {
    const description = pageData?.description?.trim() || "Published journal articles in electrocatalysts, fuel cells, water electrolysis, and energy materials.";
    const descriptionKo = pageData?.descriptionKo?.trim() || "전기촉매, 연료전지, 수전해, 에너지 소재 분야의 학술지 논문입니다.";
    return `<p class="text-lg text-gray-600 max-w-2xl mx-auto">${description}<br /><span class="text-base text-gray-500">${descriptionKo}</span></p>`;
  }, [pageData?.description, pageData?.descriptionKo]);

  return (
    <div className="flex flex-col">
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            {isDataLoaded && (
              <EditableContent
                contentKey="journals-page-title"
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
                        credentials: "include",
                        body: JSON.stringify({ journalsPage: JSON.stringify(updatedData) }),
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
                contentKey="journals-page-description"
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
                      const spanElement = pElement.querySelector("span.text-sm.text-gray-500") || pElement.querySelector("span");
                      
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
                      credentials: "include",
                      body: JSON.stringify({ journalsPage: JSON.stringify(updatedData) }),
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
            <p className="text-sm text-gray-500 mt-4">
              Total: {Array.isArray(publications) ? publications.length : 0} publications
            </p>
          </div>
        </div>
      </section>
      
      {/* 엑셀 편집 섹션 (로그인 시에만 표시) */}
      {authenticated && (
        <section className="py-12 bg-gray-50 border-t border-gray-200">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">저널 IF/JCR 관리 (Excel)</h2>
                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      if (!confirm("모든 엑셀 데이터를 삭제하고 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
                        return;
                      }
                      
                      try {
                        const response = await fetch(`${getApiBase()}/api/excel`, {
                          method: "DELETE",
                        });
                        
                        const result = await response.json();
                        if (result.success) {
                          alert(result.message || "엑셀 데이터가 초기화되었습니다.");
                          // 엑셀 데이터 다시 로드
                          const excelRes = await fetch(`${getApiBase()}/api/excel`);
                          const excelData = await excelRes.json();
                          if (excelData.success) {
                            setExcelData(excelData.data || []);
                          }
                        } else {
                          alert(`초기화 실패: ${result.error}`);
                        }
                      } catch (error) {
                        console.error("Reset error:", error);
                        alert("초기화 중 오류가 발생했습니다.");
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    🗑️ 데이터 초기화
                  </button>
                  <label className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer">
                    📤 엑셀 파일 업로드
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        if (!confirm("엑셀 파일을 업로드하면 기존 데이터가 모두 삭제되고 새 데이터로 교체됩니다. 계속하시겠습니까?")) {
                          e.target.value = ""; // 파일 선택 취소
                          return;
                        }
                        
                        const formData = new FormData();
                        formData.append("file", file);
                        
                        try {
                          const response = await fetch(`${getApiBase()}/api/excel`, {
                            method: "PUT",
                            body: formData,
                          });
                          
                          const result = await response.json();
                          if (result.success) {
                            alert(result.message || "엑셀 파일이 업로드되었고, 기존 데이터가 새 데이터로 교체되었습니다.");
                            // 엑셀 데이터 다시 로드
                            const excelRes = await fetch(`${getApiBase()}/api/excel`);
                            const excelData = await excelRes.json();
                            if (excelData.success) {
                              setExcelData(excelData.data || []);
                            }
                            // publications 데이터도 다시 로드
                            await loadData();
                          } else {
                            alert(`업로드 실패: ${result.error}`);
                          }
                        } catch (error) {
                          console.error("Upload error:", error);
                          alert("업로드 중 오류가 발생했습니다.");
                        } finally {
                          e.target.value = ""; // 파일 입력 초기화
                        }
                      }}
                    />
                  </label>
                  <button
                    onClick={async () => {
                      try {
                        // API에서 직접 파일 다운로드
                        const response = await fetch(`${getApiBase()}/api/excel?download=true`);
                        
                        if (!response.ok) {
                          const errorData = await response.json().catch(() => ({ error: "다운로드 실패" }));
                          throw new Error(errorData.error || "다운로드 실패");
                        }

                        // Blob으로 변환 후 다운로드
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = `journals_${new Date().toISOString().split('T')[0]}.xlsx`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(url);
                      } catch (error: any) {
                        console.error("Download error:", error);
                        alert(`다운로드 중 오류가 발생했습니다: ${error.message || "알 수 없는 오류"}`);
                      }
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    📥 엑셀 파일 다운로드
                  </button>
                </div>
              </div>
              
              <ExcelEditor
                data={excelData}
                onDataChange={setExcelData}
                onSave={async (data) => {
                  try {
                    const response = await fetch(`${getApiBase()}/api/excel`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ data, updatePublications: true }),
                    });
                    
                    const result = await response.json();
                    if (result.success) {
                      alert("엑셀 파일이 저장되고 publications가 업데이트되었습니다.");
                      // publications 데이터 다시 로드
                      await loadData();
                    } else {
                      alert(`저장 실패: ${result.error}`);
                    }
                  } catch (error) {
                    console.error("Save error:", error);
                    alert("저장 중 오류가 발생했습니다.");
                  }
                }}
              />
            </div>
          </div>
        </section>
      )}
      
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {authenticated && (
              <div className="mb-6 flex justify-end gap-3">
                <button
                  onClick={async () => {
                    if (!confirm("모든 논문의 IF를 Crossref API로 업데이트하시겠습니까? (일부 저널은 정보를 찾을 수 없을 수 있습니다)")) return;
                    
                    if (!Array.isArray(publications)) return;
                    
                    const updatedPublications = [...publications];
                    let updatedCount = 0;
                    
                    for (let i = 0; i < updatedPublications.length; i++) {
                      const pub = updatedPublications[i];
                      if (!pub.journal || pub.journal === "submitted") continue;
                      
                      try {
                        // Crossref API로 저널 검색
                        const response = await fetch(
                          `https://api.crossref.org/journals?query=${encodeURIComponent(pub.journal)}&rows=1`,
                          {
                            headers: {
                              'User-Agent': 'PKNU Lab Website (mailto:foifrit@pknu.ac.kr)'
                            }
                          }
                        );
                        
                        if (response.ok) {
                          const data = await response.json();
                          if (data.message?.items?.[0]) {
                            const journal = data.message.items[0];
                            // Crossref는 직접 IF를 제공하지 않지만, 일부 메타데이터는 제공
                            // 실제 IF는 다른 소스가 필요하므로 여기서는 알림만 표시
                            console.log(`Journal found: ${journal.title}, but IF not available via Crossref`);
                          }
                        }
                      } catch (error) {
                        console.error(`Error fetching IF for ${pub.journal}:`, error);
                      }
                      
                      // API 호출 간 딜레이 (rate limiting 방지)
                      await new Promise(resolve => setTimeout(resolve, 200));
                    }
                    
                    alert(`IF 업데이트 시도 완료. Crossref API는 직접 IF를 제공하지 않으므로, JCR 데이터베이스나 다른 소스를 사용해야 합니다.`);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  title="Crossref API를 사용하여 IF 업데이트 시도 (제한적)"
                >
                  🔄 IF 자동 업데이트 시도
                </button>
                <button
                  onClick={handleAddPublication}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  + 논문 추가
                </button>
              </div>
            )}
            <div className="space-y-6">
              {Array.isArray(publications) ? publications.sort((a, b) => b.number - a.number).map((pub) => (
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
                    {authenticated || pub.if ? (
                      <EditableContent
                        contentKey={`pub-${pub.number}-if`}
                        defaultValue={pub.if ? `<span class="text-xs bg-gray-100 px-2 py-1 rounded">IF: ${pub.if}</span>` : '<span class="text-xs bg-gray-100 px-2 py-1 rounded text-gray-400">IF: -</span>'}
                        onSave={async (content) => {
                          const tempDiv = document.createElement("div");
                          tempDiv.innerHTML = content;
                          const text = tempDiv.textContent || tempDiv.innerText || "";
                          const ifMatch = text.match(/IF:\s*([\d.]+)/);
                          const ifValue = ifMatch ? ifMatch[1] : (text.match(/[\d.]+/) ? text.match(/[\d.]+/)![0] : "");
                          if (ifValue) {
                            const ifNum = parseFloat(ifValue);
                            await handleSave(pub.number, "if", ifNum);
                            const updatedPublications = publications.map((p) =>
                              p.number === pub.number ? { ...p, if: ifNum } : p
                            );
                            setPublications(updatedPublications);
                          } else {
                            // IF 제거
                            await handleSave(pub.number, "if", "");
                          }
                        }}
                        isAuthenticated={authenticated}
                      />
                    ) : null}
                    {authenticated || pub.jcrRanking ? (
                      <EditableContent
                        contentKey={`pub-${pub.number}-jcr`}
                        defaultValue={pub.jcrRanking ? `<span class="text-xs bg-gray-100 px-2 py-1 rounded">JCR: ${pub.jcrRanking}</span>` : '<span class="text-xs bg-gray-100 px-2 py-1 rounded text-gray-400">JCR: -</span>'}
                        onSave={async (content) => {
                          const tempDiv = document.createElement("div");
                          tempDiv.innerHTML = content;
                          const text = tempDiv.textContent || tempDiv.innerText || "";
                          const jcrMatch = text.match(/JCR:\s*(.+)/);
                          const jcrValue = jcrMatch ? jcrMatch[1].trim() : (text.trim() || "");
                          if (jcrValue && jcrValue !== "-") {
                            await handleSave(pub.number, "jcrRanking", jcrValue);
                            const updatedPublications = publications.map((p) =>
                              p.number === pub.number ? { ...p, jcrRanking: jcrValue } : p
                            );
                            setPublications(updatedPublications);
                          } else {
                            // JCR 제거
                            await handleSave(pub.number, "jcrRanking", "");
                          }
                        }}
                        isAuthenticated={authenticated}
                      />
                    ) : null}
                  </div>
                </div>
              )) : (
                <div className="text-center text-gray-500 py-8">
                  논문 데이터를 불러오는 중...
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
