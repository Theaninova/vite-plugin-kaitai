import {Sign} from "crypto"

export interface MetaSpec {
  "id": string
  "title": string
  "application": string | string[]
  "file-extension": string | string[]
  "xref": object
  "license": string
  "ks-version": string | number
  "ks-opaque-types": boolean
  "imports": string[]
  "encoding": string
  "endian": "le" | "be"
}

export type AnyScalar = string | number | boolean | null

export interface Attribute {
  "id": string
  "doc": string
  "doc-ref": string | string[]
  "contents": string | string[]
  "type":
    | TypeRef
    | {
        "switch-on": AnyScalar
        "cases": Record<string, TypeRef>
      }
  "repeat": "expr" | "eos" | "until"
  "repeat-expr": string | number
  "repeat-until": string | boolean
  "if": string | boolean
  "size": string | number
  "size-eos": boolean
  "process": "zlib" | `xor(${string})` | `ro${"l" | "r"}(${number})` | `${string}(${string})`
  "enum": string
  "encoding": string
  "pad-right": number
  "terminator": number
  "consume": boolean
  "include": boolean
  "eos-error": boolean
  "pos": string | number
  "io": string
  "value": string
}

export interface TypeSpec {
  "meta": MetaSpec
  "params": ParamSpec[]
  "seq": Attribute[]
  "types": Record<string, TypeSpec>
  "enums": Record<string, EnumSpec>
  "instances": Record<string, Attribute>
  "doc": string
  "doc-ref": string | string[]
}

export type UnsignedIntType = `u${1 | 2 | 4 | 8}`
export type SignedIntType = `s${1 | 2 | 4 | 8}`
export type BitSizedIntegerType = `b${number}`
export type FloatingPointType = `f${4 | 8}`
export type ByteArrayType = "bytes"
export type StringType = "str" | "strz"
export type BooleanType = "b1" | "bool"
export type StructType = "struct"
export type IoType = "io"
export type AnyType = "any"
export type NumberType = UnsignedIntType | SignedIntType | BitSizedIntegerType | FloatingPointType
export type TypeRef = `${
  | ByteArrayType
  | StringType
  | BooleanType
  | StructType
  | IoType
  | AnyType
  | NumberType
  | string}${"" | "[]"}`

export interface ParamSpec {
  "id": string
  "type": TypeRef
  "doc": string
  "doc-ref": string | string[]
  "enum": string
}

export interface EnumSpec {
  [key: number]:
    | string
    | {
        "id": string
        "doc": string
        "doc-ref": string
        "-orig-id": string
      }
}

export interface KsySchema {
  "meta": MetaSpec
  "doc": string
  "doc-ref": string | string[]
  "params": ParamSpec[]
  "seq": Attribute[]
  "types": Record<string, TypeSpec>
  "instances": Record<string, Attribute>
  "enums": Record<string, EnumSpec>
}
