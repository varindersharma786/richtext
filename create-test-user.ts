import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createAdminClient } from './utils/supabase/admin';

async function createTestUser() {
    const supabase = createAdminClient();
    const email = 'test@example.com';
    const password = 'password123';

    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: 'Test User' }
    });

    if (error) {
        console.error('Error creating user:', error);
    } else {
        console.log('User created:', data.user.id);
    }
}

createTestUser();
