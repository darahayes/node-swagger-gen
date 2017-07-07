# swagger-ui-gen

Input your `swagger.json` and generate a static swagger UI.

```
npm install -g swagger-gen

swagger-gen swagger.json
```

This results in a static version of the official swagger UI. You can host it anywhere you like.

## How does it work?

This module bundles up the [swagger-ui-dist](npm/im/static-swagger-dist) and makes a few tweaks in the `index.html` file to include the data from your `swagger.json` file.