import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center bg-ink-50 p-6">
      <div className="text-center">
        <div className="display text-[180px] font-black text-gradient-neon leading-none">404</div>
        <h1 className="display text-4xl font-black mb-3 mt-4">页面去度假了</h1>
        <p className="text-ink-500 mb-8 max-w-md">这里似乎没有你想要的语言学习内容，回到首页继续探索吧</p>
        <div className="flex gap-3 justify-center">
          <Link to="/">
            <Button variant="primary" hard>返回首页</Button>
          </Link>
          <Link to="/courses">
            <Button variant="outline">浏览课程</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
