# Styling Guide ✒️

The documentation tool generates HTML files with a rather simple styling scheme. For now the website only supports the dark theme and we might add a lighter theme later on. There are 4 main components in the website. The topbar, navigation panel, content area and the jump table.

1. Topbar.
    - This contains the Nexonous logo along with the home button and main links to the individual inputs (projects).
    - Other than the Nexonous logo, all the other links or clickable items gets highlighted when the user hovers over them using their mouse.
2. Navigation panel.
    - This contains a quick navigation between different topics in the same input (project).
    - The current webpage is highlighted in the navigation panel so the user can easily find where they are in.
3. Content area.
    - This is where all the generated HTMl content go to.
    - The `h2` tag results in an underline under it to separate different sections in the content.
    - Inline code (ie: `something like this`) gets highlighted in a different color and the text color is also different. Note that these do not have any syntax highlighting.
    - Block codes written using ` ``` ` gets syntax highlighting based on the language specified.
    - Links are highlighted in a different text and with an underline.
    - Important texts, such as ***this*** gets highlighted differently to bring it to attention of the user.
4. Jump table.
    - This is also a navigation panel which allows the users to quickly jump between important topics in the current page.
