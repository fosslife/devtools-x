# Contributing

devtools-x is build with native webview using `tauri` and `react` for the frontend. the goal of this project will always remain as to provide
a safe, fast and cross-platform tool for developers to work with. if you want to get started to contribute to this project keep reading below

## Where can I contribute?

- Lots of this are in pending
- Checkout project dashboard here: [Link](https://github.com/orgs/fosslife/projects/1)
- Apart from adding new features you can also help out in:
  - Code cleanup
  - Security checks (There are few loopholes at the moment)
  - Writting UI test cases
  - Optimizing UI
  - Finishing all `TODO:s` and `FIXME:s`
  - Fixing Typescript type errors
  - Maintaing projects Issues, PRs,
  - Documenting, grammar, spelling checks etc.
  - Increasing social media presence
  - UX improvements (Usability)
  - UI improvements (Look and feel)
  - Performance improments (writing heavy workload in rust instead of JS)
  - Benchmarking

## Getting Started

### Rust

First yo need to have rust toolchain installed on your PC. if you have, feel free to skip this section. if you don't, visit [rustup.rs](https://rustup.rs/) and follow the instructions based on your operating system.

if you are on windows 10 and want to install rustc on WSL, you might need a remote GUI application like GWSL or vcxsrv. I haven't tested either of them so not sure how to make them work

on windows 11, WSL2 now supports native GUI so you **should** be fine, although I haven't tested that as well.

### Tauri

Tauri is native webview, it needs few system specific libraries for running and bundling the application.
they may change over time so follow the official [tauri documentation](https://tauri.app/v1/guides/getting-started/prerequisites) to install tauri dependencies

### Checkout

Once you have rust setup (check with `rustc --version` or `cargo --version`), there's nothing really to do.

#### Fork the project

create a fork on github by using `fork` button

#### checkout the project

```
git clone https://github.com/{yourname}/devtools-x
```

#### Install the dependencies

this project uses `yarn` for managing dependencies. install the dependencies using

```
yarn install
```

#### Run

```
yarn start
```

or

```
yarn tauri dev
```

this will open up the dev window on your machine.

### New Feature

Developing new feature after this is easy. just head on to `src/` for all the frontend code. any backend (rust) code is inside `src-tauri` folder. If you want to create a new feature, lets say, `Foo`

- assuming you have forked the repo, and checked it out
- create a new branch with either `feat/` or `fix/` nomenclature.
- make sure to have an issue open for the same feature or fix.
- create a folder under `src/Features/Foo/bar.tsx`.
- create a navbar entry in `src/Layout/Navbar.tsx`. just add one more entry in `data` array
- create route for the same in `App.tsx`, just add one more `Route` Component.
  - Make sure this component is `loadable`, check how other components are imported.
- Make sure to keep performance in mind, always develop like we have max 10mb-ish ram.
- eg: use properly `useCallback` or `useMemo` wherever you can, defer heavy computations to rust etc
- Keep Usability in mind. UX > UI
- follow commit convention as much as possible. it's not good to see commit messages like "please work"
- Once development is done, Open a Pull Request to `feature` branch.
- Mention the issue number that you created above in the PR.
- Wait until it is merged
