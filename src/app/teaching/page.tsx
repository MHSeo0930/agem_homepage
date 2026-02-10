export const metadata = {
  title: "Teaching | Min Ho Seo",
  description: "Teaching courses and educational activities",
};

export default function TeachingPage() {
  const courses = [
    {
      code: "NTE 301",
      title: "Introduction to Nanotechnology",
      titleKo: "나노기술 개론",
      level: "Undergraduate",
      levelKo: "학부",
      description: "Fundamental principles of nanotechnology, nanomaterials synthesis, characterization techniques, and applications in energy and electronics.",
      descriptionKo: "나노기술의 기본 원리, 나노소재 합성, 특성 분석 기법, 에너지 및 전자 분야 응용을 다룹니다.",
      semester: "Spring/Fall",
    },
    {
      code: "NTE 405",
      title: "Computational Materials Science",
      titleKo: "계산 소재 과학",
      level: "Undergraduate",
      levelKo: "학부",
      description: "Introduction to computational methods in materials science including DFT, molecular dynamics, and machine learning approaches for materials design.",
      descriptionKo: "DFT, 분자동역학, 머신러닝을 포함한 소재 과학의 계산 방법론과 소재 설계에 대한 소개입니다.",
      semester: "Spring",
    },
    {
      code: "NTE 501",
      title: "Advanced Electrochemistry",
      titleKo: "고급 전기화학",
      level: "Graduate",
      levelKo: "대학원",
      description: "Advanced topics in electrochemistry including electrocatalysis, electrochemical energy conversion, and multiscale modeling of electrochemical systems.",
      descriptionKo: "전기화학 촉매, 전기화학 에너지 변환, 전기화학 시스템의 멀티스케일 모델링을 포함한 전기화학의 고급 주제를 다룹니다.",
      semester: "Fall",
    },
    {
      code: "NTE 502",
      title: "AI and Machine Learning for Materials Science",
      titleKo: "소재 과학을 위한 AI 및 머신러닝",
      level: "Graduate",
      levelKo: "대학원",
      description: "Machine learning applications in materials science, including interatomic potentials, property prediction, and high-throughput screening.",
      descriptionKo: "원자간 포텐셜, 물성 예측, 고속 스크리닝을 포함한 소재 과학에서의 머신러닝 응용을 다룹니다.",
      semester: "Spring",
    },
  ];

  const teachingPhilosophy = {
    en: "I believe in fostering critical thinking and hands-on experience in computational and experimental methods. My teaching emphasizes the connection between fundamental principles and cutting-edge research applications, preparing students for careers in academia and industry.",
    ko: "계산 및 실험 방법론에서 비판적 사고와 실무 경험을 함양하는 것을 중요하게 생각합니다. 기본 원리와 최첨단 연구 응용 사이의 연결을 강조하여 학생들이 학계와 산업계에서의 경력을 준비할 수 있도록 합니다.",
  };

  return (
    <div className="flex flex-col">
      <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Teaching
              <span className="block text-3xl md:text-4xl text-gray-600 font-normal mt-2">
                강의
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Courses and educational activities in nanotechnology and materials science.
              <br />
              <span className="text-base text-gray-500">
                나노기술 및 소재 과학 분야의 강의 및 교육 활동입니다.
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12 p-8 bg-gray-50 rounded-xl border border-gray-200">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Teaching Philosophy
                <span className="block text-xl md:text-2xl text-gray-600 font-normal mt-2">
                  교육 철학
                </span>
              </h2>
              <p className="text-gray-700 mb-3 leading-relaxed">
                {teachingPhilosophy.en}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {teachingPhilosophy.ko}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                Courses
                <span className="block text-2xl md:text-3xl text-gray-600 font-normal mt-2">
                  강의 과목
                </span>
              </h2>
            </div>

            <div className="space-y-6">
              {courses.map((course, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-full">
                          {course.code}
                        </span>
                        <span className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                          {course.level} / {course.levelKo}
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-base text-gray-600 mb-4">
                        {course.titleKo}
                      </p>
                      <p className="text-sm text-gray-700 mb-2 leading-relaxed">
                        {course.description}
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {course.descriptionKo}
                      </p>
                    </div>
                    <div className="md:text-right">
                      <span className="text-sm font-medium text-gray-600">
                        {course.semester}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-8 bg-indigo-50 rounded-xl border border-indigo-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Student Resources
                <span className="block text-base text-gray-600 font-normal mt-1">
                  학생 자료
                </span>
              </h3>
              <p className="text-sm text-gray-700 mb-2">
                Course materials, lecture notes, and assignments are available through the university&apos;s learning management system.
              </p>
              <p className="text-xs text-gray-600">
                강의 자료, 강의 노트, 과제는 대학의 학습 관리 시스템을 통해 제공됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

