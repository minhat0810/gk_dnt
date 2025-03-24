  import { CameraResultType } from '@capacitor/camera';
import type { CapacitorConfig } from '@capacitor/cli';

  const config: CapacitorConfig = {
    appId: 'com.example.app',
    appName: 'Ứng dụng tính tuổi',
    webDir: 'build',
    plugins: {
      Camera: {
        allowEditing: true,
        saveToGallery: true,
        resultType: CameraResultType.Uri
      }
    }
  };

  export default config;
