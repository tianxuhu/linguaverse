import { Link } from 'react-router-dom'
import { ArrowUpRight, BookOpen, BookText, Mic, Headphones, Flame, Trophy, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { useLearnStore } from '@/stores/learnStore'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/utils'

const MODULES = [
  {
    to: '/learn/vocab',
    title: '单词记忆',
    en: 'Vocabulary',
    icon: BookOpen,
    color: '#FF6B9D',
    bgClass: 'from-sakura/20 to-amber/10',
    desc: '闪卡 + 拼写 + 艾宾浩斯曲线复习',
    stat: 'vocab',
  },
  {
    to: '/learn/grammar',
    title: '语法练习',
    en: 'Grammar',
    icon: BookText,
    color: '#3B82F6',
    bgClass: 'from-electric/20 to-jade/10',
    desc: '选择 / 填空 / 排序 + AI 错题解析',
    stat: 'grammar',
  },
  {
    to: '/learn/speaking',
    title: '口语跟读',
    en: 'Speaking',
    icon: Mic,
    color: '#F59E0B',
    bgClass: 'from-amber/20 to-cinnabar/10',
    desc: '原音播放 + 录音波形 + AI 评分',
    stat: 'speaking',
  },
  {
    to: '/learn/listening',
    title: '听力训练',
    en: 'Listening',
    icon: Headphones,
    color: '#10B981',
    bgClass: 'from-jade/20 to-electric/10',
    desc: '多档语速 + 听写填空 + 选择',
    stat: 'listening',
  },
]

export default function Learn() {
  const { user, isAuthenticated } = useAuthStore()
  const { todayLearned, dailyTasks, badges } = useLearnStore()
  const completedBadges = badges.filter((b) => b.unlocked).length

  return (
    <div className="min-h-screen">
      <div className="bg-[linear-gradient(135deg,#0B0B0F_0%,#1A1816_100%)] text-ink-50 py-20 noise-bg relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-sakura/20 blur-[120px]" />
        <div className="absolute -bottom-20 right-0 w-96 h-96 rounded-full bg-electric/20 blur-[120px]" />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10">
          <div className="flex items-end justify-between flex-wrap gap-6">
            <div>
              <Badge variant="outline" className="border-ink-600 text-ink-300 mb-4">
                <Flame className="w-3 h-3" /> Learning hub
              </Badge>
              <h1 className="display text-6xl lg:text-8xl font-black leading-[0.9] mb-3">
                学习<span className="text-gradient-neon">中心</span>
              </h1>
              <p className="text-ink-300 text-lg max-w-xl">
                欢迎回来{user ? `，${user.name}` : ''}。今天又是精进的一天 ✨
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { i: Trophy, n: user?.totalPoints ?? 0, l: '总积分', c: 'text-amber' },
                { i: Flame, n: '12', l: '连胜天', c: 'text-cinnabar' },
                { i: TrendingUp, n: completedBadges, l: '徽章数', c: 'text-jade' },
              ].map((s) => (
                <div key={s.l} className="bg-ink-700/40 backdrop-blur rounded-2xl p-4 border border-ink-700 min-w-[100px]">
                  <s.i className={cn('w-5 h-5', s.c)} />
                  <div className="display text-2xl font-black tnum mt-1.5">{s.n}</div>
                  <div className="text-[10px] text-ink-400 uppercase tracking-widest">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-12">
        <h2 className="display text-3xl font-black mb-6">四大训练模块</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {MODULES.map((m) => {
            const today = todayLearned[m.stat as keyof typeof todayLearned]
            return (
              <Link
                key={m.to}
                to={m.to}
                className="group relative bg-white border border-ink-100 rounded-3xl p-8 hover:-translate-y-1 hover:shadow-xl transition-all overflow-hidden"
              >
                <div className={cn('absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity bg-gradient-to-br', m.bgClass)} />
                <div className="relative flex items-start gap-6">
                  <div
                    className="w-16 h-16 rounded-2xl grid place-items-center flex-shrink-0"
                    style={{ background: m.color }}
                  >
                    <m.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-ink-400 tracking-widest uppercase mb-1">{m.en}</div>
                    <h3 className="display text-2xl font-black mb-2">{m.title}</h3>
                    <p className="text-sm text-ink-500 mb-4">{m.desc}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-ink-400 tnum">
                        今日完成 <span className="display text-base font-black text-ink-900 ml-1 tnum">{today}</span> 次
                      </div>
                      <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: m.color }}>
                        开始训练 <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-16">
          <h2 className="display text-3xl font-black mb-6">每日任务</h2>
          <Card className="p-6">
            <div className="space-y-4">
              {dailyTasks.map((t) => {
                const pct = Math.min(100, (t.current / t.target) * 100)
                return (
                  <div key={t.id} className="flex items-center gap-4">
                    <div className={cn('w-10 h-10 rounded-2xl grid place-items-center', t.completed ? 'bg-jade text-white' : 'bg-ink-100 text-ink-500')}>
                      {t.completed ? '✓' : t.icon.slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between mb-1.5">
                        <span className="text-sm font-semibold">{t.title}</span>
                        <span className="text-xs text-ink-400 tnum">{t.current} / {t.target}</span>
                      </div>
                      <Progress value={pct} variant={t.completed ? 'jade' : 'amber'} />
                    </div>
                    <div className="text-right hidden md:block">
                      <div className="display text-base font-black text-amber tnum">+{t.reward}</div>
                      <div className="text-[10px] text-ink-400 uppercase">pts</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
