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

  const outputElem = document.querySelector("output");
  [...outputElem.childNodes].forEach(node => outputElem.removeChild(node));

  outputElem.appendChild(element("div", displayJsonObj(dmmf), { className: "json" }));
}

function element(type, content, attrs) {
  const elem = document.createElement(type);
  if (typeof content === "string") {
    elem.textContent = content;
  } else if (Array.isArray(content)) {
    content.forEach(child => elem.appendChild(child));
  }
  if (attrs) {
    const { className, ...rest } = attrs;
    const classNameList = Array.isArray(className) ? className : [className];
    classNameList.forEach(className => elem.classList.add(className));
    Object.entries(rest).forEach(([key, value]) => elem.setAttribute(key, value));
  }
  return elem;
}

function valueElements(name, value) {
  const keyElement = element("span", `${name}`, { className: "key" });
  if (value == null || ["boolean", "number", "string"].includes(typeof value)) {
    return element("p", [keyElement, ...displayJsonPrimitive(value)]);
  } else if (Array.isArray(value)) {
    return element("details", [element("summary", [keyElement]), ...displayJsonArray(value)], { open: true });
  } else {
    return element("details", [element("summary", [keyElement]), ...displayJsonObj(value)], { open: true });
  }
}

function displayJsonObj(obj) {
  return Object.entries(obj).flatMap(([name, value]) => valueElements(name, value));
}

function displayJsonArray(list) {
  return list.map((value, name) => valueElements(name, value));
}

function displayJsonPrimitive(value) {
  return [
    element("span", typeof value === "string" ? `"${value}"` : `${value}`, {
      className: ["value", "primitive"],
    }),
  ];
}

document.querySelector("form#dmmf").addEventListener("submit", event => {
  event.preventDefault();
  getDMMF();
});

getDMMF();
