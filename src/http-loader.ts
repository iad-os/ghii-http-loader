import { Loader } from '@ghii/ghii';
import axios from 'axios';

export default function httpLoader(urlEndpoint: string, headers?: any): Loader {
  return async function () {
    try {
      const { data } = await axios.get(urlEndpoint, {headers});
      return data as { [key: string]: unknown };
    } catch (err) {
      throw new Error(`Call in error: ${err.message}`);
    }
  };
}
