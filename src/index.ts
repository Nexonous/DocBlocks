import Generator from './generator'

const generator = new Generator('public', 'content/Index.md', 'content/Not Found.md', [])
generator.generate()
