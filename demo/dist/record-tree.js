// record-tree.css?raw
var record_tree_default = "record-tree\n{\n    display: block;\n    --spacing: 7px;\n    --indent: 20px;\n}\n\nrecord-tree .collection\n{\n    border-radius: 3px;\n    padding: var(--spacing);\n    border: solid 1px transparent;\n}\nrecord-tree .collection:hover\n{\n    border-color: graytext;\n}\n\nrecord-tree .collection > .collection\n{\n    margin-left: var(--indent);\n    margin-block: var(--spacing);\n}\n\nrecord-tree .collection > .property:first-of-type\n{\n    margin-top: var(--spacing);\n}\nrecord-tree .collection > .property\n{\n    margin-left: var(--indent);\n}\nrecord-tree .collection > .property:last-of-type\n{\n    margin-bottom: var(--spacing);\n}\n\nrecord-tree .removed\n{\n    scale: .99;\n    color: graytext;\n}\n\nrecord-tree summary\n{\n    user-select: none;\n    display: flex;\n    gap: var(--spacing);\n}\nrecord-tree summary:before\n{\n    content: '\u25B6';\n    transition: transform 100ms ease-out;\n    font-size: .78em;\n    align-self: center;\n    margin-right: var(--spacing);\n}\nrecord-tree details[open] > summary:before\n{\n    transform: rotate(90deg);\n}\nrecord-tree summary .name\n{\n    flex: 1;\n}\nrecord-tree :not(.properties) > summary .name\n{\n    font-weight: bold;\n    font-size: .8em;\n}\n\nrecord-tree ul\n{\n    margin-block: var(--spacing);\n    margin-left: var(--indent);\n    padding: 0;\n}\n\nrecord-tree .property\n{\n    user-select: none;\n    display: flex;\n    align-items: center;\n    border-radius: 3px;\n    border: solid 1px transparent;\n}\nrecord-tree .property:hover\n{\n    border-color: graytext;\n}\n\nrecord-tree .property .name\n{\n    font-weight: bold;\n    font-size: .8em;    \n    text-align: right;\n\n    padding-left: var(--spacing);\n    padding-block: var(--spacing);\n    width: var(--property-name-width);\n}\nrecord-tree .property .value\n{\n    padding-inline: var(--spacing);\n    padding-block: var(--spacing);\n    flex: 1;\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n\nrecord-tree button\n{\n    display: inline-flex;\n    align-items: center;\n    margin-left: auto;\n    margin-right: var(--spacing);\n}\n\nrecord-tree button .icon\n{\n    --size: 14px;\n    width: var(--size);\n    height: var(--size);\n}";

