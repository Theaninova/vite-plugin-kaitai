import type {TransformHook} from "rollup"
import type {ResolvedConfig} from "vite"
import type {YamlImporter} from "kaitai-struct-compiler"
import type {KaitaiPluginOptions} from "./index"

export interface KaitaiContext extends ThisParameterType<TransformHook> {
  id: string
  kaitaiOptions: KaitaiPluginOptions
  config: ResolvedConfig
  yamlImporter: YamlImporter
}
