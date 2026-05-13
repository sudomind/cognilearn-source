import { useApp } from '../context/AppContext'
import MainLayout from '../layouts/MainLayout'
import LoginPage from '../pages/LoginPage'
import DashboardPage from '../pages/DashboardPage'
import DocumentsPage from '../pages/DocumentsPage'
import DocumentDetailPage from '../pages/DocumentDetailPage'
import FlashcardsPage from '../pages/FlashcardsPage'
import QuizzesPage from '../pages/QuizzesPage'
import ProgressPage from '../pages/ProgressPage'
import ProfilePage from '../pages/ProfilePage'

/**
 * View-based router — no URL routing needed for this SPA.
 * Uses the AppContext currentView to render the right page.
 */
function PageRouter() {
  const { currentView } = useApp()

  switch (currentView) {
    case 'dashboard':     return <DashboardPage />
    case 'documents':     return <DocumentsPage />
    case 'document-detail': return <DocumentDetailPage />
    case 'flashcards':    return <FlashcardsPage />
    case 'quizzes':       return <QuizzesPage />
    case 'progress':      return <ProgressPage />
    case 'profile':       return <ProfilePage />
    default:              return <DashboardPage />
  }
}

export default function AppRouter() {
  const { isAuthenticated } = useApp()

  if (!isAuthenticated) return <LoginPage />

  return (
    <MainLayout>
      <PageRouter />
    </MainLayout>
  )
}
