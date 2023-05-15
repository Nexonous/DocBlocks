import Generator from './generator'
import Input from './input'
import Version from './version'

const generator = new Generator('public', 'content/Index.md', 'content/Not Found.md', [
  new Input('Documentation Tool').addVersion(Version.fromDirectory('docs')),
  new Input('Peregrine')
    .addVersion(Version.fromDirectory('content/Peregrine/latest/docs'))
    .addVersion(Version.fromDirectory('content/Peregrine/v2023-05-14-173907/docs', 'v2023.05.14.173907'))
])
generator.generate()
