import { jsonTree } from "./json-tree.js";

document.querySelector("#schema").value = `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id    Int    @id
  posts Post[]
}

model Post {
  id       Int  @id
  author   User @relation(fields: [authorId], references: [id])
  authorId Int
}
`.trim();

await _loadPrismaSchemaWasm();

function getDMMF() {
  const params = JSON.stringify({
    prismaSchema: document.querySelector("#schema").value,
    noColor: true,
  });

  const dmmf = JSON.parse(prisma_schema.get_dmmf(params));

  console.log(dmmf);

  const outputElem = document.querySelector("#output_container");
  [...outputElem.childNodes].forEach(node => outputElem.removeChild(node));

  outputElem.appendChild(
    jsonTree(dmmf, {
      tagName: "output",
      attributes: {
        for: "schema",
      },
    }),
  );
}

function format() {
  const schema = document.querySelector("#schema").value;
  const params = JSON.stringify({ tabSize: 2 });

  const formatted = prisma_schema.format(schema, params);
  console.log(formatted);
  document.querySelector("#schema").value = formatted;
}

document.querySelector("form#dmmf").addEventListener("submit", event => {
  event.preventDefault();
  getDMMF();
});

document.querySelector("#btn_format")?.addEventListener("click", () => format());

getDMMF();
