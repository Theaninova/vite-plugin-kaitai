import KaitaiStructCompiler from "kaitai-struct-compiler"
import type {KaitaiContext} from "./context"

export async function compileKaitaiToJs(this: KaitaiContext): Promise<string | undefined> {
  const compiler = new KaitaiStructCompiler()
  const yaml = await this.yamlImporter.importYaml(this.id)
  const files = await compiler.compile("javascript", yaml, this.yamlImporter, false)

  // wrap the output in a proper module...
  return `
    import {KaitaiStream} from "kaitai-struct"

    export default function (source) {
      const self = {KaitaiStream};
      ${Object.values(files).join("\n")}

      const outputFunction = Object.entries(self).find(([name]) => name !== 'KaitaiStream')[1]
      return new outputFunction(new KaitaiStream(source))
    }
  `
}
