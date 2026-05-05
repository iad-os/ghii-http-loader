# GHII - HTTP LOADER

Http loader is a [ghii](https://github.com/iad-os/ghii) loader. It is used to load the configurations of a nodejs application by calling an endpoint which returns a json with the configurations to be injected into the application.

## How to install:

```sh
npm install @ghii/http-loader
```

Configuration in yaml:

```yaml
env: development
app:
  version: "0.0.1"
  name: "ghii-test"

```

in JSON:

```json
{
  "env": "development",
  "app": {
    "version": "0.0.1",
    "name": "ghii-test"
  }
}
```

## Usage example:

```TypeScript
import ghii from "@ghii/ghii";
import httpLoader from "@ghii/http-loader";

const options = ghii((T) =>
  T.Object({
    env: T.Union([T.Literal("development"), T.Literal("production")], {
      default: "development",
    }),
    app: T.Object(
      {
        name: T.String({ default: "test" }),
        version: T.String(),
      },
      { additionalProperties: false, default: {} }
    ),
  })
).loader(
  //example url http://localhost:4000/.wellknown.json
  httpLoader(process.env.WELLKNOWN_URL!, {
    throwOnError:  process.env.NODE_ENV !== 'development', //silent mode
    logger: (err, msg) => {
      if (err) {
        customLogger.error(err, msg);
      } else {
        customLogger.debug(msg);
      }
    },
  })
);

export default options;
```

## Related

- [ghii](https://github.com/iad-os/ghii)
- [ghii-yaml-loader](https://github.com/iad-os/ghii-yaml-loader)
- [ghii-envs-loader](https://github.com/iad-os/ghii-envs-loader)
- [ghii-package- json-loader](https://github.com/iad-os/ghii-package-json-loader)
