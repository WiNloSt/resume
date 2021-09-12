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
function parseString(template, data, currentDirectory = "", currentPrefix = "") {
  function includeWithPrefix(templatePath, prefix = "") {
    const templateAbsolutePath = path.resolve(currentDirectory, templatePath)
    const file = fs.readFileSync(templateAbsolutePath)
    const SEPARATOR = "\n"

    // Add the first line to prevent adding multiple prefix to nested templates
    const template = file
      .toString()
      .split(SEPARATOR)
      .map((line, index) => {
        // The first line will already have previous prefix so have
        // to not include it.
        if (index === 0) {
          if (!line) {
            return prefix
          }

          return prefix + line
        } else {
          if (!line) {
            return currentPrefix + prefix
          }

          return currentPrefix + prefix + line
        }
      })
      .join(SEPARATOR)

    const _currentDirectory = path.dirname(templateAbsolutePath)
    return parseString(template, data, _currentDirectory, prefix)
  }

  return eval(`\`${template}\``)
}
