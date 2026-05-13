export async function POST(req) {
  try {
    const body = await req.json()

    const {
      apiKey,
      taskId,
      endpoint
    } = body

    const response = await fetch(
      `${endpoint}/${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      }
    )

    const text = await response.text()

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
