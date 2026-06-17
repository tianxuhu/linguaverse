import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Heart, MessageCircle, Share2, Send, Sparkles, Users, Plus, Check, TrendingUp, Hash, Search } from 'lucide-react'
import { POSTS, GROUPS } from '@/data/mock'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useCommunityStore } from '@/stores/communityStore'
import { useAuthStore } from '@/stores/authStore'
import { relativeTime, cn } from '@/utils'

const TABS = [
  { code: 'all', name: '全部', icon: Sparkles },
  { code: 'en', name: '英语', icon: Hash },
  { code: 'ja', name: '日语', icon: Hash },
  { code: 'ko', name: '韩语', icon: Hash },
  { code: 'trending', name: '热门', icon: TrendingUp },
]

const HOT_TAGS = ['#日语打卡', '#语法笔记', '#口语练习', '#考试经验', '#语伴交换', '#学习技巧', '#K-Pop', '#TED推荐']

export default function Community() {
  const { posts, toggleLike, joinedGroups, toggleJoinGroup, addPost, newPostContent, setNewPostContent } = useCommunityStore()
  const { user, isAuthenticated } = useAuthStore()
  const [tab, setTab] = useState('all')
  const [showComposer, setShowComposer] = useState(false)

  const filteredPosts = tab === 'all' ? posts
    : tab === 'trending' ? [...posts].sort((a, b) => b.likes - a.likes)
    : posts.filter((p) => p.language === tab)

  const handlePost = () => {
    if (!newPostContent.trim() || !user) return
    addPost(
      newPostContent,
      user.targetLanguage,
      '学员分享',
      user.name,
      user.avatar,
      user.id,
    )
    setShowComposer(false)
  }

  return (
    <div className="min-h-screen">
      <div className="bg-ink-900 text-ink-50 py-16 noise-bg relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-sakura/20 blur-[120px]" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-electric/20 blur-[120px]" />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10">
          <Badge variant="outline" className="border-ink-600 text-ink-300 mb-4">
            <Users className="w-3 h-3" /> Community
          </Badge>
          <h1 className="display text-5xl lg:text-7xl font-black leading-[0.9] mb-3">
            学习者<span className="text-gradient-neon">社区</span>
          </h1>
          <p className="text-ink-300 text-lg max-w-xl">
            2.24 万学习者在此分享、提问、互相激励。找到你的学习伙伴。
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            <Card className="p-4">
              {!showComposer ? (
                <button
                  onClick={() => isAuthenticated ? setShowComposer(true) : null}
                  className="w-full flex items-center gap-3 px-2 py-2 text-sm text-ink-400 hover:text-ink-700"
                >
                  <div className="w-9 h-9 rounded-full bg-[linear-gradient(135deg,#FF6B9D,#F59E0B)] text-white grid place-items-center text-xs font-bold">
                    {user?.avatar || '?'}
                  </div>
                  <span>{isAuthenticated ? '分享你的学习心得...' : '登录后参与讨论'}</span>
                </button>
              ) : (
                <div>
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="分享你的学习心得、提问或鼓励..."
                    className="w-full h-24 p-3 rounded-2xl bg-ink-50 border border-ink-200 focus:border-sakura focus:outline-none text-sm resize-none"
                  />
                  <div className="flex justify-end gap-2 mt-3">
                    <Button size="sm" variant="ghost" onClick={() => { setShowComposer(false); setNewPostContent('') }}>取消</Button>
                    <Button size="sm" variant="primary" onClick={handlePost}>
                      <Send className="w-3.5 h-3.5 mr-1" /> 发布
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            <div className="flex items-center gap-1 overflow-x-auto pb-2 -mx-2 px-2">
              {TABS.map((t) => (
                <button
                  key={t.code}
                  onClick={() => setTab(t.code)}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0',
                    tab === t.code ? 'bg-ink-900 text-ink-50' : 'bg-white border border-ink-200 hover:border-ink-900',
                  )}
                >
                  <t.icon className="w-3.5 h-3.5" />
                  {t.name}
                </button>
              ))}
            </div>

            {filteredPosts.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-ink-500">暂无动态，换个筛选条件看看吧</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((p) => (
                  <Card key={p.id} className="p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-11 h-11 rounded-full bg-[linear-gradient(135deg,#FF6B9D,#F59E0B)] text-white grid place-items-center font-bold text-sm flex-shrink-0">
                        {p.userAvatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{p.userName}</span>
                          <Badge variant="default" className="bg-sakura/10 text-sakura text-[10px]">
                            #{p.tag}
                          </Badge>
                        </div>
                        <div className="text-xs text-ink-400">{relativeTime(p.createdAt)}</div>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-ink-800 mb-4">{p.content}</p>
                    <div className="flex items-center gap-5 pt-3 border-t border-ink-100">
                      <button
                        onClick={() => toggleLike(p.id)}
                        className={cn('flex items-center gap-1.5 text-xs transition-colors', p.liked ? 'text-sakura' : 'text-ink-500 hover:text-sakura')}
                      >
                        <Heart className={cn('w-4 h-4', p.liked && 'fill-sakura')} />
                        <span className="tnum">{p.likes}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-xs text-ink-500 hover:text-electric">
                        <MessageCircle className="w-4 h-4" />
                        <span className="tnum">{p.comments}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-xs text-ink-500 hover:text-ink-900">
                        <Share2 className="w-4 h-4" />
                        分享
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <aside className="lg:col-span-4 space-y-4">
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Hash className="w-4 h-4 text-sakura" />
                <h3 className="text-sm font-bold">热门话题</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {HOT_TAGS.map((t) => (
                  <button key={t} className="text-xs px-2.5 py-1 rounded-full bg-ink-50 hover:bg-ink-100 transition-colors">
                    {t}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Users className="w-4 h-4 text-electric" /> 学习小组
                </h3>
                <Link to="#" className="text-xs text-ink-400 hover:text-ink-900">查看全部</Link>
              </div>
              <div className="space-y-3">
                {GROUPS.slice(0, 4).map((g) => {
                  const joined = joinedGroups.includes(g.id)
                  return (
                    <div key={g.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl flex-shrink-0" style={{ background: g.cover }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate">{g.name}</div>
                        <div className="text-[10px] text-ink-400 tnum">{g.members.toLocaleString()} 成员</div>
                      </div>
                      <button
                        onClick={() => toggleJoinGroup(g.id)}
                        className={cn(
                          'px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors',
                          joined ? 'bg-jade/10 text-jade' : 'bg-ink-100 text-ink-700 hover:bg-ink-900 hover:text-ink-50',
                        )}
                      >
                        {joined ? <><Check className="w-3 h-3 inline" /> 已加入</> : <><Plus className="w-3 h-3 inline" /> 加入</>}
                      </button>
                    </div>
                  )
                })}
              </div>
            </Card>

            <Card className="p-5 bg-[linear-gradient(135deg,#FF6B9D,#F59E0B)] text-white relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/20 blur-2xl" />
              <Sparkles className="w-7 h-7 mb-3" />
              <h3 className="display text-xl font-black mb-2">分享有礼</h3>
              <p className="text-sm text-white/90 mb-4">发布学习笔记，每周精选可获 100 积分奖励</p>
              <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-ink-900">
                了解详情
              </Button>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
