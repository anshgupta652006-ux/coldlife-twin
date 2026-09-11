const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const schema = {
  type: 'OBJECT',
  properties: {
    risk_level: { type: 'STRING', enum: ['low', 'medium', 'high', 'critical'] },
    risk_score: { type: 'INTEGER' },
    predicted_temperature_15m: { type: 'NUMBER' },
    predicted_survival_30m: { type: 'NUMBER' },
    minutes_to_critical: { type: 'INTEGER', description: 'Minutes until critical; use 0 when no critical threshold is expected soon.' },
    cooling_action: { type: 'STRING' },
    recommendation: { type: 'STRING' },
    explanation: { type: 'STRING' },
    confidence: { type: 'INTEGER' },
  },
  required: [
    'risk_level',
    'risk_score',
    'predicted_temperature_15m',
    'predicted_survival_30m',
    'minutes_to_critical',
    'cooling_action',
    'recommendation',
    'explanation',
    'confidence',
  ],
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) {
      return Response.json(
        { error: 'GEMINI_API_KEY is not configured.' },
        { status: 500, headers: corsHeaders },
      )
    }

    const x = await req.json()

    // Compact input = lower latency.
    const prompt = [
      'Cold-chain logistics prediction. Return only structured JSON.',
      'Use supplied sensor values only.',
      `Product: ${x.product || 'medical cold-chain product'}`,
      `Current status: ${x.status}; stored risk: ${x.riskLevel}`,
      `Temperature: ${x.temperature} C; safe range: ${x.safeMin}-${x.safeMax} C`,
      `Survival: ${x.survival}%`,
      `Cooling health: ${x.coolingHealthPct}%; compressor: ${x.compressorEfficiency}%`,
      `Fuel: ${x.fuelLevelPct}%; speed: ${x.speedKmh} km/h; ETA: ${x.etaMinutes} min`,
      `Recent temperatures: ${(x.recentTemperatures || []).join(', ')}`,
      `Recent survival: ${(x.recentSurvival || []).join(', ')}`,
      'Predict risk, temperature at +15m, survival at +30m, minutes to critical (0 if none expected soon), cooling action, recommendation, short explanation, confidence.',
      'Mark critical when the trend crosses the safe range materially or survival is low.',
    ].join('\n')

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 5500)

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent',
      {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: schema,
            maxOutputTokens: 320,
            thinkingConfig: {
              thinkingLevel: 'minimal',
            },
          },
        }),
      },
    ).finally(() => clearTimeout(timer))

    const body = await response.json()

    if (!response.ok) {
      return Response.json(
        { error: body?.error?.message || `Gemini error ${response.status}` },
        { status: 502, headers: corsHeaders },
      )
    }

    const text = body?.candidates?.[0]?.content?.parts
      ?.map((p: any) => p?.text || '')
      .join('')
      .trim()

    if (!text) {
      return Response.json(
        { error: 'Gemini returned no prediction text.' },
        { status: 502, headers: corsHeaders },
      )
    }

    const prediction = JSON.parse(text)

    prediction.risk_score = clamp(Number(prediction.risk_score || 0), 0, 100)
    prediction.predicted_survival_30m = clamp(Number(prediction.predicted_survival_30m || 0), 0, 100)
    prediction.confidence = clamp(Number(prediction.confidence || 0), 0, 100)

    return Response.json(
      {
        ok: true,
        model: 'gemini-3.5-flash-lite',
        prediction,
      },
      { headers: corsHeaders },
    )
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    const timeout = message.toLowerCase().includes('abort')
    return Response.json(
      { error: timeout ? 'Gemini refinement timed out; use instant prediction.' : message },
      { status: timeout ? 504 : 500, headers: corsHeaders },
    )
  }
})
