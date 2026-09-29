declare module "yamljs" {
  const YAML: {
    load(path: string): unknown;
    parse(yaml: string): unknown;
    stringify(obj: unknown, inline?: number, spaces?: number): string;
  };
  export default YAML;
}
