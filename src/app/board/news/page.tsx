import News from "@/components/News";

export const metadata = {
  title: "News | Board",
  description: "Lab news and announcements",
};

export default function NewsPage() {
  const allNews = [
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
    {
      date: "2023.12.20",
      title: "Conference Presentation",
      titleKo: "학회 발표",
      category: "Achievement",
      categoryKo: "성과",
      description: "Lab members presented their research at the International Conference on Electrochemistry in Seoul.",
      descriptionKo: "연구실 구성원들이 서울에서 개최된 국제 전기화학 학회에서 연구를 발표했습니다.",
    },
    {
      date: "2023.12.10",
      title: "New Lab Equipment Installed",
      titleKo: "새로운 연구 장비 설치",
      category: "Announcement",
      categoryKo: "공지",
      description: "New electrochemical workstation has been installed in the lab for advanced electrocatalysis research.",
      descriptionKo: "고급 전기화학 촉매 연구를 위한 새로운 전기화학 워크스테이션이 연구실에 설치되었습니다.",
    },
  ];

  return (
    <div className="flex flex-col">
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
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
          <div className="max-w-4xl mx-auto space-y-6">
            {allNews.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full mb-2">
                      {item.category}
                      <span className="ml-1 text-gray-500">({item.categoryKo})</span>
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.titleKo}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 ml-4 whitespace-nowrap">{item.date}</span>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-700 mb-1">
                    {item.description}
                  </p>
                  <p className="text-xs text-gray-600">
                    {item.descriptionKo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

