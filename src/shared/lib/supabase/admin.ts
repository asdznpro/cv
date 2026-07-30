import { createClient } from '@supabase/supabase-js'

function getSecretKey() {
	const key =
		process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY

	if (!key) {
		throw new Error(
			'SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY) is not set',
		)
	}

	return key
}

/** Server-only client that bypasses RLS. Always gate with requireAdminSession(). */
export function createAdminClient() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL
	if (!url) {
		throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
	}

	return createClient(url, getSecretKey(), {
		auth: {
			persistSession: false,
			autoRefreshToken: false,
		},
	})
}
