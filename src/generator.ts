import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs'
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
  private base: string
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
    this.template = template
    this.output = output
    this.index = index
    this.inputs = inputs
    this.base = readFileSync(path.join(template, 'template.html')).toString()
    this.converter = new Converter({ strikethrough: true, tables: true })
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
    this.copyTemplateFolders()
  }

  /**
   * Generate the HTML files and save them in the output directory.
   *
   * @param input The input to generate from.
  */
  private async generateFromDirectory (input: Input) {
    for (const file of this.getAllFiles(input.directory)) {
      const outputDirectory = path.join(this.output, input.name, path.parse(file).dir.replace(path.join(input.directory), '')).replaceAll(' ', '-')
      const outputFile = path.join(outputDirectory, path.parse(file).name.replaceAll(' ', '-') + '.html')

      this.createDirectory(outputDirectory)
      this.createDirectory(outputFile)

      // Convert just the markdown files and copy the rest of them.
      if (file.endsWith('.md')) {
        const html = this.converter.makeHtml(readFileSync(file).toString())

        let content = this.base.replaceAll('{title}', input.name)
        content = content.replaceAll('{navigation}', this.prepareNavigation(outputDirectory))
        content = content.replaceAll('{jump}', this.generateJumpTable(html))
        content = content.replaceAll('{project}', this.project)
        content = content.replaceAll('{file}', path.parse(file).name)
        content = content.replaceAll('{content}', html)
        content = content.replaceAll(/href="(?!www\.|(?:http|ftp)s?)(.*).md"/g, 'href="$1.html"')

        writeFileSync(outputFile, content)
      } else {
        copyFileSync(file, path.join(outputDirectory, outputFile))
      }
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
    const html = this.converter.makeHtml(readFileSync(this.index).toString())

    let content = this.base.replaceAll('{title}', this.project)
    content = content.replaceAll('{navigation}', this.prepareNavigation(this.output))
    content = content.replaceAll('{jump}', this.generateJumpTable(html))
    content = content.replaceAll('{project}', this.project)
    content = content.replaceAll('{file}', path.parse(this.index).name)
    content = content.replaceAll('{content}', html)
    content = content.replaceAll(/href="(?!www\.|(?:http|ftp)s?)(.*).md"/g, 'href="$1.html"')
    writeFileSync(path.join(this.output, 'index.html'), content)
  }

  /**
   * Copy the assets, scripts and styles from the template folder to the output directory.
   */
  private async copyTemplateFolders () {
    this.copyFiles(path.join(this.template, 'assets'), path.join(this.output, 'assets'))
    this.copyFiles(path.join(this.template, 'scripts'), path.join(this.output, 'scripts'))
    this.copyFiles(path.join(this.template, 'styles'), path.join(this.output, 'styles'))
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
   * Recursively copy files from the source directory to the destination directory.
   *
   * @param source The source directory to copy from.
   * @param destination The destination directory to copy to.
   */
  private copyFiles (source: string, destination: string) {
    this.createDirectory(destination)
    if (existsSync(source)) {
      readdirSync(source).forEach(entry => {
        const sourceName = path.join(source, entry)
        const destinationName = path.join(destination, entry)

        if (statSync(sourceName).isDirectory()) {
          this.copyFiles(sourceName, destinationName)
        } else {
          copyFileSync(sourceName, destinationName)
        }
      })
    }
  }

  /**
   * Create the directory if does not exist.
   *
   * @param directory The directory to create.
   */
  private createDirectory (directory: string) {
    if (path.parse(directory).ext.length === 0 && !existsSync(directory)) { mkdirSync(directory, { recursive: true }) }
  }

  /**
   * Prepare the navigation content for a given input.
   *
   * @param relative The relative path of the input.
   * @returns The navigation HTML.
   */
  private prepareNavigation (relative: string): string {
    let html = ''

    for (const input of this.inputs) {
      const files = this.getAllFiles(input.directory)
      if (files.length === 0) { continue }

      const inputDirectory = path.join(input.directory)

      html += '<ul>'

      // Walk through the source tree recursively and process the files.
      this.walkDirectoryRecursively(inputDirectory, (file: string, directory: string, level: number) => {
        // Skip the index files since it's already given to the directory name.
        if (path.parse(file).name.toLowerCase() === 'index' && path.parse(file).ext.toLowerCase() === '.md') { return }

        const outputDirectory = path.join(this.output, input.name, path.parse(file).dir.replace(path.join(input.directory), '')).replaceAll(' ', '-')
        const filepath = path.relative(relative, path.join(outputDirectory, path.parse(file).name.replaceAll(' ', '-') + '.html'))
        const filename = path.parse(file.replace(inputDirectory + path.sep, '')).name

        html += `<li class="file"><a href="${filepath}">${filename}</a></li>`
      },
      (directory: string) => {
        const outputDirectory = path.join(this.output, directory).replaceAll(' ', '-')
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
    }

    return html
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

  /**
   * Recursively walk through a directory.
   *
   * @param directory The directory to walk.
   * @param walker The directory walker. This method gets called on each file.
   * @param onDirectoryPush This method gets called when a new directory is found and is about to walk through all the files in it.
   * @param onDirectoryPop This method gets called once we're done walking on a directory.
   * @param level The level of the current walking.
   */
  private walkDirectoryRecursively (directory: string, walker: (file: string, directory: string, level: number) => void, onDirectoryPush: (directory: string) => void, onDirectoryPop: () => void, level: number = 0) {
    if (existsSync(directory)) {
      onDirectoryPush(directory)
      readdirSync(directory).forEach(file => {
        const name = path.join(directory, file)

        if (statSync(name).isDirectory()) {
          this.walkDirectoryRecursively(name, walker, onDirectoryPush, onDirectoryPop, level + 1)
        } else {
          walker(name, directory, level)
        }
      })
      onDirectoryPop()
    }
  }

  /**
   * Generate the jump table from the generated HTML data.
   *
   * @param content The converted HTML data.
   * @returns The jump table.
   */
  private generateJumpTable (content: string): string {
    let jump = ''
    let level: number = -1
    for (const item of content.matchAll(/<h(\d) id="(.*)">(.*)<\/h\d>/g)) {
      const currentValue = +item[1]
      if (currentValue > level) {
        jump += '<ul>'
      } else if (currentValue < level) {
        jump += '</ul>'
      }

      level = currentValue
      jump += `<li><a href="#${item[2]}">${item[3]}</a></li>`
    }

    return jump
  }
}

export = Generator
