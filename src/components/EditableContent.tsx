"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
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
  const quillRef = useRef<any>(null);
  const quillInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!isEditing) {
      setDisplayContent(defaultValue);
    }
  }, [defaultValue, isEditing]);

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
      
      await onSave(htmlContent);
      setDisplayContent(htmlContent);
      setIsEditing(false);
      setQuillKey(prev => prev + 1); // 다음 편집을 위해 key 증가
      quillInstanceRef.current = null; // ref 초기화
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save content");
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
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.success && quillInstanceRef.current) {
          const quill = quillInstanceRef.current;
          const range = quill.getSelection();
          quill.insertEmbed(range?.index || 0, "image", data.url);
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

  // ReactQuill이 마운트된 후 content 설정 및 quillInstanceRef 업데이트
  useEffect(() => {
    if (isEditing && quillRef.current) {
      const timer = setTimeout(() => {
        const quillElement = quillRef.current?.querySelector('.ql-editor') as any;
        if (quillElement) {
          const quill = quillElement.__quill || (quillElement as any).quill;
          if (quill) {
            quillInstanceRef.current = quill;
            const contentToSet = sanitizeHTML(displayContent || defaultValue);
            const currentContent = quill.root.innerHTML.trim();
            const targetContent = contentToSet.trim();
            // 현재 content와 다를 때만 설정 (불필요한 업데이트 방지)
            if (currentContent !== targetContent && targetContent !== '<p><br></p>') {
              quill.root.innerHTML = contentToSet;
            }
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
      return <div dangerouslySetInnerHTML={{ __html: displayContent }} className="block w-full" />;
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
          <div dangerouslySetInnerHTML={{ __html: displayContent }} className={hasBlockElements ? '' : 'inline'} />
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
