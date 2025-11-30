export default defineBackground(() => {
  console.log('IsThisAI background script loaded');

  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: 'check-with-isthisai',
      title: 'Check with IsThisAI 🦠',
      contexts: ['selection']
    });
    console.log('Context menu created');
  });

    chrome.contextMenus.onClicked.addListener((info, tab) => {
      console.log('Context menu clicked', info);

      if (info.menuItemId == 'check-with-isthisai' && info.selectionText) {
        if(!tab?.id) {
          console.error('No tab ID available');
          return;
        }

        const tabId = tab.id;

        chrome.tabs.sendMessage(tabId, {
          action: 'analyzeText',
          text: info.selectionText
        }).catch (err => {
          console.error('Failed to send Message:', err);

          chrome.scripting.executeScript({
            target: {tabId: tabId},
            files: ['entrypoints\content.ts']
          }).then(() => {
            chrome.tabs.sendMessage(tabId, {
              action: 'analyzeText',
              text: info.selectionText
            });
          }).catch (injectErr => {
            console.error('Failed to inject script:', injectErr);
          });
        });
      }
    });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action == 'openPopup') {
        chrome.action.openPopup();
        sendResponse({ cuccess: true })
      }
      return true;
    });
});