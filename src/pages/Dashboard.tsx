import { Link } from 'react-router-dom'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Area, AreaChart, CartesianGrid } from 'recharts'
import { TrendingUp, Calendar as CalendarIcon, Flame, Trophy, Target, Clock, Sparkles, BookOpen, ArrowUpRight, Check } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import { useLearnStore } from '@/stores/learnStore'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/utils'

const DAYS = ['一', '二', '三', '四', '五', '六', '日']

function genHeatmap() {
  const cells: { day: number; col: number; level: 0 | 1 | 2 | 3 | 4 }[] = []
  for (let d = 0; d < 7; d++) {
    for (let i = 0; i < 8; i++) {
      const r = Math.random()
      const level = r < 0.25 ? 0 : r < 0.5 ? 1 : r < 0.75 ? 2 : r < 0.9 ? 3 : 4
      cells.push({ day: d, col: i, level: level as any })
    }
  }
  return cells
}

const HEATMAP = genHeatmap()

const RADAR = [
  { skill: '词汇', current: 78, target: 90 },
  { skill: '语法', current: 65, target: 85 },
  { skill: '口语', current: 54, target: 80 },
  { skill: '听力', current: 70, target: 85 },
  { skill: '阅读', current: 82, target: 90 },
  { skill: '写作', current: 60, target: 80 },
]

const WEEK_DATA = [
  { day: '周一', minutes: 12 },
  { day: '周二', minutes: 18 },
  { day: '周三', minutes: 25 },
  { day: '周四', minutes: 8 },
  { day: '周五', minutes: 30 },
  { day: '周六', minutes: 22 },
  { day: '周日', minutes: 15 },
]

const MONTH_DATA = [
  { w: 'W1', m: 85 },
  { w: 'W2', m: 120 },
  { w: 'W3', m: 95 },
  { w: 'W4', m: 140 },
  { w: 'W5', m: 165 },
  { w: 'W6', m: 130 },
]

