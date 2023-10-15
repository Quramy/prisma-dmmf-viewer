function element(type, content, attrs) {
  const elem = document.createElement(type);
  if (typeof content === "string") {
    elem.textContent = content;
  } else if (Array.isArray(content)) {
    content.forEach(child => elem.appendChild(child));
  }
  if (attrs) {
    const { className, ...rest } = attrs;
    const classNameList = Array.isArray(className) ? className : typeof className === "string" ? [className] : [];
    classNameList.forEach(className => elem.classList.add(className));
    Object.entries(rest).forEach(([key, value]) => elem.setAttribute(key, value));
  }
  return elem;
}

function valueElements(name, value) {
  const keyElement = element("span", `${name}`, { className: "key" });
  if (value == null || ["boolean", "number", "string"].includes(typeof value)) {
    return element("p", [keyElement, ...elementsFromPrimitiveValue(value)]);
  } else if (Array.isArray(value)) {
    return element("details", [element("summary", [keyElement]), ...elementsFromJsonArray(value)], { open: true });
  } else {
    return element("details", [element("summary", [keyElement]), ...elementsFromJsonObj(value)], { open: true });
  }
}

function elementsFromJsonObj(obj) {
  return Object.entries(obj).flatMap(([name, value]) => valueElements(name, value));
}

function elementsFromJsonArray(list) {
  return list.map((value, name) => valueElements(name, value));
}

function elementsFromPrimitiveValue(value) {
  return [
    element("span", typeof value === "string" ? `"${value}"` : `${value}`, {
      className: ["value", "primitive"],
    }),
  ];
}

export function jsonTree(obj, { tagName, attributes } = { attributes: {}, tagName: "div" }) {
  return element(tagName, elementsFromJsonObj(obj), { className: "json-tree", ...attributes });
}
