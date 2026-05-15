import { useApp } from "../context/AppContext";

import MainLayout from "../layouts/MainLayout";

import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import DocumentsPage from "../pages/DocumentsPage";
import DocumentDetailPage from "../pages/DocumentDetailPage";
import FlashcardsPage from "../pages/FlashcardsPage";
import QuizzesPage from "../pages/QuizzesPage";
import ProgressPage from "../pages/ProgressPage";
import ProfilePage from "../pages/ProfilePage";

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1020]">
      <div className="text-center space-y-4">
        <div className="w-14 h-14 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto" />

        <div className="text-slate-400 text-sm">Restoring session...</div>
      </div>
    </div>
  );
}

/**
 * View-based router — no URL routing needed for this SPA.
 */
function PageRouter() {
  const { currentView } = useApp();

  switch (currentView) {
    case "dashboard":
      return <DashboardPage />;

    case "documents":
      return <DocumentsPage />;

    case "document-detail":
      return <DocumentDetailPage />;

    case "flashcards":
      return <FlashcardsPage />;

    case "quizzes":
      return <QuizzesPage />;

    case "progress":
      return <ProgressPage />;

    case "profile":
      return <ProfilePage />;

    default:
      return <DashboardPage />;
  }
}

export default function AppRouter() {
  const { isAuthenticated, loading } = useApp();

  // WAIT for auth restore
  if (loading) {
    return <LoadingScreen />;
  }

  // After loading finishes
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <MainLayout>
      <PageRouter />
    </MainLayout>
  );
}
