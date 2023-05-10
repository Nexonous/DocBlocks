import express from 'express'
import Converter from './converter'

/**
 * Print usage function.
 */
function printUsage () {
  console.log('Usage: npm serve "path/to/configuration.json" "path/to/website"')
}

if (process.argv.length < 3) {
  console.log('Invalid server usage!')
  printUsage()
} else {
  const configuration = process.argv[2].replaceAll('\'', '').replace('"', '')
  if (configuration.toLowerCase().endsWith('.json')) {
    Converter.fromFile(configuration).then(() => {
      const website = process.argv[3].replaceAll('\'', '').replace('"', '')
      const application = express()
      application.use(express.static(website))
      application.listen(8080, () => { console.log('The test server is running on http://localhost:8080 (http://127.0.0.1:8080).') })
    })
  } else {
    console.log('Invalid argument type!')
    printUsage()
  }
}
