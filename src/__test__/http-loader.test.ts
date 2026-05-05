import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import httpLoader from '../http-loader.js';

const fetchMock = jest.fn<typeof fetch>();

describe('Ghii Http Loader', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock;
  });

  it('export a function', () => {
    expect(typeof httpLoader).toBe('function');
  });

  describe('to create a loader', () => {
    it('create a file loader from yaml file', async () => {
      const httpCallLoader = httpLoader('http://localhost:3000/.wellknown');
      expect(typeof httpCallLoader).toBe('function');
    });

    it('attempt to make a call that fails silently', async () => {
      fetchMock.mockResolvedValue(new Response(JSON.stringify({ error: 'not found' }), { status: 404 }));
      await httpLoader('http://localhost:3000/.wellknown')();
    });

    it('attempt to make a call that fails', async () => {
      fetchMock.mockResolvedValue(new Response(JSON.stringify({ error: 'not found' }), { status: 404 }));
      try {
        await httpLoader('http://localhost:3000/.wellknown', { throwOnError: true })();
      } catch (err) {
        expect(err).toBeDefined();
        expect((err as Error).message).toContain('404 GET');
      }
    });

    it('attempt to make a call that fails 2', async () => {
      fetchMock.mockRejectedValue(undefined);
      try {
        await httpLoader('http://localhost:3000/.wellknown', { throwOnError: true })();
      } catch (err) {
        expect(err).toBeDefined();
        expect((err as Error).message).toContain('Unknown error');
      }
    });
    it('attempt to make a call that fails 3', async () => {
      fetchMock.mockRejectedValue(new Error('test'));
      try {
        await httpLoader('http://localhost:3000/.wellknown', { throwOnError: true })();
      } catch (err) {
        expect(err).toBeDefined();
        expect((err as Error).message).toContain('test');
      }
    });
    it('attempt to call api resolved', async () => {
      fetchMock.mockResolvedValue(new Response(JSON.stringify({ test: 'value' })));
      const test = await httpLoader('http://localhost:3000/.wellknown')();
      expect(test).toStrictEqual({ test: 'value' });
    });

    it('requests JSON by default', async () => {
      fetchMock.mockResolvedValue(new Response(JSON.stringify({ test: 'value' })));

      await httpLoader('http://localhost:3000/.wellknown')();

      const [, init] = fetchMock.mock.calls[0];
      expect(new Headers(init?.headers).get('Accept')).toBe('application/json');
    });

    it('allows custom accept header', async () => {
      fetchMock.mockResolvedValue(new Response(JSON.stringify({ test: 'value' })));

      await httpLoader('http://localhost:3000/.wellknown', {
        headers: {
          Accept: 'application/vnd.api+json',
        },
      })();

      const [, init] = fetchMock.mock.calls[0];
      expect(new Headers(init?.headers).get('Accept')).toBe('application/vnd.api+json');
    });

    it('returns an empty object from an empty response body', async () => {
      fetchMock.mockResolvedValue(new Response(''));
      const test = await httpLoader('http://localhost:3000/.wellknown')();
      expect(test).toStrictEqual({});
    });

    it('fails when response body is not a JSON object', async () => {
      fetchMock.mockResolvedValue(new Response(JSON.stringify(['test'])));
      const logger = jest.fn();

      const test = await httpLoader('http://localhost:3000/.wellknown', { logger })();

      expect(test).toStrictEqual({});
      expect(logger).toHaveBeenCalledWith(expect.any(Error), expect.stringContaining('JSON object'));
    });
  });
});
