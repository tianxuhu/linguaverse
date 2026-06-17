import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Layout } from '@/components/layout/Layout'
import Home from '@/pages/Home'
import Courses from '@/pages/Courses'
import CourseDetail from '@/pages/CourseDetail'
import Learn from '@/pages/Learn'
import Vocab from '@/pages/Vocab'
import Grammar from '@/pages/Grammar'
import Speaking from '@/pages/Speaking'
import Listening from '@/pages/Listening'
import Dashboard from '@/pages/Dashboard'
import Recommend from '@/pages/Recommend'
import Community from '@/pages/Community'
import Achievements from '@/pages/Achievements'
import Profile from '@/pages/Profile'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import NotFound from '@/pages/NotFound'
import { useAuthStore } from '@/stores/authStore'
import { useLearnStore } from '@/stores/learnStore'

function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuthStore()
  const loc = useLocation()
  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(loc.pathname)}`} replace />
  }
  return children
}

function App() {
  const { ensureDaily } = useLearnStore()
  useEffect(() => {
    ensureDaily()
  }, [ensureDaily])

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/learn" element={<RequireAuth><Learn /></RequireAuth>} />
        <Route path="/learn/vocab" element={<RequireAuth><Vocab /></RequireAuth>} />
        <Route path="/learn/grammar" element={<RequireAuth><Grammar /></RequireAuth>} />
        <Route path="/learn/speaking" element={<RequireAuth><Speaking /></RequireAuth>} />
        <Route path="/learn/listening" element={<RequireAuth><Listening /></RequireAuth>} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/recommend" element={<RequireAuth><Recommend /></RequireAuth>} />
        <Route path="/community" element={<Community />} />
        <Route path="/achievements" element={<RequireAuth><Achievements /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default App
