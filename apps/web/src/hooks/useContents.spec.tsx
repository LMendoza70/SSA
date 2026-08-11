import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { useContents, useContent, useCreateContent, useDeleteContent } from './useContents';
import { api } from '../lib/api';

vi.mock('../lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
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

describe('useContents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch contents list', async () => {
    const mockData = {
      data: [{ id: '1', title: 'Test' }],
      meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
    };
    (api.get as any).mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useContents({ page: 1, limit: 20 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
    expect(api.get).toHaveBeenCalledWith('/admin/contents', { params: { page: 1, limit: 20 } });
  });

  it('should fetch single content by id', async () => {
    const mockContent = { id: '1', title: 'Test Content' };
    (api.get as any).mockResolvedValue({ data: mockContent });

    const { result } = renderHook(() => useContent('1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockContent);
    expect(api.get).toHaveBeenCalledWith('/admin/contents/1');
  });

  it('should not fetch content when id is empty', async () => {
    const { result } = renderHook(() => useContent(''), {
      wrapper: createWrapper(),
    });

    expect(result.current.isFetching).toBe(false);
  });
});

describe('useCreateContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call POST to create content', async () => {
    const newContent = { title: 'New', contentTypeId: 'ct-1' };
    (api.post as any).mockResolvedValue({ data: { id: 'new-id', ...newContent } });

    const { result } = renderHook(() => useCreateContent(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(newContent);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.post).toHaveBeenCalledWith('/admin/contents', newContent);
  });
});

describe('useDeleteContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call DELETE to remove content', async () => {
    (api.delete as any).mockResolvedValue({ data: { message: 'Eliminado' } });

    const { result } = renderHook(() => useDeleteContent(), {
      wrapper: createWrapper(),
    });

    result.current.mutate('content-1');
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.delete).toHaveBeenCalledWith('/admin/contents/content-1');
  });
});
