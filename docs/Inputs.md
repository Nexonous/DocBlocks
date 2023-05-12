# Documentation Inputs ⚙️

The documentation inputs are objects that store information about the name of the input and source information. The source information varies depending on the input type and for now there are two main types,

1. Directory inputs.
    - These types of inputs load the Markdown files from local files and are converted and placed based on the folder structure they're placed in.
2. Git inputs.
    - These types of inputs load the Markdown files from a git link.
    - The files are downloaded from the web adn converted to HTML files and stored in the same folder structure they appear, just like directory inputs.
    - This feature is not supported in the current version of this tool.

The name of the input is used to determine the root directory of the output. Meaning that the name of the input will be the folder name to which we place all the generated HTML files in. For example, if the input name is given as `example` and the input directory is given as `markdown/content/`, then a file such as `markdown/content/index.md` will be placed in `example/index.md`. Any subdirectories in `markdown/content` will be copy pasted or recreated, for example a folder such as `markdown/content/assets` gets placed in `example/assets`.
