import path from 'path'
import Generator from './generator'
import Input from './input'

/**
 * Configuration class.
 * This class contains the inputs and output directory of the incoming data.
 */
class Configuration {
  private project: string
  private template: string
  private output: string
  private index: string
  private inputs: Input[]

  constructor () {
    this.project = ''
    this.template = 'template'
    this.output = ''
    this.index = 'README.md'
    this.inputs = []
  }

  /**
   * Process all the inputs in the configuration.
   */
  public generate () {
    const generator = new Generator(this.project, this.template, this.output, this.index, this.inputs)
    generator.generate()
  }

  /**
   * Configure all the inputs, template, index and output using the relative path.
   *
   * @param relative The relative path of the configuration file.
   */
  public configureRelativePath (relative: string) {
    this.template = path.join(relative, this.template)
    this.output = path.join(relative, this.output)
    this.index = path.join(relative, this.index)

    for (const input of this.inputs) {
      if (input.isDirectory()) {
        input.directory = path.join(relative, input.directory)
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
    if (castedData.project != null) { configuration.project = castedData.project }
    if (castedData.template != null) { configuration.template = castedData.template }
    if (castedData.output != null) { configuration.output = castedData.output }
    if (castedData.index != null) { configuration.index = castedData.index }

    for (const input of castedData.inputs) {
      let newInput = new Input()
      newInput = Object.assign(newInput, input)
      configuration.inputs.push(newInput)
    }

    return configuration
  }
}

export = Configuration
