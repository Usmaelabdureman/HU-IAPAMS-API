import { createClient } from '@supabase/supabase-js';
import config from '../config';


const supabaseUrl = config.supabase_url!;
const supabaseKey = config.supabase_anon_key!;

export const supabase = createClient(supabaseUrl, supabaseKey);