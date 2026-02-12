"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getApiBase } from "@/lib/apiBase";
import EditableContent from "@/components/EditableContent";
import EditableImage from "@/components/EditableImage";

interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  institutionKo: string;
}

interface CareerItem {
  title: string;
  institution: string;
  period: string;
  titleKo: string;
  institutionKo: string;
}

interface LinkItem {
  name: string;
  url: string;
}

interface ProfessorData {
  name: string;
  nameKo: string;
  position: string;
  positionKo: string;
  department: string;
  departmentKo: string;
  institution: string;
  institutionKo: string;
  office: string;
  officeKo: string;
  email: string;
  phone: string;
  labName: string;
  image: string;
  researchInterests: string;
  researchInterestsKo: string;
  education: EducationItem[];
  career: CareerItem[];
  links: LinkItem[];
}

const defaultProfessorData: ProfessorData = {
  name: "Min Ho Seo",
  nameKo: "서민호",
  position: "Associate Professor",
  positionKo: "부교수",
  department: "Department of Nanoconvergence Engineering",
  departmentKo: "부경대학교 나노융합공학과",
  institution: "Pukyong National University (PKNU)",
  institutionKo: "부경대학교",
  office: "공학1관(E13) 1308호",
  officeKo: "Engineering Building 1 (E13), Room 1308",
  email: "foifrit@pknu.ac.kr",
  phone: "051-629-6393",
  labName: "AI & Green Energy Material Lab.",
  image: "/images/members/professor.jpg",
  researchInterests: "AI & Green Energy Material Lab. We develop high-performance and durable electrocatalysts and electrodes for electrochemical energy conversion systems including fuel cells, water electrolysis, and metal-air batteries. Our research focuses on advanced materials development and applications for improving the efficiency of electrochemical energy conversion systems.",
  researchInterestsKo: "인공지능 그린에너지 소재 연구실. 연료전지, 수전해, 금속-공기 전지 등 전기화학 에너지 전환 시스템을 위한 고활성·고내구 전기촉매 및 전극 개발 연구를 수행합니다. 전기화학 에너지 전환 시스템의 효율 향상을 위한 첨단 소재 개발 및 응용 연구를 진행하고 있습니다.",
  education: [
    {
      degree: "Ph.D. in Materials Science and Engineering",
      institution: "Gwangju Institute of Science and Technology (GIST)",
      period: "2007.09 – 2012.02",
      institutionKo: "광주과학기술원(GIST) 신소재공학부 박사 (지도교수: 김원배)",
    },
    {
      degree: "M.S. in Materials Science and Engineering",
      institution: "Gwangju Institute of Science and Technology (GIST)",
      period: "2005.09 – 2007.08",
      institutionKo: "광주과학기술원(GIST) 신소재공학부 석사 (지도교수: 김원배)",
    },
    {
      degree: "B.S. in Materials Science and Engineering",
      institution: "Sungkyunkwan University",
      period: "1998.03 – 2005.08",
      institutionKo: "성균관대학교 신소재공학부 학사",
    },
  ],
  career: [
    {
      title: "Associate Professor",
      institution: "Pukyong National University, Department of Nanoconvergence Engineering",
      period: "2025.03 – Present",
      titleKo: "부경대학교 나노융합공학과 부교수",
      institutionKo: "(2025.03 – 현재)",
    },
    {
      title: "Assistant Professor",
      institution: "Pukyong National University, Department of Nanoconvergence Engineering",
      period: "2022.03 – 2025.02",
      titleKo: "부경대학교 나노융합공학과 조교수",
      institutionKo: "(2022.03 – 2025.02)",
    },
    {
      title: "Principal Researcher",
      institution: "Korea Institute of Energy Research (KIER)",
      period: "2020.02 – 2022.02",
      titleKo: "한국에너지기술연구원(KIER) 책임연구원",
      institutionKo: "(2020.02 – 2022.02)",
    },
    {
      title: "Senior Researcher",
      institution: "Korea Institute of Energy Research (KIER)",
      period: "2016.03 – 2020.02",
      titleKo: "한국에너지기술연구원(KIER) 선임연구원",
      institutionKo: "(2016.03 – 2020.02)",
    },
    {
      title: "Postdoctoral Researcher",
      institution: "University of Waterloo, Department of Chemical Engineering (Advisor: Zhongwei Chen)",
      period: "2013.08 – 2016.01",
      titleKo: "워털루 대학교 화학공학과 박사후 연구원 (지도교수: Zhongwei Chen)",
      institutionKo: "(2013.08 – 2016.01)",
    },
    {
      title: "Postdoctoral Researcher",
      institution: "DGIST, School of Energy Science and Engineering (Advisor: Byeong-chan Han)",
      period: "2012.02 – 2013.05",
      titleKo: "대구경북과학기술원(DGIST) 에너지시스템공학과 박사후 연구원 (지도교수: 한병찬)",
      institutionKo: "(2012.02 – 2013.05)",
    },
  ],
  links: [
    { name: "ORCID", url: "https://orcid.org/0000-0003-3910-4512" },
    { name: "Google Scholar", url: "https://scholar.google.com/citations?user=XXXXXXX" },
    { name: "ResearchGate", url: "https://www.researchgate.net/profile/Min-Ho-Seo-2?ev=hdr_xprf" },
  ],
};

