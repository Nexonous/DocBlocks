import subprocess
import os

updated = False


def get_version(submodule: str) -> str:
    """
    Get the version of the latest commit to a submodule.

    :param: submodule The submodule to get the version of.
    """
    return subprocess.check_output(['git', 'log', '-1', '--format=%cd', '--date=format:v%Y-%m-%d-%H%M%S'], cwd=submodule).decode().replace('\n', '')


def process_submodule(submodule: str, repository: str) -> None:
    """
    Process a single submodule.
    This will check if a submodule has an update and if it does, will migrate the old version to a new directory and update the latest reference.

    :param: submodule The submodule to get the version of.
    """

    latest_submodule = os.path.join(submodule, 'latest')
    previous_version = get_version(latest_submodule)
    print('Previous version of', latest_submodule, 'is', previous_version)
    subprocess.call(['git', 'submodule', 'update',
                    '--remote', latest_submodule])
    current_version = get_version(latest_submodule)
    print('Current version of', latest_submodule, 'is', current_version)

    if previous_version != current_version:
        global updated
        updated = True

        new_directory = os.path.join(
            submodule, previous_version)
        print('Creating new submodule at', new_directory,
              'and switching branches to', 'version/' + previous_version)
        subprocess.call(['git', 'submodule', 'add', '--force', repository,
                        new_directory])
        subprocess.call(['git', 'checkout', 'version/' +
                        previous_version], cwd=new_directory)


if __name__ == '__main__':
    # Check for updates and perform the update if necessary.
    process_submodule('content/Peregrine',
                      'https://github.com/Nexonous/Peregrine')

    if updated:
        subprocess.call(['export', 'UPDATED="Submodules Updated"'])
