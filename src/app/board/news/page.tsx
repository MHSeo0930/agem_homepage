"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getApiBase } from "@/lib/apiBase";
import EditableContent from "@/components/EditableContent";

interface NewsItem {
  id: string;
  number: number;
  date: string;
  title: string;
  titleKo: string;
  category: string;
  categoryKo: string;
  description: string;
  descriptionKo: string;
}

export default function NewsPage() {
  const { authenticated } = useAuth();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([
    {
      id: "news-24",
      number: 24,
      date: "2025-07-17",
      title: "2025 우수공학도상 - 우승민",
      titleKo: "2025 우수공학도상 - 우승민",
      category: "Award",
      categoryKo: "수상",
      description: "우승민 학생이 2025 우수공학도상을 수상했습니다.",
      descriptionKo: "우승민 학생이 2025 우수공학도상을 수상했습니다.",
    },
    {
      id: "news-23",
      number: 23,
      date: "2025-07-17",
      title: "2025 Nano Korea 우수포스터상 - 우승민",
      titleKo: "2025 Nano Korea 우수포스터상 - 우승민",
      category: "Award",
      categoryKo: "수상",
      description: "우승민 학생이 2025 Nano Korea 우수포스터상을 수상했습니다.",
      descriptionKo: "우승민 학생이 2025 Nano Korea 우수포스터상을 수상했습니다.",
    },
    {
      id: "news-22",
      number: 22,
      date: "2024-12-09",
      title: "[Front cover] Adv. Sci. 2402020 (2024)",
      titleKo: "[Front cover] Adv. Sci. 2402020 (2024)",
      category: "Publication",
      categoryKo: "논문",
      description: "Advanced Science 2402020 (2024)의 표지 논문으로 선정되었습니다.",
      descriptionKo: "Advanced Science 2402020 (2024)의 표지 논문으로 선정되었습니다.",
    },
    {
      id: "news-21",
      number: 21,
      date: "2024-11-11",
      title: "[Front cover] Adv. Sci. 2402389 (2024)",
      titleKo: "[Front cover] Adv. Sci. 2402389 (2024)",
      category: "Publication",
      categoryKo: "논문",
      description: "Advanced Science 2402389 (2024)의 표지 논문으로 선정되었습니다.",
      descriptionKo: "Advanced Science 2402389 (2024)의 표지 논문으로 선정되었습니다.",
    },
    {
      id: "news-20",
      number: 20,
      date: "2024-11-11",
      title: "[언론보도] ('23.04.03') POSTECH·한국화학연구원·한국재료연구원·부경대 공동연구팀, 버려지는 글리세롤 활용법 개발",
      titleKo: "[언론보도] ('23.04.03') POSTECH·한국화학연구원·한국재료연구원·부경대 공동연구팀, 버려지는 글리세롤 활용법 개발",
      category: "Media",
      categoryKo: "언론보도",
      description: "POSTECH, 한국화학연구원, 한국재료연구원, 부경대 공동연구팀이 버려지는 글리세롤 활용법을 개발했습니다.",
      descriptionKo: "POSTECH, 한국화학연구원, 한국재료연구원, 부경대 공동연구팀이 버려지는 글리세롤 활용법을 개발했습니다.",
    },
    {
      id: "news-19",
      number: 19,
      date: "2024-11-11",
      title: "[언론보도] ('24.08.29') 포스텍/국립부경대 '리튬 폴리설파이드' 전환 문제, Ni-Co 촉매 메커니즘으로 해결",
      titleKo: "[언론보도] ('24.08.29') 포스텍/국립부경대 '리튬 폴리설파이드' 전환 문제, Ni-Co 촉매 메커니즘으로 해결",
      category: "Media",
      categoryKo: "언론보도",
      description: "포스텍/국립부경대 연구팀이 '리튬 폴리설파이드' 전환 문제를 Ni-Co 촉매 메커니즘으로 해결했습니다.",
      descriptionKo: "포스텍/국립부경대 연구팀이 '리튬 폴리설파이드' 전환 문제를 Ni-Co 촉매 메커니즘으로 해결했습니다.",
    },
    {
      id: "news-18",
      number: 18,
      date: "2024-11-11",
      title: "[언론보도] ('24.08.29') 국립부경대-재료硏-GIST, 수소연료전지 수명 향상 기술 개발",
      titleKo: "[언론보도] ('24.08.29') 국립부경대-재료硏-GIST, 수소연료전지 수명 향상 기술 개발",
      category: "Media",
      categoryKo: "언론보도",
      description: "국립부경대, 재료硏, GIST 공동 연구팀이 수소연료전지 수명 향상 기술을 개발했습니다.",
      descriptionKo: "국립부경대, 재료硏, GIST 공동 연구팀이 수소연료전지 수명 향상 기술을 개발했습니다.",
    },
    {
      id: "news-17",
      number: 17,
      date: "2024-08-26",
      title: "[수소중점연구실] H2 NEXT ROUND 선정",
      titleKo: "[수소중점연구실] H2 NEXT ROUND 선정",
      category: "Project",
      categoryKo: "과제",
      description: "우리 연구실이 H2 NEXT ROUND 수소중점연구실로 선정되었습니다.",
      descriptionKo: "우리 연구실이 H2 NEXT ROUND 수소중점연구실로 선정되었습니다.",
    },
    {
      id: "news-16",
      number: 16,
      date: "2024-08-26",
      title: "[과제선정] 연구재단 원천기술개발사업 (2024/04/01)",
      titleKo: "[과제선정] 연구재단 원천기술개발사업 (2024/04/01)",
      category: "Project",
      categoryKo: "과제",
      description: "연구재단 원천기술개발사업에 선정되었습니다.",
      descriptionKo: "연구재단 원천기술개발사업에 선정되었습니다.",
    },
    {
      id: "news-15",
      number: 15,
      date: "2023-12-18",
      title: "2023 추계 전기화학회 우수포스터상 - 우승민",
      titleKo: "2023 추계 전기화학회 우수포스터상 - 우승민",
      category: "Award",
      categoryKo: "수상",
      description: "우승민 학생이 2023 추계 전기화학회에서 우수포스터상을 수상했습니다.",
      descriptionKo: "우승민 학생이 2023 추계 전기화학회에서 우수포스터상을 수상했습니다.",
    },
    {
      id: "news-14",
      number: 14,
      date: "2023-12-13",
      title: "2023 추계 표면공화학회(ICSE) 우수포스터상 - 우승민",
      titleKo: "2023 추계 표면공화학회(ICSE) 우수포스터상 - 우승민",
      category: "Award",
      categoryKo: "수상",
      description: "우승민 학생이 2023 추계 표면공화학회(ICSE)에서 우수포스터상을 수상했습니다.",
      descriptionKo: "우승민 학생이 2023 추계 표면공화학회(ICSE)에서 우수포스터상을 수상했습니다.",
    },
    {
      id: "news-13",
      number: 13,
      date: "2023-12-01",
      title: "2023 추계 화상학회 우수포스터상 - 정민경",
      titleKo: "2023 추계 화상학회 우수포스터상 - 정민경",
      category: "Award",
      categoryKo: "수상",
      description: "정민경 학생이 2023 추계 화상학회에서 우수포스터상을 수상했습니다.",
      descriptionKo: "정민경 학생이 2023 추계 화상학회에서 우수포스터상을 수상했습니다.",
    },
    {
      id: "news-12",
      number: 12,
      date: "2022-09-02",
      title: "[과제선정] 연구재단 중견연구지원사업선정 (2022/09/01)",
      titleKo: "[과제선정] 연구재단 중견연구지원사업선정 (2022/09/01)",
      category: "Project",
      categoryKo: "과제",
      description: "연구재단 중견연구지원사업에 선정되었습니다.",
      descriptionKo: "연구재단 중견연구지원사업에 선정되었습니다.",
    },
    {
      id: "news-11",
      number: 11,
      date: "2022-09-02",
      title: "[과제선정] 한국산업기술평가원 소재부품개발사업 (2022/04/01)",
      titleKo: "[과제선정] 한국산업기술평가원 소재부품개발사업 (2022/04/01)",
      category: "Project",
      categoryKo: "과제",
      description: "한국산업기술평가원 소재부품개발사업에 선정되었습니다.",
      descriptionKo: "한국산업기술평가원 소재부품개발사업에 선정되었습니다.",
    },
    {
      id: "news-10",
      number: 10,
      date: "2022-09-02",
      title: "[과제선정] 한국산업기술진흥원 소재부품산업거점지원사업 (2022/07/01)",
      titleKo: "[과제선정] 한국산업기술진흥원 소재부품산업거점지원사업 (2022/07/01)",
      category: "Project",
      categoryKo: "과제",
      description: "한국산업기술진흥원 소재부품산업거점지원사업에 선정되었습니다.",
      descriptionKo: "한국산업기술진흥원 소재부품산업거점지원사업에 선정되었습니다.",
    },
    {
      id: "news-9",
      number: 9,
      date: "2022-08-25",
      title: "서민호 교수 연구실 학사, 대학원, Post-Doc.연구원 모집.",
      titleKo: "서민호 교수 연구실 학사, 대학원, Post-Doc.연구원 모집.",
      category: "Recruitment",
      categoryKo: "모집",
      description: "서민호 교수 연구실에서 학사, 대학원, Post-Doc.연구원을 모집합니다.",
      descriptionKo: "서민호 교수 연구실에서 학사, 대학원, Post-Doc.연구원을 모집합니다.",
    },
    {
      id: "news-8",
      number: 8,
      date: "2022-08-17",
      title: "[언론보도] ('20. 11. 17) \"산소 빈자리\" 많을수록 온실가스 전환 잘 된다.",
      titleKo: "[언론보도] ('20. 11. 17) \"산소 빈자리\" 많을수록 온실가스 전환 잘 된다.",
      category: "Media",
      categoryKo: "언론보도",
      description: "\"산소 빈자리\"가 많을수록 온실가스 전환이 잘 된다는 언론 보도입니다.",
      descriptionKo: "\"산소 빈자리\"가 많을수록 온실가스 전환이 잘 된다는 언론 보도입니다.",
    },
    {
      id: "news-7",
      number: 7,
      date: "2022-08-17",
      title: "2021 KIER 학연 학술상 (원장 표창) - 진 송",
      titleKo: "2021 KIER 학연 학술상 (원장 표창) - 진 송",
      category: "Award",
      categoryKo: "수상",
      description: "진 송 연구원이 2021 KIER 학연 학술상 (원장 표창)을 수상했습니다.",
      descriptionKo: "진 송 연구원이 2021 KIER 학연 학술상 (원장 표창)을 수상했습니다.",
    },
    {
      id: "news-6",
      number: 6,
      date: "2022-08-17",
      title: "2021 KIER e-festa Oral 우수상 - 진 송",
      titleKo: "2021 KIER e-festa Oral 우수상 - 진 송",
      category: "Award",
      categoryKo: "수상",
      description: "진 송 연구원이 2021 KIER e-festa Oral 우수상을 수상했습니다.",
      descriptionKo: "진 송 연구원이 2021 KIER e-festa Oral 우수상을 수상했습니다.",
    },
    {
      id: "news-5",
      number: 5,
      date: "2022-08-09",
      title: "2022 춘계 표면화학회 우수포스터상 - 박민선",
      titleKo: "2022 춘계 표면화학회 우수포스터상 - 박민선",
      category: "Award",
      categoryKo: "수상",
      description: "박민선 학생이 2022 춘계 표면화학회 우수포스터상을 수상했습니다.",
      descriptionKo: "박민선 학생이 2022 춘계 표면화학회 우수포스터상을 수상했습니다.",
    },
    {
      id: "news-4",
      number: 4,
      date: "2022-08-09",
      title: "2022 춘계 전기화학회 우수포스터상 - 우승민",
      titleKo: "2022 춘계 전기화학회 우수포스터상 - 우승민",
      category: "Award",
      categoryKo: "수상",
      description: "우승민 학생이 2022 춘계 전기화학회에서 우수포스터상을 수상했습니다.",
      descriptionKo: "우승민 학생이 2022 춘계 전기화학회에서 우수포스터상을 수상했습니다.",
    },
    {
      id: "news-3",
      number: 3,
      date: "2022-08-09",
      title: "2022 춘계 한국재료학회 우수포스터상 - 우주완",
      titleKo: "2022 춘계 한국재료학회 우수포스터상 - 우주완",
      category: "Award",
      categoryKo: "수상",
      description: "우주완 학생이 2022 춘계 한국재료학회에서 우수포스터상을 수상했습니다.",
      descriptionKo: "우주완 학생이 2022 춘계 한국재료학회에서 우수포스터상을 수상했습니다.",
    },
    {
      id: "news-2",
      number: 2,
      date: "2022-08-09",
      title: "2022 춘계 한국화학공학회 우수포스터상 - 김대훈",
      titleKo: "2022 춘계 한국화학공학회 우수포스터상 - 김대훈",
      category: "Award",
      categoryKo: "수상",
      description: "김대훈 학생이 2022 춘계 한국화학공학회에서 우수포스터상을 수상했습니다.",
      descriptionKo: "김대훈 학생이 2022 춘계 한국화학공학회에서 우수포스터상을 수상했습니다.",
    },
    {
      id: "news-1",
      number: 1,
      date: "2022-08-09",
      title: "2022 춘계 한국고분자학회 우수포스터상 - 정민경",
      titleKo: "2022 춘계 한국고분자학회 우수포스터상 - 정민경",
      category: "Award",
      categoryKo: "수상",
      description: "정민경 학생이 2022 춘계 한국고분자학회에서 우수포스터상을 수상했습니다.",
      descriptionKo: "정민경 학생이 2022 춘계 한국고분자학회에서 우수포스터상을 수상했습니다.",
    },
  ]);

  const loadData = async () => {
    try {
      const res = await fetch(`${getApiBase()}/api/content`);
      const data = await res.json();
      if (data.news) {
        try {
          const parsed = JSON.parse(data.news);
          setNewsItems(parsed);
        } catch (e) {
          console.error("Failed to parse news data");
        }
      }
    } catch (error) {
      console.error("Failed to load news data", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (newsId: string, field: string, value: string) => {
    const updatedNews = newsItems.map((item) =>
      item.id === newsId ? { ...item, [field]: value } : item
    );
    
    // 먼저 상태를 업데이트하여 UI에 즉시 반영
    setNewsItems(updatedNews);
    
    const response = await fetch(`${getApiBase()}/api/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ news: JSON.stringify(updatedNews) }),
    });
    if (!response.ok) {
      // 실패 시 이전 상태로 복원
      setNewsItems(newsItems);
      throw new Error("Failed to save");
    }
    
    // 저장 후 데이터 다시 로드하여 서버와 동기화
    // 약간의 지연을 두어 EditableContent가 먼저 업데이트되도록 함
    setTimeout(async () => {
      await loadData();
    }, 50);
  };

  const handleAddNews = async () => {
    const maxNumber = newsItems.length > 0 ? Math.max(...newsItems.map(n => n.number)) : 0;
    const newNews = {
      id: `news-${Date.now()}`,
      number: maxNumber + 1,
      date: new Date().toISOString().split('T')[0],
      title: "New News Item",
      titleKo: "새 소식",
      category: "Announcement",
      categoryKo: "공지",
      description: "Description",
      descriptionKo: "설명",
    };
    const updatedNews = [newNews, ...newsItems].sort((a, b) => b.number - a.number);
    setNewsItems(updatedNews);
    
    const response = await fetch(`${getApiBase()}/api/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ news: JSON.stringify(updatedNews) }),
    });
    if (!response.ok) throw new Error("Failed to add news");
    
    // 저장 후 데이터 다시 로드
    await loadData();
  };

  const handleDeleteNews = async (newsId: string) => {
    if (!confirm("이 소식을 삭제하시겠습니까?")) return;
    
    const updatedNews = newsItems.filter((item) => item.id !== newsId);
    setNewsItems(updatedNews);
    
    const response = await fetch(`${getApiBase()}/api/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ news: JSON.stringify(updatedNews) }),
    });
    if (!response.ok) throw new Error("Failed to delete news");
    
    // 저장 후 데이터 다시 로드
    await loadData();
  };

  const CATEGORY_OPTIONS: { value: string; label: string; labelKo: string }[] = [
    { value: "Announcement", label: "News", labelKo: "공지" },
    { value: "Award", label: "Award", labelKo: "수상" },
    { value: "Publication", label: "Publication", labelKo: "논문" },
    { value: "Project", label: "Project", labelKo: "과제" },
    { value: "Media", label: "Media", labelKo: "언론보도" },
    { value: "Recruitment", label: "Recruitment", labelKo: "모집" },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Award":
        return "bg-purple-100 text-purple-700";
      case "Publication":
        return "bg-blue-100 text-blue-700";
      case "Media":
        return "bg-green-100 text-green-700";
      case "Project":
        return "bg-orange-100 text-orange-700";
      case "Recruitment":
        return "bg-indigo-100 text-indigo-700";
      case "Announcement":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex flex-col">
      <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              News & Updates
              <span className="block text-3xl md:text-4xl text-gray-600 font-normal mt-2">
                최신 소식
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest news and announcements from our lab.
              <br />
              <span className="text-base text-gray-500">
                연구실의 최신 소식과 공지사항을 확인하세요.
              </span>
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
                  onClick={handleAddNews}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  + 소식 추가
                </button>
              </div>
            )}
            <div className="space-y-6">
              {newsItems.sort((a, b) => b.number - a.number).map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow relative group"
                >
                  {authenticated && (
                    <button
                      onClick={() => handleDeleteNews(item.id)}
                      className="absolute top-2 right-2 z-20 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                      title="소식 삭제"
                    >
                      ✕
                    </button>
                  )}
                  <div className="mb-3">
                    <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-600">#{item.number}</span>
                        {authenticated ? (
                          <select
                            value={item.category || "Announcement"}
                            onChange={async (e) => {
                              const opt = CATEGORY_OPTIONS.find((o) => o.value === e.target.value);
                              if (!opt) return;
                              const updatedNews = newsItems.map((n) =>
                                n.id === item.id ? { ...n, category: opt.value, categoryKo: opt.labelKo } : n
                              );
                              setNewsItems(updatedNews);
                              const response = await fetch(`${getApiBase()}/api/content`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                credentials: "include",
                                body: JSON.stringify({ news: JSON.stringify(updatedNews) }),
                              });
                              if (!response.ok) setNewsItems(newsItems);
                            }}
                            className={`text-xs font-semibold rounded-full px-3 py-1 border cursor-pointer ${getCategoryColor(item.category)}`}
                          >
                            {CATEGORY_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label} ({opt.labelKo})
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(item.category)}`}>
                            {item.category}
                            <span className="ml-1 text-gray-600">({item.categoryKo})</span>
                          </span>
                        )}
                      </div>
                      {authenticated ? (
                        <EditableContent
                          contentKey={`news-${item.id}-date`}
                          defaultValue={`<span class="text-sm text-gray-500 whitespace-nowrap">${item.date}</span>`}
                          onSave={async (content) => {
                            const tempDiv = document.createElement("div");
                            tempDiv.innerHTML = content;
                            const text = tempDiv.textContent || tempDiv.innerText || "";
                            await handleSave(item.id, "date", text);
                          }}
                          isAuthenticated={authenticated}
                        />
                      ) : (
                        <span className="text-sm text-gray-500 whitespace-nowrap">{item.date}</span>
                      )}
                    </div>
                    <EditableContent
                      contentKey={`news-${item.id}-title`}
                      defaultValue={`<h3 class="text-lg font-semibold text-gray-900 mb-2">${item.title}</h3>`}
                      onSave={async (content) => {
                        const tempDiv = document.createElement("div");
                        tempDiv.innerHTML = content;
                        const text = tempDiv.textContent || tempDiv.innerText || "";
                        await handleSave(item.id, "title", text);
                      }}
                      isAuthenticated={authenticated}
                    />
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <EditableContent
                      contentKey={`news-${item.id}-description`}
                      defaultValue={`<p class="text-sm text-gray-700">${item.description}</p>`}
                      onSave={async (content) => {
                        const tempDiv = document.createElement("div");
                        tempDiv.innerHTML = content;
                        const text = tempDiv.textContent || tempDiv.innerText || "";
                        await handleSave(item.id, "description", text);
                      }}
                      isAuthenticated={authenticated}
                    />
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
