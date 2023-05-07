import Input from './input'

/**
 * Configuration class.
 * This class contains the inputs and output directory of the incoming data.
 */
class Configuration {
  output: string
  inputs: Input[]

  constructor () {
    this.output = ''
    this.inputs = []
  }
}

export = Configuration
