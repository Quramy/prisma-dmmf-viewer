const module = { exports: {} };

globalThis.global = globalThis;
globalThis.PRISMA_WASM_PANIC_REGISTRY = {
  set_message: msg => console.error(msg),
};

globalThis._loadPrismaSchemaWasm = async function () {
  const wasmInstance = await WebAssembly.instantiateStreaming(fetch("prisma_schema_build_bg.wasm"), imports);
  wasm = wasmInstance.instance.exports;
  globalThis.prisma_schema = module.exports;
};
