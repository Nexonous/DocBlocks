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
} else if (process.argv[2].toLowerCase().endsWith('.json')) {
  Converter.fromFile(process.argv[2])
} else {
  console.log('Invalid argument type!')
  printUsage()
}
