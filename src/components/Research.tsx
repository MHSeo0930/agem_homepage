import Link from "next/link";

export default function Research() {
  const researchCategories = [
    {
      title: "Green Energy Materials",
      titleKo: "그린 에너지 소재",
      description: "Research on sustainable energy materials for hydrogen production, storage, and conversion.",
      descriptionKo: "수소 생산, 저장 및 변환을 위한 지속가능한 에너지 소재 연구.",
      link: "/research/green-energy-materials",
      icon: "⚡",
    },
    {
      title: "AI & Computational Chemistry",
      titleKo: "AI 및 계산 화학",
      description: "Machine learning and computational methods for materials design and discovery.",
      descriptionKo: "소재 설계 및 발견을 위한 머신러닝 및 계산 방법론.",
      link: "/research/ai-computational-chemistry",
      icon: "🤖",
    },
  ];

  return (
    <section id="research" className="py-16 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Research
            <span className="block text-2xl md:text-3xl text-gray-600 font-normal mt-2">
              연구 분야
            </span>
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            We develop high-performance and durable electrocatalysts and electrodes for electrochemical energy conversion systems 
            including fuel cells, water electrolysis, and metal-air batteries.
            <br />
            <span className="text-sm text-gray-500">
              연료전지, 수전해, 금속-공기 전지 등 전기화학 에너지 전환 시스템을 위한 고활성·고내구 전기촉매 및 전극 개발 연구를 수행합니다.
            </span>
          </p>
        </div>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {researchCategories.map((category, index) => (
              <Link
                key={index}
                href={category.link}
                className="p-6 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 bg-white group"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl flex-shrink-0">{category.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 font-medium">
                      {category.titleKo}
                    </p>
                    <p className="text-sm text-gray-700 mb-2 leading-relaxed">
                      {category.description}
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">
                      {category.descriptionKo}
                    </p>
                    <span className="text-blue-600 font-medium text-sm group-hover:underline inline-flex items-center">
                      Learn more →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

