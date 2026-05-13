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

    if (!apiKey) {
      return NextResponse.json({
        error: 'API Key kosong'
      })
    }

    const create = await fetch(
      'https://api.magnific.ai/v1/ai/image-to-video/kling/generate',
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
          prompt,
          cfg_scale: cfg
        })
      }
    )

    const result = await create.json()

    if (!result.task_id) {
      return NextResponse.json({
        error: result
      })
    }

    let finalVideo = null

    for (let i = 0; i < 60; i++) {
      await new Promise((r) => setTimeout(r, 5000))

      const status = await fetch(
        `https://api.magnific.ai/v1/ai/image-to-video/kling/status/${result.task_id}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`
          }
        }
      )

      const data = await status.json()

      if (data.status === 'succeeded') {
        finalVideo =
          data.video_url ||
          data.output?.video_url ||
          data.result?.video_url

        break
      }
    }

    return NextResponse.json({
      success: true,
      video: finalVideo
    })
  } catch (err) {
    return NextResponse.json({
      error: err.message
    })
  }
}
