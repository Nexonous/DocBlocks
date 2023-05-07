import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs'
import path from 'path'
import Input from './input'
import Showdown, { Converter } from 'showdown'

/**
 * Generator class.
 */
class Generator {
  private project: string
  private template: string
  private output: string
  private index: string
  private inputs: Input[]
  private converter: Showdown.Converter

  /**
   * Constructor.
   *
   * @param project The project name.
   * @param template The template folder to get the basic information from.
   * @param output The output directory to place everything to.
   * @param index The main index file.
   * @param inputs The inputs to generate everything from.
   */
  constructor (project: string, template: string, output: string, index: string, inputs: Input[]) {
    this.project = project
    this.template = readFileSync(path.join(template, 'template.html')).toString()
    this.output = output
    this.index = index
    this.inputs = inputs
    this.converter = new Converter()
  }

  /**
   * Generate the HTML files.
   */
  async generate () {
    for (const input of this.inputs) {
      if (input.isDirectory()) {
        this.generateFromDirectory(input)
      } else {
        this.generateFromGit(input)
      }
    }

    this.generateIndexFile()
  }

  /**
   * Generate the HTML files and save them in the output directory.
   *
   * @param input The input to generate from.
  */
  private async generateFromDirectory (input: Input) {
    const outputDirectory = path.join(this.output, input.name)
    this.createDirectory(outputDirectory)

    const files = this.getAllFiles(input.directory)
    const navigation = this.prepareNavigation(outputDirectory)
    for (const file of files) {
      let content = this.template.replaceAll('{title}', input.name)
      content = content.replaceAll('{navigation}', navigation)
      content = content.replaceAll('{content}', this.converter.makeHtml(readFileSync(file).toString()))
      content = content.replaceAll(/href="(?!www\.|(?:http|ftp)s?)(.*).md"/g, 'href="$1.html"')
      writeFileSync(path.join(outputDirectory, path.parse(file).name + '.html'), content)
    }
  }

  /**
   * Generate the HTML files and save them in the output directory.
   *
   * @param input The input to generate from.
   */
  private async generateFromGit (input: Input) {
  }

  /**
   * Generate the main index file.
   */
  private async generateIndexFile () {
    let content = this.template.replaceAll('{title}', this.project)
    content = content.replaceAll('{navigation}', this.prepareNavigation(this.output))
    content = content.replaceAll('{content}', this.converter.makeHtml(readFileSync(this.index).toString()))
    content = content.replaceAll(/href="(?!www\.|(?:http|ftp)s?)(.*).md"/g, 'href="$1.html"')
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

  /**
   * Prepare the navigation content for a given input.
   *
   * @param relative The relative path of the input.
   * @returns The navigation HTML.
   */
  private prepareNavigation (relative: string): string {
    let html = '<ul>'

    html += '<li>'
    html += `<a href="${path.relative(relative, path.join(this.output, 'index.html'))}">Home</a>`
    html += '</li>'

    for (const input of this.inputs) {
      const files = this.getAllFiles(input.directory)
      if (files.length === 0) { continue }

      html += '<li>' + input.name
      html += '<ul>'

      const inputDirectory = path.join(input.directory)
      const outputDirectory = path.join(this.output, input.name)

      for (const file of files) {
        const filename = file.replace(inputDirectory + path.sep, '').replace('.md', '')
        const filepath = path.relative(relative, path.join(outputDirectory, path.parse(file).name + '.html'))

        html += '<li>'
        html += `<a href="${filepath}">${filename}</a>`
        html += '</li>'
      }

      html += '</ul>'
      html += '</li>'
    }

    return html + '</ul>'
  }
}

export = Generator
