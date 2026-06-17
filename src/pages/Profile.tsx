import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Settings, LogOut, Edit3, Award, Calendar, Target, Flame, TrendingUp, BookOpen, Trophy, Heart, Sparkles, Mic, Headphones } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import { useAuthStore } from '@/stores/authStore'
import { useLearnStore } from '@/stores/learnStore'
import { LANGUAGES_META } from '@/data/mock'
import type { Language } from '@/types'
import { cn, formatNumber } from '@/utils'

export default function Profile() {
  const { user, isAuthenticated, logout, updateUser, setTargetLanguage } = useAuthStore()
  const { badges, enrollments, dailyTasks, todayLearned, studyMinutes } = useLearnStore()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <Card className="p-12 max-w-md w-full text-center">
          <h2 className="display text-3xl font-black mb-3">未登录</h2>
          <p className="text-ink-500 mb-6">登录后查看个人中心</p>
          <Link to="/login">
            <Button variant="primary" hard>立即登录</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const handleSave = () => {
    updateUser({ name, avatar: name.slice(0, 2) })
    setEditing(false)
  }

  const completedTasks = dailyTasks.filter((t) => t.completed).length
  const unlockedBadges = badges.filter((b) => b.unlocked).length

  return (
    <div className="min-h-screen">
      <div className="bg-ink-900 text-ink-50 py-20 noise-bg relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-sakura/20 blur-[120px]" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-electric/20 blur-[120px]" />
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl bg-[linear-gradient(135deg,#FF6B9D,#F59E0B)] text-white grid place-items-center display text-5xl font-black pulse-glow">
                {user.avatar}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-amber text-white grid place-items-center">
                <Trophy className="w-5 h-5" />
              </div>
            </div>
            <div className="flex-1">
              {!editing ? (
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="display text-5xl lg:text-6xl font-black">{user.name}</h1>
                  <button onClick={() => setEditing(true)} className="p-2 rounded-full hover:bg-ink-700">
                    <Edit3 className="w-4 h-4 text-ink-300" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-3">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 px-4 rounded-2xl bg-ink-700 border border-ink-600 text-2xl font-bold focus:outline-none focus:border-sakura"
                    autoFocus
                  />
                  <Button size="sm" variant="gradient" onClick={handleSave}>保存</Button>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2 text-sm text-ink-300">
                <Badge variant="outline" className="border-ink-600 text-ink-300">
                  {user.email}
                </Badge>
                <Badge variant="outline" className="border-ink-600 text-ink-300">
                  {LANGUAGES_META.find((l) => l.code === user.targetLanguage)?.native} · {user.currentLevel}
                </Badge>
                <Badge variant="default" className="bg-amber/20 text-amber">
                  <Flame className="w-3 h-3" /> {user.streak?.current || 12} 连胜
                </Badge>
                <Badge variant="default" className="bg-jade/20 text-jade">
                  LV.{Math.floor(user.totalPoints / 200) + 1}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-ink-50 text-ink-50" onClick={() => navigate('/achievements')}>
                <Award className="w-4 h-4 mr-2" /> 我的徽章
              </Button>
              <Button variant="ghost" className="text-ink-300 hover:bg-ink-700" onClick={() => { logout(); navigate('/') }}>
                <LogOut className="w-4 h-4 mr-2" /> 退出
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { i: TrendingUp, l: '总积分', v: user.totalPoints, t: 'pts', c: 'text-amber', bg: 'bg-amber/10' },
            { i: Flame, l: '连胜天数', v: 12, t: '天', c: 'text-cinnabar', bg: 'bg-cinnabar/10' },
            { i: Trophy, l: '已获徽章', v: `${unlockedBadges}/${badges.length}`, t: '枚', c: 'text-sakura', bg: 'bg-sakura/10' },
            { i: BookOpen, l: '已加入课程', v: enrollments.length, t: '门', c: 'text-electric', bg: 'bg-electric/10' },
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="p-6 lg:col-span-7">
            <h2 className="display text-2xl font-black mb-4">本周学习报告</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-sm">学习时长</span>
                  <span className="display text-2xl font-black tnum">{Math.floor(studyMinutes)}<span className="text-sm text-ink-400 ml-1">分钟</span></span>
                </div>
                <Progress value={studyMinutes} max={150} variant="amber" />
                <div className="text-[10px] text-ink-400 mt-1">本周目标 150 分钟</div>
              </div>
              <div className="grid grid-cols-4 gap-3 pt-4 border-t border-ink-100">
                {[
                  { l: '单词', n: todayLearned.vocab, c: 'sakura' },
                  { l: '语法', n: todayLearned.grammar, c: 'electric' },
                  { l: '口语', n: todayLearned.speaking, c: 'amber' },
                  { l: '听力', n: todayLearned.listening, c: 'jade' },
                ].map((s) => (
                  <div key={s.l} className="text-center">
                    <div className={cn('display text-2xl font-black tnum', `text-${s.c}`)}>{s.n}</div>
                    <div className="text-[10px] text-ink-400 mt-1">{s.l} 次</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6 lg:col-span-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="display text-2xl font-black">学习目标</h2>
              <button className="p-2 rounded-full hover:bg-ink-100">
                <Settings className="w-4 h-4 text-ink-400" />
              </button>
            </div>
            <div className="mb-4">
              <div className="text-xs text-ink-500 mb-2">目标语种</div>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES_META.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setTargetLanguage(l.code as Language)}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-medium transition-all',
                      user.targetLanguage === l.code
                        ? 'bg-ink-900 text-ink-50'
                        : 'bg-ink-100 hover:bg-ink-200',
                    )}
                  >
                    {l.flag} {l.native}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <div className="text-xs text-ink-500 mb-2">每日目标</div>
              <div className="flex gap-2">
                {[15, 30, 45, 60].map((m) => (
                  <button key={m} className={cn('flex-1 py-2 rounded-xl text-sm font-medium', m === 30 ? 'bg-ink-900 text-ink-50' : 'bg-ink-100 hover:bg-ink-200')}>
                    {m}m
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-ink-50 flex items-center gap-3">
              <Target className="w-5 h-5 text-sakura" />
              <div className="text-sm">本周目标 <span className="display font-black tnum">5/7</span> 天已完成</div>
            </div>
          </Card>

          <Card className="p-6 lg:col-span-7">
            <h2 className="display text-2xl font-black mb-4">最近活动</h2>
            <div className="space-y-3">
              {[
                { i: BookOpen, t: '完成「英语 A1 · 问候与自我介绍」单词训练', time: '2 小时前', c: 'sakura' },
                { i: Trophy, t: '解锁「每日打卡」徽章', time: '今天 09:30', c: 'amber' },
                { i: Heart, t: '在社区发布了学习心得', time: '昨天', c: 'cinnabar' },
                { i: Award, t: '累计学习时长突破 100 小时', time: '3 天前', c: 'electric' },
                { i: Calendar, t: '连续学习 12 天', time: '本周', c: 'jade' },
              ].map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-ink-50">
                  <div className={cn('w-9 h-9 rounded-xl grid place-items-center', `bg-${a.c}/10`, `text-${a.c}`)}>
                    <a.i className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">{a.t}</div>
                    <div className="text-[10px] text-ink-400 mt-0.5 tnum">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 lg:col-span-5">
            <h2 className="display text-2xl font-black mb-4">最近徽章</h2>
            <div className="grid grid-cols-3 gap-3">
              {badges.filter((b) => b.unlocked).slice(0, 6).map((b) => {
                const Icon = ({
                  sprout: Sparkles, flame: Flame, book: BookOpen, mic: Mic, crown: Trophy,
                  headphones: Headphones, heart: Heart, globe: TrendingUp, check: Trophy, moon: Trophy, star: Trophy, trophy: Trophy,
                } as any)[b.icon] || Trophy
                return (
                  <div key={b.id} className="text-center p-3 rounded-2xl border border-ink-200">
                    <div className="w-12 h-12 mx-auto rounded-2xl grid place-items-center mb-2" style={{ background: b.color }}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-xs font-bold truncate">{b.name}</div>
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
