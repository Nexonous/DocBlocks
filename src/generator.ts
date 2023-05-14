import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync } from 'fs'
import { readFile, writeFile, copyFile } from 'fs/promises'
import path from 'path'
import Input from './input'
import { Converter } from 'showdown'
import Version from './version'

/**
 * Generator class.
 */
class Generator {
  private output: string
  private index: string
  private notFound: string
  private inputs: Input[]
  private base: string

  /**
   * Constructor.
   *
   * @param output The output directory to place everything to.
   * @param index The main index file.
   * @param inputs The inputs to generate everything from.
   */
  constructor (output: string, index: string, notFound: string, inputs: Input[]) {
    this.output = output
    this.index = index
    this.notFound = notFound
    this.inputs = inputs
    this.base = readFileSync(path.join('template', 'template.html')).toString()
  }

  /**
   * Generate the HTML files.
   *
   * @return The promises to wait for.
   */
  public generate () {
    this.copyTemplateFolders()

    let workers: Promise<void>[] = []
    for (const input of this.inputs) {
      for (const version of input.versions) {
        if (version.isDirectory()) {
          workers = workers.concat(this.generateFromDirectory(input, version))
        } else {
          workers = workers.concat(this.generateFromGit(input, version))
        }
      }
    }

    workers.push(this.generateIndexFile())
    workers.push(this.generateNotFoundFile())
    workers.push(this.generateCatalogFile())

    return Promise.all(workers)
  }

  /**
   * Generate the HTML files and save them in the output directory.
   *
   * @param input The input to generate from.
   * @param version The input version to generate from.
   * @return The worker promises.
  */
  private generateFromDirectory (input: Input, version: Version) {
    const workers: Promise<void>[] = []
    for (const file of this.getAllFiles(version.directory)) {
      workers.push(this.generateFromFile(file, input.name, version.directory, version.version))
    }

    return workers
  }

  /**
   * Generate the HTML file from a Markdown file.
   *
   * @param file The file path to generate from.
   * @param name The output directory name.
   * @param directory The input directory.
   * @return The promise of the worker.
   */
  async generateFromFile (file: string, name: string, directory: string, version: string) {
    const outputDirectory = path.join(this.output, name, this.processVersion(version), path.parse(file).dir.replace(path.join(directory), '')).replaceAll(' ', '-')
    const outputFile = path.join(outputDirectory, path.parse(file).name.replaceAll(' ', '-') + '.html')

    this.createDirectory(outputDirectory)
    this.createDirectory(outputFile)

    // Convert just the markdown files and copy the rest of them.
    if (file.endsWith('.md')) {
      return readFile(file).then((data) => {
        console.log('Generating HTML from', `"${file}"`, 'to', `"${outputFile}"`)

        const converter = new Converter({ strikethrough: true, tables: true })
        const html = converter.makeHtml(data.toString())

        let content = this.base.replaceAll('{title}', name)
        content = content.replaceAll('{topbar}', this.prepareTopbar())
        content = content.replaceAll('{version}', version)
        content = content.replaceAll('{navigation}', this.prepareNavigation(outputDirectory, name, version, directory))
        content = content.replaceAll('{jump}', this.generateJumpTable(html))
        content = content.replaceAll('{file}', path.parse(file).name)
        content = content.replaceAll('{content}', html)
        content = content.replaceAll(/href="(?!www\.|(?:http|ftp)s?)(.*).md"/g, 'href="$1.html"')

        return writeFile(outputFile, content)
      })
    } else {
      return copyFile(file, path.join(outputDirectory, outputFile))
    }
  }

  /**
   * Process the version by replacing all the dots ('.') with dashes ('-').
   *
   * @param version The input version.
   * @returns The processed version.
   */
  private processVersion (version: string) {
    return version.replaceAll('.', '-')
  }

  /**
   * Generate the HTML files and save them in the output directory.
   *
   * @param input The input to generate from.
   * @param version The input version to generate from.
   */
  private async generateFromGit (_input: Input, _version: Version) {
    console.log('Generating HTML files from git links are not supported for now!')
  }

