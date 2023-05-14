import Version from './version'

/**
 * Input class.
 * This class information regarding a single documentation input.
 */
class Input {
  public name: string
  public versions: Version[]

  /**
   * Constructor.
   *
   * @param name The name of the input.
   */
  constructor (name: string) {
    this.name = name
    this.versions = []
  }

  /**
   * Add a new version to the input.
   *
   * @param version The new version to add.
   * @returns The input reference.
   */
  public addVersion (version: Version) {
    this.versions.push(version)
    return this
  }
}

export = Input
