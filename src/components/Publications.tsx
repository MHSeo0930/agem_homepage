import { recentPublications } from "@/data/publications";

export default function Publications() {
  const publications = recentPublications;

  return (
    <section id="publications" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Selected Publications
            <span className="block text-2xl md:text-3xl text-gray-600 font-normal mt-2">
              주요 논문
            </span>
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Recent publications in electrocatalysts, fuel cells, water electrolysis, and energy materials.
            <br />
            <span className="text-sm text-gray-500">
              전기촉매, 연료전지, 수전해, 에너지 소재 분야의 최근 논문입니다.
            </span>
          </p>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publications.map((pub, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* 논문 썸네일 이미지 */}
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-4">
                      <div className="text-4xl mb-2">📄</div>
                      <div className="text-xs text-gray-600 font-medium">{pub.journal}</div>
                    </div>
                  </div>
                  {/* 실제 이미지가 있으면 아래 주석 해제하고 위 div 대신 사용 */}
                  {/* <img 
                    src={pub.image} 
                    alt={pub.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  /> */}
                </div>
                
                {/* 논문 정보 */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      #{pub.number}
                    </span>
                    {pub.role && (
                      <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                        {pub.role}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2 leading-tight line-clamp-2">
                    {pub.title}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {pub.authors}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <p className="text-xs text-gray-500">
                      <span className="font-medium">{pub.journal}</span> ({pub.year})
                    </p>
                    {pub.status === "submitted" && (
                      <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                        Submitted
                      </span>
                    )}
                  </div>
                  {pub.if && (
                    <p className="text-xs text-gray-500 mb-2">
                      IF: {pub.if} {pub.jcrRanking && `(JCR: ${pub.jcrRanking})`}
                    </p>
                  )}
                  {pub.specialNote && (
                    <p className="text-xs text-purple-600 mb-2">
                      ⭐ {pub.specialNote}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center mt-8">
          <a
            href="/achievements/journals"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            View All Publications →
          </a>
        </div>
      </div>
    </section>
  );
}

