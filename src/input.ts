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
   * Create a new input from a directory.
   *
   * @param name The name of the input.
   * @param directory The input directory.
   * @returns The created input object.
   */
  static fromDirectory (name: string, directory: string) {
    const input = new Input()
    input.name = name
    input.directory = directory

    return input
  }

  /**
   * Check if the input is a directory.
   *
   * @returns true if the input is a directory.
   * @returns false if the input is a GIT link.
   */
  public isDirectory (): boolean { return this.directory.length > 0 }
}

export = Input
