export default function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Min Ho Seo</h3>
            <p className="text-sm text-gray-600 mb-2">
              Associate Professor
              <br />
              <span className="text-gray-500">부교수</span>
            </p>
            <p className="text-sm text-gray-600">
              Department of Nanoconvergence Engineering
              <br />
              Pukyong National University
              <br />
              <span className="text-gray-500">부경대학교 나노융합공학과</span>
              <br />
              <span className="text-xs text-gray-500">공학1관(E13) 1308호 | Tel: 051-629-6393</span>
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/members/professor" className="text-gray-600 hover:text-gray-900">
                  Members
                </a>
              </li>
              <li>
                <a href="/research/green-energy-materials" className="text-gray-600 hover:text-gray-900">
                  Research
                </a>
              </li>
              <li>
                <a href="/achievements/journals" className="text-gray-600 hover:text-gray-900">
                  Achievements
                </a>
              </li>
              <li>
                <a href="/board/news" className="text-gray-600 hover:text-gray-900">
                  Board
                </a>
              </li>
              <li>
                <a href="/about-lab/map" className="text-gray-600 hover:text-gray-900">
                  About Lab
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Research Profiles</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://orcid.org/0000-0003-3910-4512"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  ORCID →
                </a>
              </li>
              <li>
                <a
                  href="https://scholar.google.com/citations?user=XXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  Google Scholar →
                </a>
              </li>
            </ul>
            <p className="text-sm text-gray-600 mt-4">
              Email:{" "}
              <a href="mailto:foifrit@pknu.ac.kr" className="text-indigo-600 hover:text-indigo-700">
                foifrit@pknu.ac.kr
              </a>
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} Min Ho Seo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

