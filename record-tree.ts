import style from './record-tree.css?raw';

const COMPONENT_STYLESHEET = new CSSStyleSheet();
COMPONENT_STYLESHEET.replaceSync(style);

const DEFAULT_REMOVED_CLASS_NAME = 'removed';

const ICON_CANCEL_CROSS = `<svg class="icon cancel-cross" viewBox="0 0 22.812714 22.814663" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
    <path style="color:#000000;fill:var(--icon-primary-color,InfoText);stroke:var(--icon-secondary-color,InfoBackground);stroke-linecap:square;stroke-miterlimit:6.3;stroke-dashoffset:29.2913;stroke-opacity:1;-inkscape-stroke:none"
    d="m 1237.4389,207.63366 -1.8991,1.8987 a 0.65841136,0.65841136 90.003442 0 0 0,0.93116 l 0.4831,0.48317 a 14628.329,14628.329 44.999244 0 0 0.9312,0.93118 l 3.7936,3.79311 a 0.65840885,0.65840885 89.998393 0 1 0,0.93116 l -3.7936,3.7936 a 8783.6896,8783.6896 135.00442 0 1 -0.9313,0.93111 l -0.4829,0.48283 a 0.65811,0.65811 89.993977 0 0 10e-5,0.93094 l 1.8987,1.89741 a 0.65867085,0.65867085 179.98891 0 0 0.9314,-1.8e-4 l 0.4826,-0.48267 a 45427.77,45427.77 134.99941 0 1 0.9312,-0.93119 l 3.7931,-3.79308 a 0.65848899,0.65848899 179.99848 0 1 0.9312,-2e-5 l 3.7936,3.79312 a 10110.91,10110.91 44.992994 0 0 0.9313,0.93108 l 0.483,0.48285 a 0.65856615,0.65856615 179.99438 0 0 0.9313,-9e-5 l 1.897,-1.89705 a 0.65833101,0.65833101 89.994378 0 0 -10e-5,-0.93111 l -0.483,-0.48285 a 5293.5057,5293.5057 44.99639 0 1 -0.9313,-0.93113 l -3.793,-3.79354 a 0.65849247,0.65849247 90.001607 0 1 0,-0.93122 l 3.793,-3.79305 a 149190.44,149190.44 134.99995 0 1 0.9312,-0.93119 l 0.4832,-0.48321 a 0.65863247,0.65863247 90.008202 0 0 10e-5,-0.93132 l -1.8972,-1.89834 a 0.65838576,0.65838576 0.01346964 0 0 -0.9312,-2.2e-4 l -0.483,0.48285 a 7148.543,7148.543 135.00546 0 0 -0.9313,0.9311 l -3.7936,3.79359 a 0.65841791,0.65841791 0.00151591 0 1 -0.9312,-3e-5 l -3.7931,-3.79353 a 52707.551,52707.551 45.002134 0 0 -0.9312,-0.93122 l -0.4826,-0.48267 a 0.65849044,0.65849044 0.00323988 0 0 -0.9312,-5e-5 z"
    transform="translate(-1232.6358,-204.72848)" />
</svg>`;
const ICON_UNDO = `<svg class="icon undo-redo" viewBox="0 0 22.812714 22.814663" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
<path
   style="color:#000000;fill:var(--icon-primary-color,InfoText);stroke:var(--icon-secondary-color,CanvasText);fill-opacity:1;stroke-width:0.999999;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1"
   d="M 8.7359009 1.1063924 C 8.3768905 1.0950243 8.0017196 1.1736712 7.641394 1.3523722 L 1.6107544 6.1205566 L 1.5916341 6.1386434 L 1.53479 6.1939372 C 1.0620233 6.6537208 0.70744486 7.6004515 1.0769368 8.152474 L 5.3030355 14.40894 C 6.1798306 15.219356 7.5994445 15.083541 8.4749349 14.106116 C 9.2135837 13.277519 9.3398045 12.086041 8.7787923 11.23549 L 11.334192 11.410673 C 14.129266 11.815808 17.330477 13.067707 18.931144 18.826241 C 19.313756 19.953163 19.735424 21.309718 20.245793 22.173324 C 20.976132 22.497497 21.420713 20.679238 21.478792 18.791101 C 21.506716 14.251463 18.262689 8.6142076 13.845667 6.7716797 C 13.291103 6.5403477 11.805521 5.8978235 10.30118 5.3355916 L 9.7994019 5.1107992 C 10.609379 4.4184442 10.916638 3.2966427 10.55026 2.3703979 C 10.238366 1.5905459 9.5257236 1.1314023 8.7359009 1.1063924 z " />
</svg>`;

