import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs'
import path from 'path'
import Input from './input'
import Showdown, { Converter } from 'showdown'

/**
 * Generator class.
 */
class Generator {
  private output: string
  private template: string
  private converter: Showdown.Converter

  /**
   * Constructor.
   *
   * @param template The template folder to get the basic information from.
   * @param output The output directory to place everything to.
   */
  constructor (template: string, output: string) {
    this.output = output
    this.template = readFileSync(path.join(template, 'template.html')).toString()
    this.converter = new Converter()
  }

  /**
   * Generate the HTML files and save them in the output directory.
   *
   * @param input The input to generate from.
  */
  async generateFromDirectory (input: Input) {
    const outputDirectory = path.join(this.output, input.name)
    this.createDirectory(outputDirectory)

    const files = this.getAllFiles(input.directory)
    for (const file of files) {
      let content = this.template.replaceAll('{title}', input.name)
      content = content.replaceAll('{content}', this.converter.makeHtml(readFileSync(file).toString()))
      content = content.replaceAll('{relatives}', files.toString())
      content = content.replaceAll(/href="(?!www\.|(?:http|ftp)s?)(.*).md"/g, 'href="$1.html"')
      writeFileSync(path.join(outputDirectory, path.parse(file).name + '.html'), content)
    }
  }

  /**
   * Generate the HTML files and save them in the output directory.
   *
   * @param input The input to generate from.
   */
  async generateFromGit (input: Input) {
  }

  /**
   * Generate the main index file.
   *
   * @param project The project name to base the index file from.
   * @param inputs The inputs to generate from.
   */
  async generateIndexFile (project: string, inputs: Input[]) {
    // const markdown = marked.parse(readFileSync(file).toString())
    const content = this.template.replace('{title}', project)
    writeFileSync(path.join(this.output, 'index.html'), content)
  }

  /**
   * Get all the files in a directory.
   *
   * @param directory The directory to get all the files from.
   * @param filesList The file list.
   * @returns The file list containing all the files.
   */
  private getAllFiles (directory: string, filesList: string[] = []): string[] {
    if (existsSync(directory)) {
      const files = readdirSync(directory)
      files.forEach(file => {
        const name = path.join(directory, file)
        if (statSync(name).isDirectory()) {
          this.getAllFiles(name, filesList)
        } else {
          filesList.push(name)
        }
      })
    }

    return filesList
  }

  /**
   * Create the directory if does not exist.
   *
   * @param directory The directory to create.
   */
  private createDirectory (directory: string) {
    if (!existsSync(directory)) { mkdirSync(directory, { recursive: true }) }
  }
}

export = Generator
