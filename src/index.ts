import Generator from './generator'
import Input from './input'

const generator = new Generator('public', 'README.md', [
  Input.fromDirectory('Project A', 'testing/Project A'),
  Input.fromDirectory('Project B', 'testing/Project B'),
  Input.fromDirectory('Documentation', 'docs')
])
generator.generate()
