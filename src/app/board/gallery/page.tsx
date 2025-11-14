export const metadata = {
  title: "Gallery | Board",
  description: "Lab gallery - photos and images",
};

export default function GalleryPage() {
  const galleryItems = [
    {
      title: "Lab Meeting",
      titleKo: "연구실 회의",
      description: "Weekly lab meeting discussion",
      descriptionKo: "주간 연구실 회의 토론",
      image: "📸",
    },
    {
      title: "Research Equipment",
      titleKo: "연구 장비",
      description: "Electrochemical workstation",
      descriptionKo: "전기화학 워크스테이션",
      image: "🔬",
    },
    {
      title: "Conference Presentation",
      titleKo: "학회 발표",
      description: "International conference presentation",
      descriptionKo: "국제 학회 발표",
      image: "🎤",
    },
    {
      title: "Lab Members",
      titleKo: "연구실 구성원",
      description: "Group photo of lab members",
      descriptionKo: "연구실 구성원 단체 사진",
      image: "👥",
    },
    {
      title: "Research Visit",
      titleKo: "연구 방문",
      description: "Collaboration meeting",
      descriptionKo: "협력 회의",
      image: "🤝",
    },
    {
      title: "Award Ceremony",
      titleKo: "시상식",
      description: "Research award presentation",
      descriptionKo: "연구상 수상",
      image: "🏆",
    },
  ];

  return (
    <div className="flex flex-col">
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Gallery
              <span className="block text-3xl md:text-4xl text-gray-600 font-normal mt-2">
                갤러리
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Photos and images from lab activities and events.
              <br />
              <span className="text-base text-gray-500">
                연구실 활동 및 행사 사진입니다.
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="aspect-video bg-gray-100 flex items-center justify-center text-6xl">
                    {item.image}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.titleKo}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.description}
                    </p>
                    <p className="text-xs text-gray-400">
                      {item.descriptionKo}
                    </p>
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

