export default function Contact() {
  return (
    <section id="contact" className="py-16 bg-gray-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Contact
            <span className="block text-2xl md:text-3xl text-gray-600 font-normal mt-2">
              연락처
            </span>
          </h2>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Office Information
                <span className="block text-sm text-gray-600 font-normal mt-1">
                  사무실 정보
                </span>
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Department:</span> Nanoconvergence Engineering
                  <br />
                  <span className="text-xs text-gray-600">나노융합공학과</span>
                </p>
                <p>
                  <span className="font-medium">Institution:</span> Pukyong National University (PKNU)
                  <br />
                  <span className="text-xs text-gray-600">부경대학교</span>
                </p>
                <p>
                  <span className="font-medium">Office:</span> 공학1관(E13) 1308호
                  <br />
                  <span className="text-xs text-gray-600">Engineering Building 1 (E13), Room 1308</span>
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  <a 
                    href="mailto:foifrit@pknu.ac.kr" 
                    className="text-blue-600 hover:text-blue-700"
                  >
                    foifrit@pknu.ac.kr
                  </a>
                </p>
                <p>
                  <span className="font-medium">Phone:</span> 051-629-6393
                </p>
                <p>
                  <span className="font-medium">Address:</span> 45 Yongso-ro, Nam-gu, Busan 48547
                  <br />
                  <span className="text-xs text-gray-600">부산광역시 남구 용소로 45 (대연캠퍼스) 공학 1관(E13) 1308호</span>
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Research Links
                <span className="block text-sm text-gray-600 font-normal mt-1">
                  연구 링크
                </span>
              </h3>
              <div className="space-y-2">
                <a
                  href="https://orcid.org/0000-0003-3910-4512"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  ORCID Profile →
                </a>
                <a
                  href="https://scholar.google.com/citations?user=XXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Google Scholar →
                </a>
                <a
                  href="https://www.researchgate.net/profile/Min-Ho-Seo-2?ev=hdr_xprf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  ResearchGate →
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Location
              <span className="block text-sm text-gray-600 font-normal mt-1">
                위치
              </span>
            </h3>
            <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center border border-gray-200">
              <div className="text-center p-4">
                <div className="text-4xl mb-2">📍</div>
                <p className="text-sm text-gray-600 font-medium">
                  45 Yongso-ro, Nam-gu, Busan 48547, Republic of Korea
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  부산광역시 남구 용소로 45 (대연캠퍼스) 공학 1관(E13) 1308호
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Pukyong National University, Busan Campus
                  <br />
                  Engineering Building 1 (E13), Room 1308
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

