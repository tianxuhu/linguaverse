import { Link } from 'react-router-dom'
import { Github, Twitter, Mail, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-ink-900 text-ink-50 mt-32 noise-bg relative">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[linear-gradient(135deg,#FF6B9D,#F59E0B)] text-white grid place-items-center font-display text-xl font-black">
                語
              </div>
              <div>
                <div className="font-display text-2xl font-black">LinguaVerse</div>
                <div className="text-xs text-ink-400 tracking-widest">语 · 元</div>
              </div>
            </div>
            <p className="text-ink-300 leading-relaxed max-w-md">
              沉浸式多语种学习平台，融合母语语境与游戏化激励，让每一次学习都成为探索世界的方式。
            </p>
            <div className="flex gap-3 mt-6">
              <a className="w-10 h-10 grid place-items-center rounded-full bg-ink-700 hover:bg-ink-600 transition-colors" href="#">
                <Github className="w-4 h-4" />
              </a>
              <a className="w-10 h-10 grid place-items-center rounded-full bg-ink-700 hover:bg-ink-600 transition-colors" href="#">
                <Twitter className="w-4 h-4" />
              </a>
              <a className="w-10 h-10 grid place-items-center rounded-full bg-ink-700 hover:bg-ink-600 transition-colors" href="#">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-sm font-bold mb-4 uppercase tracking-wider text-ink-400">课程</h4>
            <ul className="space-y-2.5 text-sm text-ink-200">
              <li><Link to="/courses" className="hover:text-sakura transition-colors">英语课程</Link></li>
              <li><Link to="/courses" className="hover:text-sakura transition-colors">日语课程</Link></li>
              <li><Link to="/courses" className="hover:text-sakura transition-colors">韩语课程</Link></li>
              <li><Link to="/courses" className="hover:text-sakura transition-colors">考试备考</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-sm font-bold mb-4 uppercase tracking-wider text-ink-400">训练</h4>
            <ul className="space-y-2.5 text-sm text-ink-200">
              <li><Link to="/learn/vocab" className="hover:text-sakura transition-colors">单词记忆</Link></li>
              <li><Link to="/learn/grammar" className="hover:text-sakura transition-colors">语法练习</Link></li>
              <li><Link to="/learn/speaking" className="hover:text-sakura transition-colors">口语跟读</Link></li>
              <li><Link to="/learn/listening" className="hover:text-sakura transition-colors">听力训练</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-sm font-bold mb-4 uppercase tracking-wider text-ink-400">订阅更新</h4>
            <p className="text-sm text-ink-300 mb-4">获取最新课程与学习技巧</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 h-11 px-4 rounded-full bg-ink-700 border border-ink-600 text-sm focus:outline-none focus:border-sakura"
              />
              <button className="h-11 px-5 rounded-full bg-[linear-gradient(135deg,#FF6B9D,#F59E0B)] text-white text-sm font-semibold">
                订阅
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-ink-700 flex flex-col md:flex-row justify-between gap-4 text-sm text-ink-400">
          <div>© 2026 LinguaVerse · 语元. All rights reserved.</div>
          <div className="flex items-center gap-1">
            Built with <Heart className="w-4 h-4 text-sakura fill-sakura" /> for language learners.
          </div>
        </div>
      </div>
    </footer>
  )
}
