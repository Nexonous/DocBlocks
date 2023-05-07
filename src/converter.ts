import { readFileSync } from 'fs'
import Configuration from './objects/configuration'

/**
 * Converter function.
 * This function converts the incoming markdown files (defined in the configuration) and outputs them to the given directory.
 *
 * @param configuration The configuration json file.
 */
function converter (configuration: string) {
  const config = Configuration.fromJSON(JSON.parse(readFileSync(configuration).toString()))
  config.generate()
}

export = converter
