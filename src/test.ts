import express from 'express'
import Generator from './generator'
import Input from './input'

const generator = new Generator('public', 'content/Index.md', 'README.md', [
  Input.fromDirectory('Project A', 'testing/Project A'),
  Input.fromDirectory('Project B', 'testing/Project B'),
  Input.fromDirectory('Documentation', 'docs')
])

generator.generate().then(() => {
  const application = express()
  application.use(express.static('public'))
  application.use((_request, response) => { response.status(404).redirect('/404.html') })
  application.listen(8080, () => { console.log('The test server is running on http://localhost:8080 (http://127.0.0.1:8080).') })
})
