import {compileKaitaiToJs} from "./kaitai-compiler"
import type {Plugin, ResolvedConfig} from "vite"
import {yamlImporter} from "./yaml-importer"
import type {KaitaiContext} from "./context"

export const pluginName = "vite-plugin-kaitai"
export type KaitaiPluginOptions = typeof defaultOptions

const defaultOptions = {
  generatedTypesFolder: "generated",
}

export function kaitai(options: Partial<typeof defaultOptions>): Plugin {
  const kaitaiOptions = {...defaultOptions, ...options}
  let config: ResolvedConfig
  return {
    name: pluginName,
    async transform(source, id) {
      if (!/\.ksy$/.test(id)) return

      Object.assign(this, {
        id,
        config,
        kaitaiOptions,
        yamlImporter: yamlImporter(this as KaitaiContext),
      })

      return {
        code: await compileKaitaiToJs.call(this as KaitaiContext),
        map: null,
      }
    },
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
  }
}
