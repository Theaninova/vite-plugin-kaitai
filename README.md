# vite-plugin-kaitai

![](https://img.shields.io/npm/v/vite-plugin-kaitai)

Allows you to directly import [Kaitai Struct](https://kaitai.io/) (`.ksy`) files,
including auto-generating some (somewhat rudimentary) type definitions.

## Installation

```sh
npm i -D vite-plugin-kaitai kaitai-struct
```

`vite.config.js`

```js
/** @type {import("vite").UserConfig} */
export default {
  plugins: [..., kaitai()],
}
```

`tsconfig.json`

```json5
{
  compilerOptions: {
    rootDirs: [
      "./",
      "./.svelte-kit/types", // add this too if you're using SvelteKit!
      "./generated",
    ],
  },
}
```

## Usage

```typescript
import FileFormat from "path/to/file-format.ksy"

const parsedFile = new FileFormat(fs.readFileSync(...))
```