  /**
   * Generate the main index file.
   *
   * @return The writer promise.
  */
  private async generateIndexFile () {
    const outputFile = path.join(this.output, 'index.html')
    this.createDirectory(this.output)

    return readFile(this.index).then((data) => {
      console.log('Generating HTML from', `"${this.index}"`, 'to', `"${outputFile}"`)

      const converter = new Converter({ strikethrough: true, tables: true, emoji: true })
      const html = converter.makeHtml(data.toString())

      let content = this.base.replaceAll('{title}', 'Nexonous')
      content = content.replaceAll('{topbar}', this.prepareTopbar())
      content = content.replaceAll('{version}', '')
      content = content.replaceAll('{navigation}', this.generateGlobalNavigation())
      content = content.replaceAll('{jump}', this.generateJumpTable(html))
      content = content.replaceAll('{file}', path.parse(this.index).name)
      content = content.replaceAll('{content}', html)
      content = content.replaceAll(/href="(?!www\.|(?:http|ftp)s?)(.*).md"/g, 'href="$1.html"')
      return writeFile(outputFile, content)
    })
  }

  /**
   * Generate the catalog files.
   *
   * @returns The catalog file worker.
   */
  private async generateCatalogFile () {
    const outputFile = path.join(this.output, 'catalog.html')
    this.createDirectory(this.output)
    console.log('Generating HTML from', `"${this.index}"`, 'to', `"${outputFile}"`)

    let html = '<h1 id="catalog">Catalog 📚</h1>\r\n'
    html += '<p>This page contains information about all the web pages and documentation stored in the website. You can use this as a quick jump to find documentation about everything in the versioning order.</p>\r\n'

    for (const input of this.inputs) {
      html += `<h2 id="${input.name.toLowerCase().replaceAll(' ', '')}">${input.name}</h2>\r\n`
      for (const version of input.versions) {
        html += `<h3 id="version-${version.version.toLowerCase().replaceAll(' ', '')}">Version: ${version.version}</h3>\r\n`
        html += '<ul>\r\n'
        this.walkDirectoryRecursively(version.directory, (file: string, _directory: string, _level: number) => {
          const outputDirectory = path.join(this.output, input.name, this.processVersion(version.version), path.parse(file).dir.replace(path.join(version.directory), '')).replaceAll(' ', '-')
          const filepath = path.relative(this.output, path.join(outputDirectory, path.parse(file).name.replaceAll(' ', '-') + '.html'))
          const filename = path.parse(file.replace(version.directory + path.sep, '')).name

          html += `<li class="file"><a href="${filepath}">${filename}</a></li>\r\n`
        },
        (directory: string) => {
          const outputDirectory = path.join(this.output, directory).replaceAll(' ', '-')
          const indexFile = this.findIndexFileOfDirectory(this.output, outputDirectory, directory)

          directory = path.parse(directory).name
          if (indexFile != null) {
            const filepath = path.relative(this.output, path.join(outputDirectory, path.parse(indexFile).name.replaceAll(' ', '-') + '.html'))
            html += `<li class="directory"><a href="${filepath}">${directory}</a></li>\r\n`
          } else {
            html += `<li class="directory">${directory}</li>\r\n`
          }

          html += '<ul>\r\n'
        }, () => { html += '</ul>\r\n' })
        html += '</ul>\r\n'
      }
    }

    let content = this.base.replaceAll('{title}', 'Projects')
    content = content.replaceAll('{topbar}', this.prepareTopbar())
    content = content.replaceAll('{version}', '')
    content = content.replaceAll('{navigation}', this.generateGlobalNavigation())
    content = content.replaceAll('{jump}', this.generateJumpTable(html))
    content = content.replaceAll('{file}', 'Projects')
    content = content.replaceAll('{content}', html)
    content = content.replaceAll(/href="(?!www\.|(?:http|ftp)s?)(.*).md"/g, 'href="$1.html"')
    return writeFile(outputFile, content)
  }

  /**
   * Generate the not found file.
   *
   * @return The writer promise.
   */
  private async generateNotFoundFile () {
    const outputFile = path.join(this.output, '404.html')
    this.createDirectory(this.output)

    return readFile(this.notFound).then((data) => {
      console.log('Generating HTML from', `"${this.notFound}"`, 'to', `"${outputFile}"`)

      const converter = new Converter({ strikethrough: true, tables: true, emoji: true })
      const html = converter.makeHtml(data.toString())

      let content = this.base.replaceAll('{title}', 'Nexonous')
      content = content.replaceAll('{topbar}', this.prepareTopbar())
      content = content.replaceAll('{version}', '')
      content = content.replaceAll('{navigation}', this.generateGlobalNavigation())
      content = content.replaceAll('{jump}', this.generateJumpTable(html))
      content = content.replaceAll('{file}', path.parse(this.notFound).name)
      content = content.replaceAll('{content}', html)
      content = content.replaceAll(/href="(?!www\.|(?:http|ftp)s?)(.*).md"/g, 'href="$1.html"')
      return writeFile(outputFile, content)
    })
  }

