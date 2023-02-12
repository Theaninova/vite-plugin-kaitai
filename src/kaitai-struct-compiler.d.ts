declare module "kaitai-struct-compiler" {
  export interface YamlImporter {
    importYaml(name: string): any
  }

  export default class KaitaiStructCompiler {
    compile(language: string, yaml: any, yamlImporter?: YamlImporter, debugMode?: boolean): Promise<string>
  }
}
