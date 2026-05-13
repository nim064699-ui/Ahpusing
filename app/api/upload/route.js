export async function POST(req) {
  try {
    const data = await req.formData()

    const file = data.get('file')

    if (!file) {
      return Response.json({
        error: 'No file uploaded'
      })
    }

    const form = new FormData()

    form.append('reqtype', 'fileupload')

    form.append('fileToUpload', file)

    const upload = await fetch(
      'https://catbox.moe/user/api.php',
      {
        method: 'POST',
        body: form
      }
    )

    const url = await upload.text()

    return Response.json({
      success: true,
      url
    })
  } catch (err) {
    return Response.json({
      error: err.message
    })
  }
}
