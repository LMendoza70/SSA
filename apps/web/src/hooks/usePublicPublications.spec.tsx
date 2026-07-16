import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  usePublicPublications,
  useFeaturedPublications,
  usePublicPublication,
  usePublicSearch,
} from './usePublicPublications';
import { api } from '../lib/api';

vi.mock('../lib/api', () => ({
  api: {
    get: vi.fn(),
  },
  setAccessToken: vi.fn(),
  getAccessToken: vi.fn(),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('usePublicPublications', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should fetch public publications list', async () => {
    const mockData = { data: [{ id: '1', title: 'Public' }], meta: { total: 1 } };
    (api.get as any).mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => usePublicPublications({ page: 1 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(api.get).toHaveBeenCalledWith('/public/publications', { params: { page: 1 } });
  });
});

describe('useFeaturedPublications', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should fetch featured publications', async () => {
    const mockData = [{ id: '1', title: 'Featured' }];
    (api.get as any).mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useFeaturedPublications(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(api.get).toHaveBeenCalledWith('/public/featured-publications');
  });
});

describe('usePublicPublication', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should fetch publication by slug', async () => {
    const mockData = { id: '1', publicSlug: 'test-article' };
    (api.get as any).mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => usePublicPublication('test-article'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(api.get).toHaveBeenCalledWith('/public/publications/test-article');
  });

  it('should not fetch when slug is empty', async () => {
    const { result } = renderHook(() => usePublicPublication(''), {
      wrapper: createWrapper(),
    });

    expect(result.current.isFetching).toBe(false);
  });
});

describe('usePublicSearch', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should search public publications', async () => {
    const mockData = { data: [{ id: '1' }], meta: { total: 1 } };
    (api.get as any).mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => usePublicSearch('salud', 1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(api.get).toHaveBeenCalledWith('/public/search', { params: { q: 'salud', page: 1 } });
  });

  it('should not search when query is empty', async () => {
    const { result } = renderHook(() => usePublicSearch('', 1), {
      wrapper: createWrapper(),
    });

    expect(result.current.isFetching).toBe(false);
  });
});
