import { useState } from 'react'
import { Sparkles, Flame, Trophy, Award, BookOpen, Mic, Headphones, Brain, Crown, Star, Heart, Globe2, Moon, Check, Lock, TrendingUp, Users } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import { useLearnStore } from '@/stores/learnStore'
import { LEADERBOARD } from '@/data/mock'
import { cn, formatNumber } from '@/utils'

const ICON_MAP: Record<string, any> = {
  sprout: Sparkles, flame: Flame, book: BookOpen, mic: Mic, crown: Crown, headphones: Headphones,
  heart: Heart, globe: Globe2, check: Check, moon: Moon, star: Star, trophy: Trophy,
}

const RARITY_COLORS: Record<string, string> = {
  common: 'bg-ink-100 text-ink-700',
  rare: 'bg-electric/10 text-electric',
  epic: 'bg-sakura/10 text-sakura',
  legendary: 'bg-amber/10 text-amber',
}

const RARITY_BG: Record<string, string> = {
  common: 'from-ink-100 to-ink-50',
  rare: 'from-electric/20 to-jade/10',
  epic: 'from-sakura/20 to-amber/10',
  legendary: 'from-amber/30 to-sakura/20',
}

export default function Achievements() {
  const { badges } = useLearnStore()
  const [tab, setTab] = useState<'badges' | 'leaderboard' | 'shop'>('badges')
  const unlocked = badges.filter((b) => b.unlocked).length

  return (
    <div className="min-h-screen">
      <div className="bg-[linear-gradient(135deg,#0B0B0F_0%,#1A1816_100%)] text-ink-50 py-20 noise-bg relative overflow-hidden">
        <div className="absolute -top-20 right-0 w-96 h-96 rounded-full bg-amber/20 blur-[120px]" />
        <div className="absolute -bottom-20 left-0 w-96 h-96 rounded-full bg-sakura/20 blur-[120px]" />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10">
          <Badge variant="outline" className="border-ink-600 text-ink-300 mb-4">
            <Trophy className="w-3 h-3" /> Achievements
          </Badge>
          <h1 className="display text-5xl lg:text-7xl font-black leading-[0.9] mb-4">
            成就<span className="text-gradient-neon">中心</span>
          </h1>
          <p className="text-ink-300 text-lg max-w-xl">
            12 枚稀有徽章 + 每周排行榜 + 积分商城，每一次坚持都值得被记录。
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { i: Trophy, l: '已获徽章', v: `${unlocked}/${badges.length}`, c: 'text-amber' },
            { i: TrendingUp, l: '当前排名', v: '#47', c: 'text-sakura' },
            { i: Users, l: '好友数', v: '12', c: 'text-electric' },
            { i: Award, l: '总积分', v: '1280', c: 'text-jade' },
          ].map((s) => (
            <Card key={s.l} className="p-5">
              <s.i className={cn('w-6 h-6', s.c)} />
              <div className="display text-2xl font-black tnum mt-2">{s.v}</div>
              <div className="text-xs text-ink-400 mt-0.5">{s.l}</div>
            </Card>
          ))}
        </div>

        <div className="flex items-center gap-1 mb-8 border-b border-ink-100">
          {([
            { k: 'badges', l: '徽章墙' },
            { k: 'leaderboard', l: '排行榜' },
            { k: 'shop', l: '积分商城' },
          ] as const).map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={cn(
                'px-5 py-3 text-sm font-medium transition-colors relative',
                tab === t.k ? 'text-ink-900' : 'text-ink-500 hover:text-ink-900',
              )}
            >
              {t.l}
              {tab === t.k && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-ink-900" />}
            </button>
          ))}
        </div>

        {tab === 'badges' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {badges.map((b) => {
              const Icon = ICON_MAP[b.icon] || Trophy
              return (
                <div
                  key={b.id}
                  className={cn(
                    'relative rounded-3xl p-6 border transition-all hover:-translate-y-1 overflow-hidden',
                    b.unlocked
                      ? 'bg-white border-ink-200 hover:shadow-xl'
                      : 'bg-ink-50/50 border-ink-100',
                  )}
                >
                  <div className={cn('absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl bg-gradient-to-br', RARITY_BG[b.rarity], !b.unlocked && 'opacity-30')} />
                  <div className="relative text-center">
                    <div className="relative inline-block mb-3">
                      <div
                        className={cn('w-20 h-20 rounded-3xl grid place-items-center transition-transform', b.unlocked && 'hover:rotate-12')}
                        style={{ background: b.unlocked ? b.color : '#D2CCBA' }}
                      >
                        {b.unlocked ? <Icon className="w-10 h-10 text-white" /> : <Lock className="w-9 h-9 text-white" />}
                      </div>
                      {b.unlocked && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-jade grid place-items-center">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-sm mb-1">{b.name}</h3>
                    <p className="text-xs text-ink-500 leading-relaxed mb-3 min-h-[32px]">{b.description}</p>
                    <Badge className={cn('uppercase text-[10px] mb-3', RARITY_COLORS[b.rarity])}>
                      {b.rarity}
                    </Badge>
                    {!b.unlocked && (
                      <div>
                        <Progress value={b.progress} variant="amber" />
                        <div className="text-[10px] text-ink-400 mt-1 tnum">{b.progress}%</div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {tab === 'leaderboard' && (
          <div className="space-y-4">
            <Card className="p-6 bg-[linear-gradient(135deg,#FF6B9D,#F59E0B)] text-white relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/20 blur-3xl" />
              <div className="relative flex items-end justify-between flex-wrap gap-4">
                <div>
                  <h2 className="display text-3xl font-black mb-1">本周排行榜</h2>
                  <p className="text-white/80 text-sm">前 8 名学习者</p>
                </div>
                <div className="flex gap-2">
                  {['本周', '本月', '总榜'].map((p, i) => (
                    <button key={p} className={cn('px-3 py-1.5 rounded-full text-xs font-medium', i === 0 ? 'bg-white text-ink-900' : 'bg-white/20 text-white')}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="p-2">
              {LEADERBOARD.map((lb) => {
                const medals = ['🥇', '🥈', '🥉']
                return (
                  <div
                    key={lb.userId}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-2xl transition-colors',
                      lb.rank === 1 && 'bg-gradient-to-r from-amber/10 to-sakura/5',
                    )}
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-full grid place-items-center text-lg flex-shrink-0',
                      lb.rank <= 3 ? 'text-2xl' : 'bg-ink-100 text-xs font-bold text-ink-500',
                    )}>
                      {lb.rank <= 3 ? medals[lb.rank - 1] : lb.rank}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[linear-gradient(135deg,#FF6B9D,#F59E0B)] text-white grid place-items-center text-xs font-bold">
                      {lb.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate">{lb.name}</div>
                      <div className="text-xs text-ink-400 flex items-center gap-2">
                        <span>{lb.language === 'en' ? '英语' : lb.language === 'ja' ? '日语' : '韩语'}</span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5">
                          <Flame className="w-3 h-3 text-cinnabar" /> {lb.streak}天
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="display text-xl font-black tnum">{formatNumber(lb.points)}</div>
                      <div className="text-[10px] text-ink-400 uppercase">pts</div>
                    </div>
                  </div>
                )
              })}
            </Card>
          </div>
        )}

        {tab === 'shop' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="display text-2xl font-black">积分商城</h2>
              <Badge variant="default" className="bg-amber/10 text-amber">
                <Sparkles className="w-3 h-3" /> 余额 1,280 pts
              </Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { name: '主题皮肤 · 樱花', price: 500, color: '#FF6B9D' },
                { name: '主题皮肤 · 翡翠', price: 500, color: '#10B981' },
                { name: '主题皮肤 · 琥珀', price: 500, color: '#F59E0B' },
                { name: '会员周卡', price: 300, color: '#3B82F6' },
                { name: '会员月卡', price: 1000, color: '#8B5CF6' },
                { name: '实体证书', price: 2000, color: '#0B0B0F' },
                { name: '学习礼包', price: 800, color: '#EF4444' },
                { name: '联名周边', price: 1500, color: '#06B6D4' },
              ].map((item, i) => (
                <Card key={i} className="p-5 hover:shadow-lg">
                  <div className="aspect-square rounded-2xl mb-3 grid place-items-center" style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}88)` }}>
                    <Sparkles className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-sm font-bold mb-2">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="display text-lg font-black tnum text-amber">{item.price}</span>
                    <Button size="sm" variant="primary">兑换</Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
