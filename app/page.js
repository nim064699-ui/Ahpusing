'use client'

import { useState, useEffect } from 'react'

const USERNAME = 'Juan12'
const PASSWORD = 'klingmotion'

export default function Page() {
  const [loggedIn, setLoggedIn] = useState(false)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [apiKey, setApiKey] = useState('')

  const [imageFile, setImageFile] = useState(null)
  const [videoFile, setVideoFile] = useState(null)

  const [imagePreview, setImagePreview] = useState('')
  const [videoPreview, setVideoPreview] = useState('')

  const [prompt, setPrompt] = useState('')

  const [cfg, setCfg] = useState(0.5)

  const [loading, setLoading] = useState(false)

  const [history, setHistory] = useState([])

  useEffect(() => {
    const login = localStorage.getItem('login')
    const historyData = localStorage.getItem('history')

    if (login === 'true') {
      setLoggedIn(true)
    }

    if (historyData) {
      setHistory(JSON.parse(historyData))
    }
  }, [])

  const login = () => {
    if (
      username === USERNAME &&
      password === PASSWORD
    ) {
      localStorage.setItem('login', 'true')
      setLoggedIn(true)
    } else {
      alert('Login salah')
    }
  }

  const logout = () => {
    localStorage.removeItem('login')
    setLoggedIn(false)
  }

  const saveHistory = (item) => {
    const updated = [item, ...history]
    setHistory(updated)
    localStorage.setItem(
      'history',
      JSON.stringify(updated)
    )
  }

  const uploadToTmp = async (file) => {
    const form = new FormData()
    form.append('file', file)

    const res = await fetch(
      'https://tmpfiles.org/api/v1/upload',
      {
        method: 'POST',
        body: form
      }
    )

    const data = await res.json()

    return data.data.url.replace(
      'tmpfiles.org/',
      'tmpfiles.org/dl/'
    )
  }

  const generate = async () => {
    try {
      setLoading(true)

      let imageUrl = ''
      let videoUrl = ''

      if (imageFile) {
        imageUrl = await uploadToTmp(imageFile)
      }

      if (videoFile) {
        videoUrl = await uploadToTmp(videoFile)
      }

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apiKey,
          imageUrl,
          videoUrl,
          prompt,
          cfg
        })
      })

      const data = await res.json()

      if (data.error) {
        alert(JSON.stringify(data.error))
        return
      }

      saveHistory(data.video)

      alert('Video berhasil dibuat 🔥')
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!loggedIn) {
    return (
      <div style={styles.bg}>
        <div style={styles.card}>
          <h1 style={styles.title}>
            MOTION CONTROL
            <br />
            SAYAANA
          </h1>

          <input
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            style={styles.input}
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={styles.input}
          />

          <button
            onClick={login}
            style={styles.button}
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          MOTION CONTROL
          <br />
          SAYAANA
        </h1>

        <button
          onClick={logout}
          style={styles.logout}
        >
          Logout
        </button>

        <input
          placeholder="API KEY"
          value={apiKey}
          onChange={(e) =>
            setApiKey(e.target.value)
          }
          style={styles.input}
        />

        <div style={styles.row}>
          <div style={styles.box}>
            <h3>Reference Image</h3>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file =
                  e.target.files[0]

                setImageFile(file)

                if (file) {
                  setImagePreview(
                    URL.createObjectURL(file)
                  )
                }
              }}
            />

            {imagePreview && (
              <img
                src={imagePreview}
                style={styles.preview}
              />
            )}
          </div>

          <div style={styles.box}>
            <h3>Reference Motion</h3>

            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                const file =
                  e.target.files[0]

                setVideoFile(file)

                if (file) {
                  setVideoPreview(
                    URL.createObjectURL(file)
                  )
                }
              }}
            />

            {videoPreview && (
              <video
                src={videoPreview}
                controls
                style={styles.preview}
              />
            )}
          </div>
        </div>

        <textarea
          placeholder="Prompt Motion"
          value={prompt}
          onChange={(e) =>
            setPrompt(e.target.value)
          }
          style={styles.textarea}
        />

        <h2>CFG Scale: {cfg}</h2>

        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={cfg}
          onChange={(e) =>
            setCfg(e.target.value)
          }
          style={{ width: '100%' }}
        />

        <button
          onClick={generate}
          disabled={loading}
          style={styles.button}
        >
          {loading
            ? 'Generating Video...'
            : 'Generate Video'}
        </button>

        <h1 style={styles.history}>
          History Generate
        </h1>

        {history.map((item, index) => (
          <video
            key={index}
            src={item}
            controls
            style={styles.historyVideo}
          />
        ))}
      </div>
    </div>
  )
}

const styles = {
  bg: {
    background: '#020617',
    minHeight: '100vh',
    padding: 20,
    color: 'white'
  },

  card: {
    maxWidth: 1100,
    margin: '0 auto',
    background: '#081028',
    borderRadius: 30,
    padding: 30
  },

  title: {
    fontSize: 60,
    fontWeight: 'bold',
    lineHeight: 1
  },

  input: {
    width: '100%',
    padding: 18,
    marginTop: 20,
    borderRadius: 15,
    border: '1px solid #334155',
    background: '#1e293b',
    color: 'white',
    fontSize: 18
  },

  textarea: {
    width: '100%',
    height: 180,
    padding: 20,
    borderRadius: 20,
    border: '1px solid #334155',
    background: '#1e293b',
    color: 'white',
    marginTop: 20,
    fontSize: 18
  },

  button: {
    width: '100%',
    padding: 20,
    background: '#2563eb',
    border: 'none',
    borderRadius: 20,
    color: 'white',
    fontSize: 20,
    marginTop: 20
  },

  logout: {
    background: '#dc2626',
    border: 'none',
    padding: '12px 20px',
    color: 'white',
    borderRadius: 15,
    marginTop: 10
  },

  row: {
    display: 'flex',
    gap: 20,
    marginTop: 30,
    flexWrap: 'wrap'
  },

  box: {
    flex: 1,
    minWidth: 300
  },

  preview: {
    width: '100%',
    borderRadius: 20,
    marginTop: 10
  },

  history: {
    marginTop: 40
  },

  historyVideo: {
    width: '100%',
    borderRadius: 20,
    marginTop: 20
  }
      }
