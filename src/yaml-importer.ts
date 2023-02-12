import type {YamlImporter} from "kaitai-struct-compiler"
import {isAbsolute, basename, dirname, join, relative} from "node:path"
import {readFile} from "node:fs/promises"
import {parse} from "yaml"
import {generateTypes} from "./kaitai-type-generator"
import type {KaitaiContext} from "./context"
import {pluginName} from "./index"

export function yamlImporter(context: KaitaiContext): YamlImporter {
  const importYaml = async (name: string) => {
    name = name.replace(/(?<!\.ksy)$/, ".ksy")
    const importPath = isAbsolute(name) ? name : join(dirname(context.id), name)
    const resolvedFile = await context.resolve(importPath)
    if (!resolvedFile) {
      context.error({
        name: "YAML Resolver Error",
        message: `Could not resolve ${name} (${importPath})`,
        plugin: pluginName,
      })
      return null
    }

    const file = await readFile(resolvedFile.id, "utf8")
    const yaml = parse(file)

    await generateTypes.call(context, yaml)

    return yaml
  }

  return {importYaml}
}
