export default function News() {
  const newsItems = [
    {
      date: "2024.01.15",
      title: "New Research Paper Published",
      titleKo: "새로운 연구 논문이 발표되었습니다",
      category: "Publication",
      categoryKo: "논문",
      description: "Our latest work on AI-driven interatomic potentials for hydrogen storage materials has been published in Nature Materials.",
      descriptionKo: "수소 저장 소재를 위한 AI 기반 원자간 포텐셜에 관한 최신 연구가 Nature Materials에 게재되었습니다.",
    },
    {
      date: "2024.01.10",
      title: "Lab Seminar Announcement",
      titleKo: "연구실 세미나 개최 안내",
      category: "Announcement",
      categoryKo: "공지",
      description: "Monthly lab seminar will be held on January 20th. All members are welcome to attend.",
      descriptionKo: "월례 연구실 세미나가 1월 20일에 개최됩니다. 모든 구성원의 참석을 환영합니다.",
    },
    {
      date: "2024.01.05",
      title: "Graduate Student Recruitment",
      titleKo: "신입 연구원 모집 공고",
      category: "Recruitment",
      categoryKo: "모집",
      description: "We are looking for motivated graduate students interested in hydrogen materials and computational modeling.",
      descriptionKo: "수소 소재 및 계산 모델링에 관심이 있는 의욕적인 대학원생을 모집합니다.",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            News & Updates
            <span className="block text-2xl md:text-3xl text-gray-600 font-normal mt-2">
              최신 소식
            </span>
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest news and announcements from our lab.
            <br />
            <span className="text-sm text-gray-500">
              연구실의 최신 소식과 공지사항을 확인하세요.
            </span>
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsItems.map((item, index) => (
              <div
                key={index}
                className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded">
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{item.date}</span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2 leading-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {item.titleKo}
                </p>
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-700 mb-1 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {item.descriptionKo}
                  </p>
                </div>
              </div>
            ))}
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

