import { useState } from 'react';
import './App.css';
import QRCode from 'react-qr-code';

const apiUrl = import.meta.env.VITE_API_URL;

function App() {
  const [text, setText] = useState('');
  const [expiry, setExpiry] = useState(300);
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (text.trim() === '') {
      setError('Text cannot be empty');
      return;
    }

    setLoading(true);
    setError('');
    setCopied(false);
    setGeneratedLink('');

    try {
      const response = await fetch(`${apiUrl}/api/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, expiresInSeconds: expiry }),
      });

      const rawText = await response.text();

      try {
        const data = JSON.parse(rawText);
        if (data.link) {
          setGeneratedLink(data.link);
          setShowModal(true);
          window.open(data.link, '_blank', 'noopener,noreferrer');
        } else {
          setError('No link returned from server');
        }
      } catch {
        setError('Invalid JSON from server');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  return (
    <>
      <div className='heading'>
        <h1 className='heading-text'>Text Share</h1>
      </div>

      <div className='main-div'>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          name="mainText"
          id="mainText"
          style={{ width: '100%', height: '100%' }}
        />

        <div className='genBtn-div'>
          <label htmlFor="expiry">Expire After:&nbsp;</label>
          <select
            id="expiry"
            value={expiry}
            onChange={(e) => setExpiry(parseInt(e.target.value))}
            className="expiry-dropdown"
          >
            <option value={300}>5 Minutes</option>
            <option value={1800}>30 Minutes</option>
            <option value={3600}>1 Hour</option>
            <option value={86400}>1 Day</option>
          </select>

          <button className='genBtn' onClick={handleSubmit} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Link'}
          </button>
        </div>

        {error && <p className="error">{error}</p>}
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Link Generated</h2>
            <a href={generatedLink} target="_blank" rel="noopener noreferrer">
              {generatedLink}
            </a>
            <button onClick={handleCopy} className="copyBtn">
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>

            {generatedLink && (
              <div className="qr-code">
                <QRCode value={generatedLink} style={{ height: '128px', width: '128px' }} />
              </div>
            )}

            <button className="closeBtn" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
