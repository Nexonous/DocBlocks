import express from 'express'

if (process.argv.length < 2) {
  console.log('Invalid server usage!')
  console.log('Usage: npm serve "path/to/website"')
} else {
  const application = express()
  application.use(express.static(process.argv[2]))
  application.listen(8080)
}
