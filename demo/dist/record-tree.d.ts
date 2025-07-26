declare class RecordTreeElement extends HTMLElement {
    #private;
    static observedAttributes: never[];
    path: string[];
    constructor();
    getPathArray(): string[];
    getCurrentPathString(): string;
    getInitialData<T>(): T;
    setData<T>(data: T): void;
    renderRecordData<T extends {}>(data: T): Promise<void>;
    renderData(data: any, parentElement: HTMLElement, usePropertiesContainer?: boolean): Promise<void>;
    addCustomCollectionRenderer(condition: (key: string, data: any, parentElement: HTMLElement) => boolean | Promise<boolean>, renderer: (key: string, data: any, parentElement: HTMLElement) => void | Promise<void>): void;
    addCustomObjectRenderer(condition: (key: string, data: any, parentElement: HTMLElement) => boolean | Promise<boolean>, renderer: (key: string, data: any, parentElement: HTMLElement) => void | Promise<void>): void;
    addCustomPropertyRenderer(condition: (key: string, data: any, parentElement: HTMLElement) => boolean | Promise<boolean>, renderer: (key: string, data: any, parentElement: HTMLElement) => void | Promise<void>): void;
    addCustomPropertyNameGenerator(condition: (title: string, value: string, parentElement: HTMLElement) => boolean | Promise<boolean>, generator: (title: string, value: string, parentElement: HTMLElement) => HTMLElement | Promise<HTMLElement>): void;
    addCustomPropertyValueGenerator(condition: (title: string, value: string, parentElement: HTMLElement) => boolean | Promise<boolean>, generator: (title: string, value: string, parentElement: HTMLElement) => HTMLElement | Promise<HTMLElement>): void;
    clear(): void;
    refresh(): void;
    getUpdatedData<T>(): T;
    createCollectionDetailsElement(name: string, path: string, classes?: string[], preventRemoveButton?: boolean, isTop?: boolean): HTMLDetailsElement;
    renderArrayAsCollection(key: string, data: any, parentElement: HTMLElement, isTop?: boolean): Promise<void>;
    renderObjectAsCollection(key: string, data: any, parentElement: HTMLElement, isTop?: boolean): Promise<void>;
    renderObjectProperty(title: string, value: any, parentElement: HTMLElement): Promise<void>;
    createPropertyName(title: string, value: any, parentElement: HTMLElement): HTMLSpanElement;
    createPropertyValue(title: string, value: any, parentElement: HTMLElement): HTMLSpanElement;
    renderCollectionAsKeyValuePairs(key: string, items: {
        key: string;
        value: any;
    }[], parentElement: HTMLElement): Promise<void>;
    renderCollectionAsValues(key: string, items: any[], parentElement: HTMLElement): Promise<void>;
    renderObjectAsValue(key: string, value: any, parentElement: HTMLElement): Promise<void>;
    renderDataObject(data: any, parent: HTMLElement): void;
    /**
     * Converts a complex object that may contain `get` properties and functions,
     * into a simple object that is only key-value pairs of data.
     * @param instance a complex object to be collapsed into a key-value object.
     * @returns a simple key-value object that represents the point-in-execution data of the provided object.
     */
    draftObject(instance: any): any;
    extractProperties(instance: any): {
        [key: string]: any;
    };
    getPropertyNames(instance: any): string[];
}

export { RecordTreeElement };
