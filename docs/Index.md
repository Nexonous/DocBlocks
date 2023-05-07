# DocBlocks

DocBlocks is a documentation tool that converts Markdown files to HTML files that can be hosted in a server. It comes with a default theme and it can be customized using the configuration JSON file.

## Usage

This repository is based on [Node.js](https://nodejs.org/en). So make sure you have it installed in your machine.

After installing Node.js, using this tool is fairly straight forward. For any project, start by cloning or adding this repository as a submodule. For this example, let's say it's stored in `/DocBlocks`. The project requires a JSON file knows as the 'configuration'. This contain all the required information to convert the Markdown files to HTML. For this example let's use the following file.

```json
{
  "output": "/public",
  "inputs": [
    {
      "directory": "/docs"
    }
  ]
}
```

Here, this file instructs the tool to convert all the Markdown files form the `/docs` directory and place them in the `/public` directory. Once this JSON file is ready, initialize the repository using `npm` and start the process!

```sh
npm install
npm start 'path/to/<configuration file>.json'
```

For more information about the configuration JSON file, please read the [Configuration](Configuration.md) documentation.

## License

This repository is licensed under MIT.
