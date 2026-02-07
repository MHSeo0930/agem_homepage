"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { getApiBase } from "@/lib/apiBase";
import { registerQuillFontSize } from "@/lib/registerQuillFontSize";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// HTML을 ReactQuill이 안전하게 처리할 수 있는 형식으로 변환
const sanitizeHTML = (html: string): string => {
  if (typeof window === "undefined") return html || '<p><br></p>';
  if (!html || html.trim() === '') return '<p><br></p>';
  try {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.innerHTML || '<p><br></p>';
  } catch (error) {
    return '<p><br></p>';
  }
};

interface EditableContentProps {
  contentKey: string;
  defaultValue: string;
  onSave: (content: string) => Promise<void>;
  isAuthenticated: boolean;
}

export default function EditableContent({
  contentKey,
  defaultValue,
  onSave,
  isAuthenticated,
}: EditableContentProps) {
  const [displayContent, setDisplayContent] = useState(defaultValue);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [quillKey, setQuillKey] = useState(0);
  const [quillReady, setQuillReady] = useState(false);
  const quillRef = useRef<any>(null);
  const quillInstanceRef = useRef<any>(null);
  const fontSizeInputRef = useRef<HTMLInputElement>(null);

  // defaultValue 변경 추적을 위한 ref
  const prevDefaultValueRef = useRef<string>(defaultValue);
  const isInitialMountRef = useRef<boolean>(true);
  const justSavedRef = useRef<boolean>(false); // 저장 직후인지 추적

  // Quill 글자 크기(숫자 px) 포맷 등록 — 한 번만 실행
  useEffect(() => {
    registerQuillFontSize().then(() => setQuillReady(true));
  }, []);

  // HTML 정규화 함수 (비교를 위해)
  const normalizeHTML = (html: string): string => {
    if (!html) return '';
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.innerHTML;
  };
  
  useEffect(() => {
    // 초기 마운트 시에는 defaultValue로 설정
    if (isInitialMountRef.current) {
      setDisplayContent(defaultValue);
      prevDefaultValueRef.current = defaultValue;
      isInitialMountRef.current = false;
      return;
    }
    
    // 편집 중이 아닐 때만 defaultValue를 displayContent에 반영
    // 편집 중일 때는 사용자가 입력한 내용을 유지
    if (!isEditing && !saving) {
      // HTML을 정규화하여 비교 (공백, 속성 순서 등 차이 무시)
      const normalizedDefault = normalizeHTML(defaultValue || '');
      const normalizedPrev = normalizeHTML(prevDefaultValueRef.current || '');
      const normalizedDisplay = normalizeHTML(displayContent || '');
      
      // defaultValue가 실제로 변경되었는지 확인
      const defaultValueChanged = normalizedDefault !== normalizedPrev;
      
      // 저장 직후인지 확인
      if (justSavedRef.current) {
        // 저장 직후: 저장한 내용(displayContent)을 유지하고, 새로운 defaultValue와 동기화
        // 저장한 내용과 새로운 defaultValue가 같으면 (정규화 후) 이미 동기화됨
        if (normalizedDisplay === normalizedDefault) {
          // 저장한 내용과 새로운 defaultValue가 같으면 prevDefaultValueRef만 업데이트
          prevDefaultValueRef.current = defaultValue;
        } else {
          // 저장한 내용과 새로운 defaultValue가 다르면 저장한 내용 유지
          // (부모 컴포넌트의 상태 업데이트가 완료되지 않았을 수 있음)
          // prevDefaultValueRef는 저장한 내용으로 유지하여 덮어쓰지 않도록 함
          // 다음 렌더링 사이클에서 다시 확인됨
        }
        // 저장 직후 플래그 리셋
        justSavedRef.current = false;
        return; // 저장 직후에는 더 이상 처리하지 않음
      }
      
      // 저장 직후가 아닌 경우
      if (defaultValueChanged && defaultValue) {
        // defaultValue가 변경되었으면 항상 업데이트 (페이지 이동 후 돌아온 경우 포함)
        // 하지만 displayContent와 새로운 defaultValue가 같으면 업데이트 불필요
        if (normalizedDisplay !== normalizedDefault) {
          setDisplayContent(defaultValue);
        }
        prevDefaultValueRef.current = defaultValue;
      } else if (!defaultValueChanged && defaultValue && normalizedDefault !== normalizedDisplay) {
        // defaultValue는 같지만 displayContent가 다른 경우 (초기 로드 시 동기화)
        setDisplayContent(defaultValue);
        prevDefaultValueRef.current = defaultValue;
      }
    }
  }, [defaultValue, isEditing, saving]);

  const handleSave = async () => {
    setSaving(true);
    try {
      let htmlContent = displayContent;
      
      // quillInstanceRef에서 가져오기 시도
      if (quillInstanceRef.current) {
        htmlContent = quillInstanceRef.current.root.innerHTML;
      } else if (quillRef.current) {
        // quillRef에서 직접 가져오기 시도
        const quillElement = quillRef.current.querySelector('.ql-editor') as any;
        if (quillElement) {
          const quill = quillElement.__quill || (quillElement as any).quill;
          if (quill) {
            htmlContent = quill.root.innerHTML;
          } else {
            // quill이 없으면 직접 innerHTML 가져오기
            htmlContent = quillElement.innerHTML;
          }
        }
      }
      
      // 빈 내용 체크
      if (!htmlContent || htmlContent.trim() === '' || htmlContent === '<p><br></p>') {
        htmlContent = displayContent || defaultValue;
      }
      
      // 저장된 내용을 먼저 표시 (UI 즉시 반영)
      setDisplayContent(htmlContent);
      
      // 편집 모드 종료
      setIsEditing(false);
      
      // 저장 직후 플래그 설정
      justSavedRef.current = true;
      
      // 부모 컴포넌트에 저장 요청
      await onSave(htmlContent);
      
      // 저장 완료 후 quill 초기화
      setQuillKey(prev => prev + 1); // 다음 편집을 위해 key 증가
      quillInstanceRef.current = null; // ref 초기화
      
      // 저장 직후 플래그는 useEffect에서 처리한 후 리셋됨
    } catch (error) {
      console.error("Save error:", error);
      const msg = error instanceof Error ? error.message : "Failed to save content";
      alert(msg);
      // 에러 발생 시 편집 모드로 복귀하지 않음 (이미 setIsEditing(false) 호출됨)
    } finally {
      setSaving(false);
    }
  };

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(`${getApiBase()}/api/upload`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        const data = await response.json();
        if (data.success && quillInstanceRef.current) {
          const quill = quillInstanceRef.current;
          const range = quill.getSelection();
          const url = data.url.startsWith("http")
            ? data.url
            : data.url.startsWith("/")
              ? data.url
              : getApiBase() + data.url;
          quill.insertEmbed(range?.index || 0, "image", url);
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("Failed to upload image");
      }
    };
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        [{ align: [] }],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  };

  const applyFontSize = () => {
    const quill = quillInstanceRef.current;
    const input = fontSizeInputRef.current;
    if (!quill || !input) return;
    const num = parseInt(input.value, 10);
    if (!isNaN(num) && num >= 8 && num <= 200) {
      quill.format("size", `${num}px`);
      quill.focus();
    }
  };

  // ReactQuill이 마운트된 후 content 설정 및 quillInstanceRef 업데이트
  // clipboard.convert + setContents 사용 시 h1/h2/h3 등 블록 서식이 Quill Delta에 정확히 반영됨
  useEffect(() => {
    if (isEditing && quillRef.current) {
      const timer = setTimeout(() => {
        const quillElement = quillRef.current?.querySelector('.ql-editor') as any;
        if (quillElement) {
          const quill = quillElement.__quill || (quillElement as any).quill;
          if (quill) {
            quillInstanceRef.current = quill;
            const contentToSet = sanitizeHTML(displayContent || defaultValue);
            const targetContent = contentToSet.trim();
            if (targetContent === '' || targetContent === '<p><br></p>') return;
            const currentContent = quill.root.innerHTML.trim();
            if (currentContent === targetContent) return;
            try {
              if (quill.clipboard?.convert) {
                const delta = quill.clipboard.convert({ html: contentToSet });
                if (delta && delta.ops && delta.ops.length > 0) {
                  quill.setContents(delta, 'silent');
                  return;
                }
              }
            } catch (_) {
              // convert 실패 시 innerHTML 폴백
            }
            quill.root.innerHTML = contentToSet;
          }
        }
      }, 150);
      return () => clearTimeout(timer);
    } else {
      // 편집 모드가 아닐 때 ref 초기화
      quillInstanceRef.current = null;
    }
  }, [isEditing, quillKey, displayContent, defaultValue]);

  // 블록 레벨 요소가 포함되어 있는지 확인
  const hasBlockElements = /<(h[1-6]|p|div|ul|ol|li|blockquote|pre|table|tr|td|th|section|article|header|footer|nav|aside|main|figure|figcaption|address|fieldset|form|details|summary|dl|dt|dd)/i.test(displayContent || defaultValue);

  if (!isAuthenticated) {
    // 블록 레벨 요소가 있으면 div, 없으면 span 사용
    if (hasBlockElements) {
      return <div dangerouslySetInnerHTML={{ __html: displayContent }} className="editable-content-display block w-full" />;
    } else {
      // span만 포함된 경우 인라인으로 표시
      return <span dangerouslySetInnerHTML={{ __html: displayContent }} className="inline" />;
    }
  }

  // 인라인 모드: 블록 레벨 요소가 없고 span만 포함된 경우
  const isInlineMode = !hasBlockElements;

  // 인라인 모드일 때는 span을 루트로 사용
  if (isInlineMode && !isEditing) {
    return (
      <span className="relative inline group">
        <span dangerouslySetInnerHTML={{ __html: displayContent }} />
        <button
          onClick={() => {
            setQuillKey(prev => prev + 1);
            setIsEditing(true);
          }}
          className="absolute -top-6 right-0 opacity-0 group-hover:opacity-100 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-opacity whitespace-nowrap z-10"
        >
          Edit
        </button>
      </span>
    );
  }

  return (
    <div className={`relative group ${isInlineMode ? 'inline-block' : 'w-full'}`}>
      {isEditing ? (
        <div className="border-2 border-blue-500 rounded-lg p-3 bg-white w-full">
          <style jsx global>{`
            .ql-container {
              min-height: 150px;
              font-size: 14px;
              border: 1px solid #ccc;
              border-radius: 4px;
            }
            .ql-editor {
              min-height: 150px;
              font-size: 14px;
              padding: 12px;
            }
            .ql-editor.ql-blank::before {
              color: #999;
              font-style: normal;
            }
            .ql-toolbar {
              padding: 8px;
              border-top-left-radius: 4px;
              border-top-right-radius: 4px;
              border-bottom: 1px solid #ccc;
            }
            .ql-toolbar .ql-formats {
              margin-right: 8px;
            }
            .quill-wrapper .ql-container {
              display: block;
            }
            .quill-wrapper .ql-editor {
              display: block;
            }
          `}</style>
          {!quillReady ? (
            <div className="min-h-[150px] flex items-center justify-center text-gray-500">로딩 중...</div>
          ) : (
            <>
              <div ref={quillRef} className="quill-wrapper">
                <ReactQuill
                  key={`quill-${contentKey}-${quillKey}`}
                  theme="snow"
                  defaultValue={sanitizeHTML(displayContent || defaultValue)}
                  onChange={() => {
                    // onChange는 사용하지 않고, 저장 시에만 ref를 통해 가져옴
                  }}
                  modules={modules}
                  className="bg-white"
                  placeholder="내용을 입력하세요..."
                />
              </div>
              <div className="flex items-center gap-2 mt-2 py-2 border-t border-gray-200">
                <label className="text-sm text-gray-600 whitespace-nowrap">글자 크기(px):</label>
                <input
                  ref={fontSizeInputRef}
                  type="number"
                  min={8}
                  max={200}
                  defaultValue={14}
                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                  onKeyDown={(e) => e.key === "Enter" && applyFontSize()}
                />
                <button
                  type="button"
                  onClick={applyFontSize}
                  className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  적용
                </button>
              </div>
            </>
          )}
          <div className="flex gap-2 mt-3 justify-end border-t pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {saving ? "저장 중..." : "저장"}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setQuillKey(prev => prev + 1); // 다음 편집을 위해 key 증가
              }}
              className="px-3 py-1.5 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-medium"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <div className={`relative ${hasBlockElements ? 'w-full' : 'inline'}`}>
          <div dangerouslySetInnerHTML={{ __html: displayContent }} className={hasBlockElements ? 'editable-content-display' : 'inline'} />
          <button
            onClick={() => {
              setQuillKey(prev => prev + 1);
              setIsEditing(true);
            }}
            className="absolute -top-6 right-0 opacity-0 group-hover:opacity-100 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-opacity whitespace-nowrap z-10"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
