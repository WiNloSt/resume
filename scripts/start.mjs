import fs from "node:fs"
import path from "node:path"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"
import rehypeRaw from "rehype-raw"
import rehypeStringify from "rehype-stringify"
import liveServer from "live-server"

import templateEngine from './templateEngine.mjs'

const SRC_PATH = "src"
const INPUT_MD_PATH = "src/resume.md"
const OUTPUT_PATH = "dist"
const OUTPUT_HTML_PATH = "dist/resume.html"

buildResumeHtmlForDevelopment()
copyStaticFileToBuildDirectory(`${SRC_PATH}/style.css`)

fs.watch(SRC_PATH, (event, filename) => {
  if (filename && event === "change") {
    if (filename.includes(".md")) {
      buildResumeHtmlForDevelopment()
    }
    if (filename.includes("style.css")) {
      copyStaticFileToBuildDirectory(`${SRC_PATH}/style.css`)
    }
  }
})

liveServer.start({
  open: "/resume.html",
  root: "dist",
})

function buildResumeHtmlForDevelopment() {
  const markdown = fs.readFileSync(INPUT_MD_PATH)
  unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(markdown)
    .then((file) => {
      const templateData = { bodyChild: String(file) }
      const htmlString = templateEngine.parseString(HTML_TEMPLATE, templateData)
      return fs.promises.writeFile(OUTPUT_HTML_PATH, htmlString)
    })
}

const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css" />
    <title>My awesome resume</title>
</head>
<body class='a4'>
  ${"${data.bodyChild}"}
</body>
</html>`

function copyStaticFileToBuildDirectory(fileToCopy) {
  fs.copyFile(fileToCopy, `${OUTPUT_PATH}/${path.parse(fileToCopy).base}`, (error) => {
    if (error) {
      throw error
    }
  })
}