// record-tree.ts
var COMPONENT_STYLESHEET = new CSSStyleSheet();
COMPONENT_STYLESHEET.replaceSync(record_tree_default);
var DEFAULT_REMOVED_CLASS_NAME = "removed";
var ICON_CANCEL_CROSS = `<svg class="icon cancel-cross" part="icon cross remove-icon" viewBox="0 0 22.812714 22.814663" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
    <path style="color:#000000;fill:var(--icon-primary-color,InfoText);stroke:var(--icon-secondary-color,InfoBackground);stroke-linecap:square;stroke-miterlimit:6.3;stroke-dashoffset:29.2913;stroke-opacity:1;-inkscape-stroke:none"
    d="m 1237.4389,207.63366 -1.8991,1.8987 a 0.65841136,0.65841136 90.003442 0 0 0,0.93116 l 0.4831,0.48317 a 14628.329,14628.329 44.999244 0 0 0.9312,0.93118 l 3.7936,3.79311 a 0.65840885,0.65840885 89.998393 0 1 0,0.93116 l -3.7936,3.7936 a 8783.6896,8783.6896 135.00442 0 1 -0.9313,0.93111 l -0.4829,0.48283 a 0.65811,0.65811 89.993977 0 0 10e-5,0.93094 l 1.8987,1.89741 a 0.65867085,0.65867085 179.98891 0 0 0.9314,-1.8e-4 l 0.4826,-0.48267 a 45427.77,45427.77 134.99941 0 1 0.9312,-0.93119 l 3.7931,-3.79308 a 0.65848899,0.65848899 179.99848 0 1 0.9312,-2e-5 l 3.7936,3.79312 a 10110.91,10110.91 44.992994 0 0 0.9313,0.93108 l 0.483,0.48285 a 0.65856615,0.65856615 179.99438 0 0 0.9313,-9e-5 l 1.897,-1.89705 a 0.65833101,0.65833101 89.994378 0 0 -10e-5,-0.93111 l -0.483,-0.48285 a 5293.5057,5293.5057 44.99639 0 1 -0.9313,-0.93113 l -3.793,-3.79354 a 0.65849247,0.65849247 90.001607 0 1 0,-0.93122 l 3.793,-3.79305 a 149190.44,149190.44 134.99995 0 1 0.9312,-0.93119 l 0.4832,-0.48321 a 0.65863247,0.65863247 90.008202 0 0 10e-5,-0.93132 l -1.8972,-1.89834 a 0.65838576,0.65838576 0.01346964 0 0 -0.9312,-2.2e-4 l -0.483,0.48285 a 7148.543,7148.543 135.00546 0 0 -0.9313,0.9311 l -3.7936,3.79359 a 0.65841791,0.65841791 0.00151591 0 1 -0.9312,-3e-5 l -3.7931,-3.79353 a 52707.551,52707.551 45.002134 0 0 -0.9312,-0.93122 l -0.4826,-0.48267 a 0.65849044,0.65849044 0.00323988 0 0 -0.9312,-5e-5 z"
    transform="translate(-1232.6358,-204.72848)" />
</svg>`;
var ICON_UNDO = `<svg class="icon undo-redo" part="icon undo-redo-icon" viewBox="0 0 22.812714 22.814663" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
<path
   style="color:#000000;fill:var(--icon-primary-color,InfoText);stroke:var(--icon-secondary-color,CanvasText);fill-opacity:1;stroke-width:0.999999;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1"
   d="M 8.7359009 1.1063924 C 8.3768905 1.0950243 8.0017196 1.1736712 7.641394 1.3523722 L 1.6107544 6.1205566 L 1.5916341 6.1386434 L 1.53479 6.1939372 C 1.0620233 6.6537208 0.70744486 7.6004515 1.0769368 8.152474 L 5.3030355 14.40894 C 6.1798306 15.219356 7.5994445 15.083541 8.4749349 14.106116 C 9.2135837 13.277519 9.3398045 12.086041 8.7787923 11.23549 L 11.334192 11.410673 C 14.129266 11.815808 17.330477 13.067707 18.931144 18.826241 C 19.313756 19.953163 19.735424 21.309718 20.245793 22.173324 C 20.976132 22.497497 21.420713 20.679238 21.478792 18.791101 C 21.506716 14.251463 18.262689 8.6142076 13.845667 6.7716797 C 13.291103 6.5403477 11.805521 5.8978235 10.30118 5.3355916 L 9.7994019 5.1107992 C 10.609379 4.4184442 10.916638 3.2966427 10.55026 2.3703979 C 10.238366 1.5905459 9.5257236 1.1314023 8.7359009 1.1063924 z " />
</svg>`;
var COMPONENT_TAG_NAME = "record-tree";
var RecordTreeElement = class extends HTMLElement {
  static observedAttributes = [];
  #data;
  path = [];
  #removedPaths = /* @__PURE__ */ new Set();
  #customCollectionRenderers = new Array();
  #customObjectRenderers = new Array();
  #customPropertyRenderers = new Array();
  #customPropertyNameGenerators = new Array();
  #customPropertyValueGenerators = new Array();
  #widestPropertyName = 0;
  constructor() {
    super();
    let parent = this.getRootNode();
    parent.adoptedStyleSheets.push(COMPONENT_STYLESHEET);
    this.addEventListener("click", this.#onClick.bind(this));
  }
  #onClick(event) {
    const removeButton = event.target.closest("svg") != null ? event.target.closest("button") : event.target;
    if (removeButton == null || !removeButton.classList.contains("remove")) {
      return;
    }
    const parentToRemove = removeButton.parentElement?.classList.contains("property") ? removeButton.parentElement : removeButton.parentElement?.parentElement?.classList.contains("collection") ? removeButton.parentElement.parentElement : null;
    if (parentToRemove == null) {
      console.error("Unknown button clicked");
      return;
    }
    event.stopPropagation();
    event.preventDefault();
    if (this.hasAttribute("removed-class")) {
      let removeAttributeName = this.getAttribute("removed-class");
      if (removeAttributeName == null || removeAttributeName == "") {
        removeAttributeName = DEFAULT_REMOVED_CLASS_NAME;
      }
      const isRemoved = parentToRemove.classList.contains(removeAttributeName);
      if (isRemoved) {
        parentToRemove.classList.remove(removeAttributeName);
        parentToRemove.part.remove(removeAttributeName);
        if (parentToRemove.dataset.path != ".properties") {
          this.#removedPaths.delete(parentToRemove.dataset.path);
        }
        removeButton.innerHTML = ICON_CANCEL_CROSS;
        removeButton.title = "Remove";
        removeButton.classList.remove("undo");
        removeButton.part.remove("undo");
        this.dispatchEvent(new CustomEvent("restore", { detail: { path: parentToRemove.dataset.path } }));
      } else {
        parentToRemove.classList.add(removeAttributeName);
        parentToRemove.part.add(removeAttributeName);
        if (parentToRemove.dataset.path != ".properties") {
          this.#removedPaths.add(parentToRemove.dataset.path);
        }
        removeButton.innerHTML = ICON_UNDO;
        removeButton.title = "Undo";
        removeButton.classList.add("undo");
        removeButton.part.add("undo");
        this.dispatchEvent(new CustomEvent("remove", { detail: { path: parentToRemove.dataset.path } }));
      }
    } else {
      parentToRemove.remove();
      this.#removedPaths.add(parentToRemove.dataset.path);
      this.dispatchEvent(new CustomEvent("remove", { detail: { path: parentToRemove.dataset.path } }));
    }
  }
  getPathArray() {
    return this.path;
  }
  getCurrentPathString() {
    return this.path.join(".");
  }
  getInitialData() {
    return this.#data;
  }
  setData(data) {
    this.#data = data;
    this.renderRecordData(this.#data);
  }
  async renderRecordData(data) {
    this.innerHTML = "";
    this.path = [];
    await this.renderData(data, this);
    this.path = [];
    this.style.setProperty("--property-name-width", `${this.#widestPropertyName}px`);
  }
  async renderData(data, parentElement, usePropertiesContainer = true) {
    const lastPathEntry = this.path[this.path.length - 1] ?? this.getAttribute("parent-name") ?? "Data";
    if (Array.isArray(data)) {
      let renderer = this.renderArrayAsCollection;
      for (let i = 0; i < this.#customCollectionRenderers.length; i++) {
        if (this.#customCollectionRenderers[i].condition(lastPathEntry, data, parentElement) == true) {
          renderer = this.#customCollectionRenderers[i].renderer;
          break;
        }
      }
      await renderer.call(this, lastPathEntry, data, parentElement, true);
    } else if (Object.prototype.toString.call(data) === "[object Object]") {
      data = this.draftObject(data);
      let renderer = this.renderObjectAsCollection;
      for (let i = 0; i < this.#customObjectRenderers.length; i++) {
        if (this.#customObjectRenderers[i].condition(lastPathEntry, data, parentElement) == true) {
          renderer = this.#customObjectRenderers[i].renderer;
          break;
        }
      }
      await renderer.call(this, lastPathEntry, data, parentElement, true);
    } else if (usePropertiesContainer == true) {
      const pathMinusLastEntry = this.path.filter((item, index) => index < this.path.length - 1);
      let properties = this.querySelector(`details[data-path="${pathMinusLastEntry.join(".")}.properties"]`);
      let propertyList = properties == null ? null : properties.querySelector("ul");
      if (properties == null) {
        properties = this.createCollectionDetailsElement("Properties", `${pathMinusLastEntry.join(".")}.properties`, ["collection", "properties"], false);
        properties.toggleAttribute("open", true);
        propertyList = document.createElement("ul");
        propertyList.classList.add("properties-list");
        propertyList.part.add("properties-list");
        properties.append(propertyList);
        parentElement.append(properties);
      }
      if (propertyList.children.length > 10) {
        properties.toggleAttribute("open", false);
      }
      let renderer = this.renderObjectProperty;
      for (let i = 0; i < this.#customPropertyRenderers.length; i++) {
        if (this.#customPropertyRenderers[i].condition(lastPathEntry, data, propertyList) == true) {
          renderer = this.#customPropertyRenderers[i].renderer;
          break;
        }
      }
      await renderer.call(this, lastPathEntry, data, propertyList);
    } else {
      let renderer = this.renderObjectProperty;
      for (let i = 0; i < this.#customPropertyRenderers.length; i++) {
        if (this.#customPropertyRenderers[i].condition(lastPathEntry, data, parentElement) == true) {
          renderer = this.#customPropertyRenderers[i].renderer;
          break;
        }
      }
      await renderer.call(this, lastPathEntry, data, parentElement);
    }
  }
  addCustomCollectionRenderer(condition, renderer) {
    this.#customCollectionRenderers.push(
      {
        condition,
        renderer
      }
    );
  }
  addCustomObjectRenderer(condition, renderer) {
    this.#customObjectRenderers.push(
      {
        condition,
        renderer
      }
    );
  }
  addCustomPropertyRenderer(condition, renderer) {
    this.#customPropertyRenderers.push(
      {
        condition,
        renderer
      }
    );
  }
  addCustomPropertyNameGenerator(condition, generator) {
    this.#customPropertyNameGenerators.push(
      {
        condition,
        generator
      }
    );
  }
  addCustomPropertyValueGenerator(condition, generator) {
    this.#customPropertyValueGenerators.push(
      {
        condition,
        generator
      }
    );
  }
  clear() {
    this.innerHTML = "";
  }
  refresh() {
    this.setData(this.#data);
  }
  getUpdatedData() {
    const updatedData = structuredClone(this.#data);
    for (const [key] of this.#removedPaths.entries()) {
      const keyArray = key.split(".");
      let parent = updatedData;
      let target = updatedData[keyArray[0]];
      let targetKey = keyArray[0];
      for (let i = 1; i < keyArray.length; i++) {
        targetKey = keyArray[i];
        parent = target;
        target = parent[targetKey];
      }
      if (parent != null && target != null) {
        delete parent[targetKey];
      }
    }
    return updatedData;
  }
  createCollectionDetailsElement(name, path, classes, preventRemoveButton, isTop) {
    const details = document.createElement("details");
    if (classes != null) {
      details.classList.add("details", ...classes);
      details.part.add("details", ...classes);
    }
    details.setAttribute("data-path", path);
    const summary = document.createElement("summary");
    summary.classList.add("summary");
    summary.part.add("summary", "collection", ...classes ?? []);
    if (isTop != null && isTop == true) {
      summary.part.add("top");
    }
    const nameSpan = document.createElement("span");
    nameSpan.textContent = name;
    nameSpan.classList.add("name");
    nameSpan.part.add("name", "collection", ...classes ?? []);
    summary.append(nameSpan);
    if (preventRemoveButton != false) {
      const removeButton = document.createElement("button");
      removeButton.innerHTML = ICON_CANCEL_CROSS;
      removeButton.title = "Remove";
      removeButton.classList.add("button", "icon-button", "remove");
      removeButton.part.add("button", "icon-button", "remove");
      summary.append(removeButton);
    }
    details.append(summary);
    return details;
  }
  async renderArrayAsCollection(key, data, parentElement, isTop = false) {
    const name = isNaN(parseInt(key)) ? key : `[${key}]`;
    const details = this.createCollectionDetailsElement(name, this.path.join("."), ["collection"], void 0, isTop);
    if (this.path.length == 0) {
      details.setAttribute("open", "");
    }
    if (isTop == true) {
      details.classList.add("top");
      details.part.add("top");
    }
    parentElement.append(details);
    for (let i = 0; i < data.length; i++) {
      this.path.push(i.toString());
      await this.renderData(data[i], details, false);
      this.path.pop();
    }
  }
  async renderObjectAsCollection(key, data, parentElement, isTop = false) {
    const name = isNaN(parseInt(key)) ? key : data.name != null && data.name.trim() != "" ? data.name : data.description != null && data.description.trim() != "" ? data.description : data.key != null && data.key.trim() != "" ? data.key : data.id != null && data.id.toString().trim() != "" ? data.id : `[${key}]`;
    const details = this.createCollectionDetailsElement(name, this.path.join("."), ["collection"], void 0, isTop);
    if (this.path.length == 0) {
      details.setAttribute("open", "");
    }
    if (isTop == true) {
      details.classList.add("top");
      details.part.add("top");
    }
    parentElement.append(details);
    for (const [key2, value] of Object.entries(data)) {
      this.path.push(key2);
      await this.renderData(data[key2], details);
      this.path.pop();
    }
  }
  async renderObjectProperty(title, value, parentElement) {
    const tagName = parentElement instanceof HTMLUListElement ? "li" : "div";
    const property = document.createElement(tagName);
    property.classList.add("property");
    property.part.add("property");
    property.dataset.path = this.path.join(".");
    let nameGenerator = this.createPropertyName;
    for (let i = 0; i < this.#customPropertyNameGenerators.length; i++) {
      if (this.#customPropertyNameGenerators[i].condition(title, value, parentElement) == true) {
        nameGenerator = this.#customPropertyNameGenerators[i].generator;
        break;
      }
    }
    const name = await nameGenerator(title, value, parentElement);
    const delimiter = document.createElement("span");
    delimiter.classList.add("delimiter");
    delimiter.part.add("delimiter");
    delimiter.textContent = ":";
    let valueGenerator = this.createPropertyValue.bind(this);
    for (let i = 0; i < this.#customPropertyValueGenerators.length; i++) {
      if (this.#customPropertyValueGenerators[i].condition(title, value, parentElement) == true) {
        valueGenerator = this.#customPropertyValueGenerators[i].generator;
        break;
      }
    }
    const valueSpan = await valueGenerator(title, value, parentElement);
    const removeButton = document.createElement("button");
    removeButton.innerHTML = ICON_CANCEL_CROSS;
    removeButton.title = "Remove";
    removeButton.classList.add("button", "icon-button", "remove");
    removeButton.part.add("button", "icon-button", "remove");
    property.append(name, delimiter, valueSpan, removeButton);
    property.title = `${name.getAttribute("title")}: ${valueSpan.getAttribute("title")}`;
    parentElement.append(property);
    const propertyNameWidth = Math.ceil(name.getBoundingClientRect().width);
    if (this.#widestPropertyName < propertyNameWidth) {
      this.#widestPropertyName = propertyNameWidth;
    }
  }
  createPropertyName(title, value, parentElement) {
    const name = document.createElement("span");
    name.classList.add("name");
    name.part.add("name", "property-name");
    name.textContent = title;
    name.title = title;
    return name;
  }
  createPropertyValue(title, value, parentElement) {
    const valueSpan = document.createElement("span");
    valueSpan.classList.add("value");
    valueSpan.part.add("value", "value");
    if (value === void 0) {
      const undefinedTextValue = this.getAttribute("undefined-value") ?? "[ undefined ]";
      value = undefinedTextValue;
      valueSpan.classList.add("undefined");
      valueSpan.part.add("undefined");
    } else if (value === null) {
      const nullTextValue = this.getAttribute("null-value") ?? "[ null ]";
      value = nullTextValue;
      valueSpan.classList.add("null");
      valueSpan.part.add("null");
    } else {
      value = value.toString();
    }
    if (value.trim() == "") {
      const blankTextValue = this.getAttribute("blank-value") ?? "[ blank text ]";
      value = blankTextValue;
    }
    valueSpan.textContent = value.length > 1024 ? value.substring(0, 1024) : value;
    valueSpan.title = value.startsWith("data:") ? "[ Binary Data ]" : value;
    return valueSpan;
  }
  async renderCollectionAsKeyValuePairs(key, items, parentElement) {
    const propertiesDetails = this.createCollectionDetailsElement(key, this.path.join("."), ["collection", "key-value-pairs"]);
    const propertiesList = document.createElement("ul");
    propertiesList.part.add("properties-list");
    propertiesDetails.append(propertiesList);
    for (let i = 0; i < items.length; i++) {
      this.path.push(items[i].key);
      await this.renderObjectProperty(items[i].key, items[i].value, propertiesList);
      this.path.pop();
    }
    parentElement.append(propertiesDetails);
  }
  async renderCollectionAsValues(key, items, parentElement) {
    const propertiesDetails = this.createCollectionDetailsElement(key, this.path.join("."), ["collection", "values"]);
    const propertiesList = document.createElement("ul");
    propertiesList.part.add("properties-list");
    propertiesDetails.append(propertiesList);
    for (let i = 0; i < items.length; i++) {
      this.path.push(items[i]);
      await this.renderObjectAsValue(items[i], items[i], propertiesList);
      this.path.pop();
    }
    parentElement.append(propertiesDetails);
  }
  async renderObjectAsValue(key, value, parentElement) {
    const property = document.createElement("li");
    property.classList.add("property");
    property.part.add("property");
    property.dataset.path = this.path.join(".");
    const valueSpan = document.createElement("span");
    valueSpan.classList.add("value");
    valueSpan.part.add("value");
    valueSpan.textContent = value.toString();
    valueSpan.title = "[ Object ]";
    const removeButton = document.createElement("button");
    removeButton.innerHTML = ICON_CANCEL_CROSS;
    removeButton.title = "Remove";
    removeButton.classList.add("button", "icon-button", "remove");
    removeButton.part.add("button", "icon-button", "remove");
    property.append(valueSpan, removeButton);
    parentElement.append(property);
  }
  // generic json rendering
  renderDataObject(data, parent) {
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        const value = data[i];
        const $details = document.createElement("details");
        const $summary = document.createElement("summary");
        let textContent = value.name ?? value.description ?? value.key;
        if (textContent == null || textContent.trim() == "") {
          textContent = i.toString();
        }
        $summary.classList.add("summary");
        $summary.part.add("summary", "property");
        $summary.textContent = textContent.substring(0, Math.min(textContent.length, 20));
        $details.classList.add("subrecord");
        $details.part.add("subrecord");
        parent.appendChild($details);
        $details.appendChild($summary);
        this.renderDataObject(value, $details);
      }
    } else {
      let propertiesList = null;
      for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value) || Object.prototype.toString.call(value) === "[object Object]") {
          const $details = document.createElement("details");
          const $summary = document.createElement("summary");
          $summary.classList.add("summary");
          $summary.part.add("summary", "property");
          $summary.textContent = key;
          $details.classList.add("subrecord");
          $details.part.add("subrecord");
          parent.appendChild($details);
          $details.appendChild($summary);
          this.renderDataObject(value, $details);
        } else {
          if (propertiesList == null) {
            propertiesList = parent.querySelector(":scope > ul");
            if (propertiesList == null) {
              propertiesList = document.createElement("ul");
              propertiesList.classList.add("properties-list");
              propertiesList.part.add("properties-list");
              parent.appendChild(propertiesList);
            }
          }
          const $property = document.createElement("li");
          $property.classList.add("property");
          $property.part.add("property");
          const $name = document.createElement("span");
          $name.classList.add("name");
          $name.part.add("name", "property-name");
          $name.textContent = key;
          const $value = document.createElement("span");
          $value.classList.add("value");
          $value.part.add("value", "property-value");
          let textContent = value.toString();
          $value.textContent = textContent.substring(0, Math.min(textContent.length, 20));
          $property.append($name, $value);
          propertiesList.append($property);
        }
      }
    }
  }
  // helpers
  /**
   * Converts a complex object that may contain `get` properties and functions,
   * into a simple object that is only key-value pairs of data.  
   * @param instance a complex object to be collapsed into a key-value object.
   * @returns a simple key-value object that represents the point-in-execution data of the provided object.
   */
  draftObject(instance) {
    return Object.assign({}, instance, this.extractProperties(instance));
  }
  extractProperties(instance) {
    const propertyNames = this.getPropertyNames(instance);
    const itemData = {};
    for (let i = 0; i < propertyNames.length; i++) {
      itemData[propertyNames[i]] = instance[propertyNames[i]];
    }
    return itemData;
  }
  getPropertyNames(instance) {
    const prototype = Reflect.getPrototypeOf(instance);
    const descriptors = Object.getOwnPropertyDescriptors(prototype);
    return Object.entries(descriptors).filter((entry) => typeof entry[1].get === "function" && entry[0] !== "__proto__").map((entry) => entry[0]);
  }
};
if (customElements.get(COMPONENT_TAG_NAME) == null) {
  customElements.define(COMPONENT_TAG_NAME, RecordTreeElement);
}
export {
  RecordTreeElement
};
