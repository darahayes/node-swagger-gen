# swagger-ui-gen

[![CircleCI](https://circleci.com/gh/darahayes/node-swagger-gen.svg?style=svg)](https://circleci.com/gh/darahayes/node-swagger-gen)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Input your `swagger.json` and generate a static swagger UI. It's the official Swagger UI and you can host it anywhere you like.

## Usage

```
$ npm install -g swagger-gen

$ swagger-gen swagger.json
```

By default the site will be generated in `./swagger-dist` but you can specify a different destination with `-d`

```
swagger-gen -d my-swagger-site swagger.json
```

You can also pipe the swagger JSON into `swagger-gen` if you wish e.g.

```
curl http://petstore.swagger.io/v2/swagger.json | swagger-gen
```

## Demo

![gif-demo](http://g.recordit.co/ds1ku3bbus.gif)

## How does it work?

This module bundles up the [swagger-ui-dist](npm/im/static-swagger-dist) and makes a few tweaks in the `index.html` file to include the data from your `swagger.json` file.

## Acknowledgements

This project is kindly sponsored by [nearForm](http://nearform.com)

## License

MIT