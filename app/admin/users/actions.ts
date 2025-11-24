'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function getUsers(page = 1, search = '') {
    const supabase = await createClient()

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') throw new Error('Unauthorized')

    // Fetch users with pagination and search
    const PAGE_SIZE = 10
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('updated_at', { ascending: false })
        .range(from, to)

    if (search) {
        query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`)
    }

    const { data, count, error } = await query

    if (error) throw error

    return { users: data, count }
}

export async function updateUserPlan(userId: string, plan: 'free' | 'basic' | 'pro') {
    const supabase = await createClient()

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') throw new Error('Unauthorized')

    // Use admin client to bypass RLS
    const adminClient = createAdminClient()
    const { error } = await adminClient
        .from('profiles')
        .update({ plan })
        .eq('id', userId)

    if (error) {
        console.error('Error updating user plan:', error)
        throw new Error(`Failed to update plan: ${error.message} (Code: ${error.code})`)
    }
    revalidatePath('/admin/users')
}

export async function updateUserRole(userId: string, role: 'user' | 'admin') {
    const supabase = await createClient()

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') throw new Error('Unauthorized')

    // Use admin client to bypass RLS
    const adminClient = createAdminClient()
    const { error } = await adminClient
        .from('profiles')
        .update({ role })
        .eq('id', userId)

    if (error) throw error
    revalidatePath('/admin/users')
}

export async function toggleUserBlock(userId: string, isBlocked: boolean) {
    const supabase = await createClient()

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') throw new Error('Unauthorized')

    // Use admin client to bypass RLS
    const adminClient = createAdminClient()
    const { error } = await adminClient
        .from('profiles')
        .update({ is_blocked: isBlocked })
        .eq('id', userId)

    if (error) throw error
    revalidatePath('/admin/users')
}

export async function deleteUser(userId: string) {
    const supabase = await createClient()

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') throw new Error('Unauthorized')

    // Use admin client to delete from auth.users
    const adminClient = createAdminClient()
    const { error } = await adminClient.auth.admin.deleteUser(userId)

    if (error) throw error
    revalidatePath('/admin/users')
}
