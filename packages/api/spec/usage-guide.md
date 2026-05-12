<!-- SPDX-License-Identifier: CC-BY-4.0 -->
# L0011 User Guide

Agent-facing guide for authoring L0011 programs. Read this before composing a `create_item` prompt or an `update_item` modification.

## Overview

L0011 is a minimal Graffiticode display dialect with exactly two primitives: `hello` for rendering a greeting string and `image` for rendering an image from a URL. Input is a natural-language description of a single item to display; output is an L0011 program whose evaluation renders that item in the hosted React app. L0011 is the right tool when the job is "show a 'hello, X' greeting" or "display this image"; anything richer — themed output, stylable text, captions, layout, multiple elements composed together — belongs in a higher-numbered dialect (L0012 adds a theme; L0002 adds the full base language; domain dialects handle specific artifacts). L0011 exists primarily as the simplest working example of the Graffiticode pipeline; when the user wants a richer UI, suggest redirecting to a different language rather than padding L0011.

When composing a request, name the thing to show — a hello string or an image URL — and nothing else. Patterns: `hello "world"..` for greetings (renders `hello, world!`), `image "https://example.com/photo.png"..` for images. Every program terminates with `..`. There is no composition between `hello` and `image` in L0011; pick one per item.

In scope: a single `hello` greeting or a single `image` per program. Out of scope: themes (use L0012 or L0002), styled or LaTeX-rendered text, captions or alt text, multiple elements in one item, interactive controls, and anything that requires the broader base language (arithmetic, lists, lambdas — those belong in L0002 and above).

## Vocabulary Cues

Say this to get that:

- **hello** — "say hello to X" / "render a 'hello, X' greeting" → `hello "X"..`.
- **image** — "display the image at URL" / "show this picture" → `image "https://..."..`.
- **Program terminator** — every L0011 program ends with `..`.

## Example Prompts

- *"Render a hello greeting for 'world'."* → `rendered_display`
- *"Say hello to 'reader'."* → `rendered_display`
- *"Display the image at https://example.com/photo.png."* → `rendered_display`
- *"Show the picture at https://example.com/cat.jpg."* → `rendered_display`

## Out of Scope

- **Themes and styling** — use L0012 (adds `theme`) or L0002 (adds `theme` plus the full base language).
- **Multiple elements or composition** — L0011 emits a single `hello` or a single `image` per program.
- **Rich text or LaTeX** — plain strings only.
- **Interactive controls** — L0011 has no buttons, inputs, or state.
- **Any domain-specific artifact** — assessments, spreadsheets, board content, etc. belong in the corresponding domain dialect.
