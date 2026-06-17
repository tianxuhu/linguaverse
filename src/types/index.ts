export type Language = 'en' | 'ja' | 'ko'
export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | 'TOPIK1' | 'TOPIK2' | 'TOPIK3' | 'TOPIK4' | 'TOPIK5' | 'TOPIK6'

export interface Course {
  id: string
  language: Language
  level: Level
  title: string
  subtitle: string
  description: string
  cover: string
  rating: number
  learnerCount: number
  duration: number
  tags: string[]
  instructor: {
    name: string
    title: string
    avatar: string
  }
  lessons: Lesson[]
  category: 'general' | 'business' | 'travel' | 'exam' | 'culture'
}

export interface Lesson {
  id: string
  courseId: string
  title: string
  duration: number
  order: number
  type: 'vocab' | 'grammar' | 'speaking' | 'listening'
  preview?: string
}

export interface VocabItem {
  id: string
  lessonId: string
  word: string
  translation: string
  example: string
  exampleTranslation: string
  pronunciation: string
  partOfSpeech: string
}

export interface GrammarItem {
  id: string
  lessonId: string
  rule: string
  explanation: string
  examples: { sentence: string; translation: string }[]
  exercise: {
    question: string
    options: string[]
    answer: number
    hint: string
  }
}

export interface DialogItem {
  id: string
  lessonId: string
  title: string
  scenario: string
  lines: { speaker: string; text: string; translation: string; start: number; end: number }[]
  speed: 'slow' | 'normal' | 'fast'
}

export interface User {
  id: string
  email: string
  name: string
  avatar: string
  targetLanguage: Language
  currentLevel: Level
  totalPoints: number
  joinedAt: string
  streak: { current: number; longest: number; lastActiveAt: string }
  abilities: { vocab: number; grammar: number; speaking: number; listening: number; reading: number; writing: number }
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  progress: number
  unlocked: boolean
}

export interface Post {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  language: Language
  likes: number
  comments: number
  liked: boolean
  createdAt: string
  tag: string
}

export interface Group {
  id: string
  name: string
  language: Language
  description: string
  members: number
  activity: number
  cover: string
}

export interface DailyTask {
  id: string
  title: string
  description: string
  target: number
  current: number
  reward: number
  icon: string
  completed: boolean
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  name: string
  avatar: string
  language: Language
  points: number
  streak: number
}
