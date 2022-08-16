# DevTools-X


![image](assets/banner.png)
### inspiration

`devutils` is mac only and `devtoys` is windows only.
so heres devtools-x a x-platform collection of dev-tools, lighter, probably safer, and feature rich collection of devepment utilities.



## Badges

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)

[![GitHub issues](https://img.shields.io/github/issues/fosslife/devtools-x)](https://github.com/fosslife/devtools-x/issues)

[![GitHub stars](https://img.shields.io/github/stars/fosslife/devtools-x)](https://github.com/fosslife/devtools-x/stargazers)




## Features

Entire project is a webapp. it uses `monaco editor` as text editor everywhere. so if you use vs-code then all the keyboard shortcuts like
Ctrl-F or Ctrl-X will work just fine. or even opening vscode command menu to perform complicated operations like format or set language etc


- JSON format and minify
- Hashing of text and files
- Random text generator (for passwords)
- JWT
- Number convertor
- SQL formatter
- Color picker and converter
- Regex Tester
- Text Diff (with syntax highlight and code editing)
- Markdown write and preview
- Yaml-Json converter
- A Pastebin
- Language scratchpad
- Image Compressor with preview
- Unit converter
- React live playground (without a server)
- Rest API tester
- And many more to come...




## Installation

Download the correct package from github releases section. and start using it :D

## Tech Stack

It's very important for everyone to understand this section. People have choices, just like me. Some of you may not use a tool
just because it's electron. and the hate is justifiable. I personally don't want to run a chrome + nodejs for every app I launch

Which is why devtool-x is **NOT WRITTEN IN ELECTRON**

Devtools-X uses native webview to achieve the desktop application, called as [Tauri](tauri.studio/). native webview gives me
development speed of electron (react+ts) while being secure and low on ram, and staying cross platform at the same time.



## Authors

- [@Sparkenstein](https://www.github.com/Sparkenstein)
- You?




## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.




## FAQ

#### Whats up with the bad looking UI

It was even worse. I am not a UI developer, I understand react, not colors. 
feel free to contribute

#### Do I need to know rust to get started?

Absolutely not. I don't know rust myself and I have a complete application created from scratch.


## NEED HELP

- More features
- Testing
- LOGO PLS.
- Regex Tester is kinda broken, monaco gives headache
- Fix ALL FIXME: s and TODO: s
- a db integration for storing configuration? optional
- Security. Check CSP and fix the worker loading
