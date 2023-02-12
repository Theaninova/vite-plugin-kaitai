import type {KaitaiContext} from "./context"
import {mkdir, writeFile} from "node:fs/promises"
import {dirname, join, relative, basename} from "node:path"
import {Attribute, EnumSpec, KsySchema, ParamSpec} from "./kaitai-struct"

export function toTitleCase(kebabCase: string): string {
  return kebabCase.replace(/(?<=^|_)\w/g, it => it.toUpperCase()).replace(/_/g, "")
}

export function toCamelCase(kebabCase: string): string {
  return kebabCase.replace(/(?<=_)\w/g, it => it.toUpperCase()).replace(/_/g, "")
}

export function toScreamingCase(kebabCase: string): string {
  return kebabCase.toUpperCase()
}

export async function generateTypes(this: KaitaiContext, yaml: any, target: string) {
  const targetFolder = dirname(
    join(this.config.root, this.kaitaiOptions.generatedTypesFolder, relative(this.config.root, target)),
  )
  await mkdir(targetFolder, {recursive: true})
  await writeFile(join(targetFolder, `${basename(target)}.d.ts`), generateTypeDefinition(yaml))
}

export function generateTypeDefinition(spec: KsySchema): string {
  return [
    ...(spec.meta.imports || []).map(
      it => `import type ${toTitleCase(basename(it))} from "${basename(it) === it ? `./${it}` : it}.ksy"`,
    ),
    toInterface(spec.meta.id, spec, true, `constructor(buffer: ArrayBuffer)`),
    ...Object.entries(spec.types).map(([name, type]) => toInterface(name, type)),
    generateEnums(spec.enums),
  ].join("\n")
}

export function toInterface(
  name: string,
  raw: {
    seq: Attribute[]
    instances: Record<string, Attribute>
    params: ParamSpec[]
  },
  defaultExport = false,
  constructor?: string,
): string {
  return `
export ${defaultExport ? "default " : ""}class ${toTitleCase(name)}${
    "params" in raw
      ? `<${raw.params
          .map(it => `${toScreamingCase(it.id)} = ${getAttributeType(it as Attribute)}`)
          .join(", ")}>`
      : ""
  } {
${[
  constructor ? `  public ${constructor}` : `  private constructor()`,
  ...(raw.params || []).map(it => `  readonly ${toCamelCase(it.id)}: ${toScreamingCase(it.id)}`),

  ...(raw.seq || []).map(it => `  readonly ${toCamelCase(it.id)}: ${getAttributeType(it as Attribute)}`),

  ...Object.entries(raw.instances || []).map(
    ([name, value]) => `  get ${toCamelCase(name as string)}(): ${getAttributeType(value as Attribute)}`,
  ),
]
  .filter(it => !!it)
  .join("\n\n")}
}`
}

export function getAttributeType(attribute: Attribute) {
  const convertExternalType = (it: string) =>
    convertNativeType(it) ||
    it
      .replace(/(?<=^\w+\().+(?=\)$)/, it =>
        it
          .split(",")
          .map(it => Number(it.trim()) || "unknown")
          .join(", "),
      )
      .replace(/(?<=^\w+)\(/, "<")
      .replace(/\)(?=$)/, ">")
      .replace(/^\w+/, it => toTitleCase(it))
  const typeName = attribute.enum
    ? toTitleCase(attribute.enum)
    : typeof attribute.type === "string"
    ? convertExternalType(attribute.type)
    : typeof attribute.type === "object"
    ? [...new Set(Object.values(attribute.type.cases).map(it => convertExternalType(it)))].join(" | ")
    : "unknown"
  return attribute.repeat
    ? Number(attribute["repeat-expr"])
      ? `[${Array.from({length: Number(attribute["repeat-expr"])}, () => typeName).join(", ")}]`
      : `${typeName}[]`
    : typeName
}

export function convertNativeType(type: string): string | undefined {
  const isArray = /\[]$/.test(type)
  type = type.replace(/\[]$/, "")
  const jsTypeName = /^([suf]\d+|b[1-9]\d*)([bl]e)?$/.test(type)
    ? "number"
    : /^b1|bool$/.test(type)
    ? "boolean"
    : /^strz?$/.test(type)
    ? "string"
    : /^struct$/.test(type)
    ? "object"
    : /^io|any$/.test(type)
    ? "any"
    : /bytes/.test(type)
    ? "number[]"
    : undefined
  return jsTypeName && isArray ? `${jsTypeName}[]` : jsTypeName
}

export function generateEnums(enumSpec: Record<string, EnumSpec>) {
  return Object.entries(enumSpec)
    .map(
      ([name, spec]) =>
        `
export declare const enum ${toTitleCase(name)} {
${Object.entries(spec)
  .map(([key, value]) => `  ${toScreamingCase(typeof value === "string" ? value : value.id)} = ${key},`)
  .join("\n")}
}`,
    )
    .join("\n")
}
