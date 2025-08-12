'use client'

// import { useUserStore } from '@/store/userStore'
import { useUser } from '@/hooks/use-user'

export function UserProfile() {
  const {
    loading,
    user
  } = useUser()

  const avatarUrl = user?.user_metadata?.avatar_url;
  const name = user?.user_metadata?.name;

  if (loading) {
    return <div className="user-profile">加载中...</div>
  }

  return (
    <div className="user-profile">
      {user ? (
        <div className="profile-info">
          <img src={avatarUrl} alt={name} className="w-10 h-10 rounded-full object-cover" />
          <span className="ml-2">{name}</span>
        </div>
      ) : (
        <div className="profile-info">
          <span className="text-gray-500">未登录</span>
        </div>
      )}
    </div>
  )
}
