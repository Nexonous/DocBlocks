import { readFileSync } from 'fs'
import Configuration from './configuration'
import path from 'path'

/**
 * Converter class.
 */
class Converter {
  /**
   * Converter function.
   * This function converts the incoming markdown files (defined in the configuration) and outputs them to the given directory.
   *
   * @param configuration The configuration json file.
   * @param configFilePath The configuration file path. Default is ''
   */
  static fromJSON (configuration: JSON, configFilePath: string = '') {
    const config = Configuration.fromJSON(configuration)
    config.configureRelativePath(configFilePath)
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
    config.configureRelativePath(path.parse(configuration).dir)
    config.generate()
  }
}

export = Converter
