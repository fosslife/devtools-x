# Changelog

All notable changes to this project will be documented in this file.

## [devtoolsx-v2.10.0] - 2024-07-05

### 🚀 Features

- Rewrite image module in imagers
- New build for arm mac, cleanup
- Navbar cleanup
- Move settings to homepage
- Categories for items
- Colorful group icons
- Support both grouped and ungrouped views, settings in sidebar
- Vertical layout
- Auto open accordion for path

### 🐛 Bug Fixes

- Hardcoded width
- Vertical image overflow
- Error handling
- *(ci)* Js heap out of mem

### 📚 Documentation

- Rest client
- Update FAQ
- Star history
- Reorder features

### ⚙️ Miscellaneous Tasks

- Merge conflicts
- Refactoring and error handling
- Cleanup
- Smaller app drawer
- *(ui)* Bigger icons, flex fix
- Cleanup
- Unused vars rule
- Deps upgrade

### Deps

- React-icon version upgrade

### Release

- V2.10.0
- V2.11.0

## [devtoolsx-v2.9.0] - 2024-03-31

### 🚀 Features

- Text compressor with multiple algorithms

### 🐛 Bug Fixes

- Incorrect input type

### 📚 Documentation

- New text compressor

### Release

- V2.9.0

## [devtoolsx-v2.8.0] - 2024-03-30

### 🚀 Features

- All version upgrade because why not
- Version upgrades

### 🐛 Bug Fixes

- Incorrect update URL, navbar permanent reorder

### ⚙️ Miscellaneous Tasks

- Refactor logic
- Cleanup

## [devtoolsx-v2.7.0] - 2024-03-27

### 🚀 Features

- Uuid generator

### Release

- V2.7.0

## [devtoolsx-v2.6.0] - 2024-03-26

### 🚀 Features

- Onboarding

### Release

- V2.6.0

## [devtoolsx-v2.5.0] - 2024-03-26

### 🚀 Features

- Cron parser
- Scale
- Copy text button

### 🐛 Bug Fixes

- Skip aarch64 support
- Error type

### ⚙️ Miscellaneous Tasks

- Data and visual improvements

### Release

- V2.5.0

## [updater] - 2024-03-25

### 🚀 Features

- Scripts for prepare and auto updater
- New theme
- Updater pub key

### 🐛 Bug Fixes

- Incorrect asset copy
- Native fetch
- Missing env vars
- Wrong script name
- Add package on CI
- Add dep

## [devtoolsx-v2.4.0] - 2024-03-11

### 🚀 Features

- Tighten security
- Ping graph
- Basic anon analytics

### ⚙️ Miscellaneous Tasks

- Cleanup done todo comments

### Release

- V2.4.0

## [devtoolsx-v2.3.0] - 2024-02-27

### 🚀 Features

- Bulk image convert basic layout
- Lorem-ipsum
- Draggable items
- Sidebar drag-drop and cleanup
- Pdf viewer basic
- Use preact-compat in prod
- Base64 to image module, enable ping
- Using unique strings instead of numerical IDs
- New wip readme
- New logos
- Bulk image progress
- New logo, favicon

### 🐛 Bug Fixes

- Download qr code
- Use css to show pin instead of react state
- Replace custom pastebin with github gist
- Generate image on mode change

### ⚙️ Miscellaneous Tasks

- Linting
- Eslintrc
- Merge modules into one
- Cleanup
- Incorrect table implementation

### [feat]

- Qr code generator

### Release

- V2.3.0

## [devtoolsx-v2.2.0] - 2024-02-12

### 🚀 Features

- Image optimization, lazy loading script and es6 import
- Url parser
- Even more optimization for vips loading
- Html preview

### Release

- V2.2.0

## [devtoolsx-v2.1.0] - 2024-02-12

### 🚀 Features

- Ping tool
- Image workins in dev
- Images are working in prod
- Resize instantly after selecting image
- Base64 separate modules
- Minifier/beautifier
- New tauri action
- Release v2.1.0
- *(ci)* Fix broken CI
- Upgrade pnpm version
- Move to pnpm
- Move to yarn

### ⚙️ Miscellaneous Tasks

- Cleanup

## [DevToolsv2.0.0] - 2024-02-06

### 🚀 Features

- Support password type
- Stateless password manager
- Default theme support
- Volatile storage for config
- Backup and restore settings
- Delete row feature
- Open and save markdown files
- Lots of cleanup, collapsible navbar
- *(navbar)* Migrate to css-modules
- App style
- All version upgrade

### 🐛 Bug Fixes

- Pinned cards different layouts
- *(readme)* Borked english
- Minimum width
- Styles cleanup
- Css cleanup and overflow fix
- Css fixes
- Styling
- Whatever css fixes
- Min node v
- Tsc

