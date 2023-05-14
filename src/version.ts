/**
 * Version class.
 * This class stores information about a single version of an input.
 */
class Version {
  public version: string
  public directory: string
  public git: string
  public auth: string

  /**
   * Default constructor.
   */
  constructor () {
    this.directory = ''
    this.git = ''
    this.auth = ''
    this.version = 'latest'
  }

  /**
   * Create a new version from a directory.
   *
   * @param directory The input directory.
   * @param version The version of the input. Default is 'latest'
   * @returns The created version object.
   */
  static fromDirectory (directory: string, version: string = 'latest') {
    const v = new Version()
    v.directory = directory
    v.version = version

    return v
  }

  /**
   * Check if the input is a directory.
   *
   * @returns true if the input is a directory.
   * @returns false if the input is a GIT link.
   */
  public isDirectory (): boolean { return this.directory.length > 0 }
}

export = Version
