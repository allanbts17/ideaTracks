import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'idea.tracks.composer',
  appName: 'IdeaTracks',
  webDir: 'www/browser',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    StatusBar: {
      overlaysWebView: false
    }
  }
};

export default config;
