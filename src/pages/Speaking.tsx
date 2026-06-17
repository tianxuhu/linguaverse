import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mic, Square, Play, Pause, RotateCcw, Volume2, Sparkles, Trophy, Check, ChevronRight, AudioLines } from 'lucide-react'
import { DIALOGS } from '@/data/mock'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { useLearnStore } from '@/stores/learnStore'
import { cn, randomChoice } from '@/utils'

export default function Speaking() {
  const { completeSpeaking } = useLearnStore()
  const [dialogIndex, setDialogIndex] = useState(0)
  const [lineIndex, setLineIndex] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'playing' | 'recording' | 'scored'>('idle')
  const [score, setScore] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [done, setDone] = useState(false)
  const [scores, setScores] = useState<number[]>([])
  const timerRef = useRef<number | null>(null)

  const dialog = DIALOGS[dialogIndex]
  const line = dialog?.lines[lineIndex]

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [])

  const startPlay = () => {
    setPhase('playing')
    setIsPlaying(true)
    setProgress(0)
    const start = Date.now()
    const duration = ((line?.end ?? 3) - (line?.start ?? 0)) * 1000
    timerRef.current = window.setInterval(() => {
      const p = (Date.now() - start) / duration
      if (p >= 1) {
        window.clearInterval(timerRef.current!)
        setIsPlaying(false)
        setProgress(1)
        setTimeout(() => setPhase('idle'), 500)
      } else {
        setProgress(p)
      }
    }, 50)
  }

  const startRecord = () => {
    setPhase('recording')
    setProgress(0)
    const start = Date.now()
    const duration = ((line?.end ?? 3) - (line?.start ?? 0)) * 1000
    timerRef.current = window.setInterval(() => {
      const p = (Date.now() - start) / duration
      if (p >= 1) {
        window.clearInterval(timerRef.current!)
        setProgress(1)
        setTimeout(() => finishRecord(), 200)
      } else {
        setProgress(p)
      }
    }, 50)
  }

  const stopRecord = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current!)
      finishRecord()
    }
  }

  const finishRecord = () => {
    const s = Math.floor(60 + Math.random() * 35)
    setScore(s)
    setPhase('scored')
    setScores([...scores, s])
  }

  const handleNext = () => {
    if (lineIndex < (dialog?.lines.length ?? 0) - 1) {
      setLineIndex(lineIndex + 1)
      setPhase('idle')
      setScore(0)
      setProgress(0)
    } else {
      const totalScore = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length))
      completeSpeaking(dialog.lines.length)
      if (totalScore >= 90) {
        useLearnStore.getState().awardBadge('b4')
      }
      if (dialogIndex < DIALOGS.length - 1) {
        setDialogIndex(dialogIndex + 1)
        setLineIndex(0)
        setPhase('idle')
        setScore(0)
        setProgress(0)
      } else {
        setDone(true)
      }
    }
  }

  const handleRetry = () => {
    setPhase('idle')
    setScore(0)
    setProgress(0)
  }

  if (done) {
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / Math.max(1, scores.length))
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <Card className="p-12 max-w-md w-full text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-amber/20 blur-3xl" />
          <div className="relative">
            <div className="w-20 h-20 mx-auto rounded-full bg-[linear-gradient(135deg,#F59E0B,#EF4444)] grid place-items-center mb-6 pulse-glow">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="display text-4xl font-black mb-3">口语训练完成！</h2>
            <p className="text-ink-500 mb-8">跟读 {DIALOGS.length} 段对话</p>
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div>
                <div className="display text-3xl font-black tnum">{DIALOGS.reduce((a, d) => a + d.lines.length, 0)}</div>
                <div className="text-xs text-ink-400">句数</div>
              </div>
              <div>
                <div className="display text-3xl font-black tnum text-amber">{avg}</div>
                <div className="text-xs text-ink-400">平均分</div>
              </div>
              <div>
                <div className="display text-3xl font-black tnum text-amber">+{DIALOGS.length * 6}</div>
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
    <div className="min-h-screen bg-[linear-gradient(135deg,#0B0B0F_0%,#1A1816_100%)] text-ink-50">
      <div className="max-w-[960px] mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <Link to="/learn" className="flex items-center gap-2 text-ink-300 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> 返回
          </Link>
          <Badge variant="default" className="bg-amber/20 text-amber">
            <Sparkles className="w-3 h-3" /> +{dialog.lines.length * 4} pts
          </Badge>
        </div>

        <h1 className="display text-4xl font-black mb-2">口语跟读</h1>
        <p className="text-ink-300 text-sm mb-6">原音播放 · 录音对比 · AI 评分</p>

        <div className="flex items-center gap-2 mb-6">
          <Progress
            value={lineIndex + 1}
            max={dialog.lines.length}
            variant="amber"
            className="flex-1"
          />
          <span className="text-xs text-ink-300 tnum">{lineIndex + 1}/{dialog.lines.length}</span>
        </div>

        <Card className="bg-ink-700/40 border-ink-700 p-8 mb-6 noise-bg relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-amber/20 blur-3xl" />
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="default" className="bg-ink-700/60 text-ink-200">
                {dialog.scenario}
              </Badge>
              <span className="text-xs text-ink-400 tnum">Speaker {line.speaker}</span>
            </div>
            <h2 className="display text-xl font-black mb-6">{dialog.title}</h2>

            <div className="bg-ink-900/60 rounded-2xl p-6 mb-6 text-center">
              <div className="text-xs text-ink-300 uppercase tracking-widest mb-3">
                {phase === 'scored' ? 'Your score' : 'Listen & repeat'}
              </div>
              {phase === 'scored' ? (
                <div>
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                      <circle
                        cx="50" cy="50" r="45"
                        stroke={score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444'}
                        strokeWidth="8" fill="none"
                        strokeDasharray={`${(score / 100) * 283} 283`}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 grid place-items-center">
                      <span className="display text-4xl font-black tnum">{score}</span>
                    </div>
                  </div>
                  <div className="text-sm text-ink-200">
                    {score >= 90 ? '🎉 发音地道！' : score >= 75 ? '👍 表达流畅' : score >= 60 ? '💪 继续加油' : '🌱 多听多练'}
                  </div>
                </div>
              ) : (
                <div className="display text-3xl lg:text-4xl font-black leading-tight">
                  "{line.text}"
                </div>
              )}
              <div className="mt-4 text-sm text-ink-300 italic">
                {line.translation}
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between text-xs text-ink-300">
                <span>{phase === 'playing' ? '原音波形' : phase === 'recording' ? '你的波形' : '波形预览'}</span>
                <span className="tnum">{(progress * 100).toFixed(0)}%</span>
              </div>
              <div className="flex items-center gap-1 h-16">
                {Array.from({ length: 48 }).map((_, i) => {
                  const baseHeight = Math.abs(Math.sin(i * 0.4)) * 60 + 10
                  const active = i / 48 < progress
                  const intensity = active ? baseHeight * (1 + (i % 3) * 0.2) : 10
                  return (
                    <div
                      key={i}
                      className={cn(
                        'flex-1 rounded-full transition-all',
                        phase === 'scored' ? (score >= 80 ? 'bg-jade' : score >= 60 ? 'bg-amber' : 'bg-cinnabar')
                          : phase === 'recording' ? 'bg-amber'
                          : 'bg-electric',
                      )}
                      style={{ height: `${active ? intensity : 10}%`, opacity: active ? 1 : 0.3 }}
                    />
                  )
                })}
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              {phase === 'idle' && (
                <>
                  <Button variant="outline" onClick={startPlay} className="border-ink-50 text-ink-50">
                    <Volume2 className="w-4 h-4 mr-2" /> 听原音
                  </Button>
                  <Button variant="gradient" onClick={startRecord}>
                    <Mic className="w-4 h-4 mr-2" /> 开始跟读
                  </Button>
                </>
              )}
              {phase === 'playing' && (
                <Button variant="outline" onClick={() => { if (timerRef.current) window.clearInterval(timerRef.current); setIsPlaying(false); setPhase('idle') }} className="border-ink-50 text-ink-50">
                  <Square className="w-4 h-4 mr-2" /> 停止
                </Button>
              )}
              {phase === 'recording' && (
                <Button variant="primary" hard onClick={stopRecord}>
                  <Square className="w-4 h-4 mr-2 fill-current" /> 停止录音
                </Button>
              )}
              {phase === 'scored' && (
                <>
                  <Button variant="outline" onClick={handleRetry} className="border-ink-50 text-ink-50">
                    <RotateCcw className="w-4 h-4 mr-2" /> 重录
                  </Button>
                  <Button variant="gradient" onClick={handleNext}>
                    {lineIndex === dialog.lines.length - 1 && dialogIndex === DIALOGS.length - 1 ? '完成' : '下一句'} <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>

        <div className="flex gap-2 flex-wrap">
          {dialog.lines.map((l, i) => (
            <div
              key={i}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs',
                i === lineIndex ? 'bg-amber text-white' : i < lineIndex ? 'bg-jade/20 text-jade' : 'bg-ink-700/40 text-ink-400',
              )}
            >
              {i < lineIndex && '✓ '}
              Speaker {l.speaker}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
