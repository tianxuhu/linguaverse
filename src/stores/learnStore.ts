import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useAuthStore } from './authStore'
import type { DailyTask, Badge } from '@/types'
import { BADGES } from '@/data/mock'

interface LearnState {
  studyMinutes: number
  weeklyMinutes: number[]
  todayLearned: { vocab: number; grammar: number; speaking: number; listening: number }
  errorBook: string[]
  favoriteWords: string[]
  dailyTasks: DailyTask[]
  badges: Badge[]
  todayCompletedAt: string | null
  enrollments: string[]
  lessonProgress: Record<string, number>
  completeVocab: (count: number) => void
  completeGrammar: (count: number) => void
  completeSpeaking: (count: number) => void
  completeListening: (count: number) => void
  toggleFavorite: (word: string) => void
  addToErrorBook: (id: string) => void
  claimTask: (id: string) => void
  ensureDaily: () => void
  enroll: (courseId: string) => void
  setLessonProgress: (lessonId: string, percent: number) => void
  awardBadge: (badgeId: string) => void
}

const defaultTasks: () => DailyTask[] = () => [
  { id: 't1', title: '学习 10 个新单词', description: '在单词记忆模块掌握 10 个生词', target: 10, current: 0, reward: 30, icon: 'book', completed: false },
  { id: 't2', title: '完成 1 组语法练习', description: '在语法模块拿到 80% 正确率', target: 1, current: 0, reward: 25, icon: 'check', completed: false },
  { id: 't3', title: '跟读 3 句口语', description: '在口语跟读模块进行 3 次练习', target: 3, current: 0, reward: 35, icon: 'mic', completed: false },
  { id: 't4', title: '听写 5 个句子', description: '在听力模块听写 5 个完整句子', target: 5, current: 0, reward: 20, icon: 'headphones', completed: false },
  { id: 't5', title: '学习 20 分钟', description: '累计学习时长达到 20 分钟', target: 20, current: 0, reward: 40, icon: 'clock', completed: false },
]

function awardPoints(p: number) {
  const auth = useAuthStore.getState()
  if (auth.user) {
    auth.updateUser({ totalPoints: auth.user.totalPoints + p })
  }
}

function recalcTasks(tasks: DailyTask[], learned: { vocab: number; grammar: number; speaking: number; listening: number }, minutes: number): DailyTask[] {
  return tasks.map((t) => {
    if (t.id === 't1') return { ...t, current: learned.vocab }
    if (t.id === 't2') return { ...t, current: learned.grammar }
    if (t.id === 't3') return { ...t, current: learned.speaking }
    if (t.id === 't4') return { ...t, current: learned.listening }
    if (t.id === 't5') return { ...t, current: Math.floor(minutes) }
    return t
  })
}

export const useLearnStore = create<LearnState>()(
  persist(
    (set, get) => ({
      studyMinutes: 0,
      weeklyMinutes: [12, 18, 25, 8, 30, 22, 15],
      todayLearned: { vocab: 0, grammar: 0, speaking: 0, listening: 0 },
      errorBook: [],
      favoriteWords: [],
      dailyTasks: defaultTasks(),
      badges: BADGES,
      todayCompletedAt: null,
      enrollments: [],
      lessonProgress: {},

      completeVocab: (count) => {
        const learned = { ...get().todayLearned, vocab: get().todayLearned.vocab + count }
        const minutes = get().studyMinutes + count * 0.5
        const tasks = recalcTasks(get().dailyTasks, learned, minutes)
        set({ todayLearned: learned, studyMinutes: minutes, dailyTasks: tasks })
        awardPoints(count * 2)
      },
      completeGrammar: (count) => {
        const learned = { ...get().todayLearned, grammar: get().todayLearned.grammar + count }
        const minutes = get().studyMinutes + count * 2
        const tasks = recalcTasks(get().dailyTasks, learned, minutes)
        set({ todayLearned: learned, studyMinutes: minutes, dailyTasks: tasks })
        awardPoints(count * 3)
      },
      completeSpeaking: (count) => {
        const learned = { ...get().todayLearned, speaking: get().todayLearned.speaking + count }
        const minutes = get().studyMinutes + count * 1.5
        const tasks = recalcTasks(get().dailyTasks, learned, minutes)
        set({ todayLearned: learned, studyMinutes: minutes, dailyTasks: tasks })
        awardPoints(count * 4)
      },
      completeListening: (count) => {
        const learned = { ...get().todayLearned, listening: get().todayLearned.listening + count }
        const minutes = get().studyMinutes + count * 1.5
        const tasks = recalcTasks(get().dailyTasks, learned, minutes)
        set({ todayLearned: learned, studyMinutes: minutes, dailyTasks: tasks })
        awardPoints(count * 3)
      },
      toggleFavorite: (word) => {
        const set0 = new Set(get().favoriteWords)
        if (set0.has(word)) set0.delete(word)
        else set0.add(word)
        set({ favoriteWords: Array.from(set0) })
      },
      addToErrorBook: (id) => {
        const set0 = new Set(get().errorBook)
        set0.add(id)
        set({ errorBook: Array.from(set0) })
      },
      claimTask: (id) => {
        const tasks = get().dailyTasks.map((t) => {
          if (t.id === id && t.current >= t.target && !t.completed) {
            awardPoints(t.reward)
            return { ...t, completed: true }
          }
          return t
        })
        set({ dailyTasks: tasks })
      },
      ensureDaily: () => {
        const today = new Date().toDateString()
        if (get().todayCompletedAt !== today) {
          set({
            todayLearned: { vocab: 0, grammar: 0, speaking: 0, listening: 0 },
            studyMinutes: 0,
            dailyTasks: defaultTasks(),
            todayCompletedAt: today,
          })
        }
      },
      enroll: (courseId) => {
        if (!get().enrollments.includes(courseId)) {
          set({ enrollments: [...get().enrollments, courseId] })
        }
      },
      setLessonProgress: (lessonId, percent) => {
        set({ lessonProgress: { ...get().lessonProgress, [lessonId]: percent } })
      },
      awardBadge: (badgeId) => {
        set({
          badges: get().badges.map((b) => (b.id === badgeId ? { ...b, unlocked: true, progress: 100 } : b)),
        })
      },
    }),
    {
      name: 'linguaverse:learn',
      partialize: (s) => ({
        studyMinutes: s.studyMinutes,
        weeklyMinutes: s.weeklyMinutes,
        todayLearned: s.todayLearned,
        errorBook: s.errorBook,
        favoriteWords: s.favoriteWords,
        dailyTasks: s.dailyTasks,
        badges: s.badges,
        todayCompletedAt: s.todayCompletedAt,
        enrollments: s.enrollments,
        lessonProgress: s.lessonProgress,
      }),
    },
  ),
)
