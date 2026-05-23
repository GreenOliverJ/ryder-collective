export function errorHandler (err, req, res, next) {
  console.error('[error]', err)

  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors?.map(e => ({ path: e.path.join('.'), message: e.message }))
    })
  }

  if (err.code === 11000) {
    return res.status(409).json({ error: 'Duplicate value', field: Object.keys(err.keyPattern || {})[0] })
  }

  const status = err.status || 500
  res.status(status).json({
    error: err.message || 'Internal server error'
  })
}
