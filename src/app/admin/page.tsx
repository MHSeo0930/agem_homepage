"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/check");
      const data = await response.json();
      if (!data.authenticated) {
        router.push("/admin/login");
      } else {
        setAuthenticated(true);
      }
    } catch (error) {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
          <div className="space-y-4">
            <p className="text-gray-600">
              웹사이트에서 직접 콘텐츠를 편집할 수 있습니다. 홈페이지로 이동하여 편집하고 싶은 섹션에 마우스를 올리면 &quot;Edit&quot; 버튼이 나타납니다.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">사용 방법:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                <li>홈페이지로 이동합니다</li>
                <li>편집하고 싶은 텍스트에 마우스를 올립니다</li>
                <li>&quot;Edit&quot; 버튼을 클릭합니다</li>
                <li>에디터에서 내용을 수정합니다</li>
                <li>이미지 아이콘을 클릭하여 사진을 업로드할 수 있습니다</li>
                <li>&quot;Save&quot; 버튼을 클릭하여 저장합니다</li>
              </ol>
            </div>
            <div className="flex gap-4">
              <Link
                href="/"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                홈페이지로 이동 →
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">편집 가능한 섹션</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✓ 홈페이지 Hero 섹션 (연구실 이름, 소개)</li>
            <li>✓ 연구 분야 설명</li>
            <li>✓ 이미지 업로드 및 삽입</li>
            <li>✓ 텍스트 서식 (굵게, 기울임, 목록 등)</li>
            <li>✓ 링크 추가</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

