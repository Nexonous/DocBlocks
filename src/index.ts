import Generator from './generator'
import Input from './input'

const generator = new Generator('public', 'content/Index.md', 'content/Not Found.md', [
  Input.fromDirectory('Documentation Tool', 'docs')
])
generator.generate()
