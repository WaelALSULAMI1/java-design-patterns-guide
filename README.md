# Java Design Patterns Guide

An interactive, beginner-friendly guide to eight classic object-oriented design patterns, explained through the problems they solve and illustrated with short, readable Java examples.

**Website:** published from this repository with GitHub Pages. The address is listed in the repository’s *About* panel.

## Features

- **Eight complete pattern guides**, each covering intent, problem, solution, when to use it, real-world examples, a Java example, a step-by-step code walkthrough, common mistakes, and advantages and disadvantages.
- **Practice on every page:** multiple-choice and scenario questions where every option explains why it is right or wrong, plus a code-completion or find-the-mistake exercise.
- **Scenario quiz** that mixes all eight patterns, with a full review at the end.
- **Side-by-side comparison** of any two patterns, highlighting the difference that matters most.
- **Search and category filters** that match pattern names as well as the problems they solve.
- **Syntax-highlighted Java** with copy buttons, loaded directly from the source files in this repository.
- **Light and dark themes**, a responsive layout for phones and desktops, and keyboard-accessible controls.
- **Progress tracking** for the current browser session, with no accounts and no data sent anywhere.

## Patterns covered

| Pattern | Category | Example used in the guide |
|---|---|---|
| Singleton | Creational | Shared application configuration |
| Prototype | Creational | Cloning a pre-filled order template (copy constructor and `Cloneable`) |
| Builder | Creational | A pizza with required and optional parts |
| Factory Method | Creational | Email, SMS and push notifications, contrasting Simple Factory with the GoF pattern |
| Abstract Factory | Creational | Light and dark UI component families |
| Adapter | Structural | An XML payment gateway behind a JSON payment interface |
| Bridge | Structural | Remote controls and devices |
| Composite | Structural | Files and folders |

## Educational approach

Each guide starts from a concrete situation where a design goes wrong, then introduces the pattern as the answer to that problem. The Java examples are complete but intentionally small, so the structure of the pattern stays visible. The walkthrough highlights the lines that matter, and the common-mistakes section shows broken code next to the fix. The exercises explain incorrect answers as carefully as correct ones, because most of the learning happens there.

The guide also clarifies distinctions that often cause confusion: Simple Factory versus Factory Method, shallow versus deep copies, object versus class adapters, and the safe versus transparent forms of Composite.

## Technology

- Plain HTML, CSS and JavaScript modules, with no framework, build step or runtime dependencies.
- A small custom syntax highlighter for Java.
- Self-hosted fonts: Readex Pro and JetBrains Mono.
- Hash-based routing, so every page and section has a shareable link that works on static hosting.
- Deployed to GitHub Pages with a GitHub Actions workflow.

## Project structure

```
java-design-patterns-guide/
├── index.html                 Single-page application shell
├── 404.html                   Redirects unknown paths to the site
├── assets/
│   ├── css/main.css           Design tokens, layout, themes
│   ├── js/                    Router, views, code viewer, highlighter, exercises
│   └── fonts/                 Font files and their licences
├── content/
│   ├── patterns.js            Overview data for search, cards and comparison
│   ├── patterns/              One full guide per pattern
│   ├── scenarios.js           Scenario quiz
│   ├── ui.js                  Interface text
│   └── site.js                Repository link settings
├── java/patterns/
│   ├── creational/            Singleton, Prototype, Builder, Factory Method, Abstract Factory
│   └── structural/            Adapter, Bridge, Composite
└── .github/workflows/pages.yml
```

The Java files are organised by package (`patterns.creational.builder`, `patterns.structural.adapter`, and so on). Each example includes a `Demo` class that shows how client code uses the pattern.

## License

Released under the [MIT License](LICENSE). The bundled fonts are distributed under the SIL Open Font License; see [`assets/fonts`](assets/fonts).
