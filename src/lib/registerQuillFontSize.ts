/**
 * Quill 에디터에서 글자 크기를 숫자(px)로 자유롭게 지정할 수 있도록
 * 기본 size attributor를 whitelist 없이 재등록합니다.
 * EditableContent에서 편집 모드 진입 전에 호출해야 합니다.
 */
export function registerQuillFontSize(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  return import("react-quill").then((module) => {
    const Quill = (module as { default?: { Quill: unknown } }).default?.Quill as
      | { import: (name: string) => unknown; register: (def: object, overwrite?: boolean) => void }
      | undefined;
    if (!Quill?.import) return;
    const Parchment = Quill.import("parchment") as {
      Attributor: { Style: new (name: string, keyName: string, opts: { scope: number }) => unknown };
      Scope: { INLINE: number };
    };
    if (!Parchment?.Attributor?.Style) return;
    const FontSizeStyle = new Parchment.Attributor.Style("size", "font-size", {
      scope: Parchment.Scope.INLINE,
    });
    Quill.register({ "attributors/style/size": FontSizeStyle }, true);
  });
}
