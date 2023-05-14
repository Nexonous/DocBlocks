# Updating Documentation 🔁

The documentation system is self contained, meaning that once any other project is added as a submodule, the documentation system will automatically update to the latest version if any new version is available. It'll automatically update the latest version of the submodule and create a copy of the previous version and store it locally. But the documentation system requires a certain set of requirements to be met in order for smooth operation.

## Versioning 🛫

The documentation system uses a basic versioning system which is based on the date and time a new version is released. This versioning scheme contains a major, minor, patch along with a build number. These are generated using the following format.

1. Major version: Year
2. Minor version: Month number (00 - 12)
3. Patch version: Day number (00 - 31)
4. Build number: Hour (00 - 23), Minute (00 - 59), Seconds (00 - 59)

These 4 components are combined as follows: v\[Year].\[Month].\[Day].\[Build]. But since a name like that cannot be easily used as a directory, the dots (`'.'`) are converted to dashes (`'-'`) and then used. For example, for a build released at 6:30 PM on 6th May 2023, the version would be `v2023.05.06.183000`. This version gets converted to `v2023-05-06-183000` when converting to directories.

But that's not the only requirement by submodules. Each repository should maintain a read-only branch that contains the versions in the following format: `version/<version number>`. If we take in the previous version as an example, the branches should look like this: `version/v2023-05-06-183000`. This is required by the update script to update the submodule to the new version and for the documentation to keep track of previous versions of the application.

We will provide an automation workflow to make this process smoother but for now you need to do this manually 😉

## Automatic Submodule Update System 🤖

Keeping track of previous versions and updating the latest version is done by first getting the existing version of the submodule and updating the submodule right after. Then we compare the new version and the previous version of the repository and if the update results in a new version, the repository is added back as a submodule but will be placed in the folder with the version number as mentioned earlier. This is where the branches come to play. Once the submodule is added we checkout to the required version and the documentation of that version is used thereafter.

When the submodules are updated, a new branch is created on the documentation repository. The branch will have the following format: `updates/<version number>`. The version number there is calculated like mentioned above. This branch is then used to open a pull request with all the updates. A maintainer or an authorized individual will review the PR and will add the required changes before merging it to the release branch. Note that this process happens at 3:15 AM every Monday.
