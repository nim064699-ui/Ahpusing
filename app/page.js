'use client'

import { useEffect, useState } from 'react'

const USERNAME = 'Juan12'
const PASSWORD = 'klingmotion'

const MODELS = {
  'kling-2.6-std':
    'https://api.magnific.com/v1/ai/video/kling-v2-6-motion-control-std',

  'kling-2.6-pro':
    'https://api.magnific.com/v1/ai/video/kling-v2-6-motion-control-pro',

  'kling-3-std':
    'https://api.magnific.com/v1/ai/video/kling-v3-motion-control-std',

  'kling-3-pro':
    'https://api.magnific.com/v1/ai/video/kling-v3-motion-control-pro'
}

export default function Page() {
  const [loggedIn, setLoggedIn] =
    useState(false)

  const [username, setUsername] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [apiKey, setApiKey] =
    useState('')

  const [model, setModel] = useState(
    'kling-2.6-std'
  )

  const [imageFile, setImageFile] =
    useState(null)

  const [videoFile, setVideoFile] =
    useState(null)

  const [imagePreview, setImagePreview] =
    useState('')

  const [videoPreview, setVideoPreview] =
    useState('')

  const [prompt, setPrompt] =
    useState('')

  const [cfgScale, setCfgScale] =
    useState(0.5)

  const [loading, setLoading] =
    useState(false)

  useEffect(() => {
    const login =
      localStorage.getItem('login')

    if (login === 'true') {
      setLoggedIn(true)
    }
  }, [])

  const handleLogin = () => {
    if (
      username === USERNAME &&
      password === PASSWORD
    ) {
      localStorage.setItem('login', 'true')

      setLoggedIn(true)
    } else {
      alert('Login gagal')
    }
  }

  const logout = () => {
    localStorage.removeItem('login')

    setLoggedIn(false)
  }

  const generateVideo = async () => {
    if (!imageFile || !videoFile) {
      return alert(
        'Upload image & video dulu'
      )
    }

    try {
      setLoading(true)

      alert(
        'Upload mode UI berhasil 😄🔥\n\nBackend upload belum dipasang.'
      )
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!loggedIn) {
    return (
      <div style={loginWrap}>
        <div style={loginBox}>
          <h1>MOTION CONTROL SA AYANA</h1>

          <input
            placeholder='Username'
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            style={inputStyle}
          />

          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={inputStyle}
          />

          <button
            onClick={handleLogin}
            style={buttonStyle}
          >
            LOGIN
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={mainStyle}>
      <div style={container}>
        <div style={card}>
          <h1 style={title}>
            MOTION CONTROL
            <br />
            SAYAANA
          </h1>

          <button
            onClick={logout}
            style={logoutStyle}
          >
            Logout
          </button>

          <input
            placeholder='Magnific API Key'
            value={apiKey}
            onChange={(e) =>
              setApiKey(e.target.value)
            }
            style={inputStyle}
          />

          <select
            value={model}
            onChange={(e) =>
              setModel(e.target.value)
            }
            style={inputStyle}
          >
            <option value='kling-2.6-std'>
              Kling 2.6 Standard
            </option>

            <option value='kling-2.6-pro'>
              Kling 2.6 Pro
            </option>

            <option value='kling-3-std'>
              Kling 3 Standard
            </option>

            <option value='kling-3-pro'>
              Kling 3 Pro
            </option>
          </select>

          <div style={uploadGrid}>
            <div>
              <h3>Reference Image</h3>

              <input
                type='file'
                accept='image/*'
                onChange={(e) => {
                  const file =
                    e.target.files[0]

                  setImageFile(file)

                  setImagePreview(
                    URL.createObjectURL(file)
                  )
                }}
              />

              {imagePreview && (
                <img
                  src={imagePreview}
                  style={previewStyle}
                />
              )}
            </div>

            <div>
              <h3>Reference Motion</h3>

              <input
                type='file'
                accept='video/*'
                onChange={(e) => {
                  const file =
                    e.target.files[0]

                  setVideoFile(file)

                  setVideoPreview(
                    URL.createObjectURL(file)
                  )
                }}
              />

              {videoPreview && (
                <video
                  src={videoPreview}
                  controls
                  style={previewStyle}
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
            style={textareaStyle}
          />

          <h3>
            CFG Scale: {cfgScale}
          </h3>

          <input
            type='range'
            min='0'
            max='1'
            step='0.1'
            value={cfgScale}
            onChange={(e) =>
              setCfgScale(e.target.value)
            }
            style={{ width: '100%' }}
          />

          <button
            onClick={generateVideo}
            disabled={loading}
            style={buttonStyle}
          >
            {loading
              ? 'Generating...'
              : 'Generate Video'}
          </button>
        </div>
      </div>
    </div>
  )
}

const uploadGrid = {
  display: 'grid',
  gridTemplateColumns:
    'repeat(auto-fit,minmax(250px,1fr))',
  gap: 20,
  marginTop: 20
}

const previewStyle = {
  width: '100%',
  borderRadius: 20,
  marginTop: 10,
  maxHeight: 300,
  objectFit: 'cover'
}

const loginWrap = {
  minHeight: '100vh',
  background: '#020617',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20
}

const loginBox = {
  width: '100%',
  maxWidth: 400,
  background: '#0f172a',
  padding: 25,
  borderRadius: 25,
  color: 'white'
}

const mainStyle = {
  minHeight: '100vh',
  background: '#020617',
  padding: 20,
  color: 'white'
}

const container = {
  maxWidth: 1000,
  margin: '0 auto'
}

const card = {
  background: '#0f172a',
  padding: 20,
  borderRadius: 25,
  marginBottom: 20
}

const title = {
  fontSize: 55,
  lineHeight: 1,
  marginBottom: 20
}

const inputStyle = {
  width: '100%',
  padding: 15,
  marginTop: 15,
  borderRadius: 15,
  border: '1px solid #334155',
  background: '#1e293b',
  color: 'white'
}

const textareaStyle = {
  width: '100%',
  height: 150,
  marginTop: 20,
  borderRadius: 15,
  border: '1px solid #334155',
  background: '#1e293b',
  color: 'white',
  padding: 15
}

const buttonStyle = {
  width: '100%',
  padding: 15,
  marginTop: 20,
  border: 'none',
  borderRadius: 15,
  background: '#2563eb',
  color: 'white',
  fontWeight: 'bold'
}

const logoutStyle = {
  padding: '10px 20px',
  borderRadius: 15,
  border: 'none',
  background: '#dc2626',
  color: 'white',
  marginBottom: 20
                        }
