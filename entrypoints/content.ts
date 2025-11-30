import { TextDetector } from '../utils/textDetector';

export default defineContentScript({
  matches: ['<all_urls>'],
  
  main() {
    console.log('IsThisAI content script loaded on:', window.location.href);


    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log('Content script received message:', message);
      
      if (message.action === 'analyzeText') {
        try {
          const detector = new TextDetector();
          const result = detector.detect(message.text);
          console.log('Detection result:', result);
          
          showResultModal(message.text, result);
          sendResponse({ success: true });
        } catch (error) {
          console.error('Error analyzing text:', error);
          sendResponse({ success: false, error: String(error) });
        }
      }
      
      return true;
    });

    function showResultModal(text: string, result: any) {
  
      const existing = document.getElementById('isthisai-modal');
      if (existing) existing.remove();

   
      const overlay = document.createElement('div');
      overlay.id = 'isthisai-modal';
      Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '2147483647', 
        fontFamily: 'system-ui, -apple-system, sans-serif',
      });

     
      const modal = document.createElement('div');
      Object.assign(modal.style, {
        background: 'white',
        borderRadius: '16px',
        padding: '30px',
        maxWidth: '500px',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
      });

      const truncatedText = text.length > 200 ? text.substring(0, 200) + '...' : text;

      modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 24px; font-weight: 700; color: #1a1a1a;">
            IsThisAI? 🦠
          </h2>
          <button id="isthisai-close" style="
            background: none;
            border: none;
            font-size: 32px;
            cursor: pointer;
            color: #666;
            line-height: 1;
            padding: 0;
            width: 40px;
            height: 40px;
          ">×</button>
        </div>

        <div style="
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          max-height: 120px;
          overflow-y: auto;
          font-size: 13px;
          color: #555;
          border: 1px solid #e0e0e0;
          line-height: 1.5;
        ">
          <strong style="color: #333;">Analyzed Text:</strong><br>
          ${truncatedText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
        </div>

        <div style="
          background: ${result.isAI ? '#fee' : '#efe'};
          border: 2px solid ${result.isAI ? '#e74c3c' : '#27ae60'};
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 15px;
        ">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <span style="font-size: 36px;">${result.isAI ? '🤖' : '👤'}</span>
            <div>
              <div style="font-size: 18px; font-weight: 700; color: ${result.isAI ? '#c0392b' : '#229954'};">
                ${result.isAI ? 'Likely AI-Generated' : 'Likely Human-Written'}
              </div>
              <div style="font-size: 13px; color: #666; margin-top: 4px;">
                Confidence: ${result.confidance}%
              </div>
            </div>
          </div>

          <div style="width: 100%; height: 10px; background: rgba(0,0,0,0.1); border-radius: 5px; overflow: hidden;">
            <div style="width: ${result.confidance}%; height: 100%; background: ${result.isAI ? '#e74c3c' : '#27ae60'};"></div>
          </div>
        </div>

        ${result.reason.length > 0 ? `
          <div style="margin-bottom: 20px;">
            <div style="font-size: 14px; font-weight: 600; color: #333; margin-bottom: 10px;">
              Detection Indicators:
            </div>
            <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #555; line-height: 1.7;">
              ${result.reason.map((r: string) => `<li>${r.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div style="
          background: #fff3cd;
          border: 1px solid #ffc107;
          border-radius: 8px;
          padding: 12px;
          font-size: 12px;
          color: #856404;
          margin-bottom: 15px;
        ">
          <strong>⚠️ Note:</strong> This is a prototype. Results may not be 100% accurate.
        </div>

        <button id="isthisai-open-popup" style="
          width: 100%;
          padding: 14px;
          background: #4a90e2;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        ">
          Open Full Extension
        </button>
      `;

      overlay.appendChild(modal);
      document.body.appendChild(overlay);

   
      const closeBtn = modal.querySelector('#isthisai-close');
      closeBtn?.addEventListener('click', () => overlay.remove());

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
      });

      const openBtn = modal.querySelector('#isthisai-open-popup');
      openBtn?.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'openPopup' });
        overlay.remove();
      });

      const escHandler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          overlay.remove();
          document.removeEventListener('keydown', escHandler);
        }
      };
      document.addEventListener('keydown', escHandler);
    }
  },
});