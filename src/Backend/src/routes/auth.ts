import { Express } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';

export default function registerAuthRoutes(app: Express, supabase: SupabaseClient) {
  app.post('/api/signin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        return res.status(401).json({ error: error.message });
      }

      return res.status(200).json(data);
    } catch (err) {
      console.error('Error signing in:', err);
      return res.status(500).json({ error: 'An internal server error occurred.' });
    }
  });
}
