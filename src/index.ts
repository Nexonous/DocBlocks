import { exit } from 'process'
import Converter from './converter'

/**
 * Print usage function.
 */
const printUsage = () => {
  console.log('Usage: npm start <configuration>.json')
}

// Validate the incoming arguments.
if (process.argv.length < 2) {
  console.log('Invalid number of arguments!')
  printUsage()
  exit()
}

const processedArgument = process.argv[2].replaceAll('\'', '').replace('"', '')
if (processedArgument.toLowerCase().endsWith('.json')) {
  Converter.fromFile(processedArgument)
} else {
  console.log('Invalid argument type!')
  printUsage()
}
