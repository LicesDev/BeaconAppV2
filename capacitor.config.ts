import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'BeaconApp',
  webDir: 'www',
  plugins: {
    BackgroundTask: {
      // Aquí puedes agregar configuraciones específicas del plugin si es necesario
    }
  }
};

export default config;
