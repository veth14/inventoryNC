require('dotenv').config()
const express = require('express')
const { createClient } = require('@supabase/supabase-js')
const registerAuthRoutes = require('./routes/auth')

const app = express()
app.use(express.json())

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in Backend/.env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

registerAuthRoutes(app, supabase)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`)
})
