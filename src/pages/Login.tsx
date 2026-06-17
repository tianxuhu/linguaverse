import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Github, MessageCircle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/stores/authStore'

export default function Login() {
  const { login, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [email, setEmail] = useState('demo@linguaverse.app')
  const [pwd, setPwd] = useState('demo123456')
  const [showPwd, setShowPwd] = useState(false)

  if (isAuthenticated) {
    navigate(params.get('redirect') || '/dashboard')
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    login(email, email.split('@')[0])
    navigate(params.get('redirect') || '/dashboard')
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex relative bg-ink-900 text-ink-50 p-12 items-center overflow-hidden noise-bg">
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-sakura/30 blur-[150px]" />
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full bg-amber/30 blur-[150px]" />

        <div className="marquee-mask absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-1/4 -left-20 flex gap-8 animate-marquee whitespace-nowrap">
            {[...Array(8)].map((_, i) => (
              <span key={i} className="font-display text-[80px] font-black">Linguaverse · 語 · 元 ·</span>
            ))}
          </div>
        </div>

        <div className="relative max-w-md">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-12">
            <div className="w-10 h-10 rounded-xl bg-[linear-gradient(135deg,#FF6B9D,#F59E0B)] text-white grid place-items-center font-display text-xl font-black">
              語
            </div>
            <span className="font-display text-2xl font-black">LinguaVerse</span>
          </Link>

          <h1 className="display text-6xl font-black leading-[0.95] mb-6">
            欢迎<br />回来
          </h1>
          <p className="text-ink-300 text-lg leading-relaxed mb-10">
            继续你昨日的学习旅程。今天又是充满新知的一天。
          </p>

          <div className="space-y-3">
            {[
              { n: '12 门', l: '系统化课程' },
              { n: '4 维', l: '能力训练' },
              { n: '2.24M', l: '学习者' },
            ].map((s) => (
              <div key={s.l} className="flex items-baseline gap-2">
                <span className="display text-3xl font-black text-gradient-neon">{s.n}</span>
                <span className="text-ink-300 text-sm">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12 bg-ink-50">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-12">
            <div className="w-10 h-10 rounded-xl bg-ink-900 text-ink-50 grid place-items-center font-display text-xl font-black">語</div>
            <span className="font-display text-xl font-black">LinguaVerse</span>
          </Link>

          <Badge />
          <h2 className="display text-4xl font-black mb-2">登录</h2>
          <p className="text-ink-500 mb-8">输入邮箱和密码，开启学习之旅</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-ink-500 uppercase tracking-widest mb-2 block">邮箱</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-full bg-white border border-ink-200 focus:border-ink-900 focus:outline-none text-sm"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-ink-500 uppercase tracking-widest mb-2 block">密码</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  className="w-full h-12 pl-11 pr-11 rounded-full bg-white border border-ink-200 focus:border-ink-900 focus:outline-none text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-ink-500">记住我</span>
              </label>
              <a href="#" className="text-sakura hover:underline">忘记密码？</a>
            </div>

            <Button type="submit" variant="primary" hard className="w-full" size="lg">
              登录 <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-ink-200" />
            <span className="text-xs text-ink-400">或使用</span>
            <div className="flex-1 h-px bg-ink-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="md" className="w-full">
              <Github className="w-4 h-4 mr-2" /> GitHub
            </Button>
            <Button variant="outline" size="md" className="w-full">
              <MessageCircle className="w-4 h-4 mr-2" /> 微信
            </Button>
          </div>

          <div className="text-center text-sm text-ink-500 mt-8">
            还没有账号？{' '}
            <Link to="/register" className="text-sakura font-semibold hover:underline">
              免费注册
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function Badge() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sakura/10 text-sakura text-xs font-medium mb-6">
      <Sparkles className="w-3 h-3" /> 每日登录 +10 积分
    </div>
  )
}
