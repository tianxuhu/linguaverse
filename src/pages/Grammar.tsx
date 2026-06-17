import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, X, Lightbulb, RotateCcw, Sparkles, Trophy, ArrowRight } from 'lucide-react'
import { GRAMMAR } from '@/data/mock'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { useLearnStore } from '@/stores/learnStore'
import { cn } from '@/utils'

export default function Grammar() {
  const { completeGrammar, addToErrorBook } = useLearnStore()
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [done, setDone] = useState(false)

  const current = GRAMMAR[index]
  const isCorrect = selected === current?.exercise.answer

  const handleSelect = (i: number) => {
    if (showResult) return
    setSelected(i)
    setShowResult(true)
    if (i === current.exercise.answer) {
      setCorrectCount(correctCount + 1)
    } else {
      addToErrorBook(current.id)
    }
  }

  const handleNext = () => {
    if (index < GRAMMAR.length - 1) {
      setIndex(index + 1)
      setSelected(null)
      setShowResult(false)
    } else {
      completeGrammar(GRAMMAR.length)
      if (correctCount === GRAMMAR.length) {
        useLearnStore.getState().awardBadge('b5')
      }
      setDone(true)
    }
  }

  if (done) {
    const accuracy = Math.round((correctCount / GRAMMAR.length) * 100)
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <Card className="p-12 max-w-md w-full text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-electric/20 blur-3xl" />
          <div className="relative">
            <div className="w-20 h-20 mx-auto rounded-full bg-[linear-gradient(135deg,#3B82F6,#10B981)] grid place-items-center mb-6 pulse-glow">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="display text-4xl font-black mb-3">语法训练完成！</h2>
            <p className="text-ink-500 mb-8">完成 {GRAMMAR.length} 道语法题</p>
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div>
                <div className="display text-3xl font-black tnum">{GRAMMAR.length}</div>
                <div className="text-xs text-ink-400">题目</div>
              </div>
              <div>
                <div className="display text-3xl font-black tnum text-jade">{accuracy}%</div>
                <div className="text-xs text-ink-400">正确率</div>
              </div>
              <div>
                <div className="display text-3xl font-black tnum text-amber">+{GRAMMAR.length * 3}</div>
                <div className="text-xs text-ink-400">积分</div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setIndex(0); setSelected(null); setShowResult(false); setCorrectCount(0); setDone(false) }} className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" /> 再练
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
    <div className="min-h-screen bg-ink-50">
      <div className="max-w-[960px] mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <Link to="/learn" className="flex items-center gap-2 text-ink-700 hover:text-ink-900">
            <ArrowLeft className="w-4 h-4" /> 返回
          </Link>
          <Badge variant="default" className="bg-electric/10 text-electric">
            <Sparkles className="w-3 h-3" /> +{GRAMMAR.length * 3} pts
          </Badge>
        </div>

        <h1 className="display text-4xl font-black mb-2">语法练习</h1>
        <p className="text-ink-500 text-sm mb-6">单选练习 · AI 错题解析 · 实时反馈</p>

        <Progress value={index + 1} max={GRAMMAR.length} variant="electric" className="mb-8" />

        <Card className="p-8 mb-6">
          <Badge variant="default" className="mb-3 bg-ink-100">{current.rule}</Badge>
          <p className="text-ink-700 leading-relaxed mb-6">{current.explanation}</p>

          <div className="bg-ink-100/50 rounded-2xl p-5 mb-6">
            <div className="text-xs text-ink-400 uppercase tracking-widest mb-3">Examples</div>
            <div className="space-y-2">
              {current.examples.map((ex, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="text-ink-400 w-4 tnum">{i + 1}.</span>
                  <div>
                    <div className="text-ink-900 font-medium">{ex.sentence}</div>
                    <div className="text-ink-500 text-xs">{ex.translation}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-ink-400 uppercase tracking-widest mb-3">Exercise</div>
          <div className="text-xl font-bold mb-6">{current.exercise.question}</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {current.exercise.options.map((opt, i) => {
              let variant = 'border-ink-200 hover:border-ink-900'
              if (showResult) {
                if (i === current.exercise.answer) variant = 'border-jade bg-jade/10'
                else if (i === selected) variant = 'border-cinnabar bg-cinnabar/10'
                else variant = 'border-ink-100 opacity-50'
              } else if (selected === i) {
                variant = 'border-ink-900 bg-ink-50'
              }
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={showResult}
                  className={cn(
                    'p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between font-medium',
                    variant,
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-ink-100 grid place-items-center text-xs font-bold tnum">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </span>
                  {showResult && i === current.exercise.answer && <Check className="w-5 h-5 text-jade" />}
                  {showResult && i === selected && i !== current.exercise.answer && <X className="w-5 h-5 text-cinnabar" />}
                </button>
              )
            })}
          </div>

          {showResult && (
            <div className={cn('mt-6 p-4 rounded-2xl flex gap-3', isCorrect ? 'bg-jade/10' : 'bg-cinnabar/10')}>
              <Lightbulb className={cn('w-5 h-5 flex-shrink-0', isCorrect ? 'text-jade' : 'text-cinnabar')} />
              <div>
                <div className={cn('text-sm font-bold mb-1', isCorrect ? 'text-jade' : 'text-cinnabar')}>
                  {isCorrect ? '✓ 回答正确！' : '✗ 答案不正确'}
                </div>
                <div className="text-sm text-ink-600">{current.exercise.hint}</div>
              </div>
            </div>
          )}
        </Card>

        <div className="flex justify-between">
          <div className="text-sm text-ink-500 tnum">
            已答对 <span className="display text-lg font-black text-jade">{correctCount}</span> / {GRAMMAR.length}
          </div>
          <Button variant="gradient" onClick={handleNext} disabled={!showResult}>
            {index === GRAMMAR.length - 1 ? '完成' : '下一题'} <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
