import fs from "node:fs"
import path from "node:path"

export default {
  parse,
  parseString,
}

/**
 *
 * @param templatePath Path to the template
 * @param data Data to render the template
 * @returns
 */
function parse(templatePath, data = {}) {
  const template = fs.readFileSync(templatePath)
  const currentDirectory = path.dirname(templatePath)
  return parseString(template, data, currentDirectory)
}

/**
 *
 * @param template Template string for rendering
 * @param data data to render the template
 * @returns
 */
function parseString(template, data, currentDirectory = "") {
  function includeWithPrefix(templatePath, prefix = "") {
    const file = fs.readFileSync(path.resolve(currentDirectory, templatePath))
    const SEPARATOR = "\n"

    const template = file
      .toString()
      .split(SEPARATOR)
      .map((line) => {
        if (!line) {
          return prefix
        }

        return prefix + line
      })
      .join(SEPARATOR)

    const _currentDirectory = path.dirname(templatePath)
    return parseString(template, data, _currentDirectory)
  }

  return eval(`\`${template}\``)
}
