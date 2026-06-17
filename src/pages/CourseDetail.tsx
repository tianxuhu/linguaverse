import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { Star, Users, Clock, Award, Play, CheckCircle2, ChevronDown, BookOpen, MessageCircle, Headphones, Mic, ChevronRight, Heart, Share2 } from 'lucide-react'
import { COURSES } from '@/data/mock'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import { useLearnStore } from '@/stores/learnStore'
import { useAuthStore } from '@/stores/authStore'
import { formatNumber, cn } from '@/utils'
import type { Lesson } from '@/types'

const ICONS = {
  vocab: BookOpen,
  grammar: MessageCircle,
  speaking: Mic,
  listening: Headphones,
}

const COLORS = {
  vocab: '#FF6B9D',
  grammar: '#3B82F6',
  speaking: '#F59E0B',
  listening: '#10B981',
}

const LANG_NAMES = { en: '英语', ja: '日语', ko: '韩语' }

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const course = COURSES.find((c) => c.id === id)
  const { isAuthenticated } = useAuthStore()
  const { enroll, enrollments, lessonProgress, setLessonProgress } = useLearnStore()
  const [expanded, setExpanded] = useState<string | null>(course?.lessons[0]?.id ?? null)

  if (!course) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-center">
          <h2 className="display text-3xl font-black mb-4">课程不存在</h2>
          <Link to="/courses">
            <Button variant="primary">返回课程中心</Button>
          </Link>
        </div>
      </div>
    )
  }

  const enrolled = enrollments.includes(course.id)
  const totalProgress = Math.round(
    (course.lessons.reduce((acc, l) => acc + (lessonProgress[l.id] || 0), 0) / (course.lessons.length * 100)) * 100,
  )

  const handleEnroll = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/courses/' + course.id)
      return
    }
    enroll(course.id)
  }

  const handleStartLesson = (lesson: Lesson) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setLessonProgress(lesson.id, Math.max(lessonProgress[lesson.id] || 0, 10))
    const route = lesson.type === 'vocab' ? '/learn/vocab'
      : lesson.type === 'grammar' ? '/learn/grammar'
      : lesson.type === 'speaking' ? '/learn/speaking'
      : '/learn/listening'
    navigate(route)
  }

  return (
    <div className="min-h-screen">
      <div className="relative" style={{ background: course.cover }}>
        <div className="absolute inset-0 noise-bg" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-20 relative z-10 text-white">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/70 mb-4">
            <Link to="/courses" className="hover:text-white">课程</Link>
            <ChevronRight className="w-3 h-3" />
            <span>{LANG_NAMES[course.language]}</span>
            <ChevronRight className="w-3 h-3" />
            <span>{course.level}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <Badge variant="default" className="bg-white/20 backdrop-blur text-white border-0 mb-4">
                {LANG_NAMES[course.language]} · {course.level} · {course.category}
              </Badge>
              <h1 className="display text-5xl lg:text-7xl font-black leading-[0.95] mb-3">
                {course.title}
              </h1>
              <div className="text-2xl text-white/80 mb-4">{course.subtitle}</div>
              <p className="text-white/80 text-lg max-w-2xl leading-relaxed mb-6">
                {course.description}
              </p>
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber fill-amber" />
                  <span className="display text-xl font-black tnum">{course.rating}</span>
                  <span className="text-white/60">评分</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span className="display text-xl font-black tnum">{formatNumber(course.learnerCount)}</span>
                  <span className="text-white/60">学习者</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span className="display text-xl font-black tnum">{course.duration}</span>
                  <span className="text-white/60">小时</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  <span className="display text-xl font-black tnum">{course.lessons.length}</span>
                  <span className="text-white/60">章节</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4">
              <Card className="p-6 bg-white/95 backdrop-blur">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-ink-100">
                  <div className="w-12 h-12 rounded-2xl bg-[linear-gradient(135deg,#FF6B9D,#F59E0B)] text-white grid place-items-center font-bold">
                    {course.instructor.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-ink-900">{course.instructor.name}</div>
                    <div className="text-xs text-ink-500">{course.instructor.title}</div>
                  </div>
                </div>
                {enrolled ? (
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-ink-500">课程进度</span>
                      <span className="display text-lg font-black tnum">{totalProgress}%</span>
                    </div>
                    <Progress value={totalProgress} variant="jade" />
                    <Link to="/learn">
                      <Button variant="primary" className="w-full" hard>
                        继续学习 <Play className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Button variant="primary" className="w-full" hard onClick={handleEnroll}>
                    立即加入 · 免费
                  </Button>
                )}
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <Button variant="outline" size="sm" className="w-full">
                    <Heart className="w-4 h-4 mr-1" /> 收藏
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Share2 className="w-4 h-4 mr-1" /> 分享
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <Card className="p-6">
              <h2 className="display text-2xl font-black mb-4">课程介绍</h2>
              <p className="text-ink-700 leading-relaxed">
                本课程以 <span className="font-bold">{LANG_NAMES[course.language]}{course.level}</span> 级别为基准，针对
                {course.category === 'business' ? '商务沟通' :
                 course.category === 'exam' ? '考试备考' :
                 course.category === 'travel' ? '旅行场景' :
                 course.category === 'culture' ? '文化主题' : '日常应用'}
                设计真实语境任务。共 <span className="display font-black tnum">{course.lessons.length}</span> 个章节、
                <span className="display font-black tnum">{course.duration}</span> 小时学习时长，
                配套 4 大训练模块全方位覆盖输入输出能力。
              </p>
            </Card>

            <Card>
              <div className="p-6 pb-2 flex items-center justify-between">
                <h2 className="display text-2xl font-black">课程大纲</h2>
                <span className="text-xs text-ink-400 tnum">{course.lessons.length} 章节</span>
              </div>
              <div className="divide-y divide-ink-100">
                {course.lessons.map((l, i) => {
                  const Icon = ICONS[l.type]
                  const isOpen = expanded === l.id
                  const progress = lessonProgress[l.id] || 0
                  return (
                    <div key={l.id} className="px-6">
                      <button
                        onClick={() => setExpanded(isOpen ? null : l.id)}
                        className="w-full py-4 flex items-center gap-4 text-left hover:bg-ink-50/50 transition-colors"
                      >
                        <div className="display text-lg font-black text-ink-300 tnum w-8">
                          {String(i + 1).padStart(2, '0')}
                        </div>
                        <div
                          className="w-9 h-9 rounded-xl grid place-items-center flex-shrink-0"
                          style={{ background: COLORS[l.type] + '20', color: COLORS[l.type] }}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm">{l.title}</div>
                          <div className="text-xs text-ink-400 tnum">{l.duration} 分钟</div>
                        </div>
                        {progress > 0 && (
                          <div className="hidden md:block w-24">
                            <Progress value={progress} variant="jade" />
                          </div>
                        )}
                        {progress === 100 ? (
                          <CheckCircle2 className="w-5 h-5 text-jade" />
                        ) : (
                          <ChevronDown className={cn('w-4 h-4 text-ink-400 transition-transform', isOpen && 'rotate-180')} />
                        )}
                      </button>
                      {isOpen && (
                        <div className="pb-4 pl-16 space-y-3">
                          {l.preview && (
                            <p className="text-sm text-ink-600 leading-relaxed">
                              <span className="text-xs text-ink-400 uppercase tracking-widest mr-2">preview</span>
                              {l.preview}...
                            </p>
                          )}
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="primary" onClick={() => handleStartLesson(l)}>
                              <Play className="w-3.5 h-3.5 mr-1" /> {progress > 0 ? '继续学习' : '开始学习'}
                            </Button>
                            {progress > 0 && progress < 100 && (
                              <span className="text-xs text-ink-500 tnum">已完成 {progress}%</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="display text-2xl font-black mb-6">学员评价</h2>
              <div className="space-y-5">
                {[
                  { name: '林同学', avatar: '林', rate: 5, text: '讲解非常清晰，每个例句都贴近生活场景，学完立刻能开口用。' },
                  { name: 'Alex', avatar: 'A', rate: 5, text: 'Instructor is engaging and the structure makes the language really stick.' },
                  { name: '小美', avatar: '美', rate: 4, text: '课程编排合理，文化部分尤其喜欢。期待更多深度内容。' },
                ].map((r, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-ink-100 grid place-items-center text-xs font-bold flex-shrink-0">
                      {r.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold">{r.name}</span>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star key={j} className={cn('w-3 h-3', j < r.rate ? 'text-amber fill-amber' : 'text-ink-200')} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-ink-600 leading-relaxed">{r.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <aside className="lg:col-span-4 space-y-4">
            <Card className="p-6">
              <h3 className="text-xs uppercase tracking-widest text-ink-400 font-semibold mb-4">课程亮点</h3>
              <div className="space-y-3">
                {[
                  { i: BookOpen, l: '系统化分级路径' },
                  { i: MessageCircle, l: '真实语境对话' },
                  { i: Mic, l: 'AI 口语评分' },
                  { i: Headphones, l: '多档语速训练' },
                ].map((x, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-xl bg-ink-100 grid place-items-center">
                      <x.i className="w-4 h-4" />
                    </div>
                    {x.l}
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-6 bg-ink-900 text-ink-50 noise-bg relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-sakura/30 blur-2xl" />
              <Award className="w-7 h-7 text-sakura mb-3" />
              <h3 className="display text-xl font-black mb-2">完成课程获得</h3>
              <p className="text-sm text-ink-300 mb-4">电子证书 + 500 积分 + 「{course.level} 大师」徽章</p>
              <div className="flex items-baseline gap-1">
                <span className="display text-4xl font-black">+500</span>
                <span className="text-xs text-ink-400">pts</span>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
