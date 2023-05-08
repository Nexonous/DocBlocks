# Testing

The repository provides a testing server along with a testing directory which contains all the testing tools necessary. Run the following commands to generate the output and serve them locally using a localhost server.

```sh
npm start 'testing/docblocks.json'
npm run serve 'out/public'
```

Afterwards just open up the following link: <http://localhost:8080>

Note that the server requires the `'out/public'` argument, which is basically where all the generated HTML files are placed in. In your case this might be different if a custom configuration JSON file is used.
