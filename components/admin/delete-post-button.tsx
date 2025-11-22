'use client'

import { Trash2 } from 'lucide-react'

interface DeletePostButtonProps {
  postId: string
}

export default function DeletePostButton({ postId }: DeletePostButtonProps) {
  return (
    <button
      type="submit"
      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
      onClick={(e) => {
        if (!confirm('Are you sure you want to delete this post?')) {
          e.preventDefault()
        }
      }}
    >
      <Trash2 size={18} />
    </button>
  )
}
