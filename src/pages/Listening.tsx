import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Play, Pause, Volume2, Sparkles, Trophy, RotateCcw, ChevronRight, Check, X, Headphones } from 'lucide-react'
import { DIALOGS } from '@/data/mock'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { useLearnStore } from '@/stores/learnStore'
import { cn } from '@/utils'

const QUESTIONS = [
  { q: 'What did the customer order?', options: ['Tea', 'Cappuccino', 'Latte', 'Espresso'], answer: 1, hint: 'The order is for a coffee drink.' },
  { q: 'How much does it cost?', options: ['$3.50', '$4.00', '$4.50', '$5.00'], answer: 2, hint: 'The price is between 4 and 5 dollars.' },
  { q: 'Will the customer stay or leave?', options: ['Stay', 'Take away', 'Cancel order', 'Not sure'], answer: 1, hint: 'The barista asks about it.' },
]

const DICTATION_SENTENCES = [
  { text: 'Hello, my name is Anna.', translation: '你好，我叫安娜。' },
  { text: 'I would like a coffee, please.', translation: '我想要一杯咖啡，谢谢。' },
  { text: 'Where is the train station?', translation: '火车站在哪里？' },
  { text: 'Thank you very much for your help.', translation: '非常感谢你的帮助。' },
  { text: 'See you tomorrow morning.', translation: '明天早上见。' },
]

