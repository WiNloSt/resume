# Resume

The source for [my resume](https://drive.google.com/file/d/15f81tEpcz9ASpWE0CNK6eFQ85Bq0-220/preview). This repo is the source for the article [Version control my resume](https://medium.com/@winlost/version-control-my-resume-25e3e8502eac).

## Motivation

Writing a resume in Notion or Figma meant every one-word change was a chore, and changing the layout risked breaking the content. Google Docs keeps version history, but it doesn't separate content from layout.

Here the content is in Markdown, the layout is in CSS, and both are in git:

- Every revision is versioned, so no progress is ever lost.
- Restyling never touches the content, and editing the content never touches the style.
- Markdown is already familiar from GitHub and Notion, and it's simpler than LaTeX.

## How it works

`src/resume.md` is compiled to `dist/resume.html` with [remark](https://github.com/remarkjs/remark) and styled by `src/style.css`. Raw HTML inside the Markdown allows sections such as a two-column layout.

```sh
yarn
yarn start
```

`yarn start` rebuilds the resume whenever you save a change and shows it in your browser. To get a PDF, print the page from the browser.
