import { Loader } from '@ghii/ghii';
import axios from 'axios';

export default function httpLoader(
  urlEndpoint: string,
  {
    headers,
    throwOnError = false,
    logger = (err, message) => console.log(message, err),
  }: {
    headers?: any;
    throwOnError?: boolean;
    logger?: (err: any, message: string) => void;
  } = {}
): Loader {
  return async function () {
    try {
      const { data } = await axios.get(urlEndpoint, { headers });
      return data as { [key: string]: unknown };
    } catch (err) {
      const msg = `${err?.response?.status || ''} GET ${urlEndpoint} : ${err?.message}`;
      logger(err, msg);
      if (throwOnError) throw new Error(msg);
      return {};
    }
  };
}
