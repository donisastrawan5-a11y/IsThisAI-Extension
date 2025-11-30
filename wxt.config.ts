import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: 'IsThisAI',
    description: 'Detect AI-generated content instantly. Perfect for educators, reaschers, and content verifiers.',
    version: '0.1.0',
    permissions: [
      'contextMenus',
      'activeTab',
      'scripting'
    ],
    host_permissions: [
      '<all_urls>'
    ],

    icons: {
      '16': 'assets/icons/48.png',
      '48': 'assets/icons/48.png',
      '128': 'assets/icons/128.png'
    },

    action: {
      default_icon: {
        '16': 'assets/icons/48.png',
        '48': 'assets/icons/48.png',
        '128': 'assets/icons/128.png'
      },
      default_title: 'IsThisAI?  - AI Content Detector',
      default_popup: 'entrypoints/popup/index.html'
    }
  },
  modules: ['@wxt-dev/module-react']
});
