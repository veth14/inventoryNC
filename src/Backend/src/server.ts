import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path'; // Import the path module
import { createClient } from '@supabase/supabase-js';
import registerAuthRoutes from './routes/auth';

// Load root .env reliably (works when running from src or dist)
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
app.use(express.json());

// Simple request logger to aid debugging
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} → ${req.method} ${req.originalUrl}`);
  next();
});

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('ERROR: Missing Supabase environment variables.');
  console.error('Ensure VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY are set in the root .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

try {
  registerAuthRoutes(app, supabase);
} catch (err) {
  console.error('Failed to register auth routes:', err);
  process.exit(1);
}

// Generic error handler to return JSON and log stack traces
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = Number(process.env.BACKEND_PORT || 8080);
app.listen(PORT, () => {
  console.log(`✅ Backend server is running on http://localhost:${PORT}`);
});
