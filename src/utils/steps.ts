import { ShepherdOptionsWithType } from "react-shepherd";

const buttons = [
  {
    classes: "shepherd-button-secondary",
    text: "Exit",
    type: "cancel",
  },
  {
    classes: "shepherd-button-primary",
    text: "Back",
    type: "back",
  },
  {
    classes: "shepherd-button-primary",
    text: "Next",
    type: "next",
  },
];

const steps: ShepherdOptionsWithType[] = [
  {
    id: "intro",
    buttons: buttons,
    // classes: "custom-class-name-1 custom-class-name-2",
    // highlightClass: "highlight",
    // scrollTo: false,
    cancelIcon: {
      enabled: true,
    },
    title: "Welcome to DevTools-X!",
    text: ["Cross-platform collection of utilities for developers."],
  },
  {
    id: "shortcuts",
    buttons: buttons,
    cancelIcon: {
      enabled: true,
    },
    title: "Shortcuts",
    text: "This app provides many shortcuts. Press Shift + ? to see all available shortcuts from anywhere",
  },
  {
    id: "search",
    buttons: buttons,
    cancelIcon: {
      enabled: true,
    },
    title: "Search",
    text: "For example. press `/` to search for a page",
  },
  {
    id: "navbar",
    buttons: buttons,
    cancelIcon: {
      enabled: true,
    },
    title: "Navbar",
    text: "Click on the navbar links to navigate between pages",
    attachTo: {
      element: "#navbar",
      on: "right",
    },
    highlightClass: "highlight",
  },
  {
    id: "navbar-order",
    buttons: buttons,
    cancelIcon: {
      enabled: true,
    },
    title: "Navbar ordering",
    text: "You can reorder the navbar links by dragging and dropping them",
    attachTo: {
      element: "#navbar",
      on: "right-start",
    },
    highlightClass: "highlight",
  },
  {
    id: "github",
    buttons: buttons,
    cancelIcon: {
      enabled: true,
    },
    title: "GitHub",
    text: "If there's any issue, you can report it on GitHub fosslife/devtools-x",
  },
];

export default steps;
