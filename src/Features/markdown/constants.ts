export const demoMdFile = `
# Markdown
- Supports every markdown feature + GitHub Flavored Markdown  
- Refer [GFM](https://github.github.com/gfm/)
- Supports footnotes
- ⛳️ Emoji support

\`\`\`js
const codeblock = () => {
    // Code with syntax highlighting 
}
\`\`\`


A foot note[^1]

[^1]: Actual footnote content.

~one~ or ~~two~~ tildes.

| a | b  |  c |  d  |
| - | :- | -: | :-: |
| 1 | 2  |  3 |  4  |

* [ ] to do
* [x] done

> #### [Rehype-raw](https://www.npmjs.com/package/rehype-raw) & [Rehype-katex](https://www.npmjs.com/package/rehype-katex/v/6.0.2) included

So you can use *markdown* and <em>HTML</em>.

$\\frac{-30}{8}$

$$
L = \\frac{1}{2} \\rho v^2 S C_L
$$

<div class="math math-display">
  L = \\frac{1}{2} \\rho v^2 S C_L
</div>
`;
