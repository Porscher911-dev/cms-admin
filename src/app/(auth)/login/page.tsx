'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Mock login logic
      let userRole = 'EMPLOYEE'
      if (email.includes('admin') || email.includes('director')) {
        userRole = 'DIRECTOR'
      } else if (email.includes('manager')) {
        userRole = 'MANAGER'
      }

      // Set auth cookie
      document.cookie = `mrex_auth=true; path=/; max-age=86400` // 1 day
      
      // Set role for RoleProvider
      localStorage.setItem('mrex_demo_role', userRole)

      toast.success('Đăng nhập thành công!')
      
      // Short delay for UI effect
      setTimeout(() => {
        router.push('/')
        router.refresh()
      }, 500)
    } catch (err) {
      toast.error('Có lỗi xảy ra khi đăng nhập.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex items-center gap-2"
      >
        <div className="bg-primary/10 p-3 rounded-2xl">
          <Building2 className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Mrex Agency
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-md"
      >
        <Card className="premium-card border-none">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Đăng nhập hệ thống
            </CardTitle>
            <CardDescription>
              Nhập email và mật khẩu để truy cập không gian làm việc của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@mrex.agency"
                    className="pl-10 rounded-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <a href="#" className="text-sm font-medium text-primary hover:underline">
                    Quên mật khẩu?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-10 rounded-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full rounded-xl mt-6 h-11 text-base shadow-lg shadow-primary/25"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Đăng nhập <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 text-center text-sm text-muted-foreground">
            <div>
              <p className="mb-2"><strong>Gợi ý tài khoản demo:</strong></p>
              <div className="flex justify-center gap-4 text-xs font-mono bg-muted/50 p-2 rounded-lg">
                <span>admin@mrex.vn (Giám đốc)</span>
              </div>
              <div className="flex justify-center gap-4 text-xs font-mono bg-muted/50 p-2 rounded-lg mt-1">
                <span>manager@mrex.vn (Quản lý)</span>
              </div>
              <div className="flex justify-center gap-4 text-xs font-mono bg-muted/50 p-2 rounded-lg mt-1">
                <span>nhanvien@mrex.vn (Nhân viên)</span>
              </div>
            </div>
            <div className="mt-2">
              Chưa có tài khoản?{' '}
              <a href="#" className="font-semibold text-primary hover:underline">
                Liên hệ Quản trị viên
              </a>
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px]" />
      </div>
    </div>
  )
}