/** <br /> / </p><p> / 줄바꿈으로 구분된 두 줄을 파싱 (textContent는 br을 줄바꿈으로 주지 않아 한 줄로 붙음) */
function parseBrOrNewline(body: HTMLElement): [string, string] {
  const html = body.innerHTML || "";
  let rawParts: string[];
  const byBr = html.split(/<br\s*\/?>/i);
  if (byBr.length >= 2) {
    rawParts = byBr;
  } else {
    const byP = html.split(/<\/p>\s*<p[^>]*>/i);
    if (byP.length >= 2) rawParts = byP;
    else {
      const byNewline = (byBr[0] || "").split(/\n/).map((s) => s.trim()).filter(Boolean);
      rawParts = byNewline.length >= 2 ? byNewline : byBr;
    }
  }
  const parts = rawParts.map((raw) => {
    const div = document.createElement("div");
    div.innerHTML = raw;
    return (div.textContent || "").trim();
  });
  return [parts[0] || "", parts[1] ?? ""];
}

export default function ProfessorPage() {
  const { authenticated } = useAuth();
  const [professorData, setProfessorData] = useState<ProfessorData>(defaultProfessorData);

  const loadData = async () => {
    try {
      // 캐시 회피: 새로고침/저장 후에도 항상 최신 content.json 반영
      const url = `${getApiBase()}/api/content?_=${Date.now()}`;
      const res = await fetch(url, { cache: "no-store", credentials: "include" });
      const data = await res.json();
      if (data.professor) {
        try {
          const parsed = JSON.parse(data.professor);
          setProfessorData({ ...defaultProfessorData, ...parsed });
        } catch (e) {
          console.error("Failed to parse professor data");
        }
      }
    } catch (error) {
      console.error("Failed to load professor data", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /** 단일 필드 저장 (다른 게시판과 동일한 방식) */
  const handleSave = async (field: string, value: string | EducationItem[] | CareerItem[] | LinkItem[]) => {
    const updatedData = { ...professorData, [field]: value };
    setProfessorData(updatedData);
    const response = await fetch(`${getApiBase()}/api/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ professor: JSON.stringify(updatedData) }),
    });
    if (!response.ok) {
      if (field !== "image") setProfessorData(professorData);
      throw new Error("Failed to save");
    }
    if (field === "image") return;
    setTimeout(() => loadData(), 400);
  };

  /** 여러 필드를 한 번에 저장 (연속 handleSave 시 두 번째가 첫 번째를 덮어쓰는 문제 방지) */
  const handleSavePartial = async (updates: Partial<ProfessorData>) => {
    const updatedData = { ...professorData, ...updates };
    setProfessorData(updatedData);
    const response = await fetch(`${getApiBase()}/api/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ professor: JSON.stringify(updatedData) }),
    });
    if (!response.ok) {
      setProfessorData(professorData);
      throw new Error("Failed to save");
    }
    setTimeout(() => loadData(), 400);
  };

  const handleImageSave = async (imageUrl: string) => {
    await handleSave("image", imageUrl);
  };

  const handleEducationSave = async (index: number, field: string, value: string) => {
    const updatedEducation = [...professorData.education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    await handleSave("education", updatedEducation);
  };

  const handleCareerSave = async (index: number, field: string, value: string) => {
    const updatedCareer = [...professorData.career];
    updatedCareer[index] = { ...updatedCareer[index], [field]: value };
    await handleSave("career", updatedCareer);
  };

  const handleLinkSave = async (index: number, field: string, value: string) => {
    const updatedLinks = [...professorData.links];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    await handleSave("links", updatedLinks);
  };

  return (
    <div className="flex flex-col">
      <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-0">
            <EditableContent
              contentKey="professor-page-title"
              defaultValue={`<h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Professor<span class="block text-3xl md:text-4xl text-gray-600 font-normal mt-2">교수</span></h1>`}
              onSave={async (content) => {
                // Title editing can be implemented if needed
              }}
              isAuthenticated={authenticated}
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="md:col-span-1">
                <div className="aspect-square bg-gray-200 rounded-xl mb-4 overflow-hidden relative">
                  <EditableImage
                    src={professorData.image || "/images/members/professor.jpg"}
                    alt={`${professorData.name} (${professorData.nameKo})`}
                    contentKey="professor-image"
                    onSave={handleImageSave}
                    isAuthenticated={authenticated}
                    className="object-cover object-top"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  <EditableContent
                    contentKey="professor-name"
                    defaultValue={`${professorData.name}<span class="block text-xl text-gray-600 font-normal mt-1">${professorData.nameKo}</span>`}
                    onSave={async (content) => {
                      const parser = new DOMParser();
                      const doc = parser.parseFromString(content, "text/html");
                      const text = doc.body.textContent || "";
                      const lines = text.split("\n").map(l => l.trim()).filter(l => l);
                      await handleSavePartial({
                        name: lines[0] || professorData.name,
                        nameKo: lines[1] ?? professorData.nameKo,
                      });
                    }}
                    isAuthenticated={authenticated}
                  />
                  <span className="block text-lg text-indigo-600 font-medium mt-2">
                    <EditableContent
                      contentKey="professor-lab-name"
                      defaultValue={professorData.labName}
                      onSave={async (content) => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(content, "text/html");
                        const text = doc.body.textContent || "";
                        await handleSave("labName", text.trim() || professorData.labName);
                      }}
                      isAuthenticated={authenticated}
                    />
                  </span>
                </h2>
                <div className="space-y-4 text-gray-700">
                  <div>
                    <p className="font-semibold mb-1">Position / 직위</p>
                    <p className="text-gray-600">
                      <EditableContent
                        contentKey="professor-position"
                        defaultValue={`${professorData.position} / ${professorData.positionKo}`}
                        onSave={async (content) => {
                          const parser = new DOMParser();
                          const doc = parser.parseFromString(content, "text/html");
                          const text = doc.body.textContent || "";
                          const parts = text.split("/").map(p => p.trim());
                          await handleSavePartial({
                            position: parts[0] || professorData.position,
                            positionKo: parts[1] ?? professorData.positionKo,
                          });
                        }}
                        isAuthenticated={authenticated}
                      />
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Department / 소속</p>
                    <p className="text-gray-600">
                      <EditableContent
                        contentKey="professor-department"
                        defaultValue={`${professorData.department}<br /><span class="text-sm">${professorData.departmentKo}</span>`}
                        onSave={async (content) => {
                          const parser = new DOMParser();
                          const doc = parser.parseFromString(content, "text/html");
                          const lines = parseBrOrNewline(doc.body);
                          await handleSavePartial({
                            department: lines[0] || professorData.department,
                            departmentKo: lines[1] ?? professorData.departmentKo,
                          });
                        }}
                        isAuthenticated={authenticated}
                      />
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Institution / 기관</p>
                    <p className="text-gray-600">
                      <EditableContent
                        contentKey="professor-institution"
                        defaultValue={`${professorData.institution}<br /><span class="text-sm">${professorData.institutionKo}</span>`}
                        onSave={async (content) => {
                          const parser = new DOMParser();
                          const doc = parser.parseFromString(content, "text/html");
                          const lines = parseBrOrNewline(doc.body);
                          await handleSavePartial({
                            institution: lines[0] || professorData.institution,
                            institutionKo: lines[1] ?? professorData.institutionKo,
                          });
                        }}
                        isAuthenticated={authenticated}
                      />
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Office / 연구실</p>
                    <p className="text-gray-600">
                      <EditableContent
                        contentKey="professor-office"
                        defaultValue={`${professorData.office}<br /><span class="text-sm">${professorData.officeKo}</span>`}
                        onSave={async (content) => {
                          const parser = new DOMParser();
                          const doc = parser.parseFromString(content, "text/html");
                          const lines = parseBrOrNewline(doc.body);
                          await handleSavePartial({
                            office: lines[0] || professorData.office,
                            officeKo: lines[1] ?? professorData.officeKo,
                          });
                        }}
                        isAuthenticated={authenticated}
                      />
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Email / 이메일</p>
                    <EditableContent
                      contentKey="professor-email"
                      defaultValue={`<a href="mailto:${professorData.email}" class="text-indigo-600 hover:text-indigo-700">${professorData.email}</a>`}
                      onSave={async (content) => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(content, "text/html");
                        const link = doc.querySelector("a");
                        const email = link?.href?.replace("mailto:", "") || link?.textContent?.trim() || "";
                        if (email) await handleSave("email", email);
                      }}
                      isAuthenticated={authenticated}
                    />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Phone / 전화</p>
                    <p className="text-gray-600">
                      <EditableContent
                        contentKey="professor-phone"
                        defaultValue={professorData.phone}
                        onSave={async (content) => {
                          const parser = new DOMParser();
                          const doc = parser.parseFromString(content, "text/html");
                          const text = doc.body.textContent || "";
                          await handleSave("phone", text.trim() || professorData.phone);
                        }}
                        isAuthenticated={authenticated}
                      />
                    </p>
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
                <EditableContent
                  contentKey="professor-research-interests"
                  defaultValue={`<p>${professorData.researchInterests}</p><p class="text-sm text-gray-600">${professorData.researchInterestsKo}</p>`}
                  onSave={async (content) => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(content, "text/html");
                    const paragraphs = doc.querySelectorAll("p");
                    await handleSavePartial({
                      researchInterests: paragraphs[0]?.textContent?.trim() ?? professorData.researchInterests,
                      researchInterestsKo: paragraphs[1]?.textContent?.trim() ?? professorData.researchInterestsKo,
                    });
                  }}
                  isAuthenticated={authenticated}
                />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
                Education / 학력
              </h3>
              <div className="space-y-3 text-gray-700">
                {professorData.education.map((edu, index) => (
                  <div key={index} className="border-l-4 border-indigo-500 pl-4">
                    <EditableContent
                      contentKey={`professor-education-${index}-degree`}
                      defaultValue={`<p class="font-semibold">${edu.degree}</p>`}
                      onSave={async (content) => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(content, "text/html");
                        const text = doc.body.textContent || "";
                        await handleEducationSave(index, "degree", text.trim());
                      }}
                      isAuthenticated={authenticated}
                    />
                    <EditableContent
                      contentKey={`professor-education-${index}-institution`}
                      defaultValue={`<p class="text-sm text-gray-600">${edu.institution}, ${edu.period}</p><p class="text-xs text-gray-500">${edu.institutionKo}</p>`}
                      onSave={async (content) => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(content, "text/html");
                        const paragraphs = doc.querySelectorAll("p");
                        const updatedEducation = [...professorData.education];
                        const current = { ...updatedEducation[index] };
                        if (paragraphs[0]) {
                          const text = paragraphs[0].textContent || "";
                          const parts = text.split(",").map(p => p.trim());
                          if (parts[0]) current.institution = parts[0];
                          if (parts[1]) current.period = parts[1];
                        }
                        if (paragraphs[1]) {
                          const text = paragraphs[1].textContent || "";
                          current.institutionKo = text.trim();
                        }
                        updatedEducation[index] = current;
                        await handleSave("education", updatedEducation);
                      }}
                      isAuthenticated={authenticated}
                    />
                  </div>
                ))}
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
                Career / 경력
              </h3>
              <div className="space-y-3 text-gray-700">
                {professorData.career.map((career, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <EditableContent
                      contentKey={`professor-career-${index}-title`}
                      defaultValue={`<p class="font-semibold">${career.title}</p>`}
                      onSave={async (content) => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(content, "text/html");
                        const text = doc.body.textContent || "";
                        await handleCareerSave(index, "title", text.trim());
                      }}
                      isAuthenticated={authenticated}
                    />
                    <EditableContent
                      contentKey={`professor-career-${index}-institution`}
                      defaultValue={`<p class="text-sm text-gray-600">${career.institution}, ${career.period}</p><p class="text-xs text-gray-500">${career.titleKo} ${career.institutionKo}</p>`}
                      onSave={async (content) => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(content, "text/html");
                        const paragraphs = doc.querySelectorAll("p");
                        const updatedCareer = [...professorData.career];
                        const current = { ...updatedCareer[index] };
                        if (paragraphs[0]) {
                          const text = paragraphs[0].textContent || "";
                          const parts = text.split(",").map(p => p.trim());
                          if (parts[0]) current.institution = parts[0];
                          if (parts[1]) current.period = parts[1];
                        }
                        if (paragraphs[1]) {
                          const text = paragraphs[1].textContent || "";
                          const parts = text.split(" ").filter(p => p);
                          if (parts.length > 0) {
                            const lastPart = parts[parts.length - 1];
                            if (lastPart.startsWith("(")) {
                              current.institutionKo = lastPart;
                              current.titleKo = parts.slice(0, -1).join(" ");
                            } else {
                              current.titleKo = text.trim();
                            }
                          }
                        }
                        updatedCareer[index] = current;
                        await handleSave("career", updatedCareer);
                      }}
                      isAuthenticated={authenticated}
                    />
                  </div>
                ))}
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
                Research Links / 연구 링크
              </h3>
              <div className="flex flex-wrap gap-4">
                {professorData.links.map((link, index) => (
                  <EditableContent
                    key={index}
                    contentKey={`professor-link-${index}`}
                    defaultValue={`<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors">${link.name}</a>`}
                    onSave={async (content) => {
                      const parser = new DOMParser();
                      const doc = parser.parseFromString(content, "text/html");
                      const anchor = doc.querySelector("a");
                      const name = anchor?.textContent?.trim() || professorData.links[index]?.name || "";
                      const url = anchor?.href || professorData.links[index]?.url || "";
                      const updatedLinks = [...professorData.links];
                      updatedLinks[index] = { ...updatedLinks[index], name, url };
                      await handleSave("links", updatedLinks);
                    }}
                    isAuthenticated={authenticated}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
