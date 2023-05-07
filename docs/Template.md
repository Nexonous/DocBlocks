# Template

Template is a directory that contains some files that are used by the generator to output HTML files. This directory mainly contains some HTML files, styling, assets and scripts that are used by the HTML files. DocBlocks provide a default template folder with default styling and assets and for anyone who is interested in making new templates can get started there.

The template directory should contain the following files (in the given structure).

- `template.html`: This file is used to store the converted HTML content. The generator uses 3 variables.
  - `{content}`: This variable is replaced with the converted HTML content.
  - `{title}`: Title of the page.
  - `{relatives}`: The relative pages of the input.
