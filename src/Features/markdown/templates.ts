import type { ReadmeTemplates } from "./types";

export const templates: ReadmeTemplates = {
  autoGen: {
    render: `<!-- This is an autogenerated message. Please do not edit this file. -->
`,
    renderTitle: true,
  },
  acknowledgements: `
## Acknowledgements

- [DevTools-X](https://github.com/fosslife/devtools-x)
- [Readme.so](https://readme.so/editor)
- [Awesome README](https://github.com/matiassingers/awesome-readme)
`,
  apiReference: `
    Here’s an improved and more comprehensive version of your API reference documentation:

---

## API Reference

### Endpoints Overview

This API allows you to retrieve and manipulate items in your collection. Below are the details for each available endpoint.

---

### Get All Items

Retrieve a list of all items available in the database.

\`\`\`http
GET /api/items
\`\`\`

#### Query Parameters

| Parameter | Type     | Required | Description                                    |
| :-------- | :------- | :------- | :--------------------------------------------- |
| \`api_key\` | \`string\` | Yes      | Your unique API key for authentication         |
| \`limit\`   | \`int\`    | No       | The number of items to return (default: 100)   |
| \`offset\`  | \`int\`    | No       | The number of items to skip before starting to return results |

#### Example Request

\`\`\`http
GET /api/items?api_key=your_api_key&limit=50&offset=0
\`\`\`

---

### Get Item by ID

Retrieve details for a specific item by its unique identifier.

\`\`\`http
GET /api/items/:id
\`\`\`

#### Path Parameters

| Parameter | Type     | Required | Description                              |
| :-------- | :------- | :------- | :--------------------------------------- |
| \`id\`      | \`string\` | Yes      | The unique identifier of the item to fetch |

#### Query Parameters

| Parameter | Type     | Required | Description                                    |
| :-------- | :------- | :------- | :--------------------------------------------- |
| \`api_key\` | \`string\` | Yes      | Your unique API key for authentication         |

#### Example Request

\`\`\`http
GET /api/items/12345?api_key=your_api_key
\`\`\`

---

### Add Function

This utility function adds two numbers and returns the result. It can be useful in cases where arithmetic operations are needed.

\`\`\`javascript
function add(num1, num2) {
  return num1 + num2;
}
\`\`\`

#### Parameters

| Parameter | Type     | Required | Description                     |
| :-------- | :------- | :------- | :------------------------------ |
| \`num1\`    | \`number\` | Yes      | The first number to be added    |
| \`num2\`    | \`number\` | Yes      | The second number to be added   |

#### Example Usage

\`\`\`javascript
const sum = add(5, 10);
console.log(sum); // Outputs: 15
\`\`\`

---
`,
  appendix: `
### Appendix

- Ensure that all requests include your API key for authentication.
- The \`limit\` and \`offset\` parameters are optional but can be used to control pagination for large datasets.
- The \`id\` parameter must be a valid string corresponding to an existing item.

---
`,
  authors: `
## Authors

- [@Sparkenstein](https://www.github.com/Sparkenstein)
- [@ThijsZijdel](https://github.com/ThijsZijdel)
...
`,
  badges: {
    render: `
## Badges

![MIT License](https://img.shields.io/github/license/fosslife/devtools-x.svg)
![GitHub issues](https://badgen.net/github/issues/fosslife/devtools-x) ![GitHub stars](https://badgen.net/github/stars/fosslife/devtools-x)
![Latest release](https://badgen.net/github/release/fosslife/devtools-x)

`,
    module: "shields",
    info: "https://shields.io/badges",
  },
  contributing: `    
## Contributing

Contributions are always welcome!

See [\`contributing.md\`](/contributing.md) for ways to get started.

Please adhere to this project's \`code of conduct\`.
`,
  demo: `
## Demo

<img width="1317" alt="Screenshot 2024-04-01 at 12 20 37 PM" src="logo.png">
`,
  deployment: `
## Deployment

To deploy this project run

\`\`\`bash
    # Install dependencies
    yarn install

    # Run dev server
    yarn tauri dev
\`\`\`

`,
  documentation: `    
## Documentation

[Documentation](https://linktodocumentation)

`,
  environment: `    
## Environment Variables

To run this project, add the following environment variables to your \`.env\` file. You can copy \`.env.example\` as \`.env\`:

- \`API_KEY\`: Your primary API key.
- \`ANOTHER_API_KEY\`: A secondary API key.

Make sure to replace placeholders with your actual keys.
`,
  faq: `
## FAQ

#### Question one

Answer one, check out our [docs](google.com) for more info

#### Question two

Answer two, check out our [docs](google.com) for more info
`,
  features: `
## Features

- **🌗 Light/Dark Mode Toggle**: Work comfortably in any lighting.
- **👀 Live Previews**: See changes instantly—no guessing!
- **🖥️ Fullscreen Mode**: Immerse yourself in your work.
- **🌍 Cross-Platform**: Use it anywhere, on any device.

`,
  feedback: `  
## Feedback

If you have any feedback, please reach out to us at [our@repo.com](mailto:our@repo.com)
`,
  installation: `
## Installation

Install our repo with pnpm

\`\`\`bash
    pnpm install our-repo
    cd our-repo
\`\`\`
    `,
  lessonsLearned: `
## Lessons Learned

What did you learn while building this project? What challenges did you face and how did you overcome them?
`,
  license: `  
## License

[MIT](https://choosealicense.com/licenses/mit/)
`,
  logo: `
![Logo](logo.png)    
  `,
  optimizations: `  
## Optimizations

What optimizations did you make in your code? E.g. refactors, performance improvements, accessibility

`,
  related: `    
## Related

Here are some related projects

[Awesome README](https://github.com/matiassingers/awesome-readme)
`,
  roadmap: `
## Roadmap

- **🚀 Launch New Features**
- **🔧 Improve Performance**
- **🛡️ Enhance Security**
- **🌐 Expand Cross-Platform Support**
- **📈 Continuous User Feedback Integration**
`,
  screenshots: `
## Screenshots

![App Screenshots](placeholder.png)
`,
  support: `
## Support

If you need help, please reach out via [support@yourproject.com](mailto:support@yourproject.com).
`,
  technology: `
## Technology Used

This project is built with:

- **React**: Frontend library for building user interfaces.
- **Node.js**: JavaScript runtime for backend development.
- **Express**: Web framework for Node.js.
- **MongoDB**: NoSQL database for data storage.
`,
  tests: `
## Running Tests

To run tests for this project, use the following command:

\`\`\`bash
npm test
\`\`\`

Ensure all tests pass before pushing changes.`,
  header: `
# **Project Name**

A brief description of what your project does and why it’s useful.
`,
  usage: `
## Usage

To use the main component of this project, follow the example below:

\`\`\`javascript
import Component from 'my-project';

function App() {
  return <Component />;
}
\`\`\``,
  usedBy: `    
## Used By

This project is used by the following companies/projects:

- **Company A**: Brief description of usage.
- **Project B**: Brief description of usage.
`,
};
