import { supabase } from '../config/supabase'
import { ErrorHandler } from '../utils/errorHandler'

export class AuthService {
  // 用户注册
  static async signUp(email, password, username) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username
          },
          emailRedirectTo: window.location.origin
        }
      })
      
      if (error) throw error
      
      // 如果注册成功但需要邮箱验证，返回特殊状态
      if (data.user && !data.session) {
        return {
          ...data,
          requiresEmailConfirmation: true
        }
      }
      
      return data
    } catch (error) {
      const message = ErrorHandler.handleSupabaseError(error, '用户注册')
      throw new Error(message)
    }
  }

  // 用户登录
  static async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        // 处理邮箱未验证的情况
        if (error.message.includes('Email not confirmed')) {
          throw new Error('邮箱未验证，请检查您的邮箱并点击验证链接')
        }
        throw error
      }
      return data
    } catch (error) {
      console.error('登录失败:', error)
      throw error
    }
  }

  // 用户登出
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('登出失败:', error)
      throw error
    }
  }

  // 获取当前用户
  static async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser()
      if (error) throw error
      return data.user
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return null
    }
  }

  // 重置密码
  static async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
    } catch (error) {
      console.error('密码重置失败:', error)
      throw error
    }
  }

  // 更新用户资料
  static async updateProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('更新用户资料失败:', error)
      throw error
    }
  }
}

// 监听认证状态变化
supabase.auth.onAuthStateChange((event, session) => {
  console.log('认证状态变化:', event, session)
})