import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Mail, Lock, User, ArrowRight, Sparkles, Check, Languages } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/stores/authStore'
import { LANGUAGES_META } from '@/data/mock'
import type { Language, Level } from '@/types'
import { cn } from '@/utils'

const LEVELS: { code: Level; name: string }[] = [
  { code: 'A1', name: 'A1 · 入门' },
  { code: 'A2', name: 'A2 · 基础' },
  { code: 'B1', name: 'B1 · 中级' },
  { code: 'B2', name: 'B2 · 中高' },
  { code: 'N5', name: 'N5 · 入门' },
  { code: 'N4', name: 'N4 · 基础' },
  { code: 'N3', name: 'N3 · 中级' },
  { code: 'TOPIK1', name: 'TOPIK 1' },
  { code: 'TOPIK2', name: 'TOPIK 2' },
]

export default function Register() {
  const { register } = useAuthStore()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [name, setName] = useState('')
  const [targetLang, setTargetLang] = useState<Language>('en')
  const [level, setLevel] = useState<Level>('A1')

  const handleNext = () => {
    if (step === 1 && (!email || !pwd || !name)) return
    if (step === 2) {
      register(email, name, targetLang, level)
      navigate('/dashboard')
      return
    }
    setStep(step + 1)
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex relative bg-[linear-gradient(135deg,#FF6B9D_0%,#F59E0B_100%)] text-white p-12 items-center overflow-hidden noise-bg">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-white/20 blur-[150px]" />

        <div className="relative max-w-md">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-12">
            <div className="w-10 h-10 rounded-xl bg-white text-ink-900 grid place-items-center font-display text-xl font-black">語</div>
            <span className="font-display text-2xl font-black">LinguaVerse</span>
          </Link>

          <h1 className="display text-6xl font-black leading-[0.95] mb-6">
            从今天开始<br />用另一种语言<br /><span className="italic font-light">思考</span>
          </h1>
          <p className="text-white/90 text-lg leading-relaxed mb-10">
            加入 224 万学习者，每天 30 分钟，三月后用另一种语言思考。
          </p>

          <div className="space-y-4">
            {[
              '专业课程体系 · CEFR/JLPT/TOPIK 全覆盖',
              'AI 个性化推荐 · 因材施教',
              '强激励社区 · 找到你的学习伙伴',
            ].map((t) => (
              <div key={t} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur grid place-items-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm">{t}</span>
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

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber/10 text-amber text-xs font-medium mb-6">
            <Sparkles className="w-3 h-3" /> 注册即享 7 天 Pro 会员
          </div>

          <h2 className="display text-4xl font-black mb-2">创建账号</h2>
          <p className="text-ink-500 mb-8">第 {step} / 2 步 · {step === 1 ? '基本信息' : '学习偏好'}</p>

          <div className="h-1 bg-ink-100 rounded-full mb-8 overflow-hidden">
            <div className="h-full bg-[linear-gradient(135deg,#FF6B9D,#F59E0B)] transition-all duration-500" style={{ width: `${step * 50}%` }} />
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-ink-500 uppercase tracking-widest mb-2 block">昵称</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-12 pl-11 pr-4 rounded-full bg-white border border-ink-200 focus:border-ink-900 focus:outline-none text-sm"
                    placeholder="你的昵称"
                  />
                </div>
              </div>
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
                    type="password"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    className="w-full h-12 pl-11 pr-4 rounded-full bg-white border border-ink-200 focus:border-ink-900 focus:outline-none text-sm"
                    placeholder="至少 8 位"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="text-xs text-ink-500 uppercase tracking-widest mb-3 block">选择目标语种</label>
                <div className="space-y-2">
                  {LANGUAGES_META.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setTargetLang(l.code as Language)}
                      className={cn(
                        'w-full p-4 rounded-2xl border-2 flex items-center gap-4 text-left transition-all',
                        targetLang === l.code ? 'border-ink-900 bg-ink-50' : 'border-ink-200 hover:border-ink-400',
                      )}
                    >
                      <div className="w-12 h-12 rounded-2xl grid place-items-center text-white" style={{ background: l.gradient }}>
                        <Languages className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-base">{l.native}</div>
                        <div className="text-xs text-ink-500">{l.desc}</div>
                      </div>
                      {targetLang === l.code && <Check className="w-5 h-5 text-ink-900" />}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-ink-500 uppercase tracking-widest mb-3 block">当前水平</label>
                <div className="grid grid-cols-3 gap-2">
                  {LEVELS.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLevel(l.code)}
                      className={cn(
                        'py-2.5 rounded-full text-xs font-medium transition-colors',
                        level === l.code ? 'bg-ink-900 text-ink-50' : 'bg-white border border-ink-200 hover:border-ink-900',
                      )}
                    >
                      {l.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <Button variant="primary" hard size="lg" className="w-full mt-8" onClick={handleNext}>
            {step === 2 ? '完成注册 · 开始学习' : '下一步'} <ArrowRight className="w-4 h-4 ml-1" />
          </Button>

          {step === 2 && (
            <Button variant="ghost" className="w-full mt-2" onClick={() => setStep(1)}>
              ← 上一步
            </Button>
          )}

          <div className="text-center text-sm text-ink-500 mt-6">
            已有账号？{' '}
            <Link to="/login" className="text-sakura font-semibold hover:underline">立即登录</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
