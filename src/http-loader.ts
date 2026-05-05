import { Loader } from '@ghii/ghii';

type HttpLoaderOptions = {
  headers?: HeadersInit;
  throwOnError?: boolean;
  logger?: (err: unknown, message: string) => void;
};

class HttpLoaderError extends Error {
  constructor(message: string, readonly response?: Response) {
    super(message);
    this.name = 'HttpLoaderError';
  }
}

async function readResponse(response: Response): Promise<Record<string, unknown>> {
  const text = await response.text();

  if (!text.trim()) return {};

  const parsed = JSON.parse(text) as unknown;
  if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) {
    return parsed as Record<string, unknown>;
  }

  throw new Error('Response body must be a JSON object');
}

function getErrorMessage(err: unknown, urlEndpoint: string): string {
  if (err instanceof HttpLoaderError) return err.message;
  if (err instanceof Error) return `GET ${urlEndpoint} : ${err.message}`;

  return `GET ${urlEndpoint} : Unknown error`;
}

function createHeaders(headers?: HeadersInit): Headers {
  const requestHeaders = new Headers(headers);

  if (!requestHeaders.has('Accept')) {
    requestHeaders.set('Accept', 'application/json');
  }

  return requestHeaders;
}

export default function httpLoader(
  urlEndpoint: string,
  { headers, throwOnError = false, logger = (err, message) => console.log(message, err) }: HttpLoaderOptions = {}
): Loader {
  return async function () {
    try {
      const response = await fetch(urlEndpoint, { headers: createHeaders(headers) });

      if (!response.ok) {
        throw new HttpLoaderError(`${response.status} GET ${urlEndpoint} : ${response.statusText}`, response);
      }

      return await readResponse(response);
    } catch (err) {
      const msg = getErrorMessage(err, urlEndpoint);
      logger(err, msg);

      if (throwOnError) throw new Error(msg);
      return {};
    }
  };
}

export { httpLoader };
