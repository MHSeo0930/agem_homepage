"use client";

import { useState, useEffect, useMemo } from "react";
import EditableContent from "./EditableContent";
import { useAuth } from "@/hooks/useAuth";
import { getApiBase } from "@/lib/apiBase";

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

// board/news 페이지와 동일한 초기 데이터
const defaultNewsItems: NewsItem[] = [
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
];

export default function News() {
  const { authenticated } = useAuth();
  const [newsData, setNewsData] = useState({
    title: "News & Updates",
    titleKo: "최신 소식",
    description: "Stay updated with the latest news and announcements from our lab.",
    descriptionKo: "연구실의 최신 소식과 공지사항을 확인하세요.",
  });
  const [newsItems, setNewsItems] = useState<NewsItem[]>(defaultNewsItems);
  const [isDataLoaded, setIsDataLoaded] = useState(false); // 데이터 로드 완료 여부

  const loadData = async () => {
    try {
      const res = await fetch(`${getApiBase()}/api/content`);
      const data = await res.json();
      
      // newsData 로드 (제목, 설명 등)
      if (data.newsData) {
        try {
          const parsed = JSON.parse(data.newsData);
          if (typeof parsed === 'object' && !Array.isArray(parsed)) {
            // 서버에서 가져온 값이 빈 문자열이면 현재 상태 유지 (덮어쓰지 않음)
            setNewsData(prev => {
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
        } catch (e) {
          console.error("Failed to parse newsData", e);
        }
      }
      
      // newsItems 로드 (뉴스 아이템 배열)
      if (data.news) {
        try {
          const parsed = JSON.parse(data.news);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // number 기준 내림차순 정렬 (높은 number가 최신) 후 최신 3개만 표시
            const sortedNews = parsed.sort((a: NewsItem, b: NewsItem) => b.number - a.number);
            setNewsItems(sortedNews.slice(0, 3));
          }
        } catch (e) {
          console.error("Failed to parse news items", e);
          // 파싱 실패 시 기본 데이터 사용
          const sortedNews = defaultNewsItems.sort((a, b) => b.number - a.number);
          setNewsItems(sortedNews.slice(0, 3));
        }
      } else {
        // API에 데이터가 없는 경우 기본 데이터 사용
        const sortedNews = defaultNewsItems.sort((a, b) => b.number - a.number);
        setNewsItems(sortedNews.slice(0, 3));
      }
      setIsDataLoaded(true); // 데이터 로드 완료
    } catch (error) {
      console.error("Failed to fetch news data", error);
      // API 호출 실패 시 기본 데이터 사용
      const sortedNews = defaultNewsItems.sort((a, b) => b.number - a.number);
      setNewsItems(sortedNews.slice(0, 3));
      setIsDataLoaded(true); // 에러가 발생해도 로드 완료로 표시
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (field: string, value: string) => {
    const updatedData = { ...newsData, [field]: value };
    
    // 먼저 상태를 업데이트하여 UI에 즉시 반영
    setNewsData(updatedData);
    
    const response = await fetch(`${getApiBase()}/api/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ news: JSON.stringify(updatedData) }),
    });
    if (!response.ok) {
      // 실패 시 이전 상태로 복원
      setNewsData(newsData);
      throw new Error("Failed to save");
    }
    
    // 저장 후 데이터 다시 로드하여 서버와 동기화
    // 약간의 지연을 두어 EditableContent가 먼저 업데이트되도록 함
    setTimeout(async () => {
      await loadData();
    }, 50);
  };

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
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');
    } catch {
      return dateString;
    }
  };

  // defaultValue를 useMemo로 메모이제이션하여 불필요한 재생성 방지
  const titleDefaultValue = useMemo(() => 
    `<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">${newsData?.title || "News & Updates"}<span class="block text-2xl md:text-3xl text-gray-600 font-normal mt-2">${newsData?.titleKo || "최신 소식"}</span></h2>`,
    [newsData?.title, newsData?.titleKo]
  );
  
  const descriptionDefaultValue = useMemo(() => {
    // 빈 문자열도 체크하여 기본값 사용 방지
    const description = newsData?.description?.trim() || "Stay updated with the latest news and announcements from our lab.";
    const descriptionKo = newsData?.descriptionKo?.trim() || "연구실의 최신 소식과 공지사항을 확인하세요.";
    return `<p class="text-base text-gray-600 max-w-2xl mx-auto">${description}<br /><span class="text-sm text-gray-500">${descriptionKo}</span></p>`;
  }, [newsData?.description, newsData?.descriptionKo]);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <EditableContent
            contentKey="news-title"
            defaultValue={titleDefaultValue}
            onSave={async (content) => {
              const tempDiv = document.createElement("div");
              tempDiv.innerHTML = content;
              const titleElement = tempDiv.querySelector("h2");
              const titleKoElement = tempDiv.querySelector("span");
              if (titleElement) {
                const titleText = titleElement.childNodes[0]?.textContent || "";
                const titleKoText = titleKoElement?.textContent || "";
                
                // 두 필드를 한 번에 저장
                const updatedData = { 
                  ...newsData, 
                  title: titleText.trim(),
                  titleKo: titleKoText.trim()
                };
                
                // API에 먼저 저장
                const response = await fetch(`${getApiBase()}/api/content`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ newsData: JSON.stringify(updatedData) }),
                });
                if (!response.ok) {
                  throw new Error("Failed to save");
                }
                
                // 저장 성공 후 상태 업데이트 (저장한 데이터로 즉시 반영)
                // loadData()를 호출하지 않음 - 저장한 데이터를 직접 사용하여 덮어쓰기 방지
                setNewsData(updatedData);
              }
            }}
            isAuthenticated={authenticated}
          />
          {isDataLoaded && (
            <EditableContent
              contentKey="news-description"
              defaultValue={descriptionDefaultValue}
              onSave={async (content) => {
              const tempDiv = document.createElement("div");
              tempDiv.innerHTML = content;
              const pElement = tempDiv.querySelector("p");
              const spanElement = tempDiv.querySelector("span");
              
              // p 태그에서 span을 제외한 텍스트 추출
              let descriptionText = "";
              if (pElement) {
                const pClone = pElement.cloneNode(true) as HTMLElement;
                const spanInP = pClone.querySelector("span");
                if (spanInP) {
                  spanInP.remove();
                }
                // <br /> 태그도 제거하고 텍스트만 추출
                const brTags = pClone.querySelectorAll("br");
                brTags.forEach(br => br.remove());
                descriptionText = pClone.textContent || pClone.innerText || "";
              }
              
              // span 태그의 텍스트 추출
              const descriptionKoText = spanElement?.textContent || spanElement?.innerText || "";
              
              // 두 필드를 한 번에 저장
              const updatedData = { 
                ...newsData, 
                description: descriptionText.trim(),
                descriptionKo: descriptionKoText.trim()
              };
              
              // API에 먼저 저장
              const response = await fetch(`${getApiBase()}/api/content`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newsData: JSON.stringify(updatedData) }),
              });
              if (!response.ok) {
                throw new Error("Failed to save");
              }
              
              // 저장 성공 후 상태 업데이트 (저장한 데이터로 즉시 반영)
              // loadData()를 호출하지 않음 - 저장한 데이터를 직접 사용하여 덮어쓰기 방지
              setNewsData(updatedData);
            }}
            isAuthenticated={authenticated}
            />
          )}
          {!isDataLoaded && (
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              {newsData?.description || "Stay updated with the latest news and announcements from our lab."}
              <br />
              <span className="text-sm text-gray-500">
                {newsData?.descriptionKo || "연구실의 최신 소식과 공지사항을 확인하세요."}
              </span>
            </p>
          )}
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsItems.length > 0 ? (
              newsItems.map((item, index) => (
                <div
                  key={item.id || index}
                  className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{formatDate(item.date)}</span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-3 leading-tight line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-700 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500 py-8">
                최신 소식이 없습니다.
              </div>
            )}
          </div>
        </div>
        <div className="text-center mt-8">
          <a
            href="/board/news"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            View All News →
          </a>
        </div>
      </div>
    </section>
  );
}


