'use client'

import { useState } from 'react'

export default function Page() {
  const [apiKey, setApiKey] = useState('')
  const [image, setImage] = useState(null)
  const [video, setVideo] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [videoPreview, setVideoPreview] = useState('')
  const [prompt, setPrompt] = useState('')
  const [cfgScale, setCfgScale] = useState(0.5)

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  async function uploadFile(file) {
    const form = new FormData()

    form.append('file', file)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: form
    })

    return await res.json()
  }

  async function generateVideo() {
    try {
      setLoading(true)

      const uploadedImage =
        await uploadFile(image)

      const uploadedVideo =
        await uploadFile(video)

      const generate = await fetch(
        '/api/generate',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({
            apiKey,

            endpoint:
              'https://api.magnific.com/v1/ai-video/kling/generate',

            imageUrl:
              uploadedImage.url,

            videoUrl:
              uploadedVideo.url,

            prompt,

            cfgScale
          })
        }
      )

      const generated =
        await generate.json()

      const taskId =
        generated?.data?.task_id

      if (!taskId) {
        alert(
          JSON.stringify(generated)
        )

        setLoading(false)

        return
      }

      const interval = setInterval(
        async () => {
          const status =
            await fetch(
              '/api/status',
              {
                method: 'POST',

                headers: {
                  'Content-Type':
                    'application/json'
                },

                body: JSON.stringify({
                  apiKey,

                  endpoint:
                    'https://api.magnific.com/v1/ai-video/kling/status',

                  taskId
                })
              }
            )

          const data =
            await status.json()

          if (
            data?.data?.status ===
            'COMPLETED'
          ) {
            clearInterval(interval)

            setResult(
              data.data.generated[0]
            )

            setLoading(false)
          }
        },

        5000
      )
    } catch (err) {
      alert(err.message)

      setLoading(false)
    }
  }

  return (
    <main
      style={{
        background: '#020617',
        minHeight: '100vh',
        color: 'white',
        padding: 20
      }}
    >
      <div
        style={{
          maxWidth: 500,
          margin: '0 auto',
          background: '#0f172a',
          padding: 20,
          borderRadius: 20
        }}
      >
        <h1
          style={{
            fontSize: 40,
            fontWeight: 'bold'
          }}
        >
          MOTION CONTROL
          <br />
          SAYAANA
        </h1>

        <input
          placeholder='API KEY'
          value={apiKey}
          onChange={(e) =>
            setApiKey(e.target.value)
          }
          style={input}
        />

        <div
          style={{
            display: 'flex',
            gap: 10,
            marginTop: 20
          }}
        >
          <div style={{ flex: 1 }}>
            <p>Reference Image</p>

            <input
              type='file'
              accept='image/*'
              onChange={(e) => {
                const file =
                  e.target.files[0]

                setImage(file)

                setImagePreview(
                  URL.createObjectURL(file)
                )
              }}
            />

            {imagePreview && (
              <img
                src={imagePreview}
                style={preview}
              />
            )}
          </div>

          <div style={{ flex: 1 }}>
            <p>Reference Motion</p>

            <input
              type='file'
              accept='video/*'
              onChange={(e) => {
                const file =
                  e.target.files[0]

                setVideo(file)

                setVideoPreview(
                  URL.createObjectURL(file)
                )
              }}
            />

            {videoPreview && (
              <video
                src={videoPreview}
                controls
                style={preview}
              />
            )}
          </div>
        </div>

        <textarea
          placeholder='Prompt Motion'
          value={prompt}
          onChange={(e) =>
            setPrompt(e.target.value)
          }
          style={{
            ...input,
            height: 120,
            marginTop: 20
          }}
        />

        <h2>
          CFG Scale: {cfgScale}
        </h2>

        <input
          type='range'
          min='0'
          max='1'
          step='0.1'
          value={cfgScale}
          onChange={(e) =>
            setCfgScale(e.target.value)
          }
          style={{
            width: '100%'
          }}
        />

        <button
          onClick={generateVideo}
          disabled={loading}
          style={button}
        >
          {loading
            ? 'Generating...'
            : 'Generate Video'}
        </button>

        {result && (
          <video
            src={result}
            controls
            style={{
              width: '100%',
              marginTop: 20,
              borderRadius: 20
            }}
          />
        )}
      </div>
    </main>
  )
}

const input = {
  width: '100%',
  padding: 15,
  borderRadius: 15,
  border: '1px solid #334155',
  background: '#1e293b',
  color: 'white',
  marginTop: 15
}

const button = {
  width: '100%',
  padding: 15,
  borderRadius: 15,
  border: 'none',
  background: '#2563eb',
  color: 'white',
  fontWeight: 'bold',
  marginTop: 20
}

const preview = {
  width: '100%',
  borderRadius: 15,
  marginTop: 10
          }
