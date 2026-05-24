/** Split a comma- or slash-separated instrument string into display parts. */
export function parseInstruments (instrument) {
  if (!instrument?.trim()) return []
  return instrument
    .split(/[,/]/)
    .map(s => s.trim())
    .filter(Boolean)
}

export function formatInstruments (instrument) {
  const parts = parseInstruments(instrument)
  return parts.length ? parts.join(' · ') : ''
}
