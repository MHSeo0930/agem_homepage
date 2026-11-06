"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { getApiBase } from "@/lib/apiBase";

type DeployStatus = "starting" | "running" | "success" | "failed" | "idle";

interface DeployInfo {
  runId: string;
  status: DeployStatus;
  step: string;
  message: string;
}

const INITIAL_DEPLOY_INFO: DeployInfo = { runId: "", status: "starting", step: "", message: "" };
/** 연속 폴링 실패가 이 횟수 이상이면 경고 표시 */
const POLL_ERROR_WARN = 3;

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [deploying, setDeploying] = useState(false);
  const [deployLogOpen, setDeployLogOpen] = useState(false);
  const [deployLog, setDeployLog] = useState("");
  const [deployInfo, setDeployInfo] = useState<DeployInfo>(INITIAL_DEPLOY_INFO);
  const [pollWarning, setPollWarning] = useState("");
  const [hasNewLog, setHasNewLog] = useState(false);
  const deployPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollErrorsRef = useRef(0);
  const followLogRef = useRef(true); // 사용자가 위쪽 로그를 읽는 중이면 false → 자동 스크롤 중단
  const logEndRef = useRef<HTMLPreElement>(null);
  const [mounted, setMounted] = useState(false);
  const { authenticated, loading, checkAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const stopDeployPoll = () => {
    if (deployPollRef.current) {
      clearInterval(deployPollRef.current);
      deployPollRef.current = null;
    }
  };

  // 배포 실행(runId)이 정해진 뒤에만 폴링 — 이전 실행의 완료 표시를 새 실행으로 오인하지 않음
  useEffect(() => {
    if (!deployLogOpen || !deployInfo.runId) return;
    const runId = deployInfo.runId;
    const tick = async () => {
      try {
        const res = await fetch(`${getApiBase()}/api/deploy/log`, {
          credentials: "include",
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        pollErrorsRef.current = 0;
        setPollWarning("");
        if (data.runId !== runId) return; // 아직 새 실행 로그가 기록되기 전
        setDeployLog(data.log ?? "");
        setDeployInfo({ runId, status: data.status, step: data.step ?? "", message: data.message ?? "" });
        if (data.status === "success" || data.status === "failed") {
          stopDeployPoll();
          setDeploying(false);
        }
      } catch (error) {
        pollErrorsRef.current += 1;
        if (pollErrorsRef.current >= POLL_ERROR_WARN) {
          setPollWarning(
            `서버 응답이 없습니다 (${pollErrorsRef.current}회 연속). 배포는 계속 진행 중일 수 있으니 잠시 후 확인하세요.`
          );
        }
      }
    };
    tick();
    deployPollRef.current = setInterval(tick, 1500);
    return stopDeployPoll;
  }, [deployLogOpen, deployInfo.runId]);

  useEffect(() => {
    const el = logEndRef.current;
    if (!el) return;
    if (followLogRef.current) {
      el.scrollTo(0, el.scrollHeight);
    } else {
      setHasNewLog(true);
    }
  }, [deployLog]);

  const handleLogScroll = () => {
    const el = logEndRef.current;
    if (!el) return;
    followLogRef.current = el.scrollTop + el.clientHeight >= el.scrollHeight - 40;
    if (followLogRef.current) setHasNewLog(false);
  };

  const jumpToLatestLog = () => {
    followLogRef.current = true;
    setHasNewLog(false);
    logEndRef.current?.scrollTo(0, logEndRef.current.scrollHeight);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${getApiBase()}/api/auth/logout`, { method: "POST", credentials: "include" });
      await checkAuth();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      await checkAuth();
    }
  };

  const handleDeploy = async () => {
    if (deploying) return;
    setDeploying(true);
    setDeployLog("");
    setDeployInfo(INITIAL_DEPLOY_INFO);
    setPollWarning("");
    setHasNewLog(false);
    pollErrorsRef.current = 0;
    followLogRef.current = true;
    setDeployLogOpen(true);
    // 모달이 먼저 그려지도록 한 틱 대기 후 API 호출
    await new Promise((r) => setTimeout(r, 50));
    try {
      const res = await fetch(`${getApiBase()}/api/deploy`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.status === 409 && data.runId) {
        // 다른 탭·브라우저에서 이미 진행 중인 배포에 연결
        setDeployInfo({ ...INITIAL_DEPLOY_INFO, runId: data.runId, status: "running" });
        return;
      }
      if (!res.ok) throw new Error(data.error || "배포 시작 실패");
      setDeployInfo({ ...INITIAL_DEPLOY_INFO, runId: data.runId, status: "running" });
    } catch (error) {
      alert(error instanceof Error ? error.message : "배포 시작에 실패했습니다.");
      setDeploying(false);
      setDeployLogOpen(false);
    }
  };

  const closeDeployLog = () => {
    stopDeployPoll();
    setDeployLogOpen(false);
    setDeploying(false);
  };

  // 배포 창 상단 상태 표시 (진행 단계 / 성공 / 실패)
  const deployBanner = (() => {
    const strip = (m: string) => m.replace(/^\[DEPLOY_(DONE|FAILED)\] run=\S+\s*/, "");
    switch (deployInfo.status) {
      case "success":
        return { cls: "bg-green-50 text-green-800 border-green-200", text: `✅ ${strip(deployInfo.message)}` };
      case "failed": {
        const m = deployInfo.message.match(/step=(.+?) exit=(\d+)/);
        const text = m ? `❌ 배포 실패 — 단계: ${m[1]} (종료 코드 ${m[2]}). 아래 로그를 확인하세요.` : `❌ ${strip(deployInfo.message)}`;
        return { cls: "bg-red-50 text-red-800 border-red-200", text };
      }
      case "running":
        return { cls: "bg-blue-50 text-blue-800 border-blue-200", text: `⏳ 진행 중 ${deployInfo.step ? `— ${deployInfo.step}` : ""}` };
      default:
        return { cls: "bg-gray-50 text-gray-700 border-gray-200", text: "⏳ 배포를 시작하는 중…" };
    }
  })();

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold text-gray-900">
          서민호 교수 연구실
          <span className="block text-sm font-normal text-gray-600">
            Min Ho Seo&apos;s group
          </span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Home
          </Link>
          
          {/* Members Dropdown */}
          <div 
            className="relative group"
            onMouseEnter={() => setActiveDropdown("members")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors flex items-center"
            >
              Members
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeDropdown === "members" && (
              <div className="absolute top-full left-0 pt-1 w-48">
                <div className="bg-white rounded-md shadow-lg border border-gray-200 py-2">
                  <Link href="/members/professor" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Professor
                  </Link>
                  <Link href="/members/current-members" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Current Members
                  </Link>
                  <Link href="/members/alumni" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Alumni
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Research Dropdown */}
          <div 
            className="relative group"
            onMouseEnter={() => setActiveDropdown("research")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors flex items-center"
          >
            Research
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeDropdown === "research" && (
              <div className="absolute top-full left-0 pt-1 w-56">
                <div className="bg-white rounded-md shadow-lg border border-gray-200 py-2">
                  <Link href="/research/green-energy-materials" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Green Energy Materials
                  </Link>
                  <Link href="/research/ai-computational-chemistry" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    AI & Computational Chemistry
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Achievements Dropdown */}
          <div 
            className="relative group"
            onMouseEnter={() => setActiveDropdown("achievements")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors flex items-center"
            >
              Achievements
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeDropdown === "achievements" && (
              <div className="absolute top-full left-0 pt-1 w-48">
                <div className="bg-white rounded-md shadow-lg border border-gray-200 py-2">
                  <Link href="/achievements/journals" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Journals
                  </Link>
                  <Link href="/achievements/conference" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Conference
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Board Dropdown */}
          <div 
            className="relative group"
            onMouseEnter={() => setActiveDropdown("board")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors flex items-center"
          >
              Board
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeDropdown === "board" && (
              <div className="absolute top-full left-0 pt-1 w-48">
                <div className="bg-white rounded-md shadow-lg border border-gray-200 py-2">
                  <Link href="/board/news" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    News
                  </Link>
                  <Link href="/board/gallery" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Gallery
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* About Lab */}
          <div 
            className="relative group"
            onMouseEnter={() => setActiveDropdown("about")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors flex items-center"
          >
              About Lab.
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeDropdown === "about" && (
              <div className="absolute top-full left-0 pt-1 w-48">
                <div className="bg-white rounded-md shadow-lg border border-gray-200 py-2">
                  <Link href="/about-lab/map" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Map
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Login/Logout / Deploy */}
          {!loading && (
            <div className="ml-4 pl-4 border-l border-gray-200 flex items-center gap-4">
              {authenticated ? (
                <>
                  <button
                    onClick={handleDeploy}
                    disabled={deploying}
                    className="text-sm font-medium text-green-700 hover:text-green-800 disabled:opacity-50 transition-colors"
                    title="빌드 후 Git 푸시로 배포"
                  >
                    {deploying ? "배포 중…" : "배포"}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/admin/login"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          )}
        </nav>
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          )}
        </button>
      </div>
      {mobileMenuOpen && (
        <nav className="md:hidden border-t bg-white">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <Link
              href="/"
              className="block text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <div className="space-y-2 pl-4 border-l-2 border-gray-200">
              <div className="text-xs font-semibold text-gray-500 uppercase">Members</div>
              <Link
                href="/members/professor"
                className="block text-sm text-gray-700 hover:text-gray-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Professor
              </Link>
              <Link
                href="/members/current-members"
                className="block text-sm text-gray-700 hover:text-gray-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Current Members
              </Link>
              <Link
                href="/members/alumni"
                className="block text-sm text-gray-700 hover:text-gray-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Alumni
              </Link>
            </div>
            <div className="space-y-2 pl-4 border-l-2 border-gray-200">
              <div className="text-xs font-semibold text-gray-500 uppercase">Research</div>
              <Link
                href="/research/green-energy-materials"
                className="block text-sm text-gray-700 hover:text-gray-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Green Energy Materials
              </Link>
              <Link
                href="/research/ai-computational-chemistry"
                className="block text-sm text-gray-700 hover:text-gray-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                AI & Computational Chemistry
              </Link>
            </div>
            <div className="space-y-2 pl-4 border-l-2 border-gray-200">
              <div className="text-xs font-semibold text-gray-500 uppercase">Achievements</div>
              <Link
                href="/achievements/journals"
                className="block text-sm text-gray-700 hover:text-gray-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Journals
              </Link>
              <Link
                href="/achievements/conference"
                className="block text-sm text-gray-700 hover:text-gray-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Conference
              </Link>
            </div>
            <div className="space-y-2 pl-4 border-l-2 border-gray-200">
              <div className="text-xs font-semibold text-gray-500 uppercase">Board</div>
              <Link
                href="/board/news"
                className="block text-sm text-gray-700 hover:text-gray-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                News
              </Link>
              <Link
                href="/board/gallery"
                className="block text-sm text-gray-700 hover:text-gray-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Gallery
              </Link>
            </div>
            <div className="space-y-2 pl-4 border-l-2 border-gray-200">
              <div className="text-xs font-semibold text-gray-500 uppercase">About Lab.</div>
              <Link
                href="/about-lab/map"
                className="block text-sm text-gray-700 hover:text-gray-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Map
              </Link>
            </div>
            {!loading && (
              <div className="pt-3 border-t border-gray-200 space-y-2">
                {authenticated ? (
                  <>
                    <button
                      onClick={() => {
                        handleDeploy();
                        setMobileMenuOpen(false);
                      }}
                      disabled={deploying}
                      className="block text-sm font-medium text-green-700 hover:text-green-800 disabled:opacity-50 transition-colors w-full text-left"
                    >
                      {deploying ? "배포 중…" : "배포"}
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="block text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors w-full text-left"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/admin/login"
                    className="block text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            )}
          </div>
        </nav>
      )}
    </header>

    {mounted && deployLogOpen && typeof document !== "undefined" && document.body &&
      createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
          onClick={closeDeployLog}
          role="dialog"
          aria-modal="true"
          aria-label="배포 진행 상황"
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <span className="font-medium text-gray-900">배포 진행 상황</span>
              <button
                type="button"
                onClick={closeDeployLog}
                className="text-gray-500 hover:text-gray-700 p-1"
                aria-label="닫기"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className={`px-4 py-2 text-sm border-b ${deployBanner.cls}`}>{deployBanner.text}</div>
            {pollWarning && (
              <div className="px-4 py-2 text-sm border-b bg-yellow-50 text-yellow-800 border-yellow-200">⚠️ {pollWarning}</div>
            )}
            <div className="relative flex-1 min-h-0 flex flex-col">
              {/* min-h-0: flex 자식이 로그 길이만큼 늘어나 화면 밖으로 넘치지 않고 스크롤되도록 */}
              <pre
                ref={logEndRef}
                onScroll={handleLogScroll}
                className="flex-1 min-h-0 overflow-auto p-4 text-sm text-gray-800 whitespace-pre-wrap break-all font-mono bg-gray-50 rounded-b-lg"
                style={{ minHeight: 200 }}
              >
                {deployLog || "배포를 시작했습니다. 로그를 불러오는 중…"}
              </pre>
              {hasNewLog && (
                <button
                  type="button"
                  onClick={jumpToLatestLog}
                  className="absolute bottom-3 right-4 rounded-full bg-blue-600 px-3 py-1 text-xs text-white shadow hover:bg-blue-700"
                >
                  새 로그 ↓
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}



