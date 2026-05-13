export async function POST(req) {
  try {
    const body = await req.json()

    const {
      apiKey,
      endpoint,
      imageUrl,
      videoUrl,
      prompt,
      cfgScale
    } = body

    const response = await fetch(
      endpoint,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',

          Authorization: `Bearer ${apiKey}`
        },

        body: JSON.stringify({
          image_url: imageUrl,

          video_url: videoUrl,

          prompt,

          cfg_scale: Number(cfgScale)
        })
      }
    )

    const text =
      await response.text()

    try {
      const data = JSON.parse(text)

      return Response.json(data)
    } catch {
      return Response.json({
        error: text
      })
    }
  } catch (err) {
    return Response.json({
      error: err.message
    })
  }
}
