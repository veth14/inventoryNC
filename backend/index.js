require('dotenv').config()
const express = require('express')
const { createClient } = require('@supabase/supabase-js')

const app = express()
app.use(express.json())

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend/.env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'email and password required' })

  try {
    const result = await supabase.auth.signInWithPassword({ email, password })
    if (result.error) return res.status(401).json({ error: result.error.message })
    return res.json(result.data)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'internal error' })
  }
})

app.post('/api/magic-link', async (req, res) => {
  const { email } = req.body || {}
  if (!email) return res.status(400).json({ error: 'email required' })

  try {
    const result = await supabase.auth.signInWithOtp({ email })
    if (result.error) return res.status(400).json({ error: result.error.message })
    return res.json(result.data)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'internal error' })
  }
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`)
})
