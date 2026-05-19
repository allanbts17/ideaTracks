import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'idea.tracks.composer',
  appName: 'IdeaTracks',
  webDir: 'www/browser',
  server: {
    androidScheme: 'https'
  }
};

export default config;
