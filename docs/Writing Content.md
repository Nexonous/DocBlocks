# Writing Content

Writing content that is recognizable by the parser is essential when writing documentation that is to be presented using this tool. Basically we use Markdown files since it's super easy to use and is supported by almost all the major version control systems. Since we're using GitHub, it's way easier for us to see them in action when needed. But the markdown generator we use has a couple of things we need to setup before we move forward.

1. Index files in a directory will be given a special entry in navigation.
    - Index files (`index.md`) are attached to the directory name in the navigation panel. This means that the user can visit this file by clicking on the folder name.
    - To reduce confusion with other directories which doesn't have index files, the navigation panel underlines all linked folders so the user can easily figure out what are index files and what are not.
2. Nested lists need 4 spaces.
    - Nested lists, such as this one, needs 4 spaces in order for the generator to properly output the nested list tags.
3. You don't really need a table-of-contents.
    - This tool automatically generated a side navigation panel which shows all the important links that the user can quickly go to in the page that their viewing.
    - Using a table-of-contents is fine and is supported but it's not a must to easily navigate through the documentation page.
4. Don't hesitate to add emojis 😌
    - The parser supports emojis and they work as expected so don't shy away form using them!
    - Just make sure whatever the emojis you use aren't offensive (for obvious reasons).
