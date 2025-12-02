import { use, useState } from "react";
import { useEffect } from 'react';
import { TextDetector } from "@/utils/textDetector";
import { imageDetector } from "@/utils/imageDetector";
import { DetectionResult } from "@/types";
import React from "react";

function App() {
  const [inputText, setinpuText] = useState("");
  const [result, setresult] = useState<DetectionResult | null>(null);
  const [isAnalyzing, setisAnalyzing] = useState(false);
  const [copied, setcopied] = useState(false);

  const [showExperimental, setShowExperimental] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'text' | 'image'>('text');

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

  const analyzeImage = async () => {
    if(!selectedFile) {
      alert('Please select an Image file');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('Please select an image smaller than 10MB');
      return;
    }

    setisAnalyzing(true);

    try {
      const detector = new imageDetector();
      const detectionResult = await detector.detecFromFile(selectedFile);
      setresult(detectionResult);
    } catch (error) {
      alert('Error analyzing image: ' + String(error));
    } finally {
      setisAnalyzing(false);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (mode === 'text' && inputText.length >= 50) {
          analayzeText();
        } else if (mode === 'image' && selectedFile) {
          analyzeImage();
        }
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        clearAll();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [mode, inputText, selectedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an Image file');
        return;
      }
      setSelectedFile(file);
      setresult(null);
    }
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
          fontSize: '28px',
          fontWeight: '700',
          color: '#1a1a1a',
          margin: '0 0 5px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          IsThisAI? 🦠
        </h1>
        <p style={{
          fontSize: '13px',
          color: '#666',
          margin: '0 0 5px 0'
        }}>
          AI-generated content detector
        </p>
        <p style={{
          fontSize: '11px',
          color: '#999',
          margin: 0,
          fontStyle: 'italic'
        }}>
          Beta v0.1
        </p>
      </div>


      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '15px',
        borderBottom: '2px solid #e0e0e0'
      }}>
        <button
          onClick={() => {
            setMode('text');
            setresult(null);
          }}
          style={{
            flex: 1,
            padding: '10px',
            fontSize: '14px',
            fontWeight: '600',
            color: mode === 'text' ? '#4a90e2' : '#666',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: mode === 'text' ? '3px solid #4a90e2' : 'none',
            cursor: 'pointer',
            marginBottom: '-2px'
          }}
        >
          📝 Text Analysis
        </button>
        
        <button
          onClick={() => {
            setMode('image');
            setresult(null);
            if (!showExperimental) {
              setShowExperimental(true);
            }
          }}
          style={{
            flex: 1,
            padding: '10px',
            fontSize: '14px',
            fontWeight: '600',
            color: mode === 'image' ? '#4a90e2' : '#666',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: mode === 'image' ? '3px solid #4a90e2' : 'none',
            cursor: 'pointer',
            marginBottom: '-2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px'
          }}
        >
          🖼️ Image Analysis
          <span style={{
            fontSize: '10px',
            backgroundColor: '#ff9800',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '4px',
            fontWeight: '700'
          }}>
            BETA
          </span>
        </button>
      </div>


      {mode === 'text' && (
        <>
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
              placeholder="Paste text here (minimum 50 characters)..."
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
              {inputText.length} / 50 characters minimum
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
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
                cursor: isAnalyzing || inputText.length < 50 ? 'not-allowed' : 'pointer'
              }}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Text'}
            </button>
            
            <button onClick={clearAll} style={{
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#666',
              backgroundColor: 'white',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              Clear
            </button>
          </div>
        </>
      )}


      {mode === 'image' && (
        <>

          <div style={{
            backgroundColor: '#fff3cd',
            border: '2px solid #ff9800',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '15px',
            fontSize: '12px',
            color: '#856404'
          }}>
            <strong>🧪 Experimental Feature</strong><br />
            Image detection is in early beta. Results are based on metadata and file properties, not visual content analysis.
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '8px'
            }}>
              Upload image to analyze:
            </label>
            
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                border: '2px dashed #e0e0e0',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: 'white'
              }}
            />
            
            {selectedFile && (
              <div style={{
                marginTop: '10px',
                padding: '10px',
                backgroundColor: '#e8f4f8',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#333'
              }}>
                <strong>Selected:</strong> {selectedFile.name}<br />
                <strong>Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button
              onClick={analyzeImage}
              disabled={isAnalyzing || !selectedFile}
              style={{
                flex: 1,
                padding: '12px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'white',
                backgroundColor: isAnalyzing || !selectedFile ? '#bbb' : '#4a90e2',
                border: 'none',
                borderRadius: '8px',
                cursor: isAnalyzing || !selectedFile ? 'not-allowed' : 'pointer'
              }}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
            </button>
            
            <button onClick={clearAll} style={{
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#666',
              backgroundColor: 'white',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              Clear
            </button>
          </div>
        </>
      )}

      {isAnalyzing && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              fontSize: '40px',
              marginBottom: '15px',
              animation: 'spin 1s linear infinite'
            }}>
              🦠
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#333'
            }}>
              Analyzing {mode}...
            </div>
            <div style={{
              fontSize: '12px',
              color: '#666',
              marginTop: '5px'
            }}>
              This may take a few seconds
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {result && (
        <div style={{
          backgroundColor: 'white',
          border: '2px solid #e0e0e0',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#1a1a1a',
              margin: 0
            }}>
              Analysis Result
            </h3>
            
            <button
              onClick={copyResult}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: '600',
                color: copied ? '#27ae60' : '#4a90e2',
                backgroundColor: 'transparent',
                border: `2px solid ${copied ? '#27ae60' : '#4a90e2'}`,
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
          </div>

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
              {result.isAI ? '🤖' : (mode === 'text' ? '👤' : '📷')}
            </span>
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '700',
                color: result.isAI ? '#c0392b' : '#229954'
              }}>
                {result.isAI ? 'Likely AI-Generated' : `Likely Human-${mode === 'text' ? 'Written' : 'Created'}`}
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
          backgroundColor: '#e8f4f8',
          border: '1px solid #4a90e2',
          borderRadius: '8px',
          fontSize: '11px',
          color: '#1565c0',
          lineHeight: '1.7'
      }}>
        <div><strong>💡 Tips:</strong></div>
        <div>• Right-click selected text → "Check with IsThisAI"</div>
        <div>• Press <kbd style={{
           backgroundColor: '#fff',
           padding: '2px 6px',
           borderRadius: '3px',
           border: '1px solid #ccc',
           fontSize: '10px'
        }}>Ctrl+Enter</kbd> to analyze</div>
         <div>• Press <kbd style={{
           backgroundColor: '#fff',
           padding: '2px 6px',
           borderRadius: '3px',
           border: '1px solid #ccc',
           fontSize: '10px'
        }}>Ctrl+K</kbd> to Clear</div>
        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
          <strong>⚠️ Beta Notice:</strong>  Results are guidance, not definitive proof. Image detection is experimental.
        </div>
      </div>
    </div>
  );
}

export default App;