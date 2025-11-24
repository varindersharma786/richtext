export type UserPlan = 'free' | 'basic' | 'pro';

export interface PlanLimits {
    maxTemplates: number;
    canUploadImages: boolean;
    canExport: boolean;
    canGmailUpload: boolean;
}

export const PLAN_LIMITS: Record<UserPlan, PlanLimits> = {
    free: {
        maxTemplates: 0,
        canUploadImages: false,
        canExport: false,
        canGmailUpload: false,
    },
    basic: {
        maxTemplates: 1,
        canUploadImages: false,
        canExport: true,
        canGmailUpload: false,
    },
    pro: {
        maxTemplates: 10,
        canUploadImages: true,
        canExport: true,
        canGmailUpload: true,
    },
};

export function getPlanLimits(plan: UserPlan): PlanLimits {
    return PLAN_LIMITS[plan] || PLAN_LIMITS.free;
}

export async function getUserPlan(supabase: any): Promise<UserPlan> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return 'free';

        const { data: profile } = await supabase
            .from('profiles')
            .select('plan')
            .eq('id', user.id)
            .single();

        return (profile?.plan as UserPlan) || 'free';
    } catch (error) {
        console.error('Error fetching user plan:', error);
        return 'free';
    }
}

export async function canSaveTemplate(supabase: any): Promise<{ allowed: boolean; reason?: string; currentCount?: number; maxTemplates?: number }> {
    try {
        const plan = await getUserPlan(supabase);
        const limits = getPlanLimits(plan);

        if (limits.maxTemplates === 0) {
            return {
                allowed: false,
                reason: 'Free users cannot save templates. Please upgrade to Basic or Pro.',
                currentCount: 0,
                maxTemplates: 0
            };
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { allowed: false, reason: 'Please sign in to save templates.' };
        }

        const { count } = await supabase
            .from('signature_templates')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

        if (count !== null && count >= limits.maxTemplates) {
            return {
                allowed: false,
                reason: `You've reached the limit of ${limits.maxTemplates} template(s) for your ${plan} plan. Delete a template or upgrade to save more.`,
                currentCount: count,
                maxTemplates: limits.maxTemplates
            };
        }

        return {
            allowed: true,
            currentCount: count || 0,
            maxTemplates: limits.maxTemplates
        };
    } catch (error) {
        console.error('Error checking template save permission:', error);
        return { allowed: false, reason: 'An error occurred. Please try again.' };
    }
}

export async function canUploadImage(supabase: any): Promise<{ allowed: boolean; reason?: string }> {
    try {
        const plan = await getUserPlan(supabase);
        const limits = getPlanLimits(plan);

        if (!limits.canUploadImages) {
            return {
                allowed: false,
                reason: 'Image upload is only available for Pro users. Please upgrade your plan.'
            };
        }

        return { allowed: true };
    } catch (error) {
        console.error('Error checking image upload permission:', error);
        return { allowed: false, reason: 'An error occurred. Please try again.' };
    }
}
