import Generator from './generator'
import Input from './input'
import Version from './version'

const generator = new Generator('public', 'content/Index.md', 'content/Not Found.md', [
  new Input('Documentation Tool').addVersion(Version.fromDirectory('docs'))
])
generator.generate()