### ⚙️ Miscellaneous Tasks

- Cleanup
- Future todo

### [chore]

- Wip can see something

### [feat]

- Better styles

### Release

- V1.9.1
- V2.0.0

## [DevToolsv1.8.1] - 2023-04-06

### Release

- V1.8.1

## [DevToolsv1.9.1] - 2023-04-06

### 🚀 Features

- Update deps
- Remove hardcoding, a lot better navbar
- Restructre styles
- Swc react compiler
- Home nav style
- Error handling and performance improvements
- V1.7.2
- Migrate db from lowdb to rust kb store
- File hash as separate module
- Epoch convertor
- Reusable copy component

### 🐛 Bug Fixes

- Move settings to topbar
- Correct font weights
- Update typescript to v5
- Checkbox group css
- Deps and ts error
- Handle incorrect datatypes
- Db in window
- Whatever typescript need
- Store previous hash text
- Utils path
- Password save as file
- Tabs UI for better visibility

### Release

- V1.8.1

## [DevToolsv1.7.1] - 2022-09-20

### 🐛 Bug Fixes

- Completely remove image module
- Doc

## [DevToolsv1.7.0] - 2022-09-18

### 🚀 Features

- *(doc)* Reorder features
- Add loader to show compression progress
- Navigate on entire row click
- Loader for large file hashes

### 🐛 Bug Fixes

- Animation on self route change
- Copy buttons padding
- Casing
- Broken input boxes
- Navbar casing and hover
- Linting

### Release

- V1.7.0

### Todo

- New items

## [DevToolsv1.6.0] - 2022-08-18

### 🚀 Features

- REST API module
- *(rest)* Params support
- Headers
- Delete and enable params
- *(ui)* Global styles + theme
- *(json)* Move away from jsoneditor
- *(monaco)* New theme
- Hashing tools rewrite
- Moved random text generator, entropy calculation
- Exclude chars
- Initial db for hashes
- Moved jwt
- Moved sql formatter to new UI
- Regex
- Support diff. needs TS fix
- Moved text diff
- Move markdown to new ui
- Move yamljson module
- Move pastebin to new ui
- Move scratchpad
- Rest configuration
- Fix CSP
- Move image to new UI
- Move rest API tester to new UI
- Move unit convertor
- Temp icons
- Color utils cmyk and hsl conversion
- Global spotlight to jump
- Settings drawer
- Light theme and toggle support
- Theme toggle action
- Unstable features tooltip
- Enable debug window
- *(doc)* Add coc and contributing
- Icon assets for all sizes
- Add banner
- Debug launch configuration
- Devtools on dev and prod

### 🐛 Bug Fixes

- Card width
- Unused imports
- UI changes
- *(nav)* Remove theme for now
- *(wip)* Remove chakra ui
- *(wip)* Remove chakra ui
- Responsive width
- Auto focus on new tab and close tab
- Main layout
- Overflow
- Override the options
- Width
- Cleanup
- Proper casing on folders
- Cleanup
- Cleanup ace
- Cleanup ace
- Types and values
- Move react playground
- Layout on all tabs closed
- Fixed position top bar
- Add label
- New heades
- Ui fixes and light theme
- Grid ui for welcome cards
- Increase default font size
- Reset selection on error
- Scroll high blocking last item
- *(ui)* Extra padding on left

### 🚜 Refactor

- Cleanuip
- Reuse outputbox
- Lint
- Lint
- *(doc)* New badges

### 📚 Documentation

- Todo
- Update readme
- Need help

### ⚙️ Miscellaneous Tasks

- Reuse Params component
- Cleanup TODOs

### WIP

- Colors

### Assets

- Custom logo

### Cleanup

- Unnecessary deps. comment

### Conf

- Axios and start script

### Deps

- Vite server port

### Release

- V1.6.0

### Releave

- V1.6.0

### Ui

- *(wip)* Remove chakra UI

## [DevToolsv1.5.0] - 2022-06-19

### 🚀 Features

- Scratchpad
- Image tools
- Convert image and save
- Save file after resize
- Image
- Search navbar items
- Pinning items working
- Pin feature on nav and home
- *(wip)* Unit conversion
- *(ui)* Animation on route change
- Tabs support in json-editor
- Generate many random strings at once
- Generate multiple strings
- *(ui)* Heading
- *(ui)* Heading on all components
- Unit converter
- Calculate on swap
- Global modal
- Focus on escape
- *(wip)* React playground
- React live editor

### 🐛 Bug Fixes

