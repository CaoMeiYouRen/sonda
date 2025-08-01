---
outline: deep
---

# JSON report

Generating a report in JSON format is an ideal solution for those who want to integrate Sonda with other tools. The HTML report, which is generated by default, uses the same data as the JSON report, with the only exception being that it is gzipped into the HTML file to reduce the report size.

To generate a report in JSON format, set the [`format`](/configuration#format) configuration option to `'json'`. After you build your project, Sonda will generate a JSON file in the [`outputDir`](/configuration#outputdir) directory (`.sonda` by default).

## Structure

Before we dive into the details of each field, here is the top-level structure of the JSON report:

```json
{
  "metadata": {
    "version": "0.7.1",
    "integration": "rolldown",
    "sources": true,
    "gzip": true,
    "brotli": true
  },
  "resources": [
    {
      "kind": "chunk",
      "name": "src/utils.ts",
      "type": "script",
      "format": "esm",
      "uncompressed": 1598,
      "gzip": 473,
      "brotli": 436,
      "parent": "dist/index.js"
    }
  ],
  "connections": [
    {
      "kind": "import",
      "source": "src/index.ts",
      "target": "src/utils.ts",
      "original": "./utils.js"
    }
  ],
  "dependencies": [
    {
      "name": "@ampproject/remapping",
      "paths": [
        "node_modules/@ampproject/remapping"
      ]
    }
  ],
  "issues": [],
  "sourcemaps": []
}
```

You can also refer to the TypeScript types with descriptions in the [`types.ts`](https://github.com/filipsobol/sonda/blob/release/packages/sonda/src/report/types.ts) file in the Sonda repository for more details.

### Metadata

The `metadata` field contains information about Sonda itself and the configuration used to generate the report. It doesn't include all configuration options, but only those relevant to the report. The fields are:

- **version** – The Sonda version used to generate the report.
- **integration** – The name of the integration used to generate the report. This can be a bundler or metaframework.
- **sources** – Indicates whether the [`sources`](/configuration#sources) configuration option was enabled. If `true`, the `"sourcemaps"` field in the report will contain source maps of output assets.
- **gzip** – Indicates whether the [`gzip`](/configuration#gzip) configuration option was enabled. If `true`, the `asset` and `chunk` resources will contain the `gzip` field with the size of the gzipped resource.
- **brotli** – Indicates whether the [`brotli`](/configuration#brotli) configuration option was enabled. If `true`, the `asset` and `chunk` resources will contain the `brotli` field with the size of the Brotli-compressed resource.

### Resources

The `resources` field is an array of objects representing all resources discovered in the project.

All resources use the same field names, but the values vary depending on the resource kind. The fields are:

- **kind** – The kind of the resource:
  - `filesystem`
  - `sourcemap`
  - `asset`
  - `chunk`
- **name** – The path to the resource, relative to the project root.
- **type** – The type of the resource:
  - `component`
  - `font`
  - `image`
  - `script`
  - `style`
  - `other` – For resources that don't fit into any of the above categories.
- **format** – The format of the JavaScript module:
  - `esm`
  - `cjs`
  - `amd`
  - `umd`
  - `iife`
  - `system`
  - `other` – For non-JavaScript modules or when the format is unknown.
- **uncompressed** – The uncompressed size of the resource in bytes.
- **gzip** – The gzip-compressed size of the resource in bytes.
- **brotli** – The Brotli-compressed size of the resource in bytes.
- **parent** – The name of the parent resource, if applicable.

#### `filesystem` resource

Represents a file loaded from the filesystem by the bundler during the build process. Fields:

- `kind`
- `name`
- `type`
- `format`
- `uncompressed`

The `gzip`, `brotli`, and `parent` fields are not present.

#### `sourcemap` resource

Represents a file found in the sourcemap of a `filesystem` resource. Fields:

- `kind`
- `name`
- `type`
- `format`
- `uncompressed`
- `parent` – The name of the associated `filesystem` resource; can be `null`.

The `gzip` and `brotli` fields are not present.

#### `asset` resource

Represents an output file from the build process, such as JavaScript or CSS. Fields:

- `kind`
- `name`
- `type`
- `uncompressed`
- `gzip`
- `brotli`

The `format` and `parent` fields are not present.

#### `chunk` resource

Represents a chunk of code from an `asset` contributed by `filesystem` or `sourcemap` resources. Fields:

- `kind`
- `name`
- `type`
- `format`
- `uncompressed`
- `gzip`
- `brotli`
- `parent` – The name of the `asset` resource to which this chunk belongs; can be `null`.

### Connections

The `connections` field is an array of objects representing all connections between resources discovered in the project. These are represented as edges in a directed graph, where the source is the resource that imports or requires another resource, and the target is the resource that is imported or required. Fields:

- **kind** – The kind of the connection:
  - `entrypoint`
  - `import`
  - `require`
  - `dynamic-import`
  - `sourcemap`
- **source** – The name of the source resource, relative to the project root.
- **target** – The name of the target resource, relative to the project root.
- **original** – The original path used in the source code to import or require the target.

#### `entrypoint` connection

Represents the connection between the `asset` resource and the `filesystem` resource that is its entry point.

- `kind`: `entrypoint`
- `source`: The `asset` resource name.
- `target`: The `filesystem` resource name that is the asset's entry point.
- `original`: `null`.

#### `import`, `require`, and `dynamic-import` connections

Represent connections between two `filesystem` resources.

- `kind`: One of `import`, `require`, or `dynamic-import`
- `source`: The importing `filesystem` resource.
- `target`: The imported `filesystem` resource.
- `original`: The import path used in source code.

#### `sourcemap` connection

Represents the connection between a `filesystem` resource and a `sourcemap` resource.

- `kind`: `sourcemap`
- `source`: The `filesystem` resource containing the sourcemap.
- `target`: The `sourcemap` resource.
- `original`: `null`.

### Dependencies

The `dependencies` field is an array of objects representing all external dependencies discovered in the project. Fields:

- **name** – The name of the dependency (usually the package name).
- **paths** – An array of paths to the dependency in the project. This can be multiple paths if the dependency was found in multiple places, such as in different versions or in different directories.

### Issues

A field reserved for future use; currently always an empty array.

### Sourcemaps

The `sourcemaps` field is an array of objects containing sourcemaps for `asset` resources. Each entry includes:

- **name** – The name of the sourcemap resource, relative to the project root.
- **map** – A stringified sourcemap object, including only the `mappings`, `sources`, and `sourcesContent` fields.

This field is populated only if the [`deep`](/configuration#deep) configuration option is enabled. Otherwise, the `sourcemaps` array will be empty.
