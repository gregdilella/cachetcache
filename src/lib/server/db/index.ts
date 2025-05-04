import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';

if (!env.SUPABASEDatabaseURL) throw new Error('SUPABASEDatabaseURL is not set');
if (!env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');

export const supabase = createClient(
  env.SUPABASEDatabaseURL,
  env.SUPABASE_SERVICE_ROLE_KEY
);
