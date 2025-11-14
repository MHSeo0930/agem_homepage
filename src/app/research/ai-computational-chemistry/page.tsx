export const metadata = {
  title: "AI & Computational Chemistry | Research",
  description: "Research on AI-driven interatomic potentials and multiscale modeling",
};

export default function AIComputationalChemistryPage() {
  const researchTopics = [
    {
      title: "AI-Driven Interatomic Potentials",
      titleKo: "AI 기반 원자간 포텐셜",
      description: "We leverage machine learning to develop accurate interatomic potentials for materials simulation. Our neural network potentials enable quantum-accuracy simulations at fraction of computational cost.",
      descriptionKo: "머신러닝을 활용하여 정확한 원자간 포텐셜을 개발합니다. 신경망 포텐셜을 통해 계산 비용의 일부로 양자 정확도 시뮬레이션을 가능하게 합니다.",
      icon: "🤖",
    },
    {
      title: "Multiscale Modeling",
      titleKo: "멀티스케일 모델링",
      description: "Our multiscale modeling approach bridges quantum mechanics to continuum scales, enabling predictive design of energy materials from atomic to device level.",
      descriptionKo: "양자역학부터 연속체 스케일까지 연결하는 멀티스케일 모델링을 통해 원자 수준부터 장치 수준까지 에너지 소재의 예측 설계를 가능하게 합니다.",
      icon: "🔬",
    },
    {
      title: "High-Throughput Screening",
      titleKo: "고속 스크리닝",
      description: "Using machine learning and DFT calculations, we screen thousands of materials to identify optimal candidates for energy applications.",
      descriptionKo: "머신러닝과 DFT 계산을 활용하여 에너지 응용을 위한 최적의 후보 소재를 식별하기 위해 수천 개의 소재를 스크리닝합니다.",
      icon: "⚙️",
    },
  ];

  return (
    <div className="flex flex-col">
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              AI & Computational Chemistry
              <span className="block text-3xl md:text-4xl text-gray-600 font-normal mt-2">
                AI 및 계산 화학
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Machine learning and computational methods for materials design and discovery.
              <br />
              <span className="text-base text-gray-500">
                소재 설계 및 발견을 위한 머신러닝 및 계산 방법론.
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

