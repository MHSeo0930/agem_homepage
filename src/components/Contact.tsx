"use client";

import { useState, useEffect } from "react";
import EditableContent from "./EditableContent";
import { useAuth } from "@/hooks/useAuth";
import { getApiBase } from "@/lib/apiBase";

// 구글 맵 ?q=...&output=embed 는 임베드 제한으로 깨질 수 있음 → API 키 또는 OpenStreetMap 사용
const PKNU_LAT = 35.1376;
const PKNU_LON = 129.0847;
const OSM_BBOX = "129.078,35.130,129.092,35.145";
const ADDRESS = "부산광역시 남구 용소로 45";
const GOOGLE_MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;
const OSM_LINK = `https://www.openstreetmap.org/?mlat=${PKNU_LAT}&mlon=${PKNU_LON}&zoom=17`;

function MapIframe() {
  const apiKey =
    typeof process !== "undefined" ? process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY : undefined;
  const addressEncoded = encodeURIComponent(ADDRESS);

  if (apiKey) {
    return (
      <iframe
        src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${addressEncoded}&zoom=17&language=ko`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        className="w-full h-full min-h-[280px]"
        title="부산광역시 남구 용소로 45"
      />
    );
  }

  return (
    <div className="w-full h-full min-h-[280px] relative">
      <iframe
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${OSM_BBOX}&layer=mapnik&marker=${PKNU_LAT}%2C${PKNU_LON}`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        className="w-full h-full min-h-[280px] absolute inset-0"
        title="부산광역시 남구 용소로 45"
      />
      {/* 일부 환경에서 iframe이 차단될 때를 위한 대체 링크 */}
      <div className="absolute bottom-2 right-2 flex gap-2">
        <a
          href={GOOGLE_MAPS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 bg-white/95 text-gray-800 text-xs font-medium rounded shadow hover:bg-gray-100"
        >
          Google 지도에서 보기
        </a>
        <a
          href={OSM_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 bg-white/95 text-gray-800 text-xs font-medium rounded shadow hover:bg-gray-100"
        >
          OpenStreetMap
        </a>
      </div>
    </div>
  );
}

export default function Contact() {
  const { authenticated } = useAuth();
  const [contactData, setContactData] = useState({
    title: "Contact",
    titleKo: "연락처",
    officeTitle: "Office Information",
    officeTitleKo: "사무실 정보",
    department: "Nanoconvergence Engineering",
    departmentKo: "나노융합공학과",
    institution: "Pukyong National University (PKNU)",
    institutionKo: "부경대학교",
    office: "공학1관(E13) 1308호",
    officeKo: "Engineering Building 1 (E13), Room 1308",
    email: "foifrit@pknu.ac.kr",
    phone: "051-629-6393",
    address: "45 Yongso-ro, Nam-gu, Busan 48547",
    addressKo: "부산광역시 남구 용소로 45 (대연캠퍼스) 공학 1관(E13) 1308호",
    researchLinksTitle: "Research Links",
    researchLinksTitleKo: "연구 링크",
    locationTitle: "Location",
    locationTitleKo: "위치",
    locationAddress: "45 Yongso-ro, Nam-gu, Busan 48547, Republic of Korea",
    locationAddressKo: "부산광역시 남구 용소로 45 (대연캠퍼스) 공학 1관(E13) 1308호",
    locationDetail: "Pukyong National University, Busan Campus\nEngineering Building 1 (E13), Room 1308",
    orcidLink: "https://orcid.org/0000-0003-3910-4512",
    googleScholarLink: "https://scholar.google.com/citations?user=XXXXXXX",
    researchGateLink: "https://www.researchgate.net/profile/Min-Ho-Seo-2?ev=hdr_xprf",
  });

  const loadData = async () => {
    try {
      const res = await fetch(`${getApiBase()}/api/content`);
      const data = await res.json();
      if (data.contact) {
        try {
          const parsed = JSON.parse(data.contact);
          setContactData(parsed);
        } catch (e) {
          console.error("Failed to parse contact data");
        }
      }
    } catch (error) {
      console.error("Failed to load contact data", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (field: string, value: string) => {
    const updatedData = { ...contactData, [field]: value };
    
    // 먼저 상태를 업데이트하여 UI에 즉시 반영
    setContactData(updatedData);
    
    const response = await fetch(`${getApiBase()}/api/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ contact: JSON.stringify(updatedData) }),
    });
    if (!response.ok) {
      // 실패 시 이전 상태로 복원
      setContactData(contactData);
      throw new Error("Failed to save");
    }
    
    // 저장 후 데이터 다시 로드하여 서버와 동기화
    // 약간의 지연을 두어 EditableContent가 먼저 업데이트되도록 함
    setTimeout(async () => {
      await loadData();
    }, 50);
  };

  return (
    <section id="contact" className="py-16 bg-gray-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <EditableContent
            contentKey="contact-title"
            defaultValue={`<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">${contactData?.title || "Contact"}<span class="block text-2xl md:text-3xl text-gray-600 font-normal mt-2">${contactData?.titleKo || "연락처"}</span></h2>`}
            onSave={async (content) => {
              const tempDiv = document.createElement("div");
              tempDiv.innerHTML = content;
              const titleElement = tempDiv.querySelector("h2");
              const titleKoElement = tempDiv.querySelector("span");
              if (titleElement) {
                const titleText = titleElement.childNodes[0]?.textContent || "";
                const titleKoText = titleKoElement?.textContent || "";
                await handleSave("title", titleText);
                await handleSave("titleKo", titleKoText);
              }
            }}
            isAuthenticated={authenticated}
          />
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <EditableContent
                contentKey="contact-office-title"
                defaultValue={`<h3 class="text-lg font-semibold text-gray-900 mb-4">${contactData?.officeTitle || "Office Information"}<span class="block text-sm text-gray-600 font-normal mt-1">${contactData?.officeTitleKo || "사무실 정보"}</span></h3>`}
                onSave={async (content) => {
                  const tempDiv = document.createElement("div");
                  tempDiv.innerHTML = content;
                  const titleElement = tempDiv.querySelector("h3");
                  const titleKoElement = tempDiv.querySelector("span");
                  if (titleElement) {
                    const titleText = titleElement.childNodes[0]?.textContent || "";
                    const titleKoText = titleKoElement?.textContent || "";
                    await handleSave("officeTitle", titleText);
                    await handleSave("officeTitleKo", titleKoText);
                  }
                }}
                isAuthenticated={authenticated}
              />
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Department:</span>{" "}
                  <EditableContent
                    contentKey="contact-department"
                    defaultValue={`<span>${contactData?.department || "Nanoconvergence Engineering"}</span>`}
                    onSave={async (content) => {
                      const tempDiv = document.createElement("div");
                      tempDiv.innerHTML = content;
                      const text = tempDiv.textContent || tempDiv.innerText || "";
                      await handleSave("department", text);
                    }}
                    isAuthenticated={authenticated}
                  />
                  <br />
                  <EditableContent
                    contentKey="contact-department-ko"
                    defaultValue={`<span class="text-xs text-gray-600">${contactData?.departmentKo || "나노융합공학과"}</span>`}
                    onSave={async (content) => {
                      const tempDiv = document.createElement("div");
                      tempDiv.innerHTML = content;
                      const text = tempDiv.textContent || tempDiv.innerText || "";
                      await handleSave("departmentKo", text);
                    }}
                    isAuthenticated={authenticated}
                  />
                </p>
                <p>
                  <span className="font-medium">Institution:</span>{" "}
                  <EditableContent
                    contentKey="contact-institution"
                    defaultValue={`<span>${contactData?.institution || "Pukyong National University (PKNU)"}</span>`}
                    onSave={async (content) => {
                      const tempDiv = document.createElement("div");
                      tempDiv.innerHTML = content;
                      const text = tempDiv.textContent || tempDiv.innerText || "";
                      await handleSave("institution", text);
                    }}
                    isAuthenticated={authenticated}
                  />
                  <br />
                  <EditableContent
                    contentKey="contact-institution-ko"
                    defaultValue={`<span class="text-xs text-gray-600">${contactData?.institutionKo || "부경대학교"}</span>`}
                    onSave={async (content) => {
                      const tempDiv = document.createElement("div");
                      tempDiv.innerHTML = content;
                      const text = tempDiv.textContent || tempDiv.innerText || "";
                      await handleSave("institutionKo", text);
                    }}
                    isAuthenticated={authenticated}
                  />
                </p>
                <p>
                  <span className="font-medium">Office:</span>{" "}
                  <EditableContent
                    contentKey="contact-office"
                    defaultValue={`<span>${contactData?.office || "공학1관(E13) 1308호"}</span>`}
                    onSave={async (content) => {
                      const tempDiv = document.createElement("div");
                      tempDiv.innerHTML = content;
                      const text = tempDiv.textContent || tempDiv.innerText || "";
                      await handleSave("office", text);
                    }}
                    isAuthenticated={authenticated}
                  />
                  <br />
                  <EditableContent
                    contentKey="contact-office-ko"
                    defaultValue={`<span class="text-xs text-gray-600">${contactData?.officeKo || "Engineering Building 1 (E13), Room 1308"}</span>`}
                    onSave={async (content) => {
                      const tempDiv = document.createElement("div");
                      tempDiv.innerHTML = content;
                      const text = tempDiv.textContent || tempDiv.innerText || "";
                      await handleSave("officeKo", text);
                    }}
                    isAuthenticated={authenticated}
                  />
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  <EditableContent
                    contentKey="contact-email"
                    defaultValue={`<a href="mailto:${contactData?.email || "foifrit@pknu.ac.kr"}" class="text-blue-600 hover:text-blue-700">${contactData?.email || "foifrit@pknu.ac.kr"}</a>`}
                    onSave={async (content) => {
                      const tempDiv = document.createElement("div");
                      tempDiv.innerHTML = content;
                      const text = tempDiv.textContent || tempDiv.innerText || "";
                      await handleSave("email", text);
                    }}
                    isAuthenticated={authenticated}
                  />
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  <EditableContent
                    contentKey="contact-phone"
                    defaultValue={`<span>${contactData?.phone || "051-629-6393"}</span>`}
                    onSave={async (content) => {
                      const tempDiv = document.createElement("div");
                      tempDiv.innerHTML = content;
                      const text = tempDiv.textContent || tempDiv.innerText || "";
                      await handleSave("phone", text);
                    }}
                    isAuthenticated={authenticated}
                  />
                </p>
                <p>
                  <span className="font-medium">Address:</span>{" "}
                  <EditableContent
                    contentKey="contact-address"
                    defaultValue={`<span>${contactData?.address || "45 Yongso-ro, Nam-gu, Busan 48547"}</span>`}
                    onSave={async (content) => {
                      const tempDiv = document.createElement("div");
                      tempDiv.innerHTML = content;
                      const text = tempDiv.textContent || tempDiv.innerText || "";
                      await handleSave("address", text);
                    }}
                    isAuthenticated={authenticated}
                  />
                  <br />
                  <EditableContent
                    contentKey="contact-address-ko"
                    defaultValue={`<span class="text-xs text-gray-600">${contactData?.addressKo || "부산광역시 남구 용소로 45 (대연캠퍼스) 공학 1관(E13) 1308호"}</span>`}
                    onSave={async (content) => {
                      const tempDiv = document.createElement("div");
                      tempDiv.innerHTML = content;
                      const text = tempDiv.textContent || tempDiv.innerText || "";
                      await handleSave("addressKo", text);
                    }}
                    isAuthenticated={authenticated}
                  />
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <EditableContent
                contentKey="contact-research-links-title"
                defaultValue={`<h3 class="text-lg font-semibold text-gray-900 mb-4">${contactData?.researchLinksTitle || "Research Links"}<span class="block text-sm text-gray-600 font-normal mt-1">${contactData?.researchLinksTitleKo || "연구 링크"}</span></h3>`}
                onSave={async (content) => {
                  const tempDiv = document.createElement("div");
                  tempDiv.innerHTML = content;
                  const titleElement = tempDiv.querySelector("h3");
                  const titleKoElement = tempDiv.querySelector("span");
                  if (titleElement) {
                    const titleText = titleElement.childNodes[0]?.textContent || "";
                    const titleKoText = titleKoElement?.textContent || "";
                    await handleSave("researchLinksTitle", titleText);
                    await handleSave("researchLinksTitleKo", titleKoText);
                  }
                }}
                isAuthenticated={authenticated}
              />
              <div className="space-y-2">
                <a
                  href={contactData?.orcidLink || "https://orcid.org/0000-0003-3910-4512"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  ORCID Profile →
                </a>
                <a
                  href={contactData?.googleScholarLink || "https://scholar.google.com/citations?user=XXXXXXX"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Google Scholar →
                </a>
                <a
                  href={contactData?.researchGateLink || "https://www.researchgate.net/profile/Min-Ho-Seo-2?ev=hdr_xprf"}
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
            <EditableContent
              contentKey="contact-location-title"
              defaultValue={`<h3 class="text-lg font-semibold text-gray-900 mb-4">${contactData?.locationTitle || "Location"}<span class="block text-sm text-gray-600 font-normal mt-1">${contactData?.locationTitleKo || "위치"}</span></h3>`}
              onSave={async (content) => {
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = content;
                const titleElement = tempDiv.querySelector("h3");
                const titleKoElement = tempDiv.querySelector("span");
                if (titleElement) {
                  const titleText = titleElement.childNodes[0]?.textContent || "";
                  const titleKoText = titleKoElement?.textContent || "";
                  await handleSave("locationTitle", titleText);
                  await handleSave("locationTitleKo", titleKoText);
                }
              }}
              isAuthenticated={authenticated}
            />
            <div className="aspect-video rounded-lg mb-4 overflow-hidden border border-gray-200">
              <MapIframe />
            </div>
            <div className="text-center">
              <EditableContent
                contentKey="contact-location-address"
                defaultValue={`<p class="text-sm text-gray-600 font-medium">${contactData?.locationAddress || "45 Yongso-ro, Nam-gu, Busan 48547, Republic of Korea"}</p>`}
                onSave={async (content) => {
                  const tempDiv = document.createElement("div");
                  tempDiv.innerHTML = content;
                  const text = tempDiv.textContent || tempDiv.innerText || "";
                  await handleSave("locationAddress", text);
                }}
                isAuthenticated={authenticated}
              />
              <EditableContent
                contentKey="contact-location-address-ko"
                defaultValue={`<p class="text-xs text-gray-500 mt-1">${contactData?.locationAddressKo || "부산광역시 남구 용소로 45 (대연캠퍼스) 공학 1관(E13) 1308호"}</p>`}
                onSave={async (content) => {
                  const tempDiv = document.createElement("div");
                  tempDiv.innerHTML = content;
                  const text = tempDiv.textContent || tempDiv.innerText || "";
                  await handleSave("locationAddressKo", text);
                }}
                isAuthenticated={authenticated}
              />
              <EditableContent
                contentKey="contact-location-detail"
                defaultValue={`<p class="text-xs text-gray-500 mt-2">${(contactData?.locationDetail || "Pukyong National University, Busan Campus\nEngineering Building 1 (E13), Room 1308").replace(/\n/g, '<br />')}</p>`}
                onSave={async (content) => {
                  const tempDiv = document.createElement("div");
                  tempDiv.innerHTML = content;
                  const text = tempDiv.textContent || tempDiv.innerText || "";
                  await handleSave("locationDetail", text);
                }}
                isAuthenticated={authenticated}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
