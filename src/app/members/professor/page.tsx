import Image from "next/image";

export const metadata = {
  title: "Professor | Min Ho Seo",
  description: "Associate Professor Min Ho Seo - Department of Nanoconvergence Engineering, Pukyong National University. AI & Green Energy Material Lab.",
};

export default function ProfessorPage() {
  return (
    <div className="flex flex-col">
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Professor
              <span className="block text-3xl md:text-4xl text-gray-600 font-normal mt-2">
                교수
              </span>
            </h1>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="md:col-span-1">
                <div className="aspect-square bg-gray-200 rounded-xl mb-4 overflow-hidden relative">
                  <Image
                    src="/images/members/professor.jpg"
                    alt="Prof. Min Ho Seo"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Min Ho Seo
                  <span className="block text-xl text-gray-600 font-normal mt-1">
                    서민호
                  </span>
                  <span className="block text-lg text-indigo-600 font-medium mt-2">
                    AI & Green Energy Material Lab.
                  </span>
                </h2>
                <div className="space-y-4 text-gray-700">
                  <div>
                    <p className="font-semibold mb-1">Position / 직위</p>
                    <p className="text-gray-600">Associate Professor / 부교수</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Department / 소속</p>
                    <p className="text-gray-600">
                      Department of Nanoconvergence Engineering
                      <br />
                      <span className="text-sm">부경대학교 나노융합공학과</span>
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Institution / 기관</p>
                    <p className="text-gray-600">
                      Pukyong National University (PKNU)
                      <br />
                      <span className="text-sm">부경대학교</span>
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Office / 연구실</p>
                    <p className="text-gray-600">
                      공학1관(E13) 1308호
                      <br />
                      <span className="text-sm">Engineering Building 1 (E13), Room 1308</span>
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Email / 이메일</p>
                    <a href="mailto:foifrit@pknu.ac.kr" className="text-indigo-600 hover:text-indigo-700">
                      foifrit@pknu.ac.kr
                    </a>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Phone / 전화</p>
                    <p className="text-gray-600">051-629-6393</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="prose max-w-none">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Research Interests
                <span className="block text-xl text-gray-600 font-normal mt-1">
                  연구 분야
                </span>
              </h3>
              <div className="space-y-4 text-gray-700">
                <p>
                  AI & Green Energy Material Lab. We develop high-performance and durable electrocatalysts and electrodes 
                  for electrochemical energy conversion systems including fuel cells, water electrolysis, and metal-air batteries. 
                  Our research focuses on advanced materials development and applications for improving the efficiency of 
                  electrochemical energy conversion systems.
                </p>
                <p className="text-sm text-gray-600">
                  인공지능 그린에너지 소재 연구실. 연료전지, 수전해, 금속-공기 전지 등 전기화학 에너지 전환 시스템을 위한 
                  고활성·고내구 전기촉매 및 전극 개발 연구를 수행합니다. 전기화학 에너지 전환 시스템의 효율 향상을 위한 
                  첨단 소재 개발 및 응용 연구를 진행하고 있습니다.
                </p>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
                Education / 학력
              </h3>
              <div className="space-y-3 text-gray-700">
                <div className="border-l-4 border-indigo-500 pl-4">
                  <p className="font-semibold">Ph.D. in Materials Science and Engineering</p>
                  <p className="text-sm text-gray-600">Gwangju Institute of Science and Technology (GIST), 2007.09 – 2012.02</p>
                  <p className="text-xs text-gray-500">광주과학기술원(GIST) 신소재공학부 박사 (지도교수: 김원배)</p>
                </div>
                <div className="border-l-4 border-indigo-500 pl-4">
                  <p className="font-semibold">M.S. in Materials Science and Engineering</p>
                  <p className="text-sm text-gray-600">Gwangju Institute of Science and Technology (GIST), 2005.09 – 2007.08</p>
                  <p className="text-xs text-gray-500">광주과학기술원(GIST) 신소재공학부 석사 (지도교수: 김원배)</p>
                </div>
                <div className="border-l-4 border-indigo-500 pl-4">
                  <p className="font-semibold">B.S. in Materials Science and Engineering</p>
                  <p className="text-sm text-gray-600">Sungkyunkwan University, 1998.03 – 2005.08</p>
                  <p className="text-xs text-gray-500">성균관대학교 신소재공학부 학사</p>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
                Career / 경력
              </h3>
              <div className="space-y-3 text-gray-700">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-semibold">Associate Professor</p>
                  <p className="text-sm text-gray-600">Pukyong National University, Department of Nanoconvergence Engineering, 2025.03 – Present</p>
                  <p className="text-xs text-gray-500">부경대학교 나노융합공학과 부교수 (2025.03 – 현재)</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-semibold">Assistant Professor</p>
                  <p className="text-sm text-gray-600">Pukyong National University, Department of Nanoconvergence Engineering, 2022.03 – 2025.02</p>
                  <p className="text-xs text-gray-500">부경대학교 나노융합공학과 조교수 (2022.03 – 2025.02)</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-semibold">Principal Researcher</p>
                  <p className="text-sm text-gray-600">Korea Institute of Energy Research (KIER), 2020.02 – 2022.02</p>
                  <p className="text-xs text-gray-500">한국에너지기술연구원(KIER) 책임연구원 (2020.02 – 2022.02)</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-semibold">Senior Researcher</p>
                  <p className="text-sm text-gray-600">Korea Institute of Energy Research (KIER), 2016.03 – 2020.02</p>
                  <p className="text-xs text-gray-500">한국에너지기술연구원(KIER) 선임연구원 (2016.03 – 2020.02)</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-semibold">Postdoctoral Researcher</p>
                  <p className="text-sm text-gray-600">University of Waterloo, Department of Chemical Engineering (Advisor: Zhongwei Chen), 2013.08 – 2016.01</p>
                  <p className="text-xs text-gray-500">워털루 대학교 화학공학과 박사후 연구원 (지도교수: Zhongwei Chen) (2013.08 – 2016.01)</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-semibold">Postdoctoral Researcher</p>
                  <p className="text-sm text-gray-600">DGIST, School of Energy Science and Engineering (Advisor: Byeong-chan Han), 2012.02 – 2013.05</p>
                  <p className="text-xs text-gray-500">대구경북과학기술원(DGIST) 에너지시스템공학과 박사후 연구원 (지도교수: 한병찬) (2012.02 – 2013.05)</p>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
                Research Links / 연구 링크
              </h3>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://orcid.org/0000-0003-3910-4512"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                >
                  ORCID
                </a>
                <a
                  href="https://scholar.google.com/citations?user=XXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                >
                  Google Scholar
                </a>
                <a
                  href="https://www.researchgate.net/profile/Min-Ho-Seo-2?ev=hdr_xprf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                >
                  ResearchGate
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

