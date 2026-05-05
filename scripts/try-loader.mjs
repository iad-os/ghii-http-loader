import httpLoader from '../dist/lib/http-loader.js';

const url =
  process.argv[2] ||
  process.env.HTTP_LOADER_URL ||
  'http://localhost:40009/well-known/mother-audits-dashboard';

const logger = (err, message) => {
  console.error(message);

  if (err?.cause) {
    console.error(err.cause);
  }
};

try {
  const data = await httpLoader(url, {
    throwOnError: true,
    logger,
  })();

  console.log(JSON.stringify(data, null, 2));
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
}
