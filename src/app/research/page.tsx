import Research from "@/components/Research";

export const metadata = {
  title: "Research | Min Ho Seo",
  description: "Research interests in hydrogen materials, electrochemistry, and AI multiscale modeling",
};

export default function ResearchPage() {
  return (
    <div className="flex flex-col">
      <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Research Interests
              <span className="block text-3xl md:text-4xl text-gray-600 font-normal mt-2">
                연구 분야
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our research focuses on sustainable energy technologies through materials science and computational modeling.
              <br />
              <span className="text-base text-gray-500">
                소재 과학 및 계산 모델링을 통한 지속가능한 에너지 기술 연구에 집중합니다.
              </span>
            </p>
          </div>
        </div>
      </section>
      <Research />
    </div>
  );
}

