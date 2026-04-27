const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('CRITICAL ERROR: Missing Supabase Environment Variables!');
  console.error('Please set SUPABASE_URL and SUPABASE_KEY in your Vercel Dashboard.');
  
  // Export a proxy or null to prevent immediate crash, but the app will fail on use
  // However, createClient will throw anyway, so let's just log and let it throw 
  // but with more context.
}

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder-key'
);

module.exports = supabase;

