import Generator from './generator'
import Input from './input'

/**
 * Configuration class.
 * This class contains the inputs and output directory of the incoming data.
 */
class Configuration {
  private output: string
  private inputs: Input[]

  constructor () {
    this.output = ''
    this.inputs = []
  }

  /**
   * Process all the inputs in the configuration.
   */
  public generate () {
    for (const input of this.inputs) {
      if (input.isDirectory()) {
        Generator.generateFromDirectory(input, this.output)
      } else {
        Generator.generateFromGit(input, this.output)
      }
    }
  }

  /**
   * Create the configuration object from JSON data.
   *
   * @param obj The JSON object.
   * @returns The created configuration object.
   */
  static fromJSON (obj: JSON): Configuration {
    const castedData = obj as unknown as Configuration

    const configuration = new Configuration()
    configuration.output = castedData.output
    for (const input of castedData.inputs) {
      let newInput = new Input()
      newInput = Object.assign(newInput, input)
      configuration.inputs.push(newInput)
    }

    return configuration
  }
}

export = Configuration
