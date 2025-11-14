export const metadata = {
  title: "Green Energy Materials | Research",
  description: "Research on green energy materials including hydrogen electrolysis and electrocatalysts",
};

export default function GreenEnergyMaterialsPage() {
  const researchTopics = [
    {
      title: "Fuel Cells",
      titleKo: "연료전지",
      description: "Development of high-performance and durable electrocatalysts and electrodes for fuel cell applications. Research focuses on oxygen reduction reaction (ORR) and hydrogen oxidation reaction (HOR) catalysts.",
      descriptionKo: "연료전지 응용을 위한 고활성·고내구 전기촉매 및 전극 개발. 산소환원반응(ORR) 및 수소산화반응(HOR) 촉매 연구에 집중합니다.",
      icon: "⚡",
    },
    {
      title: "Water Electrolysis",
      titleKo: "수전해",
      description: "Development of advanced electrocatalysts for water electrolysis systems including anion exchange membrane (AEM) and proton exchange membrane (PEM) electrolyzers. Focus on hydrogen evolution reaction (HER) and oxygen evolution reaction (OER) catalysts.",
      descriptionKo: "음이온 교환막(AEM) 및 양이온 교환막(PEM) 전해조를 포함한 수전해 시스템용 고급 전기촉매 개발. 수소발생반응(HER) 및 산소발생반응(OER) 촉매에 집중합니다.",
      icon: "💧",
    },
    {
      title: "Metal-Air Batteries",
      titleKo: "금속-공기 전지",
      description: "Research on electrocatalysts and electrodes for metal-air battery systems. Development of bifunctional catalysts for both oxygen reduction and evolution reactions.",
      descriptionKo: "금속-공기 전지 시스템용 전기촉매 및 전극 연구. 산소환원 및 발생반응 모두에 대한 이기능성 촉매 개발.",
      icon: "🔋",
    },
  ];

  return (
    <div className="flex flex-col">
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Green Energy Materials
              <span className="block text-3xl md:text-4xl text-gray-600 font-normal mt-2">
                그린 에너지 소재
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Development of high-performance and durable electrocatalysts and electrodes for electrochemical energy conversion systems.
              <br />
              <span className="text-base text-gray-500">
                전기화학 에너지 전환 시스템을 위한 고활성·고내구 전기촉매 및 전극 개발 연구.
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {researchTopics.map((topic, index) => (
                <div
                  key={index}
                  className="p-8 rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
                >
                  <div className="text-5xl mb-6">{topic.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 font-medium">
                    {topic.titleKo}
                  </p>
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    {topic.description}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {topic.descriptionKo}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

