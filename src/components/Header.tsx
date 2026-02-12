"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { getApiBase } from "@/lib/apiBase";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [deploying, setDeploying] = useState(false);
  const { authenticated, loading, checkAuth } = useAuth();
  const router = useRouter();

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
    try {
      const res = await fetch(`${getApiBase()}/api/deploy`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "배포 시작 실패");
      alert(data.message || "배포가 백그라운드에서 시작되었습니다.");
    } catch (error) {
      alert(error instanceof Error ? error.message : "배포 시작에 실패했습니다.");
    } finally {
      setDeploying(false);
    }
  };

  return (
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
  );
}



