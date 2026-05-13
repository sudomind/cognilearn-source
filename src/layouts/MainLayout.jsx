import Sidebar from './Sidebar'

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden relative">
      <div className="mesh-orb-1" />
      <div className="mesh-orb-2" />
      <div className="grid-overlay" />
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative z-10">{children}</main>
    </div>
  )
}