const COMPONENT_TAG_NAME = 'record-tree';
export class RecordTreeElement extends HTMLElement
{
    static observedAttributes = [ ];

    #data: any;
    path: string[] = [];
    #removedPaths: Set<string> = new Set();

    #customCollectionRenderers: Array<
    { 
        condition: (key: string, data: any, parentElement: HTMLElement) => boolean|Promise<boolean>,
        renderer: (key: string, data: any, parentElement: HTMLElement, isTop?:boolean) => void|Promise<void> 
    }> = new Array();
    #customObjectRenderers: Array<
    { 
        condition: (key: string, data: any, parentElement: HTMLElement) => boolean|Promise<boolean>,
        renderer: (key: string, data: any, parentElement: HTMLElement, isTop?:boolean) => void|Promise<void> 
    }> = new Array();
    #customPropertyRenderers: Array<
    { 
        condition: (key: string, data: any, parentElement: HTMLElement) => boolean|Promise<boolean>,
        renderer: (key: string, data: any, parentElement: HTMLElement) => void|Promise<void> 
    }> = new Array();
    #customPropertyNameGenerators: Array<
    { 
        condition: (title: string, value: string, parentElement: HTMLElement) => boolean|Promise<boolean>,
        generator: (title: string, value: string, parentElement: HTMLElement) => HTMLElement|Promise<HTMLElement> 
    }> = new Array();
    #customPropertyValueGenerators: Array<
    { 
        condition: (title: string, value: string, parentElement: HTMLElement) => boolean|Promise<boolean>,
        generator: (title: string, value: string, parentElement: HTMLElement) => HTMLElement|Promise<HTMLElement> 
    }> = new Array();

    #widestPropertyName: number = 0;

