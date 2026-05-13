import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()

    const {
      apiKey,
      imageUrl,
      videoUrl,
      prompt,
      cfg
    } = body

    const response = await fetch(
      'https://api.magnific.ai/v1/ai/image-to-video',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'kling-2.6-standard',
          image_url: imageUrl,
          motion_video_url: videoUrl,
          prompt: prompt,
          cfg_scale: Number(cfg)
        })
      }
    )

    const text = await response.text()

    try {
      const data = JSON.parse(text)

      return NextResponse.json(data)
    } catch {
      return NextResponse.json({
        error: text
      })
    }
  } catch (err) {
    return NextResponse.json({
      error: err.message
    })
  }
}
