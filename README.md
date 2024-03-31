# DEVTOOLS-X

`devutils` is macOS-only, and `devtoys` is Windows-only.  
So here's DevTools-X -- an x-platform collection of dev-tools that is lighter, safer, and full of feature rich (currenltly 32 modules and growing) development utilities.

> Note: Application is under development, expect some bugs.

> In any case if the app doesn't render/load anything, just delete the file if exists or create settings.json if doesn't exist at: https://docs.rs/tauri/latest/tauri/api/path/fn.data_dir.html

![Logo](assets/banner.png)

## Badges

![MIT License](https://img.shields.io/github/license/fosslife/devtools-x.svg)
![GitHub issues](https://badgen.net/github/issues/fosslife/devtools-x) ![GitHub stars](https://badgen.net/github/stars/fosslife/devtools-x)
![Latest release](https://badgen.net/github/release/fosslife/devtools-x)

## Installation

Download the relevant package from Github Releases section, and start using it! :D

If you prefer compiling your own package, make sure you have all tauri pre-requisites installed:

```
https://tauri.app/v1/guides/getting-started/prerequisites
```

Then just clone and open the project in terminal and run

```
yarn tauri build
```

## Acknowledgements

This project exists solely because I was fed up switching between different tools on different OSes. Please do star their github repositories, they have inspired many modules in devtools-x

- [DevUtils](https://devutils.com/)
- [DevToys](https://github.com/veler/DevToys)

## Features

DevTools-X has about **32 features** as of now, and growing. The full list in below, details of each are mentioned in a separate file. One big selling point of DevTools-X is it uses `monaco-editor`, the editor used by vscode, so tons of editor features are
available to you right from the start, as if you are using vscode. And in the backend we use `rust` so large number of heavy duty operations are given to rust to get it done quickly.

- JSON Editor/Formatter/Fixer/Minifier/Beautifier
- Text Hashes
- Hashing Files
- Password Generator
- JWT Formatter/Parser
- Number Convertor Binary/Hex/etc
- SQL Formatter
- Color Generator/Picker/Convertor
- Regex Tester
- Text/Code Diffing With Syntax Highlighting
- YAML <> JSON Convertor
- Pastebin (Github Gists)
- REST API Tester
- Programming Scratchpad
- Beautiful Markdown Preview
- Image Compressor/Convertor with Preview
- Bulk Image Compressor with Rust for Speed
- Unit Convertor (All Major Units Supported)
- React Scratchpad (Live React Editor to Get Preview)
- Unix EPOCH Convertor
- Stateless Password Generator/Manager
- BASE64 Text Convertor
- BASE64 Image Convertor
- Generating Structs/Types from JSON
- CSS/JS/HTML Minifier/Beautifier
- URL Parser
- HTML Preview
- Lorem Ipsum Sample Text Generator
- QR Code Generator
- PDF Reader
- Ping Command Preview
- Text Compressor
- And Many More Coming

## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.

## Tech Stack

DevTools-X is **NOT WRITTEN IN ELECTRON**.

**Client:** React, Mantine

**Backend:** Rust

That should be enough to tell you it's built on top of [Tauri](https://tauri.app/), So we get best of the both worlds: Web + Rust. Web to create beautiful cross-platform UI, Rust to create fast and small applications. Tauri bundle is super small, about 10MB of installer.

## Authors

- [@Sparkenstein](https://www.github.com/Sparkenstein)
- You?

## FAQ

#### What's up with the bad looking UI?

Well, it was even worse previously! I am not a UI developer. I understand React, but not colors.
Feel free to contribute any changes that you think might make it look better.

#### Do I need to know Rust to get started?

Absolutely not. I don't know Rust myself and I have a complete application that I created from scratch.

## NEED HELP WITH:

- More features
- Testing
- Can the logo be improved?
- Regex Tester is kinda broken, monaco gives a headache
- Fix ALL FIXME: s and TODO: s

## License

[MIT](https://choosealicense.com/licenses/mit/)
