# Documentation Builder

The conversion tool is called the `Generator` and is placed inside the `src/generator.ts` file. The `Generator` class takes in the output directory, index file, page not found file along with multiple inputs. These inputs can be git links or directories that contain the source but git links are not supported yet. For more information, please head on to [inputs](Inputs.md). The generator also uses template data, which are boilerplate code that is used to generate the HTML files. These contains the basic styling, assets and scripts.

The `npm run build` command will generate the HTML code and put everything inside the `public` directory, since it is used by the hosting provider to server the users. This can be changed later from the `src/index.ts` file later on if we're adding support for private documentations to which a user needs to log in to view.

In order to reduce unwanted name mangling, file paths with spaces (`' '`) gets replaced with a dash (`'-'`). This way a file with the original path of `example/a random file.md` gets formatted to `example/a-random-file.md`.
