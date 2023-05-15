import express from 'express'
import Generator from './generator'
import Input from './input'
import Version from './version'

const generator = new Generator('private', 'content/Index.md', 'content/Not Found.md', [
  new Input('Project A').addVersion(Version.fromDirectory('testing/Project A')),
  new Input('Project B').addVersion(Version.fromDirectory('testing/Project B')),
  new Input('Documentation Tool').addVersion(Version.fromDirectory('docs')).addVersion(Version.fromDirectory('docs', 'v1.0')),
  new Input('Peregrine')
    .addVersion(Version.fromDirectory('content/Peregrine/latest/docs'))
    .addVersion(Version.fromDirectory('content/Peregrine/v2023-05-14-173907/docs', 'v2023.05.14.173907'))
])

generator.generate().then(() => {
  const application = express()
  application.use(express.static('private'))
  application.use((_request, response) => { response.status(404).redirect('/404.html') })
  application.listen(8080, () => { console.log('The test server is running on http://localhost:8080 (http://127.0.0.1:8080).') })
  // application.listen(8080, '192.168.1.2', () => { console.log('The test server is running on http://192.168.1.2:8080.') })
})
