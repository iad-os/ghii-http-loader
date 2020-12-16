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

    it('attempt to make a call that fails', async () => {
      mockedAxios.get.mockRejectedValue(new Error());
      try {
        const test = await httpLoader('http://localhost:3000/.wellknown')();
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it('attempt to call api resolved', async () => {
      mockedAxios.get.mockResolvedValue({ data: { test: 'value' } });
      const test = await httpLoader('http://localhost:3000/.wellknown')();
      expect(test).toStrictEqual({ test: 'value' });
    });
  });
});
