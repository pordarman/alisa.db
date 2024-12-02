declare class AlisaDB {
    constructor(constructorObject?: string | {
        fileName?: string;
        cache?: boolean;
        spaces?: number;
        autoWrite?: boolean;
    });

    keys(fileName?: string): string[];
    values(fileName?: string): any[];
    writeAll(fileName: string): boolean;
    set(key: string, value: any, fileName?: string): object;
    setMany(items: { [key: string]: any }, fileName?: string): object;
    setFile(input: any, fileName?: string): object;
    get(key: string, defaultValue?: any, fileName?: string): any | undefined;
    getValue(value: any, defaultValue?: any, fileName?: string): object;
    getManyValue(values: any[], defaultValue?: any, fileName?: string): any | object;
    getMany(keys: string[], defaultValue?: any, fileName?: string): any | object;
    getAll(fileName?: string): object;
    fetch(key: string, defaultValue?: any, fileName?: string): any | undefined;
    fetchValue(value: any, defaultValue?: any, fileName?: string): object;
    fetchManyValue(values: any[], defaultValue?: any, fileName?: string): any | object;
    fetchMany(keys: string[], defaultValue?: any, fileName?: string): any | object;
    fetchAll(fileName?: string): object;
    all(fileName?: string): object;
    has(key: string, fileName?: string): boolean;
    hasValue(value: any, fileName?: string): boolean;
    hasAnyValue(values: any[], fileName?: string): any | object;
    hasEveryValue(values: any[], fileName?: string): any | object;
    hasAny(keys: string[], fileName?: string): boolean;
    hasAll(keys: string[], fileName?: string): boolean;
    exists(key: string, fileName?: string): boolean;
    existsValue(value: any, fileName?: string): boolean;
    existsAnyValue(values: any[], fileName?: string): any | object;
    existsEveryValue(values: any[], fileName?: string): any | object;
    existsAny(keys: string[], fileName?: string): boolean;
    hasMany(keys: string[], fileName?: string): boolean;
    existsAll(keys: string[], fileName?: string): boolean;
    find(callback: (key: string, value: any, index: number, thisArr: any[]) => boolean, fileName?: string): any;
    filter(callback: (key: string, value: any, index: number, thisArr: any[]) => boolean, fileName?: string): object;
    includes(key: string, fileName?: string): any[];
    startsWith(key: string, fileName?: string): any[];
    some(callback: (key: string, value: any, index: number, thisArr: any[]) => boolean, fileName?: string): boolean;
    forEach(callback: (key: string, value: any, index: number, thisArr: any[]) => void, fileName?: string): void;
    sort(callback?: (a: any, b: any) => number, fileName?: string): boolean;
    every(callback: (key: string, value: any, index: number, thisArr: any[]) => boolean, fileName?: string): boolean;
    findAndDelete(callback: (key: string, value: any, index: number, thisArr: any[]) => boolean, fileName?: string): object | undefined;
    filterAndDelete(callback: (key: string, value: any, index: number, thisArr: any[]) => boolean, fileName?: string): any[];
    delete(key: string, fileName?: string): object | undefined;
    deleteMany(keys: string[], fileName?: string): any[];
    deleteAll(fileName?: string): object;
    push(key: string, item: any, fileName?: string): any[];
    pushAll(key: string, values: any[], fileName?: string): any[];
    pop(key: string, number?: number, fileName?: string): any[];
    unshift(key: string, item: any, fileName?: string): any[];
    unshiftAll(key: string, values: any[], fileName?: string): any[];
    shift(key: string, number?: number, fileName?: string): any[];
    add(key: string, number?: number, fileName?: string): number;
    substr(key: string, number?: number, goToNegative?: boolean, fileName?: string): number;
    multi(key: string, number: number, fileName?: string): number;
    division(key: string, number: number, goToDecimal?: boolean, fileName?: string): number;
    toJSON(fileName?: string): object;
    toArray(fileName?: string): Array<{ [key: string]: any }>;
    destroy(fileName?: string): boolean;
    reset(fileName?: string): object;
    create(fileName: string, file?: object, isDefaultFile?: boolean): object;
    clone(cloneFileName: string, fileName?: string): object;
    typeof(key: string, fileName?: string): string;
}

declare module "alisa.db" {
    export = AlisaDB;
}
