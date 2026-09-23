"use client";

/**
 * 빌드 시 읽은 content.json 값을 클라이언트 컴포넌트의 첫 렌더에 적용한다.
 * → 정적 HTML에 최신 콘텐츠가 들어가고(크롤러·LLM도 최신 내용을 봄), 로드 직후 옛 내용이 깜빡이지 않음.
 * 이후 각 컴포넌트의 /api/content 재조회는 NAS 편집 직후 반영용으로 그대로 동작.
 */
import { createContext, useContext, useRef } from "react";

const InitialContentContext = createContext<Record<string, unknown> | null>(null);

export function InitialContentProvider({
  value,
  children,
}: {
  value: Record<string, unknown>;
  children: React.ReactNode;
}) {
  return <InitialContentContext.Provider value={value}>{children}</InitialContentContext.Provider>;
}

/**
 * 첫 렌더에서 한 번만 apply(initialContent) 실행.
 * apply는 컴포넌트의 기존 "fetch 결과 반영" 로직(자기 컴포넌트 setState)을 그대로 쓴다.
 * 렌더 중 자기 state 갱신은 React가 허용하는 패턴이며, ref 가드로 마운트당 1회만 실행한다
 * (Strict Mode 이중 렌더에서도 중복 적용되지 않음).
 */
export function useApplyInitialContent(apply: (data: any) => void) {
  const initial = useContext(InitialContentContext);
  const appliedRef = useRef(false);
  if (!appliedRef.current && initial) {
    appliedRef.current = true;
    apply(initial);
  }
}
