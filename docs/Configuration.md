# Configuration file

The configuration file is a JSON object which contains mandatory and additional information that is needed when generating the HTML files.

1. `"project"`: This is the project title and is used in the main index HTML file's title and other places.
2. `"template"`: This is the directory with default template files are used by the generator to output the HTML files. Look into [template](Template.md) for more information.
3. `"output"`: This is a string and contains the output directory to store the generated HTML files in.
4. `"index"`: This is the main index file with all the necessary information to be shown in the index HTML file.
5. `"inputs"`: This is an array of objects that contains the input data. The input data are of two types.
   1. Directory input.
      - This contains a directory where all the Markdown files will be recursively converted and stored in the output directory.
      - The `"directory"` key is required.
      - An optional `"name"` can be given which will be used as a subdirectory in the output directory.
   2. Git input.
      - Git inputs are git links that are used to recursively download its contents and converted.
      - The `"git"` key is required and it contains the git directory link to recursively get the data from.
      - The `"auth"` key is required which is the access token used to get all the content from.
      - An optional `"name"` can be given which will be used as a subdirectory in the output directory.
  
## Example configuration file

```json
{
  "output": "public",
  "inputs": [
    {
      "directory": "docs"
    },
    {
      "git": "https://github.com/markedjs/marked/tree/master/docs",
      "auth": "personal-authentication-token-for-github"
    }
  ]
}
```