import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import {
  ArrowUpRight, Sparkles, Flame, Trophy, Zap, Globe2, BookOpen, Brain,
  MessageCircle, Headphones, Mic, TrendingUp, Star, Users, BookText, Languages, Heart,
} from 'lucide-react'
import { LANGUAGES_META, COURSES, POSTS, LEADERBOARD } from '@/data/mock'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { useAuthStore } from '@/stores/authStore'
import { useLearnStore } from '@/stores/learnStore'
import { formatNumber, relativeTime, cn } from '@/utils'

const ROLLING = ['Hello', 'こんにちは', '안녕하세요', 'Bonjour', 'Hola', 'Guten Tag', 'Ciao']

function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('in')
      })
    }, { threshold: 0.12 })
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

function Hero() {
  const { user } = useAuthStore()
  return (
    <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 -left-20 w-[480px] h-[480px] rounded-full bg-sakura/20 blur-[120px]" />
        <div className="absolute top-40 -right-20 w-[520px] h-[520px] rounded-full bg-amber/20 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 w-[420px] h-[420px] rounded-full bg-electric/20 blur-[120px]" />
      </div>

      <div className="marquee-mask absolute top-24 left-0 right-0 overflow-hidden -z-10 opacity-[0.06] select-none">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {[...Array(4)].flatMap((_, i) =>
            ROLLING.map((w, j) => (
              <span key={`${i}-${j}`} className="font-display text-[120px] lg:text-[160px] font-black text-ink-900 leading-none">
                {w} ·
              </span>
            )),
          )}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-ink-200 mb-8 animate-flipIn">
              <Sparkles className="w-3.5 h-3.5 text-amber" />
              <span className="text-xs font-medium">全球 224 万学习者正在使用</span>
            </div>

            <h1 className="display text-[64px] sm:text-[88px] lg:text-[112px] leading-[0.95] font-black tracking-tight mb-8">
              <span className="block">Master</span>
              <span className="block text-gradient-neon">any language.</span>
              <span className="block italic font-light text-ink-700 text-[40px] sm:text-[56px] lg:text-[72px] mt-2">
                掌握每一门语言。
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-ink-500 leading-relaxed max-w-xl mb-10">
              沉浸式语料、AI 个性化路径、强激励社区生态。
              从英语到日韩，每一次练习都是真实语境下的探索。
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to={user ? '/learn' : '/register'}>
                <Button variant="gradient" size="lg" hard>
                  {user ? '继续学习' : '开始免费学习'} <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link to="/courses">
                <Button variant="outline" size="lg">
                  浏览课程
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-14 max-w-lg">
              {[
                { n: '12+', l: '语种' },
                { n: '2.24M', l: '学员' },
                { n: '4.9★', l: '评分' },
              ].map((s) => (
                <div key={s.l}>
                  <div className="display text-3xl font-black tnum">{s.n}</div>
                  <div className="text-xs text-ink-400 mt-1 uppercase tracking-wider">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative aspect-square max-w-[480px] mx-auto">
              <div className="absolute inset-0 rounded-[40px] bg-ink-900 notched p-8 text-ink-50 overflow-hidden noise-bg">
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <Badge variant="default" className="bg-ink-700 text-ink-50">
                      <Flame className="w-3 h-3" /> 连胜 12 天
                    </Badge>
                    <div className="text-xs text-ink-300 tnum">LV. 7</div>
                  </div>

                  <div className="font-display text-5xl font-black leading-tight mb-3">
                    こんにちは
                  </div>
                  <div className="text-ink-300 text-sm mb-6">/kon.ni.tɕi.wa/ · 你好</div>

                  <div className="bg-ink-700/60 rounded-2xl p-4 mb-4">
                    <div className="text-xs text-ink-300 mb-1">今日进度</div>
                    <Progress value={68} variant="amber" />
                    <div className="flex justify-between text-[10px] text-ink-300 mt-1.5 tnum">
                      <span>14 / 20 词</span>
                      <span>+30 pts</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    {['单词', '语法', '口语', '听力'].map((m, i) => (
                      <div key={m} className={cn('rounded-xl p-3 text-center text-xs font-medium', i === 0 ? 'bg-sakura text-white' : 'bg-ink-700/60 text-ink-200')}>
                        {m}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl bg-amber grid place-items-center text-white rotate-12 animate-float shadow-xl">
                <Trophy className="w-9 h-9" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-2xl bg-sakura grid place-items-center text-white -rotate-6 animate-float shadow-xl" style={{ animationDelay: '1.5s' }}>
                <div className="text-center">
                  <div className="display text-2xl font-black">+50</div>
                  <div className="text-[9px] uppercase tracking-widest">积分</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function LanguageSection() {
  return (
    <section className="py-24 bg-ink-900 text-ink-50 relative overflow-hidden noise-bg">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-5">
            <Badge variant="outline" className="border-ink-600 text-ink-300 mb-6">
              <Globe2 className="w-3 h-3" /> Choose your path
            </Badge>
            <h2 className="display text-5xl lg:text-6xl font-black leading-tight">
              三大主流语种，<br />
              <span className="text-gradient-neon">任你探索</span>
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 self-end">
            <p className="text-ink-300 text-lg leading-relaxed">
              每一个语种都有专属的文化语境与训练体系。从英语的全球通行，到日韩的文化沉浸，让语言学习成为一种生活方式。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LANGUAGES_META.map((l, i) => (
            <Link
              key={l.code}
              to={`/courses?lang=${l.code}`}
              className="group relative bg-ink-700/40 hover:bg-ink-700 border border-ink-700 rounded-3xl p-8 transition-all hover:-translate-y-1 overflow-hidden"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div
                className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-30 blur-2xl group-hover:opacity-60 transition-opacity"
                style={{ background: l.gradient }}
              />
              <div className="relative">
                <div className="flex items-start justify-between mb-12">
                  <div
                    className="w-14 h-14 rounded-2xl grid place-items-center text-2xl font-display font-black"
                    style={{ background: l.gradient, color: 'white' }}
                  >
                    {l.flag}
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-ink-300 group-hover:text-sakura group-hover:rotate-45 transition-all" />
                </div>

                <h3 className="font-display text-4xl font-black mb-1">{l.native}</h3>
                <div className="text-sm text-ink-400 mb-4">{l.name}</div>
                <p className="text-ink-300 text-sm leading-relaxed mb-8">{l.desc}</p>

                <div className="flex items-center justify-between pt-6 border-t border-ink-700">
                  <div>
                    <div className="text-[10px] text-ink-400 uppercase tracking-widest">学习者</div>
                    <div className="display text-xl font-black tnum mt-0.5">{formatNumber(l.learners)}</div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-ink-300">
                    <Star className="w-3.5 h-3.5 text-amber fill-amber" />
                    <span className="tnum">4.8</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function ModulesSection() {
  const modules = [
    { icon: BookOpen, title: '单词记忆', sub: 'Vocabulary', color: '#FF6B9D', desc: '闪卡 + 拼写 + 艾宾浩斯复习曲线' },
    { icon: BookText, title: '语法练习', sub: 'Grammar', color: '#3B82F6', desc: '选择 / 填空 / 排序，AI 错题解析' },
    { icon: Mic, title: '口语跟读', sub: 'Speaking', color: '#F59E0B', desc: '原音播放 + 录音波形 + AI 评分' },
    { icon: Headphones, title: '听力训练', sub: 'Listening', color: '#10B981', desc: '多档语速 + 听写 + 听后选择' },
  ]
  return (
    <section className="py-24">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-7">
            <Badge variant="default" className="mb-6">
              <Zap className="w-3 h-3" /> Four training modules
            </Badge>
            <h2 className="display text-5xl lg:text-6xl font-black leading-tight">
              输入到输出，<br />
              四维能力闭环
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((m, i) => (
            <div
              key={m.title}
              className="reveal group relative bg-white border border-ink-100 rounded-3xl p-7 hover:-translate-y-1 hover:shadow-xl transition-all overflow-hidden"
            >
              <div
                className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"
                style={{ background: m.color }}
              />
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-2xl grid place-items-center mb-6"
                  style={{ background: m.color }}
                >
                  <m.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-xs text-ink-400 tracking-widest uppercase mb-2">{m.sub}</div>
                <h3 className="display text-2xl font-black mb-3">{m.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{m.desc}</p>
                <div className="mt-6 flex items-center gap-1 text-xs font-semibold" style={{ color: m.color }}>
                  <span>0{i + 1}</span>
                  <span className="w-6 h-px bg-current" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CoursesSection() {
  return (
    <section className="py-24 bg-ink-100/40">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <Badge variant="default" className="mb-4">
              <Flame className="w-3 h-3" /> Trending now
            </Badge>
            <h2 className="display text-5xl lg:text-6xl font-black leading-tight">
              热门课程
            </h2>
          </div>
          <Link to="/courses" className="text-sm font-semibold flex items-center gap-1 hover:text-sakura transition-colors">
            查看全部 <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {COURSES.slice(0, 4).map((c) => (
            <Link
              key={c.id}
              to={`/courses/${c.id}`}
              className="reveal group bg-white border border-ink-100 rounded-3xl overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all"
            >
              <div className="aspect-[16/10] relative overflow-hidden" style={{ background: c.cover }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-5xl font-black text-white/30 group-hover:scale-110 transition-transform">
                    {c.title.slice(0, 1)}
                  </span>
                </div>
                <div className="absolute top-3 left-3">
                  <Badge variant="solid" className="bg-white/90 text-ink-900 backdrop-blur">
                    {c.level}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant="default" className="bg-black/40 text-white border-0">
                    <Star className="w-3 h-3 text-amber fill-amber" /> {c.rating}
                  </Badge>
                </div>
              </div>
              <div className="p-5">
                <div className="text-[11px] text-sakura font-semibold uppercase tracking-widest mb-2">
                  {c.subtitle}
                </div>
                <h3 className="font-display text-lg font-black leading-tight mb-2 line-clamp-2">
                  {c.title}
                </h3>
                <p className="text-xs text-ink-500 line-clamp-2 mb-4">{c.description}</p>
                <div className="flex items-center justify-between text-xs text-ink-400">
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span className="tnum">{formatNumber(c.learnerCount)}</span>
                  </div>
                  <div className="tnum">{c.duration}h</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function DashboardPreview() {
  const { user } = useAuthStore()
  const { dailyTasks, todayLearned, studyMinutes, weeklyMinutes } = useLearnStore()
  const completedTasks = dailyTasks.filter((t) => t.completed).length
  return (
    <section className="py-24">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-5">
            <Badge variant="default" className="mb-4">
              <TrendingUp className="w-3 h-3" /> Your dashboard
            </Badge>
            <h2 className="display text-5xl lg:text-6xl font-black leading-tight mb-4">
              数据驱动的<br />
              学习画像
            </h2>
            <p className="text-ink-500 leading-relaxed">
              实时追踪学习时长、能力变化、连胜与错题，让成长有迹可循。
            </p>
            <Link to="/dashboard" className="inline-flex items-center gap-1 mt-6 text-sm font-semibold hover:text-sakura transition-colors">
              完整仪表盘 <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            <Card className="p-6 col-span-2">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs text-ink-400 uppercase tracking-widest">本周学习时长</div>
                <Badge variant="default" className="bg-jade/10 text-jade">
                  +18%
                </Badge>
              </div>
              <div className="flex items-end gap-2 h-32">
                {weeklyMinutes.map((m, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2">
                    <div className="w-full bg-ink-100 rounded-full overflow-hidden flex items-end" style={{ height: '100%' }}>
                      <div
                        className="w-full bg-gradient-to-t from-sakura to-amber rounded-full"
                        style={{ height: `${(m / 35) * 100}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-ink-400 tnum">{
                      ['一', '二', '三', '四', '五', '六', '日'][i]
                    }</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <div className="text-xs text-ink-400 uppercase tracking-widest mb-2">今日学习</div>
              <div className="display text-3xl font-black tnum">
                {Math.floor(studyMinutes)}<span className="text-base font-normal text-ink-400"> / 30 min</span>
              </div>
              <Progress value={studyMinutes} max={30} className="mt-3" variant="amber" />
            </Card>

            <Card className="p-5">
              <div className="text-xs text-ink-400 uppercase tracking-widest mb-2">每日任务</div>
              <div className="display text-3xl font-black tnum">
                {completedTasks}<span className="text-base font-normal text-ink-400"> / {dailyTasks.length}</span>
              </div>
              <div className="flex gap-1 mt-3">
                {dailyTasks.map((t) => (
                  <div
                    key={t.id}
                    className={cn(
                      'flex-1 h-1.5 rounded-full',
                      t.completed ? 'bg-jade' : 'bg-ink-100',
                    )}
                  />
                ))}
              </div>
            </Card>

            <Card className="p-5 col-span-2">
              <div className="text-xs text-ink-400 uppercase tracking-widest mb-3">今日能力</div>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { k: 'vocab', l: '单词', n: todayLearned.vocab, max: 10, c: 'sakura' },
                  { k: 'grammar', l: '语法', n: todayLearned.grammar, max: 5, c: 'electric' },
                  { k: 'speaking', l: '口语', n: todayLearned.speaking, max: 3, c: 'amber' },
                  { k: 'listening', l: '听力', n: todayLearned.listening, max: 5, c: 'jade' },
                ].map((s) => (
                  <div key={s.k}>
                    <div className="flex items-baseline justify-between mb-1.5">
                      <span className="text-xs font-medium">{s.l}</span>
                      <span className="text-[10px] text-ink-400 tnum">{s.n}/{s.max}</span>
                    </div>
                    <Progress value={s.n} max={s.max} variant={s.c as any} />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

function CommunityPreview() {
  return (
    <section className="py-24 bg-ink-50 border-t border-ink-100">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <Badge variant="default" className="mb-4">
              <MessageCircle className="w-3 h-3" /> Community
            </Badge>
            <h2 className="display text-5xl lg:text-6xl font-black leading-tight">
              学员的<br />
              学习日记
            </h2>
          </div>
          <Link to="/community" className="text-sm font-semibold flex items-center gap-1 hover:text-sakura transition-colors">
            进入社区 <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {POSTS.slice(0, 3).map((p) => (
            <Card key={p.id} className="p-6 hover:shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[linear-gradient(135deg,#FF6B9D,#F59E0B)] text-white grid place-items-center font-bold text-sm">
                  {p.userAvatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{p.userName}</div>
                  <div className="text-xs text-ink-400">{relativeTime(p.createdAt)}</div>
                </div>
                <Badge variant="default" className="bg-sakura/10 text-sakura">
                  #{p.tag}
                </Badge>
              </div>
              <p className="text-sm leading-relaxed text-ink-700 line-clamp-3 mb-4">{p.content}</p>
              <div className="flex items-center gap-4 text-xs text-ink-400">
                <span className="flex items-center gap-1">
                  <Heart className={cn('w-3.5 h-3.5', p.liked && 'fill-sakura text-sakura')} /> {p.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5" /> {p.comments}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function AchievementsPreview() {
  return (
    <section className="py-24">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <Badge variant="default" className="mb-4">
              <Trophy className="w-3 h-3" /> Achievements
            </Badge>
            <h2 className="display text-5xl lg:text-6xl font-black leading-tight mb-4">
              徽章激励<br />
              系统
            </h2>
            <p className="text-ink-500 leading-relaxed mb-6">
              12 枚稀有徽章等你解锁。从初学到大师，每一次坚持都值得被记录。
            </p>
            <div className="space-y-2">
              {LEADERBOARD.slice(0, 4).map((lb) => (
                <div key={lb.userId} className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-ink-100 transition-colors">
                  <div className={cn(
                    'w-7 h-7 rounded-full grid place-items-center text-xs font-black tnum',
                    lb.rank === 1 ? 'bg-amber text-white' :
                    lb.rank === 2 ? 'bg-ink-300 text-white' :
                    lb.rank === 3 ? 'bg-cinnabar text-white' :
                    'bg-ink-100 text-ink-500',
                  )}>
                    {lb.rank}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-ink-100 grid place-items-center text-xs font-bold">
                    {lb.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{lb.name}</div>
                    <div className="text-[10px] text-ink-400 tnum">{formatNumber(lb.points)} pts · 🔥 {lb.streak}天</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: Sparkles, name: '初心起步', rarity: 'common', color: '#10B981', unlocked: true },
                { icon: Flame, name: '七日学者', rarity: 'rare', color: '#F59E0B', unlocked: true },
                { icon: BookOpen, name: '千词大师', rarity: 'epic', color: '#3B82F6', progress: 68 },
                { icon: Mic, name: '流利之声', rarity: 'epic', color: '#FF6B9D', progress: 40 },
                { icon: Brain, name: '语法大师', rarity: 'legendary', color: '#F59E0B', progress: 20 },
                { icon: Trophy, name: '词汇冠军', rarity: 'legendary', color: '#F59E0B', progress: 24 },
              ].map((b, i) => (
                <div
                  key={i}
                  className={cn(
                    'reveal relative bg-white border border-ink-100 rounded-3xl p-6 text-center hover:-translate-y-1 hover:shadow-lg transition-all',
                    !b.unlocked && !b.progress && 'opacity-40',
                  )}
                >
                  <div
                    className="w-16 h-16 mx-auto rounded-2xl grid place-items-center mb-3"
                    style={{ background: b.color }}
                  >
                    <b.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-sm font-bold mb-1">{b.name}</div>
                  <Badge variant="default" className="text-[10px] uppercase">
                    {b.rarity}
                  </Badge>
                  {typeof b.progress === 'number' && (
                    <div className="mt-3">
                      <Progress value={b.progress} variant="amber" />
                      <div className="text-[10px] text-ink-400 mt-1 tnum">{b.progress}%</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="relative bg-ink-900 rounded-[40px] notched p-12 lg:p-20 text-ink-50 overflow-hidden noise-bg">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-sakura/40 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-amber/40 blur-3xl" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <Languages className="w-12 h-12 text-sakura mb-6" />
              <h2 className="display text-5xl lg:text-7xl font-black leading-[0.95] mb-6">
                准备好开启<br />
                你的<br />
                <span className="text-gradient-neon">多语人生</span>了吗？
              </h2>
              <p className="text-ink-300 text-lg leading-relaxed mb-8 max-w-md">
                加入 224 万学习者，每天 30 分钟，三月后说另一种语言思考。
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/register">
                  <Button variant="gradient" size="lg" hard>
                    免费注册 <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button variant="outline" size="lg" className="border-ink-50 text-ink-50 hover:bg-ink-50 hover:text-ink-900">
                    浏览课程
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { n: '12+', l: '支持语种' },
                  { n: '500+', l: '精品课程' },
                  { n: '4.9★', l: '用户评分' },
                  { n: '30m', l: '每日建议' },
                ].map((s) => (
                  <div key={s.l} className="bg-ink-700/60 rounded-3xl p-6 backdrop-blur">
                    <div className="display text-4xl font-black mb-1">{s.n}</div>
                    <div className="text-xs text-ink-300">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  useReveal()
  return (
    <>
      <Hero />
      <LanguageSection />
      <ModulesSection />
      <CoursesSection />
      <DashboardPreview />
      <CommunityPreview />
      <AchievementsPreview />
      <CTASection />
    </>
  )
}
