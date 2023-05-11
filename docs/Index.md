# Documentation Tool

The documentation tool is used to convert Markdown files to HTML files that are statically rendered by the hosting provider. The generator is written in Node.js and comes with a server attached for debugging the code (both the generator, documentation source material and the template code).

## Basic Usage

This repository is based on [Node.js](https://nodejs.org/en) so make sure you have it installed in your machine. Afterwards just run `npm start` to convert all the Markdown files to HTML files and they will be placed in the `/public` directory. For testing, just run the `npm test` command which will host a server at <http://localhost:8080> (or <http://127.0.0.1:8080>).

## License

This repository is licensed under MIT.
