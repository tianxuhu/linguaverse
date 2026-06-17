import { Link, NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Home, BookOpen, Brain, Trophy, Users, User, Menu, X, Flame } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useLearnStore } from '@/stores/learnStore'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils'

const NAV = [
  { to: '/', label: '首页', icon: Home },
  { to: '/courses', label: '课程', icon: BookOpen },
  { to: '/learn', label: '学习', icon: Brain },
  { to: '/dashboard', label: '进度', icon: Flame },
  { to: '/community', label: '社区', icon: Users },
  { to: '/achievements', label: '成就', icon: Trophy },
]

export function Navbar() {
  const { user, isAuthenticated } = useAuthStore()
  const { ensureDaily } = useLearnStore()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const loc = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    ensureDaily()
  }, [ensureDaily])

  useEffect(() => {
    setMobileOpen(false)
  }, [loc.pathname])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-ink-50/85 backdrop-blur-md border-b border-ink-100'
          : 'bg-transparent',
      )}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-ink-900 text-ink-50 grid place-items-center font-display text-lg font-black transition-transform group-hover:rotate-6">
            語
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-base font-black tracking-tight text-ink-900">
              LinguaVerse
            </span>
            <span className="text-[10px] text-ink-400 tracking-widest mt-0.5">语 · 元</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) =>
                cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5',
                  isActive ? 'bg-ink-900 text-ink-50' : 'text-ink-700 hover:bg-ink-100',
                )
              }
            >
              <n.icon className="w-4 h-4" />
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <Link
              to="/profile"
              className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full hover:bg-ink-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[linear-gradient(135deg,#FF6B9D,#F59E0B)] text-white grid place-items-center font-bold text-xs">
                {user.avatar}
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold leading-tight">{user.name}</div>
                <div className="text-[10px] text-ink-400 leading-tight tnum">
                  {user.totalPoints} pts
                </div>
              </div>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  登录
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm" hard>
                  免费注册
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-full hover:bg-ink-100"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="菜单"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-ink-50 border-t border-ink-100 px-6 py-4 space-y-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium',
                  isActive ? 'bg-ink-900 text-ink-50' : 'text-ink-700 hover:bg-ink-100',
                )
              }
            >
              <n.icon className="w-4 h-4" />
              {n.label}
            </NavLink>
          ))}
          <div className="pt-3 border-t border-ink-100 mt-2 space-y-2">
            {isAuthenticated ? (
              <Link to="/profile" className="block">
                <Button variant="outline" size="md" className="w-full">
                  <User className="w-4 h-4 mr-2" /> 个人中心
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="block">
                  <Button variant="outline" size="md" className="w-full">
                    登录
                  </Button>
                </Link>
                <Link to="/register" className="block">
                  <Button variant="primary" size="md" className="w-full">
                    免费注册
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
