import { useApp } from '../context/AppContext';

const NAV = [
  { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
  { id: 'documents', icon: '📁', label: 'Documents' },
  { id: 'flashcards', icon: '🃏', label: 'Flashcards' },
  { id: 'quizzes', icon: '🧠', label: 'Quizzes' },
  { id: 'progress', icon: '📈', label: 'Progress' },
];

export default function Sidebar() {
  const {
    currentView,
    setCurrentView,
    user,
    logout,
    flashcards,
    quizzes,
    documents,
  } = useApp();

  const isActive = (id) =>
    currentView === id ||
    (currentView === 'document-detail' && id === 'documents');

  return (
    <aside
      className="w-64 h-screen flex flex-col border-r relative z-10"
      style={{
        background: 'rgba(10,12,24,0.85)',
        backdropFilter: 'blur(20px)',
        borderColor: 'rgba(255,255,255,0.08)',
      }}
    >
      {/* Logo */}
      <div
        className="p-6 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="text-white font-bold text-base font-sora">C</span>
          </div>
          <div>
            <div className="font-bold text-sm font-sora">CogniLearn</div>
            <div className="text-xs text-slate-500">AI Study Platform</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-medium text-slate-600 uppercase tracking-widest mb-3 px-3">
          Navigation
        </div>

        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              isActive(item.id)
                ? 'sidebar-active text-indigo-300'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <span className="text-base leading-none">{item.icon}</span>
            <span>{item.label}</span>

            {/* Badges */}
            {item.id === 'flashcards' && flashcards.length > 0 && (
              <span className="ml-auto text-xs bg-indigo-500/20 text-indigo-400 rounded-full px-2 py-0.5">
                {flashcards.length}
              </span>
            )}
            {item.id === 'quizzes' && quizzes.length > 0 && (
              <span className="ml-auto text-xs bg-indigo-500/20 text-indigo-400 rounded-full px-2 py-0.5">
                {quizzes.length}
              </span>
            )}
            {item.id === 'documents' && (
              <span className="ml-auto text-xs bg-indigo-500/20 text-indigo-400 rounded-full px-2 py-0.5">
                {documents.length}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* User footer */}
      <div
        className="p-4 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <div className="glass-card rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-sm font-bold flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{user?.name}</div>
            <div className="text-xs text-slate-500 truncate">{user?.email}</div>
          </div>
          <button
            onClick={logout}
            className="text-slate-500 hover:text-red-400 transition-colors text-sm"
            title="Sign out"
          >
            ↩
          </button>
        </div>
      </div>
    </aside>
  );
}
