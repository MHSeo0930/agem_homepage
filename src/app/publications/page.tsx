import { publications, type Publication } from "@/data/publications";
import { getContent } from "@/lib/contentStore";
import { getJournalDisplayName } from "@/lib/journalNames";

export const metadata = {
  title: "Publications | Min Ho Seo",
  description: "Publications in electrocatalysts, fuel cells, water electrolysis, and energy materials",
};

export const dynamic = "force-dynamic";

function toPublicationArray(parsed: unknown): Publication[] {
  if (Array.isArray(parsed)) return parsed as Publication[];
  if (parsed && typeof parsed === "object") return Object.values(parsed) as Publication[];
  return [];
}

export default async function PublicationsPage() {
  let allPublications: Publication[] = publications;

  try {
    const content = (await getContent()) as Record<string, unknown>;
    const raw = content.journalPublications;
    if (typeof raw === "string" && raw.trim() !== "") {
      const parsed = JSON.parse(raw);
      const list = toPublicationArray(parsed);
      if (list.length) {
        allPublications = list
          .map((p) => ({
            ...p,
            status: p.status === "게재됨" ? "published" : p.status,
          }))
          .sort((a, b) => (b.number ?? 0) - (a.number ?? 0));
      }
    }
  } catch (error) {
    console.error("Failed to load publications content", error);
  }

  const totalCount = allPublications.length;

  return (
    <div className="flex flex-col">
      <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Publications
              <span className="block text-3xl md:text-4xl text-gray-600 font-normal mt-2">
                논문 목록
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A comprehensive list of publications in electrocatalysts, fuel cells, water electrolysis, and energy materials.
              <br />
              <span className="text-base text-gray-500">
                전기촉매, 연료전지, 수전해, 에너지 소재 분야의 논문 목록입니다.
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Total: {totalCount} publications
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-6">
            {allPublications.map((pub) => (
              <div
                key={pub.number}
                className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-blue-600">#{pub.number}</span>
                    {pub.role && (
                      <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                        {pub.role}
                      </span>
                    )}
                    {pub.status === "submitted" && (
                      <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
                        Submitted
                      </span>
                    )}
                  </div>
                  {pub.specialNote && (
                    <span className="text-xs text-purple-600 font-medium">
                      ⭐ {pub.specialNote}
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 leading-tight">
                  {pub.title}
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  {pub.authors}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-base text-gray-800">
                    <span className="font-bold italic text-gray-900">
                      {getJournalDisplayName(pub.journal) || pub.journal}
                    </span>{" "}
                    <span className="font-semibold not-italic text-gray-700">({pub.year})</span>
                  </p>
                  {pub.if && (
                    <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded">
                      IF: {pub.if}
                    </span>
                  )}
                  {pub.jcrRanking && (
                    <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded">
                      JCR: {pub.jcrRanking?.endsWith("%") ? pub.jcrRanking : pub.jcrRanking ? `${pub.jcrRanking}%` : ""}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
