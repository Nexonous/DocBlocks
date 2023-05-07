/**
 * Input class.
 * This class information regarding a single documentation input.
 */
class Input {
  public name: string
  public directory: string
  public git: string
  public auth: string

  constructor () {
    this.name = ''
    this.directory = ''
    this.git = ''
    this.auth = ''
  }

  /**
   * Check if the input is a directory.
   *
   * @returns true if the input is a directory.
   * @returns false if the input is a GIT link.
   */
  isDirectory (): boolean { return this.directory.length > 0 }
}

export = Input
