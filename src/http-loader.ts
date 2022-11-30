import { Loader } from '@ghii/ghii';
import axios, { AxiosError } from 'axios';

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
      const axiosErr = err as AxiosError;
      const msg = `${axiosErr?.response?.status || ''} GET ${urlEndpoint} : ${axiosErr?.message}`;
      logger(err, msg);

      if (throwOnError) throw new Error(msg);
      return {};
    }
  };
}

export { httpLoader };
