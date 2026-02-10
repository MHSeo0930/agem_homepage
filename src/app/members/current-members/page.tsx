"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getApiBase } from "@/lib/apiBase";
import EditableContent from "@/components/EditableContent";
import EditableImage from "@/components/EditableImage";

export default function CurrentMembersPage() {
  const { authenticated } = useAuth();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
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
      image: "/images/members/kiju-lee.png",
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

  const loadData = async (refetchAfterSave = false) => {
    try {
      const url = `${getApiBase()}/api/content${refetchAfterSave ? `?_=${Date.now()}` : ""}`;
      const res = await fetch(url, { cache: "no-store", credentials: "include" });
      const data = await res.json();
      if (data.members) {
        try {
          const parsed = JSON.parse(data.members);
          const basePath = getApiBase();
          const normalized = parsed.map((m: { image?: string; [k: string]: unknown }) => {
            let img = m.image?.startsWith("/uploads/") && !m.image.startsWith("/agem_homepage")
              ? `${basePath}/uploads/${m.image.replace(/^\/uploads\//, "")}`
              : m.image;
            if (img && typeof img === "string" && img.includes("/uploads/") && !img.includes("/api/uploads/")) {
              img = img.replace(/\/uploads\//, "/api/uploads/");
            }
            return { ...m, image: img };
          });
          setMembers(normalized);
        } catch (e) {
          console.error("Failed to parse members data");
        }
      }
    } catch (error) {
      console.error("Failed to load members data", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (memberId: string, field: string, value: string) => {
    const updatedMembers = members.map((member) =>
      member.id === memberId ? { ...member, [field]: value } : member
    );
    
    // 먼저 상태를 업데이트하여 UI에 즉시 반영
    setMembers(updatedMembers);
    
    const response = await fetch(`${getApiBase()}/api/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ members: JSON.stringify(updatedMembers) }),
    });
    if (!response.ok) {
      if (field !== "image") setMembers(members);
      throw new Error("Failed to save");
    }
    if (field === "image") return;
    setTimeout(async () => {
      await loadData(false);
    }, 50);
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
    
    const response = await fetch(`${getApiBase()}/api/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ members: JSON.stringify(updatedMembers) }),
    });
    if (!response.ok) throw new Error("Failed to add member");
    
    // 저장 후 데이터 다시 로드
    await loadData();
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm("이 멤버를 삭제하시겠습니까?")) return;
    
    const updatedMembers = members.filter((member) => member.id !== memberId);
    setMembers(updatedMembers);
    
    const response = await fetch(`${getApiBase()}/api/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ members: JSON.stringify(updatedMembers) }),
    });
    if (!response.ok) throw new Error("Failed to delete member");
    
    // 저장 후 데이터 다시 로드
    await loadData();
  };

  const handleMoveToAlumni = async (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;
    if (!confirm(`${member.nameKo}( ${member.name} ) 님을 졸업생(Alumni)으로 이동하시겠습니까?`)) return;

    const res = await fetch(`${getApiBase()}/api/content`);
    const data = await res.json();
    let currentAlumni: Array<Record<string, unknown>> = [];
    if (data.alumni) {
      try {
        currentAlumni = JSON.parse(data.alumni);
      } catch (e) {
        console.error("Failed to parse alumni", e);
      }
    }

    const newAlumnus = {
      id: `alumnus-${Date.now()}`,
      name: member.name,
      nameKo: member.nameKo,
      position: member.position,
      positionKo: member.positionKo,
      currentPosition: "—",
      currentPositionKo: "—",
      email: member.email,
      tel: member.tel ?? "--",
      image: member.image,
    };

    const updatedMembers = members.filter((m) => m.id !== memberId);
    const updatedAlumni = [newAlumnus, ...currentAlumni];

    setMembers(updatedMembers);

    const response = await fetch(`${getApiBase()}/api/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        members: JSON.stringify(updatedMembers),
        alumni: JSON.stringify(updatedAlumni),
      }),
    });
    if (!response.ok) {
      setMembers(members);
      throw new Error("Failed to move to alumni");
    }
    await loadData();
  };

  const handleReorder = async (fromId: string, toId: string) => {
    if (fromId === toId) return;
    const fromIndex = members.findIndex((m) => m.id === fromId);
    const toIndex = members.findIndex((m) => m.id === toId);
    if (fromIndex === -1 || toIndex === -1) return;
    const reordered = [...members];
    const [removed] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, removed);
    setMembers(reordered);
    const response = await fetch(`${getApiBase()}/api/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ members: JSON.stringify(reordered) }),
    });
    if (!response.ok) {
      setMembers(members);
      throw new Error("Failed to save order");
    }
  };

  return (
    <div className="flex flex-col">
      <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-0">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member) => {
                const isDragging = authenticated && draggedId === member.id;
                const isDragOver = authenticated && dragOverId === member.id && draggedId !== member.id;
                return (
                <div
                  key={member.id}
                  draggable={authenticated}
                  onDragStart={() => authenticated && setDraggedId(member.id)}
                  onDragOver={(e) => {
                    if (!authenticated) return;
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    setDragOverId(member.id);
                  }}
                  onDragLeave={() => setDragOverId((id) => (id === member.id ? null : id))}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (!authenticated || !draggedId || draggedId === member.id) return;
                    setDragOverId(null);
                    handleReorder(draggedId, member.id);
                    setDraggedId(null);
                  }}
                  onDragEnd={() => {
                    setDraggedId(null);
                    setDragOverId(null);
                  }}
                  className={`bg-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 relative group flex flex-col ${
                    isDragging ? "opacity-50 scale-95" : ""
                  } ${isDragOver ? "ring-2 ring-blue-500 ring-offset-2" : ""} ${authenticated ? "cursor-grab active:cursor-grabbing" : ""}`}
                >
                  {authenticated && (
                    <div className="absolute top-2 right-2 z-20 flex gap-1 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveToAlumni(member.id);
                        }}
                        className="bg-indigo-600 text-white px-2 py-1 rounded text-xs hover:bg-indigo-700 transition-colors"
                        title="Alumni로 이동"
                      >
                        Alumni
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-colors"
                        title="멤버 삭제"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  {/* 사진 편집 가능 */}
                  <div className="relative mb-5 flex justify-center">
                    <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 relative overflow-hidden rounded-lg bg-gray-200">
                      <EditableImage
                        src={member.image}
                        alt={member.name}
                        contentKey={`member-${member.id}-image`}
                        onSave={(url) => handleImageSave(member.id, url)}
                        isAuthenticated={authenticated}
                        className="w-full h-full rounded-lg object-cover object-top"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 text-center w-full">
                    {/* 이름 편집 가능 */}
                    <EditableContent
                      contentKey={`member-${member.id}-name`}
                      defaultValue={`<h3 class="text-xl font-semibold text-gray-900 text-center">${member.name}</h3>`}
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
                      defaultValue={`<p class="text-sm text-gray-600 text-center">${member.nameKo}</p>`}
                      onSave={async (content) => {
                        const tempDiv = document.createElement("div");
                        tempDiv.innerHTML = content;
                        const text = tempDiv.textContent || tempDiv.innerText || "";
                        await handleSave(member.id, "nameKo", text);
                      }}
                      isAuthenticated={authenticated}
                    />
                    
                    {/* 직위 편집 가능 */}
                    <div className="text-sm font-medium text-indigo-600 text-center flex flex-wrap items-center justify-center gap-1">
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
                      <span className="text-gray-500">(</span>
                      <EditableContent
                        contentKey={`member-${member.id}-positionKo`}
                        defaultValue={`<span class="text-gray-500">${member.positionKo}</span>`}
                        onSave={async (content) => {
                          const tempDiv = document.createElement("div");
                          tempDiv.innerHTML = content;
                          const text = tempDiv.textContent || tempDiv.innerText || "";
                          await handleSave(member.id, "positionKo", text);
                        }}
                        isAuthenticated={authenticated}
                      />
                      <span className="text-gray-500">)</span>
                      {member.affiliation && (
                        <>
                          <span className="text-gray-500">(</span>
                          <EditableContent
                            contentKey={`member-${member.id}-affiliation`}
                            defaultValue={`<span class="text-gray-500">${member.affiliation}</span>`}
                            onSave={async (content) => {
                              const tempDiv = document.createElement("div");
                              tempDiv.innerHTML = content;
                              const text = tempDiv.textContent || tempDiv.innerText || "";
                              await handleSave(member.id, "affiliation", text);
                            }}
                            isAuthenticated={authenticated}
                          />
                          <span className="text-gray-500">)</span>
                        </>
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
                    <div className="text-left">
                      <EditableContent
                        contentKey={`member-${member.id}-email`}
                        defaultValue={member.email !== "mail" ? `<a href="mailto:${member.email}" class="text-xs text-indigo-600 hover:text-indigo-700 text-left">${member.email}</a>` : `<span class="text-xs text-indigo-600 text-left">${member.email}</span>`}
                        onSave={async (content) => {
                          const tempDiv = document.createElement("div");
                          tempDiv.innerHTML = content;
                          const text = tempDiv.textContent || tempDiv.innerText || "";
                          await handleSave(member.id, "email", text);
                        }}
                        isAuthenticated={authenticated}
                      />
                    </div>
                  </div>
                </div>
              );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
