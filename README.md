# `<record-tree>` Element
A custom `HTMLElement` that renders javascript objects as a collapsible tree-like structure of nested detail elements.

Package size: ~15kb minified, ~24kb verbose.

## Quick Reference
```html
<record-tree remove-attribute></record-tree>
<script type="module" src="/path/to/record-tree[.min].js"></script>
<script>
    document.querySelector('record-tree').setData({
        myText: 'Text',
        myNumber: 42,
        myArray: ["A", "B", "C"],
        myObject: {
            mySubtext: 'text'
        }
    });
    const updatedObject = document.querySelector('record-tree').getUpdatedaData();
</script>
```

## Demos
https://catapart.github.io/magnitce-record-tree/demo/

## Support
- Firefox
- Chrome
- Edge
- <s>Safari</s> (Has not been tested; should be supported, based on custom element support)

## Getting Started
 1. [Install/Reference the library](#referenceinstall)

### Reference/Install
#### HTML Import (not required for vanilla js/ts; alternative to import statement)
```html
<script type="module" src="/path/to/record-tree[.min].js"></script>
```
#### npm
```cmd
npm install @magnit-ce/record-tree
```

### Import
#### Vanilla js/ts
```js
import "/path/to/record-tree[.min].js"; // if you didn't reference from a <script>, reference with an import like this

import { RecordTreeElement } from "/path/to/record-tree[.min].js";
```
#### npm
```js
import "@magnit-ce/record-tree"; // if you didn't reference from a <script>, reference with an import like this

import { RecordTreeElement } from "@magnit-ce/record-tree";
```

---
---
---

## Overview
The `<record-tree>` element is an interactive visualizer for object data in HTML. Providing the element with any arbitrary javascript object will render that object in the DOM as a set of nested `<detail>` elements with each level representing a depth of the provided object.

The element allows for manipulating the object properties by having a "remove" button that optionally removes the object from the DOM, or adds a configurable "remove" class to the removed property.

In addition to rendering and editing, the `<record-tree>` element provides functionality for collecting the data back into a javascript object, while maintaining any of the property removals that were invoked.

These three features, together, allow the `<record-tree>` element to facilitate common import and export functionality by rendering a description of the data to import or export, allowing users to edit the data to be imported/exported, and re-composing that edited data object into a form recognized by the consuming process.

## Objects
The `<record-tree>` element accepts any arbitrary object to render, and returns all properties on an anonymous object, nested identically to the provided data.

### Setting Data
To render an object with the `<record-tree>` element, use the `setData()` function with a parameter of the data object to render. The element will render properties for all kinds of objects, including complex ones that have getter properties.

### Getting Data
To retrieve data from the `<record-tree>` element, use the `getUpdatedData()` function. The element will return a composed object that will be an anonymous type, rather than a typed object, even if a typed object was provided. As the data can change, the `<record-tree>` element cannot be certain that the resulting object will still contain all of the data required by that type. So the data is returned as an anonymous object, with the expectation that the implementer will convert the data back into the actual object type that is preferred.

The returned object will still be nested in keeping with the objected that was provided in the `setData()` function. This should allow simple casting, in the cases where that is available, and expected object traversal, in cases where the implementer will need to consume the returned object.

### Editing Data
The `<record-tree>` element allows modification to the returned object by way of DOM manipulation. When property elements are removed from the `<record-tree>` element, or given a "removed" class, the `<record-tree>` element no longer recognizes those properties as available for composing in an object.

To facilitate this editability, the `<record-tree>` element provides a "remove" button on each property element. This `<button>` can easily be removed by setting its `display` style to `none`, if this functionality is not a supported use case.

The "remove" `<button>` allows users to indicate properties should be removed from the object that was provided in the `setData()` function. The property values, themselves, cannot be edited (by default), but the properties may be removed to support common use-cases for importing and exporting data.

## Customized Rendering
The `<record-tree>` element supports most data types with default functionality, but it also allows custom handlers to render each property for uses cases that are out of scope for generalized property rendering - like showing a preview of a image data, or adding app-specific layout elements.

These custom rendering functions are managed by providing the conditions for when they are used - in case this custom rendering should only be used on some properties of that type - and then providing the function that will generate the element displaying the property's data.

### Custom Property Rendering
|Function|Description|
|-|-|
|`addCustomCollectionRenderer()`|Add a custom renderer for array-like properties.|
|`addCustomObjectRenderer()`|Add a custom renderer for complex javascript objects.|
|`addCustomPropertyRenderer()`|Add a custom renderer for "atomic"-style types like `string`, `number`, `boolean`, etc.|

#### Function Parameters
Each of these functions takes two parameters: `condition` and `generator`.

The `condition` parameter is a function that determines whether or not any specific property should use the `generator`. If the `condition` function returns `true`, the function provided as the `generator` parameter will be called on the matching property, instead of the default functionality. This function may be asynchronous to determine the result.

The `generator` parameter is a function that ouputs the custom HTML content that should be rendered for the property that has matched the `condition` parameter. The `generator` function expects a return of a single `HTMLElement`. This function may be asynchronous to generate the element.

#### Condition and Generator Parameters
Both parameter functions - `condition` and `generator` - will be provided the following parameters:
|Parameter|Type|Description|
|-|-|-|
|`key`|`string`|The name of the target property.|
|`data`|`unknown`|The value of the target property.|
|`parentElement`|`HTMLElement`|The parent element that this property's element will be appended to. Can be used to determine nesting level within the object.|

### Custom Property Child Element Rendering
For convenience, the `<record-tree>` element provides the following two functions as a way to change how property names are rendered within a property element or how property values are rendered within a property element. These functions allow for generalized or targeted changes to how properties are rendered, without considering the construction and layout of the entire property element.

|Function|Description|
|-|-|
|`addCustomPropertyNameGenerator()`|Adds a custom handler for rendering the element where the property's name is rendered.|
|`addCustomPropertyValueGenerator()`|Adds a custom handler for rendering the element where the property's value is rendered.|

#### Condition and Generator Parameters
Both parameter functions - `condition` and `generator` - will be provided the following parameters:
|Parameter|Type|Description|
|-|-|-|
|`title`|`string`|The name of the target property.|
|`value`|`string`|The value of the target property, processed into the string value that will be used as `textContent` in the DOM.|
|`parentElement`|`HTMLElement`|The parent element that this property's element will be appended to. Can be used to determine nesting level within the object.|

## Additional Functions
|Function|Description|
|-|-|
|`clear()`|Clears the data object from the `<record-tree>` element, and removes all child elements.|
|`refresh()`|Re-renders the last data object that was provided to the `setData()` function.|
|`getInitialData()`|Gets an unmodified version of the last data object that was provided to the `setData()` function.|

## Attributes
|Attribute Name|Description|
|-|-|
|`removed-class`|Providing this attribute will prevent the `<record-tree>` element from removing DOM elements and will, instead, mark the attributes that are to be removed with a class. By default, this class will be `removed`, but it can be configured by giving the `removed-class` attribute a value. For example, setting the `removed-class` attribute to `delete` will give every removed property a `delete` class, instead of the `removed` class.|
|`parent-name`|Sets the text of the top-level details summary. If this attribute is undefined, the top-level details summary will use "Data" for the heading.|
|`undefined-value`|Sets the text that will be displayed when a value on an object is `undefined`.|
|`null-value`|Sets the text that will be displayed when a value on an object is `null`.|
|`blank-value`|Sets the text that will be displayed when a value on an object is "", after having been converted to a string and trimmed.|

## Undo
Whenever the `<record-tree>` element uses the `removed-class` attribute to change the default functionality from removing a property element from the DOM, to adding a specific class to that property element instead, it also changes the functionality of the `<button>` present in each property element. When an element has the "remove" class, its `<button>` functionality will be changed into an `undo` action which will revert the property from being "removed" into being present in the final data object again.

The intention of this functionality is to allow users to indicate they would like a property removed, while still being able to undo that indication, in case of a mistake.

## Events
The `<record-tree>` element dispatches two `CustomEvent`s, but both provide the same `detail` content: a single property called `path` which is a period-delimited string that represents the nested path to the updating property. If a property on the top level of an object is being removed, its `path` will simply be the property name. But if a property exists on a nested object, rather than the top-level object, it may look like this: `topLevel.objectProperty.thisProperty`.

Using the event's `path` data, the property can be referenced on the original object during the event handler.

The following events are dispatched by the `<record-tree>` element:
|Event Name|Description
|-|-|
|`remove`|Dispatched when a removal occurs. Dispatches when the element is removed or given a "removed" class.|
|`restore`|Dispatched when a property is restored from having been removed. Only relevant if the `removed-class` attribute is provided.|

## Styling
The `<record-tree>` element can be styled with CSS, normally. Each of it's child elements are given classes that can be used for styling. The following table describes the classes used by the `<record-tree>` element:
|Class Name|Description
|-|-|
|`name`|An element that displays the property name for the target property.|
|`value`|An element that displays a string representation of the target property's value.|
|`property`|The container for the name and value elements.|
|`removed`|This class is applied to the property element whenever that property has been removed, while the `<record-tree>` element has the `removed-class` attribute.|
|`remove`|The `<button>` that toggles the "remove" class. The `remove` class is applied whenever the "remove" class is **not** present on the property element.|
|`undo`|The `<button>` that toggles the "remove" class. The `undo` class is applied whenever the "remove" class is present on the property element.|
|`delimiter`|An element that separates the property name element from the property value element. Default text content: `:`|
|`icon`|An icon displayed on the `<button>` element. Class exists on both the `remove` and `undo` buttons.|
|`cancel-cross`|This class is in the classList of the icon element that is used when a property has **not** been removed.|
|`undo-arrow`|This class is in the classList of the icon element that is used when a property has been removed.|

The icons used by the element also make use of css properties (variables) to facilitate color customization. The following css properties can be used to style the icon elements:
|CSS Property Name|Description
|-|-|
|`--icon-primary-color`|The color that will be used as the fill color for the icons.|
|`--icon-secondary-color`|The color that will be used as the outline color for the icons.|

## License
This library is in the public domain. You do not need permission, nor do you need to provide attribution, in order to use, modify, reproduce, publish, or sell it or any works using it or derived from it.