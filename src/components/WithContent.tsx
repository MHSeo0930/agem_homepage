import { readBuildContent } from "@/lib/buildContent";
import { InitialContentProvider } from "@/components/InitialContent";

/** 서버 컴포넌트: 페이지에 필요한 content.json 키만 골라 빌드 시 초기값으로 주입 */
export default function WithContent({
  keys,
  children,
}: {
  keys: string[];
  children: React.ReactNode;
}) {
  return <InitialContentProvider value={readBuildContent(keys)}>{children}</InitialContentProvider>;
}
