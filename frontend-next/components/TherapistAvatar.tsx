'use client'

interface Props {
  name: string
  size?: 'sm' | 'md' | 'lg'
}

export default function TherapistAvatar({ name, size = 'md' }: Props) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  
  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-xl',
    lg: 'w-24 h-24 text-3xl'
  }
  
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
  ]
  
  const colorIndex = name.length % colors.length
  
  return (
    <div className={`${sizeClasses[size]} ${colors[colorIndex]} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}>
      {initials}
    </div>
  )
}
