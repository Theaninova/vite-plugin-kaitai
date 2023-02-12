# vite-plugin-kaitai

Allows you to directly import `.ksy` files

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
