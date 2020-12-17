import axios from 'axios';
import httpLoader from '../http-loader';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Ghii Http Loader', () => {
  it('export a function', () => {
    expect(typeof httpLoader).toBe('function');
  });

  describe('to create a loader', () => {
    it('create a file loader from yaml file', async () => {
      const httpCallLoader = httpLoader('http://localhost:3000/.wellknown');
      expect(typeof httpCallLoader).toBe('function');
    });

    it('attempt to make a call that fails silently', async () => {
      mockedAxios.get.mockRejectedValue({ response: { status: 404 }, message: 'test' });
      await httpLoader('http://localhost:3000/.wellknown')();
    });

    it('attempt to make a call that fails', async () => {
      mockedAxios.get.mockRejectedValue({ response: { status: 404 }, message: 'test' });
      try {
        await httpLoader('http://localhost:3000/.wellknown', { throwOnError: true })();
      } catch (err) {
        expect(err).toBeDefined();
        expect(err.message).toContain('test');
      }
    });

    it('attempt to call api resolved', async () => {
      mockedAxios.get.mockResolvedValue({ data: { test: 'value' } });
      const test = await httpLoader('http://localhost:3000/.wellknown')();
      expect(test).toStrictEqual({ test: 'value' });
    });
  });
});
