import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs'
import path from 'path'
import Input from './input'
import { marked } from 'marked'

/**
 * Get all the files in a directory.
 *
 * @param directory The directory to get all the files from.
 * @param filesList The file list.
 * @returns The file list containing all the files.
 */
function getAllFiles (directory: string, filesList: string[] = []): string[] {
  const files = readdirSync(directory)
  files.forEach(file => {
    const name = path.join(directory, file)
    if (statSync(name).isDirectory()) {
      getAllFiles(name, filesList)
    } else {
      filesList.push(name)
    }
  })

  return filesList
}

/**
 * Create the directory if does not exist.
 *
 * @param directory The directory to create.
 */
function createDirectory (directory: string) {
  if (!existsSync(directory)) { mkdirSync(directory, { recursive: true }) }
}

const template = readFileSync('./template/Index.html').toString()

class Generator {
  /**
   * Generate the HTML files and save them in the output directory.
   *
   * @param input The input to generate from.
   * @param output The output directory to place everything to.
  */
  static async generateFromDirectory (input: Input, output: string) {
    const outputDirectory = path.join(output, input.name)
    createDirectory(outputDirectory)

    const files = getAllFiles(input.directory)
    for (const file of files) {
      const markdown = marked.parse(readFileSync(file).toString())
      const content = template.replace('{title}', input.name).replace('{content}', markdown)
      writeFileSync(path.join(outputDirectory, path.parse(file).name + '.html'), content)
    }
  }

  /**
   * Generate the HTML files and save them in the output directory.
  *
  * @param input The input to generate from.
   * @param output The output directory to place everything to.
   */
  static async generateFromGit (input: Input, output: string) {
  }
}

export = Generator