  /**
   * Copy the assets, scripts and styles from the template folder to the output directory.
   */
  private async copyTemplateFolders () {
    this.copyFiles(path.join('template', 'assets'), path.join(this.output, 'assets'))
    this.copyFiles(path.join('template', 'scripts'), path.join(this.output, 'scripts'))
    this.copyFiles(path.join('template', 'styles'), path.join(this.output, 'styles'))
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
   * Prepare the topbar navigation.
   *
   * @returns The HTML string.
   */
  private prepareTopbar (): string {
    let html = ''

    for (const input of this.inputs) {
      html += `<li>${input.name.toUpperCase()}</li>`

      for (const version of input.versions) {
        const indexFile = this.findIndexFileOfDirectory(this.output, this.output, version.directory)

        if (indexFile != null) {
          const outputDirectory = path.join(input.name, indexFile).replaceAll(' ', '-')
          html += `<li><a href="/${outputDirectory}">${input.name.toUpperCase()}</a></li>`
        } else {
          html += `<li>${input.name.toUpperCase()}</li>`
        }
      }
    }

    return html
  }

  /**
   * Prepare the navigation content for a given input.
   *
   * @param relative The relative path of the input.
   * @returns The navigation HTML.
   */
  private prepareNavigation (relative: string, name: string, version: string, directory: string): string {
    const indexFile = this.findIndexFileOfDirectory(this.output, this.output, directory)
    let html = `<h1><a href="${indexFile == null ? '' : indexFile}">${name}</a></h1><p id="version">${version}</p><ul>`

    // Walk through the source tree recursively and process the files.
    const inputDirectory = path.join(directory)
    this.walkDirectoryRecursively(inputDirectory, (file: string, _directory: string, _level: number) => {
      // Skip the index files since it's already given to the directory name.
      if (path.parse(file).name.toLowerCase() === 'index' && path.parse(file).ext.toLowerCase() === '.md') { return }

      const outputDirectory = path.join(this.output, name, this.processVersion(version), path.parse(file).dir.replace(path.join(directory), '')).replaceAll(' ', '-')
      const filepath = path.relative(relative, path.join(outputDirectory, path.parse(file).name.replaceAll(' ', '-') + '.html'))
      const filename = path.parse(file.replace(inputDirectory + path.sep, '')).name

      html += `<li class="file"><a href="${filepath}">${filename}</a></li>`
    },
    (directory: string) => {
      const outputDirectory = path.join(this.output, directory).replaceAll(' ', '-')
      const indexFile = this.findIndexFileOfDirectory(relative, outputDirectory, directory)

      directory = path.parse(directory).name
      if (indexFile != null) {
        const filepath = path.relative(relative, path.join(outputDirectory, path.parse(indexFile).name.replaceAll(' ', '-') + '.html'))
        html += `<li class="directory"><a href="${filepath}">${directory}</a></li>`
      } else {
        html += `<li class="directory">${directory}</li>`
      }

      html += '<ul>'
    }, () => { html += '</ul>' })

    return html + '</ul>'
  }

  /**
   * Generate the global navigation panel.
   *
   * @returns The navigation HTML.
   */
  private generateGlobalNavigation () {
    let html = ''

    for (const input of this.inputs) {
      html += `<ul class="global">${input.name}<ul>`

      for (const version of input.versions) {
        const indexFile = this.findIndexFileOfDirectory(this.output, this.output, version.directory)

        if (indexFile != null) {
          const filepath = path.join(input.name, this.processVersion(version.version), indexFile).replaceAll(' ', '-')
          html += `<li><a href="${filepath}">${version.version}</a></li>`
        } else {
          html += `<li><a href="">${version.version}</a></li>`
        }
      }

      html += '</ul></ul>'
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
        if (file.toLowerCase() === 'index.md' || file.toLowerCase() === 'index.html') {
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

  /**
   * Generate the jump table from the generated HTML data.
   *
   * @param content The converted HTML data.
   * @returns The jump table.
   */
  private generateJumpTable (content: string): string {
    let jump = ''
    let level: number = -1
    for (const item of content.matchAll(/<h(\d) id="(.*)">(.*)<\/h\1>/g)) {
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
