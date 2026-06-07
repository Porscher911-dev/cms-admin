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
  const [isResetting, setIsResetting] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const loginEmail = email.trim().toLowerCase()
      const loginPassword = password.trim()
      
      // Only allow the default admin account or an account created in HR
      if (loginEmail === 'admin@mrex.vn' && loginPassword === '123123') {
        const userRole = 'DIRECTOR'
        
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
      } else {
        // Check if there are employees in localStorage
        const stored = localStorage.getItem("mrex_employees")
        let foundEmployee = null;
        if (stored) {
          const employees = JSON.parse(stored)
          foundEmployee = employees.find((e: any) => e.email.toLowerCase() === loginEmail && e.status === 'ACTIVE')
        }

        if (foundEmployee && loginPassword === 'Mrex@2026') {
          const userRole = foundEmployee.systemRole || 'EMPLOYEE'
          document.cookie = `mrex_auth=true; path=/; max-age=86400`
          localStorage.setItem('mrex_demo_role', userRole)

          toast.success('Đăng nhập thành công!')
          setTimeout(() => {
            router.push('/')
            router.refresh()
          }, 500)
        } else {
          toast.error('Email hoặc mật khẩu không chính xác!')
          setIsLoading(false)
        }
      }
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
        className="mb-8 flex flex-col items-center gap-4"
      >
        <img src="/logo.png" alt="Mrex Agency Logo" className="h-16 object-contain" />
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
                  <button 
                    type="button" 
                    disabled={isResetting}
                    onClick={async () => {
                      if (!email) {
                        toast.error("Vui lòng nhập email của bạn trước khi yêu cầu khôi phục mật khẩu.");
                        return;
                      }
                      
                      setIsResetting(true);
                      try {
                        const res = await fetch('/api/send-mail', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            to: email,
                            subject: 'Khôi phục mật khẩu Mrex Agency',
                            html: `
                              <h2>Yêu cầu khôi phục mật khẩu</h2>
                              <p>Chào bạn,</p>
                              <p>Bạn đã yêu cầu khôi phục mật khẩu cho tài khoản <b>${email}</b>.</p>
                              <p>Vui lòng liên hệ trực tiếp với <b>Quản trị viên (0362777763)</b> để được cấp lại mật khẩu mới vì lý do bảo mật.</p>
                              <br/>
                              <p>Trân trọng,<br/>Đội ngũ Mrex Agency</p>
                            `
                          })
                        });
                        
                        if (res.ok) {
                          toast.success("Hướng dẫn thay đổi mật khẩu đã được gửi đến email của bạn.");
                        } else {
                          toast.error("Không thể gửi email. Vui lòng liên hệ Quản trị viên.");
                        }
                      } catch (error) {
                        toast.error("Đã xảy ra lỗi khi gửi email.");
                      } finally {
                        setIsResetting(false);
                      }
                    }}
                    className="text-sm font-medium text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isResetting ? "Đang gửi..." : "Quên mật khẩu?"}
                  </button>
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
            <div className="mt-2">
              Chưa có tài khoản?{' '}
              <a href="tel:0362777763" className="font-semibold text-primary hover:underline">
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
