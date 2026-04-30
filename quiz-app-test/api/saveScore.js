import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Check for environment variables
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    return res.status(500).json({ error: 'Database configuration missing' });
  }

  // Initialize Supabase client
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

  // Allow only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, score } = req.body;

    if (!username || typeof score !== 'number') {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const { data, error } = await supabase
      .from('leaderboard')
      .insert([{ username, score }]);

    if (error) {
      throw error;
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving score:', error);
    return res.status(500).json({ error: 'Failed to save score' });
  }
}
