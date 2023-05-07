import { readFileSync } from 'fs'
import Configuration from './configuration'

/**
 * Converter class.
 */
class Converter {
  /**
   * Converter function.
   * This function converts the incoming markdown files (defined in the configuration) and outputs them to the given directory.
   *
   * @param configuration The configuration json file.
   */
  static fromJSON (configuration: JSON) {
    const config = Configuration.fromJSON(configuration)
    config.generate()
  }

  /**
   * Converter function.
   * This function converts the incoming markdown files (defined in the configuration) and outputs them to the given directory.
   *
   * @param configuration The configuration file path.
   */
  static fromFile (configuration: string) {
    const config = Configuration.fromJSON(JSON.parse(readFileSync(configuration).toString()))
    config.generate()
  }
}

export = Converter
