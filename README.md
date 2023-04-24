# DevTools-X

![image](assets/banner.png)

### Inspiration

`devutils` is macOS-only, and `devtoys` is Windows-only.  
So here's DevTools-X -- an x-platform collection of dev-tools that is lighter, safer, and full of feature rich development utilities.

> Note: Application is under development, expect some bugs. 

## Badges

![MIT License](https://img.shields.io/github/license/fosslife/devtools-x.svg)
![GitHub issues](https://badgen.net/github/issues/fosslife/devtools-x) ![GitHub stars](https://badgen.net/github/stars/fosslife/devtools-x)
![Latest release](https://badgen.net/github/release/fosslife/devtools-x)

## Installation

Download the relevant package from Github Releases section, and start using it! :D  
More ways to install are on their way.

## Features

The entire project is a web app (not Electron, read below). It uses Monaco as the text editor everywhere, so just like VS Code, all the keyboard shortcuts like `Ctrl-F` or `Ctrl-X` will work just fine, even opening the VS Code command menu to perform complicated operations such 'format' or 'set language' and so on. The rest of the features are pretty straightforward.

DevTools-X comes with following features (with demo video):

### Image Compressor with preview [REMOVED TEMPORARILY]

https://user-images.githubusercontent.com/24642451/184826392-6378ee66-187b-4bf0-8c08-fcacbb3836c1.mp4

### Rest API

https://user-images.githubusercontent.com/24642451/184827036-ee6a1a54-5add-4583-ac83-6927a49b7fdb.mp4

### React live playground (without a server)

https://user-images.githubusercontent.com/24642451/184826571-6dd2e7cf-8481-47ae-b716-ba5fb5445846.mp4

### Color picker and converter

https://user-images.githubusercontent.com/24642451/184826188-b853a282-8ebd-48c0-8cbb-0f94efa979b5.mp4

### Regex Tester

https://user-images.githubusercontent.com/24642451/184826215-5d607477-bb69-4a45-bf3f-4d0709b445e9.mp4

### JSON format and minify

https://user-images.githubusercontent.com/24642451/184825668-4f3e17cf-e505-4a99-b84d-fa306c4a439e.mp4

### Hashing of text and files

https://user-images.githubusercontent.com/24642451/184825782-7fb37a03-d097-4c30-a4a1-12e580a0fea0.mp4

### Random text generator (for passwords)

https://user-images.githubusercontent.com/24642451/184825847-47ecd257-7bbc-4187-9667-10e8a3635ae7.mp4

### Language scratchpad

https://user-images.githubusercontent.com/24642451/184826344-8497f7e6-45b0-4ea9-a399-7115b0044b37.mp4

### JWT

https://user-images.githubusercontent.com/24642451/184825910-53b35492-4f89-4ba2-b402-02382c35fee7.mp4

### Number convertor

https://user-images.githubusercontent.com/24642451/184826029-f4c777bc-fdb7-48a2-aebc-f0f31e927d58.mp4

### SQL formatter

https://user-images.githubusercontent.com/24642451/184826126-0d6d939c-3ebd-4f53-a628-8fd1f32c478b.mp4

### Text Diff (with syntax highlight and code editing)

https://user-images.githubusercontent.com/24642451/184826243-9c9c72ab-9386-4120-9dbb-a05490013cfa.mp4

### Markdown write and preview

https://user-images.githubusercontent.com/24642451/184826282-c897b5d4-a370-4317-9251-2a1e63cbbd73.mp4

### Yaml-Json converter

https://user-images.githubusercontent.com/24642451/184826317-ac4c366a-2579-47b0-861f-83847ddef77b.mp4

### A Pastebin

Video WIP

### Unit converter

https://user-images.githubusercontent.com/24642451/184826530-e5ecfca2-f987-47b3-9d96-5e47f486c758.mp4

### And many more to come...

## Tech Stack

It's very important for everyone to understand this section. People have choices, just like me. Some of you may not use a tool
just because it uses Electron, and the hate is justifiable. I personally don't want to run a Chrome + NodeJS instance for every app I launch.

Which is why DevTools-X is **NOT WRITTEN IN ELECTRON**.

Devtools-X uses a native webview to achieve the same purpose using [Tauri](https://tauri.studio/). Native webview gives me the
development speed of Electron (React + TS) while being secure and efficient on RAM and staying cross platform at the same time.

The UI uses React + TS + [Mantine](https://mantine.dev/).
The backend is Rust.

## Authors

- [@Sparkenstein](https://www.github.com/Sparkenstein)
- You?

## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's Code of Conduct.

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
- Regex Tester is kinda broken, monaco gives headache
- Fix ALL FIXME: s and TODO: s
- Database integration for storing configuration? (low priority)
- Security. Check CSP and fix the worker loading.
- Stress testing, especially for hashers and the image compressor
