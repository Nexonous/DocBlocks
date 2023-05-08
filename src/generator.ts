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
    console.log('Generating HTML files from git links are not supported for now!')
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

      const inputDirectory = path.join(input.directory)
      const outputDirectory = path.join(this.output, input.name)
      const indexFile = this.findIndexFileOfDirectory(relative, outputDirectory, input.directory)

      if (indexFile != null) {
        html += `<li><a href="${indexFile}">${input.name}</a>`
      } else {
        html += '<li>' + input.name
      }

      html += '<ul>'

      this.walkDirectoryRecursively(inputDirectory, (file: string, directory: string, level: number) => {
        const filename = path.parse(file.replace(inputDirectory + path.sep, '')).name
        const filepath = path.relative(relative, path.join(outputDirectory, path.parse(file).name + '.html'))
        if (indexFile != null && filepath === indexFile) { return }

        html += '<li class="file">'
        html += `<a href="${filepath}">${filename}</a>`
        html += '</li>'
      },
      (directory: string) => {
        const indexFile = this.findIndexFileOfDirectory(relative, outputDirectory, directory)

        directory = path.parse(directory).name
        if (indexFile != null) {
          html += `<li class="directory"><a href="${indexFile}">${directory}</a></li>`
        } else {
          html += `<li class="directory">${directory}</li>`
        }
        html += '<ul>'
      }, () => {
        html += '</ul>'
      })

      html += '</ul>'
      html += '</li>'
    }

    return html + '</ul>'
  }

  /**
   * Find the a index file in a given directory.
   *
   * @param relative The relative path to get the index file.
   * @param outputDirectory The output directory.
   * @param directory The directory to search in.
   * @returns The index file directory. This could be null in which case the index file is not found.
   */
  private findIndexFileOfDirectory (relative: string, outputDirectory: string, directory: string): string | null {
    let indexFile = null
    if (existsSync(directory)) {
      const files = readdirSync(directory)
      files.forEach(file => {
        if (file.toLowerCase() === 'index.md') {
          indexFile = path.relative(relative, path.join(outputDirectory, path.parse(file).name + '.html'))
        }
      })
    }

    return indexFile
  }

  private walkDirectoryRecursively (directory: string, walker: (file: string, directory: string, level: number) => void, onDirectoryPush: (directory: string) => void, onDirectoryPop: () => void, level: number = 0) {
    if (existsSync(directory)) {
      readdirSync(directory).forEach(file => {
        const name = path.join(directory, file)

        if (statSync(name).isDirectory()) {
          onDirectoryPush(name)
          this.walkDirectoryRecursively(name, walker, onDirectoryPush, onDirectoryPop, level + 1)
          onDirectoryPop()
        } else {
          walker(name, directory, level)
        }
      })
    }
  }
}

export = Generator
