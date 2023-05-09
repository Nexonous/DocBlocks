# Template

Template is a directory that contains some files that are used by the generator to output HTML files. This directory mainly contains some HTML files, styling, assets and scripts that are used by the HTML files. DocBlocks provide a default template folder with default styling and assets and for anyone who is interested in making new templates can get started there.

The template directory should contain the following files (in the given structure).

- `template.html`: This file is used to store the converted HTML content.
- `assets/`: This folder contains all the global assets used by the HTML files.
- `scripts/`: This folder contains all the global scripts used by the HTML files.
- `styles/`: This folder contains all the global styles used by the HTML files.

The generator uses the following variables to insert data to the `template.html` file.

- `{content}`: This variable is replaced with the converted HTML content.
- `{title}`: Title of the page.
- `{navigation}`: The relative pages of the website.
- `{jump}`: The jump table containing quick access to all the headings.
- `{project}`: The project name.
- `{file}`: The file name (without the extension).

Note that in order to use the global scripts and assets, the links must start with a `'/'` (ie: `'/path/to/asset'`). Else the assets will be considered to be in a relative directory.
