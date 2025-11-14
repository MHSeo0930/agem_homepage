"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import EditableContent from "@/components/EditableContent";
import EditableImage from "@/components/EditableImage";

export default function CurrentMembersPage() {
  const { authenticated } = useAuth();
  const [members, setMembers] = useState([
    {
      id: "minseon-park",
      name: "Minseon Park",
      nameKo: "박민선",
      position: "M.S./Ph.D.",
      positionKo: "석박사통합과정",
      affiliation: "POSTECH",
      research: "Energy Conversion Materials/ Computational Chemistry",
      researchKo: "에너지 전환 소재/ 계산 화학",
      note: "Co-supervised with W. B. Kim",
      email: "mail",
      tel: "--",
      image: "/images/members/minseon-park.jpg",
    },
    {
      id: "seung-min-woo",
      name: "Seung Min Woo",
      nameKo: "우승민",
      position: "M.S. candidate",
      positionKo: "석사과정",
      affiliation: "PKNU",
      research: "Energy Conversion Materials/ Computational Chemistry",
      researchKo: "에너지 전환 소재/ 계산 화학",
      email: "mail",
      tel: "--",
      image: "/images/members/seung-min-woo.jpg",
    },
    {
      id: "juwan-woo",
      name: "Juwan Woo",
      nameKo: "우주완",
      position: "M.S. candidate",
      positionKo: "석사과정",
      affiliation: "PKNU",
      research: "Energy Conversion Materials/ Computational Chemistry",
      researchKo: "에너지 전환 소재/ 계산 화학",
      email: "mail",
      tel: "--",
      image: "/images/members/juwan-woo.jpg",
    },
    {
      id: "daehun-kim",
      name: "Daehun Kim",
      nameKo: "김대훈",
      position: "M.S. candidate",
      positionKo: "석사과정",
      affiliation: "PKNU",
      research: "Energy Conversion Materials/ Computational Chemistry",
      researchKo: "에너지 전환 소재/ 계산 화학",
      email: "mail",
      tel: "--",
      image: "/images/members/daehun-kim.jpg",
    },
    {
      id: "mingyeong-jeong",
      name: "Mingyeong Jeong",
      nameKo: "정민경",
      position: "M.S. candidate",
      positionKo: "석사과정",
      affiliation: "PKNU",
      research: "Energy Conversion Materials/ Computational Chemistry",
      researchKo: "에너지 전환 소재/ 계산 화학",
      email: "mail",
      tel: "--",
      image: "/images/members/mingyeong-jeong.jpg",
    },
    {
      id: "yerim-kim",
      name: "Yerim Kim",
      nameKo: "김예림",
      position: "M.S. candidate",
      positionKo: "석사과정",
      affiliation: "PKNU",
      research: "Energy Conversion Materials/ Computational Chemistry",
      researchKo: "에너지 전환 소재/ 계산 화학",
      email: "mail",
      tel: "--",
      image: "/images/members/yerim-kim.jpg",
    },
    {
      id: "so-jin-bae",
      name: "So Jin Bae",
      nameKo: "배소진",
      position: "Undergraduate",
      positionKo: "학부생",
      affiliation: "PKNU",
      research: "Energy Conversion Materials/ Computational Chemistry",
      researchKo: "에너지 전환 소재/ 계산 화학",
      email: "mail",
      tel: "--",
      image: "/images/members/so-jin-bae.jpg",
    },
    {
      id: "juhyeong-jeon",
      name: "Juhyeong Jeon",
      nameKo: "전주형",
      position: "Undergraduate",
      positionKo: "학부생",
      affiliation: "PKNU",
      research: "Energy Conversion Materials/ Computational Chemistry",
      researchKo: "에너지 전환 소재/ 계산 화학",
      email: "mail",
      tel: "--",
      image: "/images/members/juhyeong-jeon.jpg",
    },
    {
      id: "kiju-lee",
      name: "Kiju lee",
      nameKo: "이기주",
      position: "M.S. candidate",
      positionKo: "석사과정",
      affiliation: "PKNU, KIMS",
      research: "Energy Conversion Materials/ Computational Chemistry",
      researchKo: "에너지 전환 소재/ 계산 화학",
      note: "Co-supervised with S. M. Choi",
      email: "mail",
      tel: "--",
      image: "/images/members/kiju-lee.jpg",
    },
    {
      id: "seoyun-choi",
      name: "Seoyun Choi",
      nameKo: "최서윤",
      position: "Undergraduate",
      positionKo: "학부생",
      affiliation: "PKNU, KIMS",
      research: "Energy Conversion Materials/ Computational Chemistry",
      researchKo: "에너지 전환 소재/ 계산 화학",
      note: "Co-supervised with S. M. Choi",
      email: "mail",
      tel: "--",
      image: "/images/members/seoyun-choi.jpg",
    },
  ]);

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.members) {
          try {
            const parsed = JSON.parse(data.members);
            setMembers(parsed);
          } catch (e) {
            console.error("Failed to parse members data");
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (memberId: string, field: string, value: string) => {
    const updatedMembers = members.map((member) =>
      member.id === memberId ? { ...member, [field]: value } : member
    );
    setMembers(updatedMembers);
    
    const response = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ members: JSON.stringify(updatedMembers) }),
    });
    if (!response.ok) throw new Error("Failed to save");
  };

  const handleImageSave = async (memberId: string, imageUrl: string) => {
    await handleSave(memberId, "image", imageUrl);
  };

  const handleAddMember = async () => {
    const newMember = {
      id: `member-${Date.now()}`,
      name: "New Member",
      nameKo: "새 멤버",
      position: "M.S. candidate",
      positionKo: "석사과정",
      affiliation: "PKNU",
      research: "Energy Conversion Materials/ Computational Chemistry",
      researchKo: "에너지 전환 소재/ 계산 화학",
      email: "mail",
      tel: "--",
      image: "/images/members/new-member.jpg",
    };
    const updatedMembers = [...members, newMember];
    setMembers(updatedMembers);
    
    const response = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ members: JSON.stringify(updatedMembers) }),
    });
    if (!response.ok) throw new Error("Failed to add member");
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm("이 멤버를 삭제하시겠습니까?")) return;
    
    const updatedMembers = members.filter((member) => member.id !== memberId);
    setMembers(updatedMembers);
    
    const response = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ members: JSON.stringify(updatedMembers) }),
    });
    if (!response.ok) throw new Error("Failed to delete member");
  };

  return (
    <div className="flex flex-col">
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Current Members
              <span className="block text-3xl md:text-4xl text-gray-600 font-normal mt-2">
                현재 구성원
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet our current lab members working on cutting-edge research.
              <br />
              <span className="text-base text-gray-500">
                최첨단 연구를 수행하는 현재 연구실 구성원을 소개합니다.
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {authenticated && (
              <div className="mb-6 flex justify-end">
                <button
                  onClick={handleAddMember}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  + 멤버 추가
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 relative group"
                >
                  {authenticated && (
                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      className="absolute top-2 right-2 z-20 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                      title="멤버 삭제"
                    >
                      ✕
                    </button>
                  )}
                  {/* 사진 편집 가능 */}
                  <div className="relative mb-4">
                    <EditableImage
                      src={member.image}
                      alt={member.name}
                      contentKey={`member-${member.id}-image`}
                      onSave={(url) => handleImageSave(member.id, url)}
                      isAuthenticated={authenticated}
                      className="aspect-square w-full rounded-lg object-cover bg-gray-200"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    {/* 이름 편집 가능 */}
                    <EditableContent
                      contentKey={`member-${member.id}-name`}
                      defaultValue={`<h3 class="text-xl font-semibold text-gray-900">${member.name}</h3>`}
                      onSave={async (content) => {
                        // HTML에서 텍스트 추출
                        const tempDiv = document.createElement("div");
                        tempDiv.innerHTML = content;
                        const text = tempDiv.textContent || tempDiv.innerText || "";
                        await handleSave(member.id, "name", text);
                      }}
                      isAuthenticated={authenticated}
                    />
                    
                    {/* 한글 이름 편집 가능 */}
                    <EditableContent
                      contentKey={`member-${member.id}-nameKo`}
                      defaultValue={`<p class="text-sm text-gray-600">${member.nameKo}</p>`}
                      onSave={async (content) => {
                        const tempDiv = document.createElement("div");
                        tempDiv.innerHTML = content;
                        const text = tempDiv.textContent || tempDiv.innerText || "";
                        await handleSave(member.id, "nameKo", text);
                      }}
                      isAuthenticated={authenticated}
                    />
                    
                    {/* 직위 편집 가능 */}
                    <div className="text-sm font-medium text-indigo-600">
                      <EditableContent
                        contentKey={`member-${member.id}-position`}
                        defaultValue={`<span>${member.position}</span>`}
                        onSave={async (content) => {
                          const tempDiv = document.createElement("div");
                          tempDiv.innerHTML = content;
                          const text = tempDiv.textContent || tempDiv.innerText || "";
                          await handleSave(member.id, "position", text);
                        }}
                        isAuthenticated={authenticated}
                      />
                      <span className="text-gray-500 ml-1">({member.positionKo})</span>
                      {member.affiliation && (
                        <span className="text-gray-500 ml-1">({member.affiliation})</span>
                      )}
                    </div>
                    
                    {/* Note 편집 가능 */}
                    {member.note && (
                      <EditableContent
                        contentKey={`member-${member.id}-note`}
                        defaultValue={`<p class="text-xs text-gray-500 italic">${member.note}</p>`}
                        onSave={async (content) => {
                          const tempDiv = document.createElement("div");
                          tempDiv.innerHTML = content;
                          const text = tempDiv.textContent || tempDiv.innerText || "";
                          await handleSave(member.id, "note", text);
                        }}
                        isAuthenticated={authenticated}
                      />
                    )}
                    
                    {/* 연구 분야 편집 가능 */}
                    <EditableContent
                      contentKey={`member-${member.id}-research`}
                      defaultValue={`<p class="text-sm text-gray-700">${member.research}</p>`}
                      onSave={async (content) => {
                        const tempDiv = document.createElement("div");
                        tempDiv.innerHTML = content;
                        const text = tempDiv.textContent || tempDiv.innerText || "";
                        await handleSave(member.id, "research", text);
                      }}
                      isAuthenticated={authenticated}
                    />
                    
                    {/* 연구 분야 한글 편집 가능 */}
                    <EditableContent
                      contentKey={`member-${member.id}-researchKo`}
                      defaultValue={`<p class="text-xs text-gray-600">${member.researchKo}</p>`}
                      onSave={async (content) => {
                        const tempDiv = document.createElement("div");
                        tempDiv.innerHTML = content;
                        const text = tempDiv.textContent || tempDiv.innerText || "";
                        await handleSave(member.id, "researchKo", text);
                      }}
                      isAuthenticated={authenticated}
                    />
                    
                    {/* 이메일 편집 가능 */}
                    {authenticated ? (
                      <EditableContent
                        contentKey={`member-${member.id}-email`}
                        defaultValue={`<a href="mailto:${member.email}" class="text-xs text-indigo-600 hover:text-indigo-700">${member.email}</a>`}
                        onSave={async (content) => {
                          const tempDiv = document.createElement("div");
                          tempDiv.innerHTML = content;
                          const text = tempDiv.textContent || tempDiv.innerText || "";
                          await handleSave(member.id, "email", text);
                        }}
                        isAuthenticated={authenticated}
                      />
                    ) : (
                      member.email !== "mail" && (
                        <a
                          href={`mailto:${member.email}`}
                          className="text-xs text-indigo-600 hover:text-indigo-700"
                        >
                          {member.email}
                        </a>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