export default function Dashboard() {
  const { user } = useAuthStore()
  const { dailyTasks, studyMinutes, todayLearned, weeklyMinutes, errorBook, claimTask, badges } = useLearnStore()

  const totalToday = todayLearned.vocab + todayLearned.grammar + todayLearned.speaking + todayLearned.listening
  const completed = dailyTasks.filter((t) => t.completed).length
  const totalReward = dailyTasks.reduce((acc, t) => acc + (t.completed ? t.reward : 0), 0)

  return (
    <div className="min-h-screen">
      <div className="bg-[linear-gradient(135deg,#0B0B0F_0%,#1A1816_100%)] text-ink-50 py-16 noise-bg relative overflow-hidden">
        <div className="absolute -top-20 right-0 w-96 h-96 rounded-full bg-sakura/20 blur-[120px]" />
        <div className="absolute -bottom-20 left-0 w-96 h-96 rounded-full bg-electric/20 blur-[120px]" />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10">
          <div className="flex items-end justify-between flex-wrap gap-6">
            <div>
              <Badge variant="outline" className="border-ink-600 text-ink-300 mb-4">
                <TrendingUp className="w-3 h-3" /> Learning dashboard
              </Badge>
              <h1 className="display text-5xl lg:text-7xl font-black leading-[0.9] mb-3">
                学习<span className="text-gradient-neon">仪表盘</span>
              </h1>
              <p className="text-ink-300 text-lg">
                {user ? `${user.name}，你已坚持学习 12 天，太棒了！` : '欢迎回来'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/learn">
                <Button variant="gradient" size="lg" hard>
                  继续学习 <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { i: Clock, l: '今日学习', v: `${Math.floor(studyMinutes)}m`, t: '/ 30min', c: 'text-amber', bg: 'bg-amber/10' },
            { i: Flame, l: '连胜天数', v: '12', t: '天', c: 'text-cinnabar', bg: 'bg-cinnabar/10' },
            { i: Trophy, l: '总积分', v: user?.totalPoints ?? 0, t: 'pts', c: 'text-amber', bg: 'bg-amber/10' },
            { i: Target, l: '今日任务', v: `${completed}/${dailyTasks.length}`, t: '完成', c: 'text-jade', bg: 'bg-jade/10' },
          ].map((s) => (
            <Card key={s.l} className="p-5">
              <div className={cn('w-10 h-10 rounded-2xl grid place-items-center mb-3', s.bg, s.c)}>
                <s.i className="w-5 h-5" />
              </div>
              <div className="text-xs text-ink-400 uppercase tracking-widest">{s.l}</div>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="display text-3xl font-black tnum">{s.v}</span>
                <span className="text-xs text-ink-400">{s.t}</span>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
          <Card className="p-6 lg:col-span-7">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="display text-2xl font-black">能力雷达</h2>
                <p className="text-xs text-ink-500 mt-1">六维能力值 vs 目标分</p>
              </div>
              <Badge variant="default" className="bg-jade/10 text-jade">
                整体 +12%
              </Badge>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={RADAR}>
                <PolarGrid stroke="#E8E4D8" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#6E6A5C', fontSize: 12, fontWeight: 600 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#A39E8D', fontSize: 10 }} />
                <Radar name="目标" dataKey="target" stroke="#A39E8D" fill="#A39E8D" fillOpacity={0.15} />
                <Radar name="当前" dataKey="current" stroke="#FF6B9D" fill="#FF6B9D" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 lg:col-span-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="display text-2xl font-black">本月学习时长</h2>
                <p className="text-xs text-ink-500 mt-1">最近 6 周</p>
              </div>
              <Badge variant="default" className="bg-sakura/10 text-sakura">
                <Sparkles className="w-3 h-3" /> +18%
              </Badge>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={MONTH_DATA}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF6B9D" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#FF6B9D" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E8E4D8" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="w" tick={{ fill: '#A39E8D', fontSize: 11 }} />
                <YAxis tick={{ fill: '#A39E8D', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#0B0B0F', border: 'none', borderRadius: 12, color: 'white' }} />
                <Area type="monotone" dataKey="m" stroke="#FF6B9D" strokeWidth={3} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
          <Card className="p-6 lg:col-span-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="display text-2xl font-black">本周活跃</h2>
                <p className="text-xs text-ink-500 mt-1">每天学习时长（分钟）</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={WEEK_DATA}>
                <CartesianGrid stroke="#E8E4D8" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#A39E8D', fontSize: 11 }} />
                <YAxis tick={{ fill: '#A39E8D', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#0B0B0F', border: 'none', borderRadius: 12, color: 'white' }} />
                <Bar dataKey="minutes" fill="#F59E0B" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 lg:col-span-7">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="display text-2xl font-black">每日任务</h2>
                <p className="text-xs text-ink-500 mt-1">完成所有任务可获得 <span className="display text-amber font-black tnum">+{totalReward}</span> 积分</p>
              </div>
              <Badge variant="default" className="bg-jade/10 text-jade">
                {completed} / {dailyTasks.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {dailyTasks.map((t) => {
                const pct = Math.min(100, (t.current / t.target) * 100)
                const canClaim = t.current >= t.target && !t.completed
                return (
                  <div key={t.id} className="flex items-center gap-4">
                    <div className={cn('w-10 h-10 rounded-2xl grid place-items-center text-lg', t.completed ? 'bg-jade text-white' : 'bg-ink-100')}>
                      {t.completed ? '✓' : t.icon === 'book' ? '📖' : t.icon === 'mic' ? '🎙' : t.icon === 'headphones' ? '🎧' : t.icon === 'clock' ? '⏰' : '✓'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between mb-1.5">
                        <span className="text-sm font-semibold">{t.title}</span>
                        <span className="text-xs text-ink-400 tnum">{t.current} / {t.target}</span>
                      </div>
                      <Progress value={pct} variant={t.completed ? 'jade' : 'amber'} />
                    </div>
                    {canClaim ? (
                      <Button size="sm" variant="primary" onClick={() => claimTask(t.id)}>
                        领取 +{t.reward}
                      </Button>
                    ) : t.completed ? (
                      <Badge variant="default" className="bg-jade/10 text-jade">
                        <Check className="w-3 h-3" /> 已领
                      </Badge>
                    ) : (
                      <div className="display text-base font-black text-amber tnum">+{t.reward}</div>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="p-6 lg:col-span-7">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="display text-2xl font-black">学习日历</h2>
                <p className="text-xs text-ink-500 mt-1">过去 8 周活跃度</p>
              </div>
              <CalendarIcon className="w-5 h-5 text-ink-400" />
            </div>
            <div className="space-y-1.5">
              {DAYS.map((d, di) => (
                <div key={d} className="flex items-center gap-2">
                  <div className="w-6 text-[10px] text-ink-400 uppercase">{d}</div>
                  <div className="flex gap-1 flex-1">
                    {HEATMAP.filter((c) => c.day === di).map((c, i) => {
                      const colors = ['bg-ink-100', 'bg-jade/30', 'bg-jade/60', 'bg-jade', 'bg-jade ring-2 ring-amber/40']
                      return (
                        <div
                          key={i}
                          className={cn('flex-1 h-7 rounded-md', colors[c.level])}
                          title={`Level ${c.level}`}
                        />
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-3 text-[10px] text-ink-400">
              <span>少</span>
              {['bg-ink-100', 'bg-jade/30', 'bg-jade/60', 'bg-jade'].map((c, i) => (
                <div key={i} className={cn('w-3 h-3 rounded-sm', c)} />
              ))}
              <span>多</span>
            </div>
          </Card>

          <Card className="p-6 lg:col-span-5">
            <h2 className="display text-2xl font-black mb-4">错题本</h2>
            <p className="text-xs text-ink-500 mb-4">系统自动收集的薄弱知识点，建议每周复习 2-3 次</p>
            {errorBook.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-10 h-10 text-ink-300 mx-auto mb-3" />
                <p className="text-sm text-ink-500">还没有错题，继续保持！</p>
              </div>
            ) : (
              <div className="space-y-2">
                {errorBook.slice(0, 5).map((id) => (
                  <div key={id} className="p-3 rounded-2xl bg-ink-50 flex items-center justify-between">
                    <span className="text-sm">错题 #{id.slice(-4)}</span>
                    <Link to="/learn/grammar" className="text-xs text-sakura font-semibold">复习 →</Link>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <Card className="mt-6 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="display text-2xl font-black">已获徽章</h2>
              <p className="text-xs text-ink-500 mt-1">已解锁 {badges.filter(b => b.unlocked).length} / {badges.length} 枚</p>
            </div>
            <Link to="/achievements" className="text-sm font-semibold text-sakura flex items-center gap-1">
              查看全部 <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {badges.slice(0, 6).map((b) => (
              <div key={b.id} className={cn('text-center p-3 rounded-2xl border', b.unlocked ? 'border-ink-200 bg-white' : 'border-ink-100 bg-ink-50/50 opacity-60')}>
                <div className="w-12 h-12 mx-auto rounded-2xl grid place-items-center mb-2" style={{ background: b.color }}>
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div className="text-xs font-bold truncate">{b.name}</div>
                <div className="text-[10px] text-ink-400 uppercase mt-0.5">{b.rarity}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
