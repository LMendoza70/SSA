import { describe, it, expect, beforeEach } from 'vitest';
import { api, setAccessToken, getAccessToken } from './api';

describe('API lib', () => {
  beforeEach(() => {
    setAccessToken(null);
  });

  it('should have correct base URL', () => {
    expect(api.defaults.baseURL).toBe('/api/v1');
    expect(api.defaults.withCredentials).toBe(true);
  });

  it('should store and retrieve access token', () => {
    expect(getAccessToken()).toBeNull();
    setAccessToken('test-token');
    expect(getAccessToken()).toBe('test-token');
  });

  it('should add Authorization header when token is set', async () => {
    setAccessToken('bearer-token');
    const interceptor = api.interceptors.request as any;
    const handler = interceptor.handlers?.find(
      (h: any) => h.fulfilled && h.fulfilled.name !== 'default',
    );
    const config = { headers: { Authorization: undefined } };
    const result = handler ? handler.fulfilled(config) : config;
    expect(result.headers.Authorization).toBe('Bearer bearer-token');
  });

  it('should clear token on setAccessToken(null)', () => {
    setAccessToken('some-token');
    setAccessToken(null);
    expect(getAccessToken()).toBeNull();
  });
});