- Don't print the app
- Removing toggle for now
- Width and cyclic jsonm
- Disable ctrlP and F3
- Remove prefetch
- Lint
- *(ui)* Better animation and height fix
- Repl scroll increasing
- Cards color to match theme
- Hide outside links
- App crashing sometimes on lazyload
- Better styling
- Type error
- Infinite re-render
- Lazy loading
- Empty chunk
- Language support in editors

### 🚜 Refactor

- Vite plugins
- Color
- Layout changed
- Using reusable monaco  wrapper

### ⚙️ Miscellaneous Tasks

- Disable image tools until tauri issue is resolved
- Disable image feature
- Version upgrade
- Upgrade to latest stable tauri

### Build

- Refactor chunks

### Dep

- Unit conversion

### Deps

- Upgrade latest

### Release

- V1.2.13
- V1.3.0
- V1.4.0
- V1.5.0

### Ui

- Better fade animation

## [DevToolsv1.1.13] - 2022-04-03

### 🚀 Features

- New UI and colors
- Text diff
- Language selection
- Markdown preview and editor
- Yaml json convertro
- Support monaco offline
- *(wip)* Pastebin
- Pastebin

### 🐛 Bug Fixes

- Regex tester
- *(scope)* Update version
- Titles
- Cleanup unused deps
- Disable right click
- Disable typecheck of node modules
- Monaco offline support
- React v18 upgrade
- Lint

### Dep

- Ace-editor diff doesn't work so back to monaco editor
- Markdown preview
- Monaco-editor for types

### Deps

- Yaml
- Upgrade to latest

### Release

- 1.1.13

### Releast

- 1.0.3

## [DevToolsv1.0.1] - 2022-03-01

### 🚀 Features

- Fs scope for read and write
- Remove monaco, use ace
- Jsoneditor custom component
- Ace editor

### 🐛 Bug Fixes

- Full width
- Monaco editor cursor issue
- Entire conf dir generation logic
- Layout
- Darkmode reset on leave
- Ignore type
- Css overflow on button
- *(ui)* Remove cards

### Deps

- Upgrade to latest
- Update to rc candidate
- Remove monaco use ace

### Release

- V1.0.1

## [DevToolsv0.1.8] - 2022-02-13

### 🚀 Features

- Color picker utility
- Regex tester

### 🐛 Bug Fixes

- Hardcoded color on light theme

### ⚙️ Miscellaneous Tasks

- Cleanup
- Refactoring routes
- Lint warnings fixes

### Dep

- Color picker

### Release

- 0.1.7

### Releast

- 0.1.8

## [DevToolsv0.1.6] - 2022-02-13

### 🚀 Features

- Number base converter
- Sql formatter

### 🐛 Bug Fixes

- Jwt error handling
- Remove monaco editor

### Dep

- Base converter
- Sql formatter

### Misc

- Dev hint

### Release

- 0.1.5
- 0.1.6

## [DevToolsv0.1.4] - 2022-02-10

### 🚀 Features

- Jwt decode

### 🐛 Bug Fixes

- *(utils)* Crash when launching app for the first time
- Sort order

### Conf

- Change app identifier

### Release

- 0.1.4

## [DevToolsv0.1.3] - 2022-02-06

### 🚀 Features

- Lazy loading components
- Profile smaller release
- *(hash)* Calculate hash of a file

### 🐛 Bug Fixes

- Eslint config
- Quotes
- *(CI)* Tool name in release

### Conf

- Vscode settings for uniform formatting
- Prettier config
- Cleanup

### Dep

- Loadable for async loading

### Deps

- Eslint and prettier setup

### Lint

- *(format)* Single quotes to double

### Misc

- Eslint and formatting

### Release

- 0.1.3
- 0.1.3

## [app-v0.1.2] - 2022-02-05

### 🚀 Features

- Db and initial config setup
- Hashes tools
- Popular hashing functions
- Truncate middle part of hash for display
- Generate random text (pass)

### 🐛 Bug Fixes

- App metadata
- Debounce hook
- Bigger cards

### Conf

- Build targets for toplevel await

### Dep

- Using react-hookz
- *(add)* Crypto js for hashes
- Gen-password util

### Release

- App version

### Update

- Node version for github actions

## [app-v0.1.0] - 2022-01-27

### 🚀 Features

- Dark theme first
- Routes
- *(component)* Welcome placeholder
- Card and json-formatter
- Navbar using cards
- Basic prototype of json
- Context menu command
- Json diff

### 🐛 Bug Fixes

- Colorprovider script
- Custom scrollbar
- Theme color
- Styles
- Type
- Formatting and config
- Auto width issue

### 🚜 Refactor

- Organize imports

### Add

- *(dep)* For type hints

### Init

- Devtools

### Route

- Json-formatter

<!-- generated by git-cliff -->
