#! /bin/bash

cp node_modules/@prisma/prisma-schema-wasm/src/prisma_schema_build.js build_wasm_bg
patch -u build_wasm_bg/prisma_schema_build.js < build_wasm_bg/prisma_schema.js.patch
cat build_wasm_bg/base.js build_wasm_bg/prisma_schema_build.js > build_wasm_bg/prisma_schema.js

cp build_wasm_bg/prisma_schema.js docs
cp node_modules/@prisma/prisma-schema-wasm/src/prisma_schema_build_bg.wasm docs
