import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Volume2, ChevronLeft, ChevronRight, Check, X, Sparkles, RotateCcw, Heart, Bookmark, Trophy } from 'lucide-react'
import { VOCAB } from '@/data/mock'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { useLearnStore } from '@/stores/learnStore'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/utils'

const TEST_LANGS = ['en-a1-l1', 'en-a1-l6', 'ja-n5-l1', 'ko-1-l1']

export default function Vocab() {
  const { completeVocab, toggleFavorite, favoriteWords, addToErrorBook } = useLearnStore()
  const { updateUser } = useAuthStore()
  const [lesson, setLesson] = useState(TEST_LANGS[0])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [phase, setPhase] = useState<'flash' | 'quiz' | 'done'>('flash')
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizInput, setQuizInput] = useState('')
  const [correctCount, setCorrectCount] = useState(0)
  const [errorIds, setErrorIds] = useState<string[]>([])

  const words = VOCAB.filter((v) => v.lessonId === lesson)
  const current = words[index]
  const quizWord = words[quizIndex]

  useEffect(() => {
    setIndex(0)
    setFlipped(false)
    setPhase('flash')
    setQuizIndex(0)
    setQuizInput('')
    setCorrectCount(0)
    setErrorIds([])
  }, [lesson])

  const handleNext = () => {
    if (index < words.length - 1) {
      setIndex(index + 1)
      setFlipped(false)
    } else {
      completeVocab(words.length)
      if (errorIds.length === 0) {
        updateUser({ abilities: undefined as any })
        useLearnStore.getState().awardBadge('b1')
      }
      setPhase('done')
    }
  }

  const handleQuizSubmit = () => {
    if (!quizWord) return
    const userAnswer = quizInput.trim().toLowerCase()
    const isCorrect = quizWord.word.toLowerCase() === userAnswer || quizWord.word.toLowerCase().startsWith(userAnswer) && userAnswer.length > 2
    if (isCorrect) {
      setCorrectCount(correctCount + 1)
    } else {
      setErrorIds([...errorIds, quizWord.id])
      addToErrorBook(quizWord.id)
    }
    if (quizIndex < words.length - 1) {
      setQuizIndex(quizIndex + 1)
      setQuizInput('')
    } else {
      completeVocab(words.length)
      if (correctCount + (isCorrect ? 1 : 0) >= words.length * 0.8) {
        useLearnStore.getState().awardBadge('b2')
      }
      setPhase('done')
    }
  }

  const isFav = current ? favoriteWords.includes(current.word) : false

  if (words.length === 0) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <Card className="p-12 text-center max-w-md">
          <h2 className="display text-2xl font-black mb-3">暂无单词数据</h2>
          <Link to="/learn">
            <Button variant="primary">返回学习中心</Button>
          </Link>
        </Card>
      </div>
    )
  }

  if (phase === 'done') {
    const accuracy = Math.round((correctCount / Math.max(1, words.length)) * 100)
    return (
      <div className="min-h-screen grid place-items-center p-6 bg-ink-50">
        <Card className="p-12 max-w-md w-full text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-jade/20 blur-3xl" />
          <div className="relative">
            <div className="w-20 h-20 mx-auto rounded-full bg-[linear-gradient(135deg,#FF6B9D,#F59E0B)] grid place-items-center mb-6 pulse-glow">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="display text-4xl font-black mb-3">训练完成！</h2>
            <p className="text-ink-500 mb-8">单词记忆模块 · 奖励积分已发放</p>
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div>
                <div className="display text-3xl font-black tnum">{words.length}</div>
                <div className="text-xs text-ink-400">单词</div>
              </div>
              <div>
                <div className="display text-3xl font-black tnum text-jade">{accuracy}%</div>
                <div className="text-xs text-ink-400">准确率</div>
              </div>
              <div>
                <div className="display text-3xl font-black tnum text-amber">+{words.length * 2}</div>
                <div className="text-xs text-ink-400">积分</div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setPhase('flash'); setIndex(0); setFlipped(false); setCorrectCount(0); setErrorIds([]) }} className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" /> 再练一次
              </Button>
              <Link to="/learn" className="flex-1">
                <Button variant="primary" className="w-full">完成</Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#0B0B0F_0%,#1A1816_100%)] text-ink-50">
      <div className="max-w-[960px] mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <Link to="/learn" className="flex items-center gap-2 text-ink-300 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> 返回
          </Link>
          <div className="flex items-center gap-3">
            <select
              value={lesson}
              onChange={(e) => setLesson(e.target.value)}
              className="bg-ink-700 border border-ink-600 text-sm rounded-full px-3 py-1.5"
            >
              <option value="en-a1-l1">英语 · 问候</option>
              <option value="en-a1-l6">英语 · 基础动词</option>
              <option value="ja-n5-l1">日语 · 五十音</option>
              <option value="ko-1-l1">韩语 · 字母</option>
            </select>
            <Badge variant="default" className="bg-sakura/20 text-sakura">
              <Sparkles className="w-3 h-3" /> +{words.length * 2} pts
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="display text-4xl font-black">单词记忆</h1>
            <p className="text-ink-300 text-sm mt-1">闪卡复习 · 翻转查看释义 · 拼写测试</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPhase('flash')}
              className={cn('px-4 py-2 rounded-full text-sm font-medium', phase === 'flash' ? 'bg-white text-ink-900' : 'text-ink-300')}
            >
              闪卡
            </button>
            <button
              onClick={() => setPhase('quiz')}
              className={cn('px-4 py-2 rounded-full text-sm font-medium', phase === 'quiz' ? 'bg-white text-ink-900' : 'text-ink-300')}
            >
              拼写测试
            </button>
          </div>
        </div>

        <Progress
          value={phase === 'flash' ? index + 1 : quizIndex + 1}
          max={words.length}
          variant="sakura"
          className="mb-8"
        />

        {phase === 'flash' && current && (
          <div className="space-y-6">
            <div
              className={cn('flip-card h-[400px] cursor-pointer', flipped && 'flipped')}
              onClick={() => setFlipped(!flipped)}
            >
              <div className="flip-inner relative w-full h-full">
                <div className="flip-face bg-gradient-to-br from-sakura/30 to-amber/20 rounded-[32px] p-10 flex flex-col items-center justify-center text-center border border-ink-700 noise-bg">
                  <div className="text-xs text-ink-300 uppercase tracking-widest mb-6">
                    {index + 1} / {words.length} · 点击翻转
                  </div>
                  <div className="display text-7xl font-black mb-4">{current.word}</div>
                  <div className="text-ink-300 text-lg mb-2 font-mono">{current.pronunciation}</div>
                  <div className="text-xs text-ink-400 mt-2">{current.partOfSpeech}</div>
                  <Volume2 className="w-8 h-8 text-white/60 mt-8" />
                </div>
                <div className="flip-face flip-back bg-gradient-to-br from-electric/30 to-jade/20 rounded-[32px] p-10 flex flex-col items-center justify-center text-center border border-ink-700 noise-bg">
                  <div className="text-xs text-ink-300 uppercase tracking-widest mb-6">Translation</div>
                  <div className="display text-5xl font-black mb-6">{current.translation}</div>
                  <div className="bg-ink-900/50 rounded-2xl p-5 max-w-lg">
                    <div className="text-sm text-ink-200 italic mb-1">"{current.example}"</div>
                    <div className="text-xs text-ink-400">{current.exampleTranslation}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => { setIndex(Math.max(0, index - 1)); setFlipped(false) }}
                disabled={index === 0}
                className="text-ink-300"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> 上一张
              </Button>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(current.word) }}
                  className="w-11 h-11 grid place-items-center rounded-full bg-ink-700/60 hover:bg-ink-700"
                >
                  <Heart className={cn('w-5 h-5', isFav ? 'fill-sakura text-sakura' : 'text-ink-300')} />
                </button>
                <button className="w-11 h-11 grid place-items-center rounded-full bg-ink-700/60 hover:bg-ink-700">
                  <Bookmark className="w-5 h-5 text-ink-300" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setFlipped(!flipped) }}
                  className="w-11 h-11 grid place-items-center rounded-full bg-ink-700/60 hover:bg-ink-700"
                >
                  <Volume2 className="w-5 h-5 text-ink-300" />
                </button>
              </div>
              <Button variant="gradient" onClick={handleNext}>
                {index === words.length - 1 ? '完成训练' : '下一张'} <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {phase === 'quiz' && quizWord && (
          <div className="space-y-6">
            <Card className="p-10 bg-ink-700/40 border-ink-700 text-center">
              <div className="text-xs text-ink-300 uppercase tracking-widest mb-4">
                {quizIndex + 1} / {words.length}
              </div>
              <div className="display text-5xl font-black mb-4">{quizWord.translation}</div>
              <div className="text-ink-300 text-sm mb-8 font-mono">{quizWord.pronunciation}</div>
              <input
                value={quizInput}
                onChange={(e) => setQuizInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuizSubmit()}
                placeholder="输入对应单词..."
                className="w-full max-w-md h-14 px-6 rounded-full bg-ink-900 border-2 border-ink-600 focus:border-sakura text-center text-xl font-bold focus:outline-none"
                autoFocus
              />
              <div className="mt-6 flex justify-center gap-3">
                <Button variant="outline" onClick={handleQuizSubmit} className="border-ink-50 text-ink-50">
                  跳过
                </Button>
                <Button variant="gradient" onClick={handleQuizSubmit}>
                  提交 <Check className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </Card>
            <div className="text-center text-xs text-ink-400">
              答错将自动加入错题本，方便后续复习
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
