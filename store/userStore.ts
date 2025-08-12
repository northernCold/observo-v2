import type { User } from '@supabase/supabase-js'
import { create } from 'zustand'

// 创建用户信息存储
export const useUserStore = create(set => ({
  // 初始状态
  user: null,
  isLoading: true,

  initUser: () => {

  },

  setUser: (userData: User) => {
    const {
      id,
      user_metadata: { email, avatar_url, name }
    } = userData
    set({
      user: {
        id,
        email,
        name,
        avatarUrl: avatar_url
      }
    })
  },

  // 登出（清空用户信息）
  logout: async () => {
    // const supabase = createClientComponentClient()
    // await supabase.auth.signOut()
    // set({ user: null })
  }
}))
