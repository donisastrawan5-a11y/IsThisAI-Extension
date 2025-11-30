import { useState } from "react";
import { TextDetector } from "@/utils/textDetector";
import { DetectionResult } from "@/types";
import React from "react";

function App() {
  const [inputText, setinpuText] = useState("");
  const [result, setresult] = useState<DetectionResult | null>(null);
  const [isAnalyzing, setisAnalyzing] = useState(false);
  const [copied, setcopied] = useState(false);

  
    const clearAll = () => {
      setinpuText('');
      setresult(null);
    };

    const handleTextChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
      setinpuText(e.target.value);
      if (result) setresult(null);
    };

  const analayzeText = () => {
    if (inputText.trim().length < 50) {
      alert('Please enter at least 50 characters for acurate analysis');
      return;
    }

    setisAnalyzing(true);

    setTimeout(() => {
      const detector = new TextDetector();
      const DetectionResult = detector.detect(inputText);
      setresult(DetectionResult);
      setisAnalyzing(false);
    }, 500);
  };

  const copyResult = () => {
      if (!result) return;

      const resultText = `
      IsThisAI Detection Result
      ==========================
      status: ${result.isAI ? 'Likely AI-Generated' : 'Likely Human-Written'}
      Confidence: ${result.confidance}%

      detection Indicators:
      ${result.reason.map((r, i) => `${i + 1}. ${r}`).join('\n')}

      Analyzed Text:
      ${inputText.substring(0, 300)}${inputText.length > 300 ? '...' : ''}
      `.trim();

      navigator.clipboard.writeText(resultText).then(() => {
        setcopied(true);
        setTimeout(() => setcopied(false), 2000);
      });
  }

    return (
      <div style={{
      width: '450px',
      minHeight: '500px',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#1a1a1a',
          margin: '0 0 5px 0'
        }}>
          IsThisAI? 🦠
        </h1>
        <p style={{
          fontSize: '13px',
          color: '#666',
          margin: 0
        }}>
          AI-generated content detector
        </p>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: '600',
          color: '#333',
          marginBottom: '8px'
        }}>
          Paste text to analyze:
        </label>
        <textarea
          value={inputText}
          onChange={handleTextChange}
          placeholder="Paste the text you want to check here... (minimum 50 characters)"
          style={{
            width: '100%',
            height: '150px',
            padding: '12px',
            fontSize: '14px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            resize: 'vertical',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#4a90e2'}
          onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
        />
        <div style={{
          fontSize: '12px',
          color: inputText.length < 50 ? '#e74c3c' : '#27ae60',
          marginTop: '5px'
        }}>
          {inputText.length} / 50 characters (minimum)
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px'
      }}>
        <button
          onClick={analayzeText}
          disabled={isAnalyzing || inputText.length < 50}
          style={{
            flex: 1,
            padding: '12px',
            fontSize: '14px',
            fontWeight: '600',
            color: 'white',
            backgroundColor: isAnalyzing || inputText.length < 50 ? '#bbb' : '#4a90e2',
            border: 'none',
            borderRadius: '8px',
            cursor: isAnalyzing || inputText.length < 50 ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => {
            if (!isAnalyzing && inputText.length >= 50) {
              e.currentTarget.style.backgroundColor = '#357abd';
            }
          }}
          onMouseOut={(e) => {
            if (!isAnalyzing && inputText.length >= 50) {
              e.currentTarget.style.backgroundColor = '#4a90e2';
            }
          }}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Text'}
        </button>
        
        <button
          onClick={clearAll}
          style={{
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#666',
            backgroundColor: 'white',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = '#999';
            e.currentTarget.style.color = '#333';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = '#e0e0e0';
            e.currentTarget.style.color = '#666';
          }}
        >
          Clear
        </button>
      </div>

      {result && (
        <div style={{
          backgroundColor: 'white',
          border: '2px solid #e0e0e0',
          borderRadius: '12px',
          padding: '20px',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#1a1a1a',
            marginTop: 0,
            marginBottom: '15px'
          }}>
            Analysis Result
          </h3>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: result.isAI ? '#fee' : '#efe',
            border: `2px solid ${result.isAI ? '#e74c3c' : '#27ae60'}`,
            borderRadius: '8px',
            marginBottom: '15px'
          }}>
            <span style={{ fontSize: '20px' }}>
              {result.isAI ? '🤖' : '👤'}
            </span>
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '700',
                color: result.isAI ? '#c0392b' : '#229954'
              }}>
                {result.isAI ? 'Likely AI-Generated' : 'Likely Human-Written'}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#666',
                marginTop: '2px'
              }}>
                Confidence: {result.confidance}%
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#e0e0e0',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${result.confidance}%`,
                height: '100%',
                backgroundColor: result.isAI ? '#e74c3c' : '#27ae60',
                transition: 'width 0.5s ease-out'
              }} />
            </div>
          </div>

          {result.reason.length > 0 && (
            <div>
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px'
              }}>
                Detection Indicators:
              </div>
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                fontSize: '13px',
                color: '#555',
                lineHeight: '1.6'
              }}>
                {result.reason.map((reason, index) => (
                  <li key={index} style={{ marginBottom: '4px' }}>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div style={{
        marginTop: '20px',
        padding: '12px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffc107',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#856404'
      }}>
        <strong>⚠️ Note:</strong> This is a prototype detector. Results may not be 100% accurate. Use as a reference only.
      </div>
    </div>
  );
}

export default App;