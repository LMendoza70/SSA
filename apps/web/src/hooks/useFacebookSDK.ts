import { useCallback, useRef } from 'react';

declare global {
  interface Window {
    FB?: {
      init: (params: { appId: string; version: string; cookie?: boolean; xfbml?: boolean }) => void;
      login: (
        cb: (response: { authResponse?: { accessToken: string; userID: string; expiresIn: number }; status?: string }) => void,
        params?: { scope: string },
      ) => void;
      getLoginStatus: (cb: (response: { status: string; authResponse?: { accessToken: string } }) => void) => void;
    };
    fbAsyncInit?: () => void;
  }
}

export function useFacebookSDK() {
  const statusRef = useRef<'idle' | 'loading' | 'ready' | 'error'>('idle');

  const initSDK = useCallback((appId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (statusRef.current === 'ready' && window.FB) {
        resolve();
        return;
      }
      if (statusRef.current === 'loading') {
        return;
      }
      statusRef.current = 'loading';

      if (window.FB) {
        window.FB.init({ appId, version: 'v22.0', cookie: true });
        statusRef.current = 'ready';
        resolve();
        return;
      }

      window.fbAsyncInit = () => {
        window.FB!.init({ appId, version: 'v22.0', cookie: true });
        statusRef.current = 'ready';
        resolve();
      };

      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      script.onload = () => {};
      script.onerror = () => {
        statusRef.current = 'error';
        reject(new Error('No se pudo cargar el SDK de Facebook. Revisa tu conexión.'));
      };
      document.body.appendChild(script);
    });
  }, []);

  const login = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!window.FB) {
        reject(new Error('SDK de Facebook no está cargado'));
        return;
      }
      window.FB.login(
        (response) => {
          if (response.authResponse?.accessToken) {
            resolve(response.authResponse.accessToken);
          } else {
            reject(new Error('Login con Facebook cancelado o falló.'));
          }
        },
        {
          scope: 'pages_manage_posts,pages_read_engagement,pages_manage_metadata,instagram_basic,instagram_content_publish',
        },
      );
    });
  }, []);

  return { initSDK, login, isReady: () => statusRef.current === 'ready' };
}
