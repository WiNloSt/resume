import fs from "node:fs"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkHtml from "remark-html"
import remarkGfm from "remark-gfm"
import liveServer from "live-server"

const INPUT_MD_PATH = "resume.md"
const OUTPUT_HTML_PATH = "dist/resume.html"

buildResumeHtmlForDevelopment()
fs.watch(INPUT_MD_PATH, (event, filename) => {
  if (filename && event === "change") {
    buildResumeHtmlForDevelopment()
  }
})
liveServer.start({
  // host: '0.0.0.0',
  open: "/resume.html",
  root: "dist",
})

function buildResumeHtmlForDevelopment() {
  unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkHtml, {sanitize:false})
    .process(fs.readFileSync(INPUT_MD_PATH))
    .then((file) => {
      return fs.promises.writeFile(
        OUTPUT_HTML_PATH,
        `<body>
${file}
</body>`
      )
    })
}
