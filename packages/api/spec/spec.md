<!-- SPDX-License-Identifier: CC-BY-4.0 -->
# L0011 Vocabulary

This specification documents dialect-specific functions available in the
**L0011** language of Graffiticode. These functions extend the core language
with simple display functionality.

The core language specification including the definition of its syntax,
semantics and base library can be found here:
[Graffiticode Language Specification](./graffiticode-language-spec.html)

## Functions

| Function | Signature | Description |
| :------- | :-------- | :---------- |
| `hello` | `<string: string>` | Renders a hello message |
| `image` | `<string: record>` | Displays an image from a URL |

### hello

Renders a hello message that includes the given string.

```
hello "world"  | returns "hello, world!"
```

### image

Displays an image from the given URL string.

```
image "https://example.com/photo.png"
```

## Program Examples

```
hello "world"..
```