export default function Listening() {
  const { completeListening, addToErrorBook } = useLearnStore()
  const [tab, setTab] = useState<'dictation' | 'choice'>('dictation')
  const [dIndex, setDIndex] = useState(0)
  const [dInput, setDInput] = useState('')
  const [dShowResult, setDShowResult] = useState(false)
  const [qIndex, setQIndex] = useState(0)
  const [qSelected, setQSelected] = useState<number | null>(null)
  const [qShowResult, setQShowResult] = useState(false)
  const [dCorrect, setDCorrect] = useState(0)
  const [qCorrect, setQCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<number | null>(null)

  useEffect(() => () => { if (timerRef.current) window.clearInterval(timerRef.current) }, [])

  const playAudio = (durationMs: number) => {
    setIsPlaying(true)
    setProgress(0)
    const start = Date.now()
    timerRef.current = window.setInterval(() => {
      const p = (Date.now() - start) / (durationMs / speed)
      if (p >= 1) {
        window.clearInterval(timerRef.current!)
        setIsPlaying(false)
        setProgress(1)
      } else {
        setProgress(p)
      }
    }, 50)
  }

  const handleDictationCheck = () => {
    setDShowResult(true)
    const target = DICTATION_SENTENCES[dIndex].text.toLowerCase().replace(/[^\w\s]/g, '')
    const input = dInput.toLowerCase().replace(/[^\w\s]/g, '')
    const correct = target === input
    if (correct) setDCorrect(dCorrect + 1)
    else addToErrorBook('dict_' + dIndex)
  }

  const handleDictationNext = () => {
    if (dIndex < DICTATION_SENTENCES.length - 1) {
      setDIndex(dIndex + 1)
      setDInput('')
      setDShowResult(false)
    } else {
      completeListening(DICTATION_SENTENCES.length)
      useLearnStore.getState().awardBadge('b6')
      setDone(true)
    }
  }

  const handleChoiceSelect = (i: number) => {
    if (qShowResult) return
    setQSelected(i)
    setQShowResult(true)
    if (i === QUESTIONS[qIndex].answer) setQCorrect(qCorrect + 1)
    else addToErrorBook('q_' + qIndex)
  }

  const handleChoiceNext = () => {
    if (qIndex < QUESTIONS.length - 1) {
      setQIndex(qIndex + 1)
      setQSelected(null)
      setQShowResult(false)
    } else {
      completeListening(QUESTIONS.length)
      setDone(true)
    }
  }

  if (done) {
    const totalCorrect = dCorrect + qCorrect
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <Card className="p-12 max-w-md w-full text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-jade/20 blur-3xl" />
          <div className="relative">
            <div className="w-20 h-20 mx-auto rounded-full bg-[linear-gradient(135deg,#10B981,#3B82F6)] grid place-items-center mb-6 pulse-glow">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="display text-4xl font-black mb-3">听力训练完成！</h2>
            <p className="text-ink-500 mb-8">完成 {tab === 'dictation' ? DICTATION_SENTENCES.length : QUESTIONS.length} 题</p>
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div>
                <div className="display text-3xl font-black tnum">{tab === 'dictation' ? DICTATION_SENTENCES.length : QUESTIONS.length}</div>
                <div className="text-xs text-ink-400">题目</div>
              </div>
              <div>
                <div className="display text-3xl font-black tnum text-jade">{totalCorrect}</div>
                <div className="text-xs text-ink-400">正确</div>
              </div>
              <div>
                <div className="display text-3xl font-black tnum text-amber">+{(tab === 'dictation' ? DICTATION_SENTENCES.length : QUESTIONS.length) * 3}</div>
                <div className="text-xs text-ink-400">积分</div>
              </div>
            </div>
            <Link to="/learn">
              <Button variant="primary" className="w-full">返回学习中心</Button>
            </Link>
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
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white rounded-full p-1 border border-ink-200">
              {([0.75, 1, 1.25] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                    speed === s ? 'bg-ink-900 text-ink-50' : 'text-ink-500',
                  )}
                >
                  {s}x
                </button>
              ))}
            </div>
            <Badge variant="default" className="bg-jade/10 text-jade">
              <Sparkles className="w-3 h-3" /> +{tab === 'dictation' ? DICTATION_SENTENCES.length * 3 : QUESTIONS.length * 3} pts
            </Badge>
          </div>
        </div>

        <h1 className="display text-4xl font-black mb-2">听力训练</h1>
        <p className="text-ink-500 text-sm mb-6">多档语速 · 听写填空 · 听后选择</p>

        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => { setTab('dictation'); setDIndex(0); setDInput(''); setDShowResult(false) }}
            className={cn('px-4 py-2 rounded-full text-sm font-medium', tab === 'dictation' ? 'bg-ink-900 text-ink-50' : 'bg-white border border-ink-200')}
          >
            听写
          </button>
          <button
            onClick={() => { setTab('choice'); setQIndex(0); setQSelected(null); setQShowResult(false) }}
            className={cn('px-4 py-2 rounded-full text-sm font-medium', tab === 'choice' ? 'bg-ink-900 text-ink-50' : 'bg-white border border-ink-200')}
          >
            选择
          </button>
        </div>

        {tab === 'dictation' && (
          <>
            <Progress value={dIndex + 1} max={DICTATION_SENTENCES.length} variant="jade" className="mb-8" />
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-jade/20 text-jade grid place-items-center">
                  <Headphones className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-ink-400 uppercase tracking-widest">第 {dIndex + 1} 句</div>
                  <div className="text-sm font-semibold">听写句子</div>
                </div>
                <Button
                  variant={isPlaying ? 'primary' : 'outline'}
                  onClick={() => playAudio(3000)}
                  disabled={isPlaying}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? '播放中' : '播放'}
                </Button>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-1 h-8">
                  {Array.from({ length: 64 }).map((_, i) => {
                    const active = i / 64 < progress
                    const h = Math.abs(Math.sin(i * 0.6 + progress * 10)) * 80 + 20
                    return (
                      <div
                        key={i}
                        className={cn('flex-1 rounded-full', active ? 'bg-jade' : 'bg-ink-100')}
                        style={{ height: `${active ? h : 20}%` }}
                      />
                    )
                  })}
                </div>
                <div className="flex items-center justify-between text-xs text-ink-400">
                  <span>波形</span>
                  <span className="tnum">{(progress * 100).toFixed(0)}%</span>
                </div>
              </div>

              <textarea
                value={dInput}
                onChange={(e) => setDInput(e.target.value)}
                disabled={dShowResult}
                placeholder="听到的内容，请输入..."
                className="w-full h-28 p-4 rounded-2xl bg-ink-50 border-2 border-ink-200 focus:border-jade focus:outline-none text-base resize-none disabled:opacity-50"
              />

              {dShowResult && (
                <div className={cn('mt-4 p-4 rounded-2xl', dInput.toLowerCase().replace(/[^\w\s]/g, '') === DICTATION_SENTENCES[dIndex].text.toLowerCase().replace(/[^\w\s]/g, '') ? 'bg-jade/10' : 'bg-cinnabar/10')}>
                  <div className="flex items-center gap-2 mb-2">
                    {dInput.toLowerCase().replace(/[^\w\s]/g, '') === DICTATION_SENTENCES[dIndex].text.toLowerCase().replace(/[^\w\s]/g, '') ? (
                      <><Check className="w-4 h-4 text-jade" /><span className="text-sm font-bold text-jade">完全正确！</span></>
                    ) : (
                      <><X className="w-4 h-4 text-cinnabar" /><span className="text-sm font-bold text-cinnabar">需要再听</span></>
                    )}
                  </div>
                  <div className="text-sm text-ink-700 font-medium">{DICTATION_SENTENCES[dIndex].text}</div>
                  <div className="text-xs text-ink-500 mt-1">{DICTATION_SENTENCES[dIndex].translation}</div>
                </div>
              )}

              <div className="flex justify-between mt-6">
                <div className="text-sm text-ink-500 tnum">
                  正确 <span className="display text-lg font-black text-jade">{dCorrect}</span> / {DICTATION_SENTENCES.length}
                </div>
                {dShowResult ? (
                  <Button variant="gradient" onClick={handleDictationNext}>
                    {dIndex === DICTATION_SENTENCES.length - 1 ? '完成' : '下一句'} <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button variant="gradient" onClick={handleDictationCheck}>
                    提交答案
                  </Button>
                )}
              </div>
            </Card>
          </>
        )}

        {tab === 'choice' && (
          <>
            <Progress value={qIndex + 1} max={QUESTIONS.length} variant="electric" className="mb-8" />
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-electric/20 text-electric grid place-items-center">
                  <Volume2 className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-ink-400 uppercase tracking-widest">第 {qIndex + 1} 题</div>
                  <div className="text-sm font-semibold">听后选择</div>
                </div>
                <Button variant="outline" onClick={() => playAudio(3000)} disabled={isPlaying}>
                  <Play className="w-4 h-4" /> 播放
                </Button>
              </div>

              <div className="text-xl font-bold mb-6">{QUESTIONS[qIndex].q}</div>

              <div className="space-y-3">
                {QUESTIONS[qIndex].options.map((opt, i) => {
                  let variant = 'border-ink-200 hover:border-ink-900'
                  if (qShowResult) {
                    if (i === QUESTIONS[qIndex].answer) variant = 'border-jade bg-jade/10'
                    else if (i === qSelected) variant = 'border-cinnabar bg-cinnabar/10'
                    else variant = 'border-ink-100 opacity-50'
                  } else if (qSelected === i) {
                    variant = 'border-ink-900 bg-ink-50'
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handleChoiceSelect(i)}
                      disabled={qShowResult}
                      className={cn('w-full p-4 rounded-2xl border-2 text-left transition-all font-medium flex items-center justify-between', variant)}
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-ink-100 grid place-items-center text-xs font-bold tnum">
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </span>
                      {qShowResult && i === QUESTIONS[qIndex].answer && <Check className="w-5 h-5 text-jade" />}
                      {qShowResult && i === qSelected && i !== QUESTIONS[qIndex].answer && <X className="w-5 h-5 text-cinnabar" />}
                    </button>
                  )
                })}
              </div>

              {qShowResult && (
                <div className="mt-4 p-4 rounded-2xl bg-ink-50 text-sm text-ink-600">
                  💡 {QUESTIONS[qIndex].hint}
                </div>
              )}

              <div className="flex justify-between mt-6">
                <div className="text-sm text-ink-500 tnum">
                  正确 <span className="display text-lg font-black text-jade">{qCorrect}</span> / {QUESTIONS.length}
                </div>
                {qShowResult && (
                  <Button variant="gradient" onClick={handleChoiceNext}>
                    {qIndex === QUESTIONS.length - 1 ? '完成' : '下一题'} <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