    constructor()
    {
        super();
        let parent = this.getRootNode() as Document|ShadowRoot;
        parent.adoptedStyleSheets.push(COMPONENT_STYLESHEET);

        this.addEventListener('click', this.#onClick.bind(this));
    }
    #onClick(event: Event)
    {
        const removeButton = ((event.target as HTMLElement).closest('svg') != null)
        ? (event.target as HTMLElement).closest('button')
        : event.target as HTMLElement;
        if(removeButton == null || !removeButton.classList.contains('remove'))
        {
            return;
        }

        const parentToRemove: HTMLElement|null = removeButton.parentElement?.classList.contains('property')
        ? removeButton.parentElement
        : (removeButton.parentElement?.parentElement?.classList.contains('collection'))
        ? removeButton.parentElement.parentElement
        : null;

        if(parentToRemove == null)
        {
            console.error("Unknown button clicked");
            return;
        }
        
        event.stopPropagation();
        event.preventDefault();
        
        if(this.hasAttribute('removed-class'))
        {
            let removeAttributeName = this.getAttribute('removed-class');
            if(removeAttributeName == null || removeAttributeName == '') { removeAttributeName = DEFAULT_REMOVED_CLASS_NAME; }
            const isRemoved = parentToRemove.classList.contains(removeAttributeName);
            if(isRemoved)
            {
                parentToRemove.classList.remove(removeAttributeName);
                parentToRemove.part.remove(removeAttributeName);
                if(parentToRemove.dataset.path != ".properties")
                {
                    this.#removedPaths.delete(parentToRemove.dataset.path!);
                }
                removeButton.innerHTML = ICON_CANCEL_CROSS;
                removeButton.title = 'Remove';
                this.dispatchEvent(new CustomEvent('restore', { detail: { path: parentToRemove.dataset.path } }));
            }
            else
            {
                parentToRemove.classList.add(removeAttributeName);
                parentToRemove.part.add(removeAttributeName);
                if(parentToRemove.dataset.path != ".properties")
                {
                    this.#removedPaths.add(parentToRemove.dataset.path!);
                }
                removeButton.innerHTML = ICON_UNDO;
                removeButton.title = 'Undo';
                removeButton.classList.add('undo');
                removeButton.part.add('undo');
                this.dispatchEvent(new CustomEvent('remove', { detail: { path: parentToRemove.dataset.path } }));
            }
        }
        else
        {
            parentToRemove.remove();
            this.#removedPaths.add(parentToRemove.dataset.path!);
            this.dispatchEvent(new CustomEvent('remove', { detail: { path: parentToRemove.dataset.path } }));
        }
        // details.remove();
        // this.#removedPaths.add(details.dataset.path!);
        // this.dispatchEvent(new CustomEvent('remove', { detail: { path: this.path.join('.') } }));
    }

    getPathArray()
    {
        return this.path;
    }
    getCurrentPathString()
    {
        return this.path.join('.');
    }

    getInitialData<T>()
    {
        return this.#data as T;
    }

    setData<T>(data: T)
    {
        this.#data = data;

        // todo: special handler for settings
        // special handler for tags
        // remove buttons
        // return data for export


        // this.#updatedData = structuredClone(data);

        // const onRemoveCategory = (key: string, path?: string[]) =>
        // {
        //     const pathArray = path ?? [];
        //     console.log(pathArray);

        //     let target = this.#getUpdatedData<T>();
        //     for(let i = 0; i < pathArray.length; i++)
        //     {
        //         const pathKey = (pathArray[i][0] == '#')
        //         ? pathArray[i].substring(1)
        //         : pathArray[i];
        //         target = (target as any)[pathKey];
        //     }
        //     target = (target as any)[key];
        //     console.log(target);
        //     // finalData = updatedData;
        //     // console.log(finalData);
        // }
        // const onRemoveItem = <T>(item: T, index: number, path: string[]) =>
        // {
        //     const pathArray = path ?? [];
        //     console.log(pathArray);

        //     let target = this.#getUpdatedData<T>();
        //     for(let i = 0; i < pathArray.length; i++)
        //     {
        //         const pathKey = (pathArray[i][0] == '#')
        //         ? pathArray[i].substring(1)
        //         : pathArray[i];
        //         target = (target as any)[pathKey];
        //     }
        //     const parent = target;
        //     const value = (parent as any)[index];

        //     // todo:
        //     // delete (parent as any)[key];

        //     console.log(parent, index, value);
        // }
        // const onRemoveMemberItem = <T>(item: T, key: string, path: string[]) =>
        // {
        //     const pathArray = path ?? [];
        //     console.log(pathArray);

        //     let target = this.#getUpdatedData<T>();
        //     for(let i = 0; i < pathArray.length; i++)
        //     {
        //         const pathKey = (pathArray[i][0] == '#')
        //         ? pathArray[i].substring(1)
        //         : pathArray[i];
        //         target = (target as any)[pathKey];
        //     }
        //     const parent = target;
        //     const value = (parent as any)[key];

        //     // todo:
        //     // delete (parent as any)[key];

        //     console.log(parent, key, value);
        // }

        this.renderRecordData(this.#data);
    }

    async renderRecordData<T extends {}>(data:T)
    {
        this.innerHTML = "";
        this.path = [];
        await this.renderData(data, this);
        this.path = [];
        this.style.setProperty('--property-name-width', `${this.#widestPropertyName}px`);
    }
    async renderData(data: any, parentElement: HTMLElement, usePropertiesContainer = true)
    {
        const lastPathEntry = this.path[this.path.length - 1] ?? this.getAttribute('parent-name') ?? 'Data';

        if(Array.isArray(data))
        {
            // render property
            let renderer:(title: string, value: any, parentElement: HTMLElement, isTop?:boolean) => void|Promise<void>  = this.renderArrayAsCollection;
            for(let i = 0; i < this.#customCollectionRenderers.length; i++)
            {
                if(this.#customCollectionRenderers[i].condition(lastPathEntry, data, parentElement) == true)
                {
                    renderer = this.#customCollectionRenderers[i].renderer;
                    break;
                }
            }
            
            await renderer.call(this, lastPathEntry, data, parentElement, true);
        }
        else if(Object.prototype.toString.call(data) === "[object Object]")
        {
            // collapse getter properties into member properties
            data = this.draftObject(data);

            // render property
            let renderer:(title: string, value: any, parentElement: HTMLElement, isTop?:boolean) => void|Promise<void>  = this.renderObjectAsCollection;
            for(let i = 0; i < this.#customObjectRenderers.length; i++)
            {
                if(this.#customObjectRenderers[i].condition(lastPathEntry, data, parentElement) == true)
                {
                    renderer = this.#customObjectRenderers[i].renderer;
                    break;
                }
            }
            
            await renderer.call(this, lastPathEntry, data, parentElement, true);            
        }
        else if(usePropertiesContainer == true)
        {
            const pathMinusLastEntry = this.path.filter((item, index) => (index < (this.path.length-1)));
            let properties = this.querySelector(`details[data-path="${pathMinusLastEntry.join('.')}.properties"]`);
            let propertyList = (properties == null) ? null : properties.querySelector('ul');
            // let propertiesDetails = null;

            if(properties == null)
            {
                properties = this.createCollectionDetailsElement('Properties', `${pathMinusLastEntry.join('.')}.properties`, ['collection', 'properties'], false);
                properties.toggleAttribute('open', true);
                propertyList = document.createElement('ul');
                properties.append(propertyList);

                parentElement.append(properties);
            }

            if(propertyList!.children.length > 10)
            {
                properties!.toggleAttribute('open', false);
            }
            
            // render property
            let renderer:(title: string, value: any, parentElement: HTMLElement) => void|Promise<void>  = this.renderObjectProperty;
            for(let i = 0; i < this.#customPropertyRenderers.length; i++)
            {
                if(this.#customPropertyRenderers[i].condition(lastPathEntry, data, propertyList!) == true)
                {
                    renderer = this.#customPropertyRenderers[i].renderer;
                    break;
                }
            }
            
            await renderer.call(this, lastPathEntry, data, propertyList!);
        }
        else
        {
            // render property
            let renderer:(title: string, value: any, parentElement: HTMLElement) => void|Promise<void>  = this.renderObjectProperty;
            for(let i = 0; i < this.#customPropertyRenderers.length; i++)
            {
                if(this.#customPropertyRenderers[i].condition(lastPathEntry, data, parentElement) == true)
                {
                    renderer = this.#customPropertyRenderers[i].renderer;
                    break;
                }
            }
            
            await renderer.call(this, lastPathEntry, data, parentElement);
        }
    }

    addCustomCollectionRenderer(condition: (key: string, data: any, parentElement: HTMLElement) => boolean|Promise<boolean>, renderer: (key: string, data: any, parentElement: HTMLElement) => void|Promise<void>)
    {
        this.#customCollectionRenderers.push(
            {
                condition,
                renderer
            }
        )
    }
    addCustomObjectRenderer(condition: (key: string, data: any, parentElement: HTMLElement) => boolean|Promise<boolean>, renderer: (key: string, data: any, parentElement: HTMLElement) => void|Promise<void>)
    {
        this.#customObjectRenderers.push(
            {
                condition,
                renderer
            }
        )
    }
    addCustomPropertyRenderer(condition: (key: string, data: any, parentElement: HTMLElement) => boolean|Promise<boolean>, renderer: (key: string, data: any, parentElement: HTMLElement) => void|Promise<void>)
    {
        this.#customPropertyRenderers.push(
            {
                condition,
                renderer
            }
        )
    }
    addCustomPropertyNameGenerator(condition: (title: string, value: string, parentElement: HTMLElement) => boolean|Promise<boolean>, generator: (title: string, value: string, parentElement: HTMLElement) => HTMLElement|Promise<HTMLElement>)
    {
        this.#customPropertyNameGenerators.push(
            {
                condition,
                generator
            }
        )
    }
    addCustomPropertyValueGenerator(condition: (title: string, value: string, parentElement: HTMLElement) => boolean|Promise<boolean>, generator: (title: string, value: string, parentElement: HTMLElement) => HTMLElement|Promise<HTMLElement>)
    {
        this.#customPropertyValueGenerators.push(
            {
                condition,
                generator
            }
        )
    }

    clear()
    {
        this.innerHTML = "";
    }
    refresh()
    {
        this.setData(this.#data);
    }


    getUpdatedData<T>()
    {
        const updatedData = structuredClone(this.#data);

        for(const [key] of this.#removedPaths.entries())
        {
            const keyArray = key.split('.');
            let parent = updatedData;
            let target = updatedData[keyArray[0]];
            let targetKey = keyArray[0];
            for(let i = 1; i < keyArray.length; i++)
            {
                targetKey = keyArray[i];
                parent = target;
                target = parent[targetKey];

            }
            if(parent != null && target != null)
            {
                delete parent[targetKey];
            }
        }

        return updatedData as T;
    }

    createCollectionDetailsElement(name: string, path: string, classes?: string[], preventRemoveButton?: boolean)
    {

        const details = document.createElement('details');
        if(classes != null) 
        {
            details.classList.add('details', ...classes);
            details.part.add('details', ...classes);
        }
        details.setAttribute('data-path', path);

        const summary = document.createElement('summary');
        summary.classList.add('summary');
        summary.part.add('summary', 'collection', ...classes ?? []);
        const nameSpan = document.createElement('span');
        nameSpan.textContent = name;
        nameSpan.classList.add('name');
        nameSpan.part.add('name', 'collection', ...classes ?? []);

        summary.append(nameSpan);

        if(preventRemoveButton != false)
        {
            const removeButton = document.createElement('button');
            removeButton.innerHTML = ICON_CANCEL_CROSS;
            removeButton.title = 'Remove';
            removeButton.classList.add('button', 'icon-button', 'remove');
            removeButton.part.add('button', 'icon-button', 'remove');
            summary.append(removeButton);
        }
        
        details.append(summary);

        return details;
    }

    async renderArrayAsCollection(key: string, data: any, parentElement: HTMLElement, isTop: boolean = false)
    {
        const name = (isNaN(parseInt(key))) ? key : `[${key}]`;

        const details = this.createCollectionDetailsElement(name, this.path.join('.'), ['collection']);
        if(this.path.length == 0)
        {
            details.setAttribute('open', '');
        }

        if(isTop == true)
        {
            details.classList.add('top');
            details.part.add('top');
        }

        parentElement.append(details);

        // render array items
        for(let i = 0; i < data.length; i++)
        {
            this.path.push(i.toString());
            await this.renderData(data[i], details, false);
            this.path.pop();
        }
    }
    async renderObjectAsCollection(key: string, data: any, parentElement: HTMLElement, isTop: boolean = false)
    {
        const name = (isNaN(parseInt(key))) ? key 
        : (data.name != null && data.name.trim() != "")
        ? data.name
        : (data.description != null && data.description.trim() != "")
        ? data.description
        : (data.key != null && data.key.trim() != "")
        ? data.key
        : (data.id != null && data.id.toString().trim() != "")
        ? data.id
        : `[${key}]`;
        const details = this.createCollectionDetailsElement(name, this.path.join('.'), ['collection']);
        if(this.path.length == 0)
        {
            details.setAttribute('open', '');
        }

        if(isTop == true)
        {
            details.classList.add('top');
            details.part.add('top');
        }

        parentElement.append(details);

        // render members as items or arrays
        for(const [key, value] of Object.entries(data))
        {
            this.path.push(key);
            await this.renderData(data[key], details);
            this.path.pop();
        }
    }
    async renderObjectProperty(title: string, value: any, parentElement: HTMLElement)
    {
        const tagName = (parentElement instanceof HTMLUListElement) ? 'li' : 'div';
        const property = document.createElement(tagName);
        property.classList.add('property');
        property.part.add('property');
        property.dataset.path = this.path.join('.');

        let nameGenerator:(title: string, value: any, parentElement: HTMLElement) => HTMLElement|Promise<HTMLElement> = this.createPropertyName;
        for(let i = 0; i < this.#customPropertyNameGenerators.length; i++)
        {
            if(this.#customPropertyNameGenerators[i].condition(title, value, parentElement) == true)
            {
                nameGenerator = this.#customPropertyNameGenerators[i].generator;
                break;
            }
        }
        const name = await nameGenerator(title, value, parentElement);

        const delimiter = document.createElement('span');
        delimiter.classList.add('delimiter');
        delimiter.part.add('delimiter');
        delimiter.textContent = ':';

        let valueGenerator:(title: string, value: any, parentElement: HTMLElement) => HTMLElement|Promise<HTMLElement> = this.createPropertyValue.bind(this);
        for(let i = 0; i < this.#customPropertyValueGenerators.length; i++)
        {
            if(this.#customPropertyValueGenerators[i].condition(title, value, parentElement) == true)
            {
                valueGenerator = this.#customPropertyValueGenerators[i].generator;
                break;
            }
        }
        const valueSpan = await valueGenerator(title, value, parentElement);
        

        const removeButton = document.createElement('button');
        removeButton.innerHTML = ICON_CANCEL_CROSS;
        removeButton.title = 'Remove';
        removeButton.classList.add('button', 'icon-button', 'remove');
        removeButton.part.add('button', 'icon-button', 'remove');

        property.append(name, delimiter, valueSpan, removeButton);
        

        property.title = `${name.getAttribute('title')}: ${valueSpan.getAttribute('title')}`;

        parentElement.append(property);

        // useful for common format with right-aligned field labels
        const propertyNameWidth = Math.ceil(name.getBoundingClientRect().width);
        if(this.#widestPropertyName < propertyNameWidth)
        {
            this.#widestPropertyName = propertyNameWidth;
        }
    }
    createPropertyName(title: string, value: any, parentElement: HTMLElement)
    {
        const name = document.createElement('span');
        name.classList.add('name');
        name.part.add('name', 'property');
        name.textContent = title;
        name.title = title;
        return name;
    }
    createPropertyValue(title: string, value: any, parentElement: HTMLElement)
    {
        const valueSpan = document.createElement('span');
        valueSpan.classList.add('value');
        valueSpan.part.add('value', 'value');

        if(value === undefined)
        {
            const undefinedTextValue = this.getAttribute('undefined-value') ??  "[ undefined ]";
            value = undefinedTextValue;
            valueSpan.classList.add('undefined');
            valueSpan.part.add('undefined');
        }
        else if(value === null)
        {
            const nullTextValue = this.getAttribute('null-value') ??  "[ null ]";
            value = nullTextValue;
            valueSpan.classList.add('null');
            valueSpan.part.add('null');
        }
        else
        {
            value = value.toString();
        }

        if(value.trim() == "")
        {
            const blankTextValue = this.getAttribute('blank-value') ??  "[ blank text ]";
            value = blankTextValue;
        }

        valueSpan.textContent = (value.length > 1024) ? value.substring(0, 1024) : value;
        valueSpan.title = (value.startsWith('data:')) ? "[ Binary Data ]" : value;
        return valueSpan;
    }

    async renderCollectionAsKeyValuePairs(key: string, items: {key: string, value: any}[], parentElement: HTMLElement)
    {
        const propertiesDetails = this.createCollectionDetailsElement(key, this.path.join('.'), ['collection', 'key-value-pairs']);

        const propertiesList = document.createElement('ul');
        propertiesList.part.add('properties-list');
        propertiesDetails.append(propertiesList);

        for(let i = 0; i < items.length; i++)
        {
            this.path.push(items[i].key);
            await this.renderObjectProperty(items[i].key, items[i].value, propertiesList);
            this.path.pop();
        }

        parentElement.append(propertiesDetails);
    }
    async renderCollectionAsValues(key: string, items: any[], parentElement: HTMLElement)
    {
        const propertiesDetails = this.createCollectionDetailsElement(key, this.path.join('.'), ['collection', 'values']);

        const propertiesList = document.createElement('ul');
        propertiesList.part.add('properties-list');
        propertiesDetails.append(propertiesList);

        for(let i = 0; i < items.length; i++)
        {
            this.path.push(items[i]);
            await this.renderObjectAsValue(items[i], items[i], propertiesList);
            this.path.pop();
        }

        parentElement.append(propertiesDetails);
    }
    async renderObjectAsValue(key: string, value: any, parentElement: HTMLElement)
    {        
        const property = document.createElement('li');
        property.classList.add('property');
        property.part.add('property');
        property.dataset.path = this.path.join('.');

        const valueSpan = document.createElement('span');
        valueSpan.classList.add('value');
        valueSpan.part.add('value');
        // valueSpan.title = (options.propertyTransformation != null)
        // ? await options.propertyTransformation(value)
        // : (value == null) 
        // ? options.nullLabel 
        // : ((value as any).toString().trim() == "") 
        // ? options.blankLabel 
        // : (value as any).toString();
        // valueSpan.textContent = valueSpan.title;
        valueSpan.textContent = (value as any).toString();
        valueSpan.title = "[ Object ]";

        const removeButton = document.createElement('button');
        removeButton.innerHTML = ICON_CANCEL_CROSS;
        removeButton.title = 'Remove';
        removeButton.classList.add('button', 'icon-button', 'remove');
        removeButton.part.add('button', 'icon-button', 'remove');

        property.append(valueSpan, removeButton);

        parentElement.append(property);
    }


    // generic json rendering
    renderDataObject(data: any, parent: HTMLElement) 
    {

        if(Array.isArray(data))
        {
            for(let i = 0; i < data.length; i++)
            {
                const value = data[i];

                const $details = document.createElement('details');
                const $summary = document.createElement('summary');

                let textContent = value.name ?? value.description ?? value.key;
                if(textContent == null || textContent.trim() == "") { textContent = i.toString(); }
                $summary.classList.add('summary');
                $summary.part.add('summary', 'property');
                $summary.textContent = textContent.substring(0, Math.min(textContent.length, 20));

                $details.classList.add('subrecord');
                $details.part.add('subrecord');
                parent.appendChild($details);
                $details.appendChild($summary);

                this.renderDataObject(value, $details);
            }
        }
        else
        {
            let propertiesList = null;
            for(const [key, value] of Object.entries(data))
            {

                if(Array.isArray(value) || Object.prototype.toString.call(value) === "[object Object]")
                {
                    // console.log(key);
                    const $details = document.createElement('details');
                    const $summary = document.createElement('summary');
    
                    // let textContext = key;
                    $summary.classList.add('summary');
                    $summary.part.add('summary', 'property');
                    $summary.textContent = key;

                    $details.classList.add('subrecord');
                    $details.part.add('subrecord');
                    parent.appendChild($details);
                    $details.appendChild($summary);

                    this.renderDataObject(value, $details!);
                }
                else
                {
                    if(propertiesList == null) 
                    { 
                        propertiesList = parent.querySelector(':scope > ul');
                        if(propertiesList == null)
                        {
                            propertiesList = document.createElement('ul');
                            parent.appendChild(propertiesList);
                        }
                    }

                    const $property = document.createElement('li');
                    $property.classList.add('property');
                    $property.part.add('property');

                    const $name = document.createElement('span');
                    $name.classList.add('name');
                    $name.part.add('name', 'property');
                    $name.textContent = key;

                    const $value = document.createElement('span');
                    $value.classList.add('value');
                    $value.part.add('value', 'property');
                    let textContent = (value as any).toString();
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
    draftObject(instance: any)
    {
        return Object.assign({}, instance, this.extractProperties(instance));
    }
    extractProperties(instance: any)
    {
        const propertyNames = this.getPropertyNames(instance);
        const itemData: { [key: string]: any } = {};
        for(let i = 0; i < propertyNames.length; i++)
        {
            itemData[propertyNames[i]] = instance[propertyNames[i]];
        }
        return itemData;
    }
    getPropertyNames(instance: any)
    {
        const prototype = Reflect.getPrototypeOf(instance);
        const descriptors = Object.getOwnPropertyDescriptors(prototype);
        return Object.entries(descriptors)
        .filter(entry => (typeof entry[1].get === 'function') && entry[0] !== '__proto__')
        .map(entry => entry[0]);
    }
}

if(customElements.get(COMPONENT_TAG_NAME) == null)
{
    customElements.define(COMPONENT_TAG_NAME, RecordTreeElement);
}