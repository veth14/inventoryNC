module.exports = function registerAuthRoutes(app, supabase) {
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
}
