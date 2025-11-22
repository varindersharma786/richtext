import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return redirect('/dashboard')
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <p>Welcome, Admin {user.email}</p>
      <div className="mt-4 p-4 border rounded bg-gray-100 dark:bg-gray-800">
        <h2 className="font-semibold">Restricted Area</h2>
        <p>Only admins can see this content.</p>
      </div>
    </div>
  )
}
