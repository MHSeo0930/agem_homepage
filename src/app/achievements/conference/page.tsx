"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getApiBase } from "@/lib/apiBase";
import EditableContent from "@/components/EditableContent";

export default function ConferencePage() {
  const { authenticated } = useAuth();
  const [pageData, setPageData] = useState({
    title: "Conference Presentations",
    titleKo: "학회 발표",
    description: "Conference (Selected)",
    descriptionKo: "학회 발표 (선택)",
  });
  const [conferences, setConferences] = useState([
    {
      id: "conf-20",
      number: 20,
      title: "Multiscale modeling with neural network potential for durable electrocatalyst in PEM fuel cell",
      conference: "Nano Korea 2020 workshop",
      location: "KINTEX, Goyang-si, South Korea",
      date: "Jul. 1-3, 2020",
      type: "Invited",
      typeKo: "초청",
    },
    {
      id: "conf-19-1",
      number: 19,
      title: "Computational approaches for durable electro-catalyst in the PEM fuel cell",
      conference: "South Africa- South Korea 2019 workshop",
      location: "CSIR, Pretoria, South Africa",
      date: "Aug. 4-9, 2019",
      type: "Invited",
      typeKo: "초청",
    },
    {
      id: "conf-18",
      number: 18,
      title: "Multiscale modeling for durable electro-catalysts in the PEM Fuel Cell",
      conference: "2019 도 추계 한국전기화학회",
      location: "여수 엑스포 컨벤션 센터, 여수",
      date: "Nov. 7-9, 2019",
      type: "Invited",
      typeKo: "초청",
    },
    {
      id: "conf-17",
      number: 17,
      title: "Computational approaches for durable electro-catalyst in the PEM Fuel Cell",
      conference: "the 17th international nanotech symposium & exhibition NANO KOREA 2019 Symposium",
      location: "KINTEX, Korea",
      date: "July. 3 - 5, 2019",
      type: "Invited",
      typeKo: "초청",
    },
    {
      id: "conf-16",
      number: 16,
      title: "Computational Approaches for Durable Electro-catalyst in the PEM Fuel Cell",
      conference: "the 235 ECS Meeting",
      location: "Dallas, TX, US",
      date: "May 26-30, 2019",
      type: "Oral",
      typeKo: "구두",
    },
    {
      id: "conf-15",
      number: 15,
      title: "Computational prediction of durable electro-catalyst in the electrochemical energy conversion devices with experimental studies",
      conference: "한국신재생에너지 학회",
      location: "평창 알펜세아 컨벤션센터",
      date: "May. 9-10, 2019",
      type: "Invited",
      typeKo: "초청",
    },
    {
      id: "conf-14",
      number: 14,
      title: "Computational approaches for electrocatalytic activity and durability on Pt supported co-heteroatom doped graphene for fuel cells.",
      conference: "춘계한국전기화학회",
      location: "제주국제컨벤션센터",
      date: "April. 4 - 7, 2019",
      type: "Invited",
      typeKo: "초청",
    },
    {
      id: "conf-13",
      number: 13,
      title: "Computational prediction of durable electro-catalyst in the electrochemical energy conversion devices with experimental studies",
      conference: "International conference on electrochemical energy science and technology 2018 (EEST2018)",
      location: "Niagara, Ontario, Canada",
      date: "Aug. 13 - 17, 2018",
      type: "Invited",
      typeKo: "초청",
    },
    {
      id: "conf-12",
      number: 12,
      title: "Understanding and Designing Oxygen Reduction/Evolution Reaction (ORR/OER) Catalysts By Combining Experimental and Ab- Initio Studies",
      conference: "233 ECS Meeting",
      location: "Seattle, WA, US",
      date: "May 13-17, 2018",
      type: "Oral",
      typeKo: "구두",
    },
    {
      id: "conf-11",
      number: 11,
      title: "Highly active and durable electro-catalyst design for oxygen reduction/evolution reaction by combining experimental and ab-initio studies",
      conference: "ACEPS-9",
      location: "HICO, Gyeongju",
      date: "Aug. 20 - 23, 2017",
      type: "Oral",
      typeKo: "구두",
    },
    {
      id: "conf-10",
      number: 10,
      title: "Theoretical and experimental study of hetero-atom (N and S) doped graphene supported Pt with stability and activity toward oxygen reduction reaction",
      conference: "64th Canadian Chemical Engineering Conference",
      location: "Niagara, Ontario, Canada",
      date: "Oct. 19 - 22, 2014",
      type: "Oral",
      typeKo: "구두",
    },
    {
      id: "conf-9",
      number: 9,
      title: "The ab-initio study of iron phtalocyanie derived Fe-SPc catalysts for oxygen reduction reaction (ORR) in PEM Fuel Cells",
      conference: "15th Topical ISE Meeting",
      location: "Niagara, Ontario, Canada",
      date: "April 27 - 30, 2014",
      type: "Oral",
      typeKo: "구두",
    },
    {
      id: "conf-8",
      number: 8,
      title: "The graphene-supported palladium and palladium-yttrium nanoparticles for the oxygen reduction and ethanol oxidation reactions: Experimental measurement and Computational validation",
      conference: "222nd ECS Prime Pacific Rim Meeting",
      location: "Hawaii, Honolulu, USA",
      date: "October 6-12, 2012",
      type: "Oral",
      typeKo: "구두",
    },
    {
      id: "conf-7",
      number: 7,
      title: "The graphene-supported Pd and Pt catalysts for highly active oxygen reduction reaction in an alkaline condition",
      conference: "The 6th International Fuel Cell Workshop 2012",
      location: "Kofu, Japan",
      date: "August 1-3, 2012",
      type: "Oral",
      typeKo: "구두",
    },
    {
      id: "conf-6",
      number: 6,
      title: "Synthesis, characterization, and electrocatalytic properties of a polypyrrole-composited Pd/C catalyst",
      conference: "218th ECS Meeting",
      location: "Las Vegas, NV, USA",
      date: "October 10-15, 2010",
      type: "Oral",
      typeKo: "구두",
    },
    {
      id: "conf-5",
      number: 5,
      title: "Carbon supported Pd nanoparticles composited by polypyrrole for polymer electrolyte fuel cell (PEMFC)",
      conference: "1st Ertl Symposium on Electrochemistry and Catalysis",
      location: "GIST, Gwangju, Korea",
      date: "April 11-14, 2010",
      type: "Oral",
      typeKo: "구두",
    },
    {
      id: "conf-4",
      number: 4,
      title: "Polypyrrole-composited Pd electrocatalyst for H2 electrooxidation.",
      conference: "The 12th Japan-Korea symposium on catalysis",
      location: "Akita, Japan",
      date: "October 14- 16, 2009",
      type: "Oral",
      typeKo: "구두",
    },
    {
      id: "conf-3",
      number: 3,
      title: "A polyoxometalate-modified Pt/CNT catalyst system for methanol electro-oxidation.",
      conference: "14th International Congress on Catalysis",
      location: "Seoul, Korea",
      date: "July 13-18, 2008",
      type: "Oral",
      typeKo: "구두",
    },
    {
      id: "conf-2",
      number: 2,
      title: "Acid-stabilized Pd-based electrocatalysts development for PEMFC.",
      conference: "2008 MRS spring Meeting",
      location: "San Francisco, CA, USA",
      date: "Mar. 24-28, 2008",
      type: "Oral",
      typeKo: "구두",
    },
    {
      id: "conf-1",
      number: 1,
      title: "A polyoxometalate-deposited Pt/CNTs electrocatalyst via chemical synthesis for methanol electrooxidation.",
      conference: "Joint Symposium on Materials Science and Engineering for the 21st Century",
      location: "Hsinchu, Tiwan",
      date: "Oct. 21-23, 2007",
      type: "Oral",
      typeKo: "구두",
    },
  ]);

  const loadData = async () => {
    try {
      const res = await fetch(`${getApiBase()}/api/content`);
      const data = await res.json();
      if (data.conferences) {
        try {
          const parsed = JSON.parse(data.conferences);
          // 배열인지 확인
          if (Array.isArray(parsed)) {
            setConferences(parsed);
          }
        } catch (e) {
          console.error("Failed to parse conferences data");
        }
      }
      
      // 페이지 데이터 로드
      if (data.conferencePage) {
        try {
          const parsed = JSON.parse(data.conferencePage);
          if (parsed && typeof parsed === 'object') {
            setPageData(prev => ({ ...prev, ...parsed }));
          }
        } catch (e) {
          console.error("Failed to parse conference page data");
        }
      }
    } catch (error) {
      console.error("Failed to load conferences data", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (confId: string, field: string, value: string) => {
    // 배열이 아닌 경우 처리
    if (!Array.isArray(conferences)) {
      console.error("Conferences is not an array");
      return;
    }
    
    const updatedConferences = conferences.map((conf) =>
      conf.id === confId ? { ...conf, [field]: value } : conf
    );
    setConferences(updatedConferences);
    
    const response = await fetch(`${getApiBase()}/api/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conferences: JSON.stringify(updatedConferences) }),
    });
    if (!response.ok) throw new Error("Failed to save");
    
    // 저장 후 데이터 다시 로드
    await loadData();
  };

  const handleAddConference = async () => {
    // 배열이 아닌 경우 처리
    if (!Array.isArray(conferences)) {
      console.error("Conferences is not an array");
      return;
    }
    
    const maxNumber = conferences.length > 0 ? Math.max(...conferences.map(c => c.number)) : 0;
    const newConference = {
      id: `conf-${Date.now()}`,
      number: maxNumber + 1,
      title: "New Conference Presentation",
      conference: "Conference Name",
      location: "Location",
      date: "Date",
      type: "Oral",
      typeKo: "구두",
    };
    const updatedConferences = [newConference, ...conferences].sort((a, b) => b.number - a.number);
    setConferences(updatedConferences);
    
    const response = await fetch(`${getApiBase()}/api/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conferences: JSON.stringify(updatedConferences) }),
    });
    if (!response.ok) throw new Error("Failed to add conference");
    
    // 저장 후 데이터 다시 로드
    await loadData();
  };

  const handleDeleteConference = async (confId: string) => {
    if (!confirm("이 학회 발표를 삭제하시겠습니까?")) return;
    
    // 배열이 아닌 경우 처리
    if (!Array.isArray(conferences)) {
      console.error("Conferences is not an array");
      return;
    }
    
    const updatedConferences = conferences.filter((conf) => conf.id !== confId);
    setConferences(updatedConferences);
    
    const response = await fetch(`${getApiBase()}/api/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conferences: JSON.stringify(updatedConferences) }),
    });
    if (!response.ok) throw new Error("Failed to delete conference");
    
    // 저장 후 데이터 다시 로드
    await loadData();
  };

  return (
    <div className="flex flex-col">
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <EditableContent
              contentKey="conference-page-title"
              defaultValue={`<h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">${pageData?.title || "Conference Presentations"}<span class="block text-3xl md:text-4xl text-gray-600 font-normal mt-2">${pageData?.titleKo || "학회 발표"}</span></h1>`}
              onSave={async (content) => {
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = content;
                const titleElement = tempDiv.querySelector("h1");
                const titleKoElement = tempDiv.querySelector("span");
                if (titleElement) {
                  const titleText = titleElement.childNodes[0]?.textContent || "";
                  const titleKoText = titleKoElement?.textContent || "";
                  
                  // 두 필드를 한 번에 저장
                  const updatedData = { 
                    ...pageData, 
                    title: titleText.trim(),
                    titleKo: titleKoText.trim()
                  };
                  
                  // 먼저 상태를 업데이트하여 UI에 즉시 반영
                  setPageData(updatedData);
                  
                  const response = await fetch(`${getApiBase()}/api/content`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ conferencePage: JSON.stringify(updatedData) }),
                  });
                  if (!response.ok) {
                    // 실패 시 이전 상태로 복원
                    setPageData(pageData);
                    throw new Error("Failed to save");
                  }
                  
                  // 저장 후 데이터 다시 로드하여 서버와 동기화
                  setTimeout(async () => {
                    await loadData();
                  }, 50);
                }
              }}
              isAuthenticated={authenticated}
            />
            <EditableContent
              contentKey="conference-page-description"
              defaultValue={`<p class="text-lg text-gray-600 max-w-2xl mx-auto">${pageData?.description || "Conference (Selected)"}<br /><span class="text-base text-gray-500">${pageData?.descriptionKo || "학회 발표 (선택)"}</span></p>`}
              onSave={async (content) => {
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = content;
                const pElement = tempDiv.querySelector("p");
                const spanElement = tempDiv.querySelector("span");
                
                // p 태그에서 span을 제외한 텍스트 추출
                let descriptionText = "";
                if (pElement) {
                  const pClone = pElement.cloneNode(true) as HTMLElement;
                  const spanInP = pClone.querySelector("span");
                  if (spanInP) {
                    spanInP.remove();
                  }
                  // <br /> 태그도 제거하고 텍스트만 추출
                  const brTags = pClone.querySelectorAll("br");
                  brTags.forEach(br => br.remove());
                  descriptionText = pClone.textContent || pClone.innerText || "";
                }
                
                // span 태그의 텍스트 추출
                const descriptionKoText = spanElement?.textContent || spanElement?.innerText || "";
                
                // 두 필드를 한 번에 저장
                const updatedData = { 
                  ...pageData, 
                  description: descriptionText.trim(),
                  descriptionKo: descriptionKoText.trim()
                };
                
                // 먼저 상태를 업데이트하여 UI에 즉시 반영
                setPageData(updatedData);
                
                const response = await fetch(`${getApiBase()}/api/content`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ conferencePage: JSON.stringify(updatedData) }),
                });
                if (!response.ok) {
                  // 실패 시 이전 상태로 복원
                  setPageData(pageData);
                  throw new Error("Failed to save");
                }
                
                // 저장 후 데이터 다시 로드하여 서버와 동기화
                setTimeout(async () => {
                  await loadData();
                }, 50);
              }}
              isAuthenticated={authenticated}
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {authenticated && (
              <div className="mb-6 flex justify-end">
                <button
                  onClick={handleAddConference}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  + 발표 추가
                </button>
              </div>
            )}
            <div className="space-y-6">
              {Array.isArray(conferences) ? conferences.sort((a, b) => b.number - a.number).map((conf) => (
                <div
                  key={conf.id}
                  className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 relative group"
                >
                  {authenticated && (
                    <button
                      onClick={() => handleDeleteConference(conf.id)}
                      className="absolute top-2 right-2 z-20 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                      title="발표 삭제"
                    >
                      ✕
                    </button>
                  )}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {conf.number})
                        </span>
                        {conf.type === "Invited" && (
                          <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">
                            Invited
                          </span>
                        )}
                      </div>
                      <EditableContent
                        contentKey={`conf-${conf.id}-title`}
                        defaultValue={`<h3 class="text-lg font-semibold text-gray-900 mb-2 leading-tight">${conf.title}</h3>`}
                        onSave={async (content) => {
                          const tempDiv = document.createElement("div");
                          tempDiv.innerHTML = content;
                          const text = tempDiv.textContent || tempDiv.innerText || "";
                          await handleSave(conf.id, "title", text);
                        }}
                        isAuthenticated={authenticated}
                      />
                      <div className="mt-2 space-y-1">
                        <EditableContent
                          contentKey={`conf-${conf.id}-conference`}
                          defaultValue={`<p class="text-sm text-gray-700"><span class="font-medium">${conf.conference}</span></p>`}
                          onSave={async (content) => {
                            const tempDiv = document.createElement("div");
                            tempDiv.innerHTML = content;
                            const text = tempDiv.textContent || tempDiv.innerText || "";
                            await handleSave(conf.id, "conference", text);
                          }}
                          isAuthenticated={authenticated}
                        />
                        <EditableContent
                          contentKey={`conf-${conf.id}-location`}
                          defaultValue={`<p class="text-sm text-gray-600">${conf.location}</p>`}
                          onSave={async (content) => {
                            const tempDiv = document.createElement("div");
                            tempDiv.innerHTML = content;
                            const text = tempDiv.textContent || tempDiv.innerText || "";
                            await handleSave(conf.id, "location", text);
                          }}
                          isAuthenticated={authenticated}
                        />
                        <EditableContent
                          contentKey={`conf-${conf.id}-date`}
                          defaultValue={`<p class="text-sm text-gray-600">(${conf.date})</p>`}
                          onSave={async (content) => {
                            const tempDiv = document.createElement("div");
                            tempDiv.innerHTML = content;
                            const text = tempDiv.textContent || tempDiv.innerText || "";
                            await handleSave(conf.id, "date", text);
                          }}
                          isAuthenticated={authenticated}
                        />
                      </div>
                      <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full">
                        {conf.type} / {conf.typeKo}
                      </span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center text-gray-500 py-8">
                  학회 발표 데이터를 불러오는 중...
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
