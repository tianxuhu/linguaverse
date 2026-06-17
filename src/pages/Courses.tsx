import { Link, useSearchParams } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { Star, Users, Filter, Search, Clock, ArrowUpRight } from 'lucide-react'
import { COURSES } from '@/data/mock'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatNumber } from '@/utils'
import type { Language, Level } from '@/types'

const LANGS: { code: Language | 'all'; name: string }[] = [
  { code: 'all', name: '全部语种' },
  { code: 'en', name: '英语' },
  { code: 'ja', name: '日语' },
  { code: 'ko', name: '韩语' },
]

const LEVELS: { code: Level | 'all'; name: string }[] = [
  { code: 'all', name: '全部等级' },
  { code: 'A1', name: 'A1' },
  { code: 'A2', name: 'A2' },
  { code: 'B1', name: 'B1' },
  { code: 'B2', name: 'B2' },
  { code: 'C1', name: 'C1' },
  { code: 'N5', name: 'N5' },
  { code: 'N4', name: 'N4' },
  { code: 'N3', name: 'N3' },
  { code: 'N2', name: 'N2' },
  { code: 'N1', name: 'N1' },
  { code: 'TOPIK1', name: 'TOPIK 1' },
  { code: 'TOPIK2', name: 'TOPIK 2' },
  { code: 'TOPIK3', name: 'TOPIK 3' },
  { code: 'TOPIK4', name: 'TOPIK 4' },
  { code: 'TOPIK5', name: 'TOPIK 5' },
]

const CATEGORIES = [
  { code: 'all', name: '全部类型' },
  { code: 'general', name: '综合' },
  { code: 'business', name: '商务' },
  { code: 'travel', name: '旅行' },
  { code: 'exam', name: '考试' },
  { code: 'culture', name: '文化' },
]

export default function Courses() {
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState('')
  const lang = (params.get('lang') || 'all') as Language | 'all'
  const level = (params.get('level') || 'all') as Level | 'all'
  const cat = params.get('cat') || 'all'

  const setParam = (key: string, val: string) => {
    const p = new URLSearchParams(params)
    if (val === 'all') p.delete(key)
    else p.set(key, val)
    setParams(p)
  }

  const filtered = useMemo(() => {
    return COURSES.filter((c) => {
      if (lang !== 'all' && c.language !== lang) return false
      if (level !== 'all' && c.level !== level) return false
      if (cat !== 'all' && c.category !== cat) return false
      if (q && !c.title.toLowerCase().includes(q.toLowerCase()) && !c.subtitle.includes(q)) return false
      return true
    })
  }, [lang, level, cat, q])

  return (
    <div className="min-h-screen">
      <div className="bg-ink-900 text-ink-50 py-20 noise-bg relative">
        <div className="absolute -top-10 right-0 w-96 h-96 rounded-full bg-sakura/20 blur-[120px]" />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10">
          <Badge variant="outline" className="border-ink-600 text-ink-300 mb-6">
            <Filter className="w-3 h-3" /> Course catalog
          </Badge>
          <h1 className="display text-6xl lg:text-8xl font-black leading-[0.9] mb-6">
            <span className="text-gradient-neon">课程</span>中心
          </h1>
          <p className="text-ink-300 text-lg max-w-2xl">
            {COURSES.length} 门分级课程，覆盖 A1 至 C2、N5 至 N1、TOPIK 1 至 6。系统化路径，让每一步成长都清晰可见。
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 space-y-8">
            <div>
              <div className="text-xs uppercase tracking-widest text-ink-400 font-semibold mb-3">搜索</div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="课程名称..."
                  className="w-full h-10 pl-9 pr-3 rounded-full bg-white border border-ink-200 text-sm focus:outline-none focus:border-ink-900"
                />
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-widest text-ink-400 font-semibold mb-3">语种</div>
              <div className="space-y-1">
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setParam('lang', l.code)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                      lang === l.code ? 'bg-ink-900 text-ink-50' : 'hover:bg-ink-100'
                    }`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-widest text-ink-400 font-semibold mb-3">等级</div>
              <div className="flex flex-wrap gap-1.5">
                {LEVELS.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setParam('level', l.code)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      level === l.code ? 'bg-ink-900 text-ink-50' : 'bg-white border border-ink-200 hover:border-ink-900'
                    }`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-widest text-ink-400 font-semibold mb-3">类型</div>
              <div className="space-y-1">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setParam('cat', c.code)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                      cat === c.code ? 'bg-ink-900 text-ink-50' : 'hover:bg-ink-100'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-ink-500">
                <span className="display text-2xl font-black text-ink-900 tnum mr-1">{filtered.length}</span>
                门匹配课程
              </div>
            </div>

            {filtered.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="display text-6xl mb-4 opacity-30">∅</div>
                <p className="text-ink-500">没有匹配的课程，试试其他筛选条件</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((c) => (
                  <Link
                    key={c.id}
                    to={`/courses/${c.id}`}
                    className="group bg-white border border-ink-100 rounded-3xl overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all"
                  >
                    <div className="aspect-[16/10] relative overflow-hidden" style={{ background: c.cover }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-display text-7xl font-black text-white/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                          {c.title.slice(0, 1)}
                        </span>
                      </div>
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <Badge variant="solid" className="bg-white/95 text-ink-900">{c.level}</Badge>
                        <Badge variant="default" className="bg-black/50 text-white border-0 capitalize">{c.category}</Badge>
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
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {c.tags.slice(0, 3).map((t) => (
                          <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-ink-100 text-ink-600">
                            #{t}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-ink-400 pt-3 border-t border-ink-100">
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span className="tnum">{formatNumber(c.learnerCount)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="tnum">{c.duration}h · {c.lessons.length} 节</span>
                        </div>
                        <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
