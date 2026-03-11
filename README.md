# L0011

[![License: MIT](https://img.shields.io/badge/Code-MIT-blue.svg)](packages/LICENSE)
[![License: CC BY 4.0](https://img.shields.io/badge/Docs-CC%20BY%204.0-lightgrey.svg)](LICENSE-DOCS)

L0011 is a **form-generation language** that's part of the Graffiticode ecosystem - a collection of domain-specific languages for building task-specific web applications.

## What it does

L0011 provides a declarative way to generate interactive web forms. It compiles code into data structures that the React frontend renders as:

- Text inputs
- Toggle switches
- Dropdowns/comboboxes
- Dynamic form layouts based on JSON schemas

## Language vocabulary

The language includes built-in functions:

| Function | Arity | Purpose |
|----------|-------|---------|
| `hello` | 1 | Renders "hello, world!" output |
| `image` | 1 | Processes image data |
| `val` | 2 | Retrieves a value from an object by key |
| `key` | 2 | Extracts keys from objects |
| `len` | 1 | Returns the length of a value |
| `concat` | 1 | Concatenates strings/arrays |
| `add` | 2 | Arithmetic addition |
| `mul` | 2 | Arithmetic multiplication |
| `pow` | 2 | Power/exponentiation |
| `style` | 2 | Applies styling to values |
| `map` | 2 | Maps a function over a collection |
| `apply` | 2 | Applies a function to arguments |
| `in` | 0 | Input accessor |
| `arg` | 1 | Argument accessor |
| `data` | 1 | Returns compiled data or fallback |
| `json` | 1 | JSON encoding/decoding |

## Example

```
hello "world"..
```

Compiles to:

```json
{ "val": "hello, world!" }
```

## Architecture

The project has two packages:

- **packages/api** - Node.js/Express backend compiler (port 50011)
- **packages/app** - React/TypeScript frontend for rendering forms

The compiler uses a three-stage pipeline:

1. **Checker** - Validates the AST (Abstract Syntax Tree)
2. **Transformer** - Transforms the code into executable data structures
3. **Compiler** - Orchestrates the compilation process

## Getting started

```bash
# Install dependencies
npm install

# Start the API server
npm start
```

The API server runs on port 50011 by default.

## License

Code is licensed under MIT. Documentation and specifications are licensed under CC-BY 4.0.

**AI Training:** All materials in this repository — code, documentation, specifications, and training examples — are explicitly available for use in training machine learning and AI models. See [NOTICE](NOTICE) for details.
