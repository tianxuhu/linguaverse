import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Sparkles, BookOpen, BookText, Mic, Headphones, ArrowRight, Brain, Target, TrendingUp, RefreshCw } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/stores/authStore'
import { useLearnStore } from '@/stores/learnStore'
import { COURSES } from '@/data/mock'

const LANG_NAMES = { en: '英语', ja: '日语', ko: '韩语' }

function buildRecommendation(targetLang: string) {
  const lang = (targetLang as 'en' | 'ja' | 'ko') || 'en'
  const course = COURSES.find((c) => c.language === lang) || COURSES[0]
  return [
    { module: 'vocab', title: '单词记忆', icon: BookOpen, color: '#FF6B9D', minutes: 10, desc: '掌握 8 个核心词汇', to: '/learn/vocab', completed: false },
    { module: 'grammar', title: '语法练习', icon: BookText, color: '#3B82F6', minutes: 8, desc: '完成 1 组语法题', to: '/learn/grammar', completed: false },
    { module: 'speaking', title: '口语跟读', icon: Mic, color: '#F59E0B', minutes: 7, desc: '跟读 5 句对话', to: '/learn/speaking', completed: false },
    { module: 'listening', title: '听力训练', icon: Headphones, color: '#10B981', minutes: 5, desc: '完成 1 段听写', to: '/learn/listening', completed: false },
  ]
}

export default function Recommend() {
  const { user, setTargetLanguage } = useAuthStore()
  const { todayLearned } = useLearnStore()
  const targetLang = user?.targetLanguage || 'en'
  const plan = buildRecommendation(targetLang)

  const weak = (Object.entries(todayLearned) as [string, number][]).sort((a, b) => a[1] - b[1])[0]?.[0] || 'vocab'

  return (
    <div className="min-h-screen">
      <div className="bg-[linear-gradient(135deg,#FF6B9D_0%,#F59E0B_100%)] text-white py-20 noise-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10">
          <Badge variant="default" className="bg-white/20 backdrop-blur border-0 text-white mb-4">
            <Sparkles className="w-3 h-3" /> AI 智能推荐
          </Badge>
          <h1 className="display text-5xl lg:text-7xl font-black leading-[0.9] mb-4">
            你的今日<br />学习路径
          </h1>
          <p className="text-white/90 text-lg max-w-xl">
            基于你的目标语种、当前等级与最近表现，为你定制 30 分钟高效学习计划。
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
          <Card className="p-6 lg:col-span-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-sakura" />
              <span className="text-xs text-ink-500 uppercase tracking-widest">当前目标</span>
            </div>
            <div className="display text-3xl font-black mb-4">{LANG_NAMES[targetLang as keyof typeof LANG_NAMES]}</div>
            <div className="flex flex-wrap gap-2">
              {(['en', 'ja', 'ko'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setTargetLanguage(l)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    targetLang === l ? 'bg-ink-900 text-ink-50' : 'bg-ink-100 hover:bg-ink-200'
                  }`}
                >
                  {LANG_NAMES[l]}
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-ink-100 text-xs text-ink-500">
              当前等级：<span className="display text-base font-black text-ink-900 ml-1">{user?.currentLevel || 'A1'}</span>
            </div>
          </Card>

          <Card className="p-6 lg:col-span-4">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-electric" />
              <span className="text-xs text-ink-500 uppercase tracking-widest">AI 分析</span>
            </div>
            <div className="display text-2xl font-black mb-3">薄弱维度：{weak === 'vocab' ? '单词' : weak === 'grammar' ? '语法' : weak === 'speaking' ? '口语' : '听力'}</div>
            <p className="text-sm text-ink-600 leading-relaxed">
              根据最近 7 天的练习数据，你在 <span className="font-bold">{weak === 'vocab' ? '单词' : weak}</span> 维度需要加强。今天的计划将优先训练该模块。
            </p>
          </Card>

          <Card className="p-6 lg:col-span-4 bg-ink-900 text-ink-50 noise-bg relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-sakura/30 blur-2xl" />
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-amber" />
              <span className="text-xs text-ink-300 uppercase tracking-widest">预计效果</span>
            </div>
            <div className="display text-2xl font-black mb-2">+15% 能力值</div>
            <p className="text-sm text-ink-300 leading-relaxed">完成 30 分钟今日计划，预计本周能力分可提升 15%</p>
          </Card>
        </div>

        <div className="mb-6 flex items-end justify-between flex-wrap gap-3">
          <h2 className="display text-3xl font-black">今日学习计划</h2>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" /> 重新生成
          </Button>
        </div>

        <div className="space-y-4">
          {plan.map((step, i) => (
            <div key={step.module} className="relative">
              {i < plan.length - 1 && (
                <div className="absolute left-7 top-20 bottom-0 w-0.5 bg-gradient-to-b from-ink-200 to-transparent" style={{ height: 'calc(100% - 80px)' }} />
              )}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-6">
                  <div
                    className="w-14 h-14 rounded-2xl grid place-items-center text-white flex-shrink-0"
                    style={{ background: step.color }}
                  >
                    <step.icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-ink-400 uppercase tracking-widest tnum">Step 0{i + 1}</span>
                      <Badge variant="default" className="bg-ink-100">
                        ⏱ {step.minutes} 分钟
                      </Badge>
                      {i === 0 && (
                        <Badge variant="default" className="bg-sakura/10 text-sakura">
                          优先
                        </Badge>
                      )}
                    </div>
                    <h3 className="display text-xl font-black mb-1">{step.title}</h3>
                    <p className="text-sm text-ink-500">{step.desc}</p>
                  </div>
                  <Link to={step.to}>
                    <Button variant="primary" hard>
                      开始 <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          ))}
        </div>

        <Card className="mt-10 p-8 bg-ink-50 border-dashed">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-sakura text-white grid place-items-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm mb-1">关于推荐算法</h3>
              <p className="text-xs text-ink-600 leading-relaxed">
                我们的推荐系统综合考虑你的目标语种、当前等级、最近 7 天的学习数据（练习时长、各模块完成度、错题分布）以及个人偏好，
                通过加权算法生成每日 30 分钟的高效学习清单。每完成一项任务，推荐算法都会重新校准，确保你始终在最需要的方向上提升。
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
