import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Post, Group } from '@/types'
import { POSTS, GROUPS } from '@/data/mock'

interface CommunityState {
  posts: Post[]
  groups: Group[]
  joinedGroups: string[]
  newPostContent: string
  toggleLike: (postId: string) => void
  addPost: (content: string, language: 'en' | 'ja' | 'ko', tag: string, userName: string, userAvatar: string, userId: string) => void
  toggleJoinGroup: (groupId: string) => void
  setNewPostContent: (s: string) => void
}

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set, get) => ({
      posts: POSTS,
      groups: GROUPS,
      joinedGroups: ['g2'],
      newPostContent: '',
      toggleLike: (postId) => {
        set({
          posts: get().posts.map((p) =>
            p.id === postId
              ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
              : p,
          ),
        })
      },
      addPost: (content, language, tag, userName, userAvatar, userId) => {
        const post: Post = {
          id: 'p_' + Date.now(),
          userId,
          userName,
          userAvatar,
          content,
          language,
          likes: 0,
          comments: 0,
          liked: false,
          createdAt: new Date().toISOString(),
          tag,
        }
        set({ posts: [post, ...get().posts], newPostContent: '' })
      },
      toggleJoinGroup: (groupId) => {
        const set0 = new Set(get().joinedGroups)
        if (set0.has(groupId)) set0.delete(groupId)
        else set0.add(groupId)
        set({ joinedGroups: Array.from(set0) })
      },
      setNewPostContent: (s) => set({ newPostContent: s }),
    }),
    {
      name: 'linguaverse:community',
      partialize: (s) => ({ posts: s.posts, joinedGroups: s.joinedGroups }),
    },
  ),
)
