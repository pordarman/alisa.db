export interface Options {
    spaces?: number;
    autoWrite?: boolean;
    cache?: boolean;
  }
  
  export interface FileEventPayload {
    fileName: string;
    file?: Record<string, any>;
    [key: string]: any;
  }
  
  export interface Listener<T = any> {
    (payload: T): void;
  }
  
  export type EventPayloads = {
    getFile: FileEventPayload & { fromCache: boolean; saveCache: boolean; fromFile: boolean };
    writeFile: FileEventPayload;
    writeCache: FileEventPayload;

    get: FileEventPayload & { key: string; isFound: boolean; rawData: any; value: any };
    getMany: FileEventPayload & { keys: string[]; rawData: Record<string, any>; isFound: boolean; result: any };
    getAll: FileEventPayload & { data: Record<string, any> };
    getFromValue: FileEventPayload & { value: any; rawData: [string, any] | undefined; values?: any };
    getManyFromValue: FileEventPayload & { values: any[]; rawData: string[]; result: any };
    has: FileEventPayload & { key: string; result: boolean };
    hasAny: FileEventPayload & { keys: string[]; result: boolean; foundedKey?: string };
    hasAll: FileEventPayload & { keys: string[]; result: boolean };
    hasValue: FileEventPayload & { value: any; result: boolean };
    hasAnyValue: FileEventPayload & { values: any[]; result: boolean };
    hasAllValue: FileEventPayload & { values: any[]; result: boolean };
    set: FileEventPayload & { key: string; value: any };
    setMany: FileEventPayload & { items: Record<string, any> };
    setFile: FileEventPayload & { input: Record<string, any> };

    find: FileEventPayload & { key?: string; value?: any; isFound: boolean };
    filter: FileEventPayload & { result: Record<string, any> };
    some: FileEventPayload & { result: boolean };
    forEach: FileEventPayload;
    every: FileEventPayload & { result: boolean };
    findAndDelete: FileEventPayload & { key?: string; value?: any; isFound: boolean };
    filterAndDelete: FileEventPayload & { limit: number; result: any[] };

    delete: FileEventPayload & { key: string; value?: any; isFound: boolean };
    deleteMany: FileEventPayload & { keys: string[]; result: any[] };
    deleteAll: FileEventPayload & { beforeFile: Record<string, any> };

    push: FileEventPayload & { key: string; item: any; result: any[] };
    pushAll: FileEventPayload & { key: string; values: any[]; result: any[] };
    pop: FileEventPayload & { key: string; number: number; deletedValues: any[]; result: any[] };
    unshift: FileEventPayload & { key: string; item: any; result: any[] };
    unshiftAll: FileEventPayload & { key: string; values: any[]; result: any[] };
    shift: FileEventPayload & { key: string; number: number; deletedValues: any[]; result: any[] };

    add: FileEventPayload & { key: string; number: number; result: number };
    substr: FileEventPayload & { key: string; number: number; result: number };
    multi: FileEventPayload & { key: string; number: number; result: number };
    division: FileEventPayload & { key: string; number: number; result: number };
    
    destroy: FileEventPayload;
    reset: FileEventPayload & { afterReset: Record<string, any> };
    create: FileEventPayload & { isDefaultFile: boolean };
    clone: FileEventPayload & { cloneFileName: string };
    [event: string]: any;
  };
  
  export default class Database {
    constructor(fileName?: string, options?: Options);
    version: string;
  
    keys(fileName?: string): string[];
    values(fileName?: string): any[];
    writeAll(fileName?: string | string[]): boolean;
  
    set(key: string, value: any, fileName?: string): Record<string, any>;
    setMany(data: Record<string, any> | [string, any][], fileName?: string): Record<string, any>;
    setFile(data: Record<string, any>, fileName?: string): Record<string, any>;
  
    get(key: string, defaultValue?: any, fileName?: string): any;
    getFromValue(value: any, defaultValue?: any, fileName?: string): string | undefined;
    getManyFromValue(values: any[], defaultValue?: any, fileName?: string): any;
    getMany(keys: string[], defaultValue?: any, fileName?: string): any;
    getAll(fileName?: string): Record<string, any>;
  
    has(key: string, fileName?: string): boolean;
    hasValue(value: any, fileName?: string): boolean;
    hasAnyValue(values: any[], fileName?: string): boolean;
    hasEveryValue(values: any[], fileName?: string): boolean;
    hasAny(keys: string[], fileName?: string): boolean;
    hasAll(keys: string[], fileName?: string): boolean;
  
    on<K extends keyof EventPayloads>(event: K, listener: Listener<EventPayloads[K]>): this;
    off<K extends keyof EventPayloads>(event: K, listener: Listener<EventPayloads[K]>): this;
    emit<K extends keyof EventPayloads>(event: K, payload: EventPayloads[K]): this;
  
    find(callback: (key: string, value: any, index: number, entries: [string, any][]) => boolean, fileName?: string): any;
    filter(callback: (key: string, value: any, index: number, entries: [string, any][]) => boolean, fileName?: string): Record<string, any>;
    includes(key: string, fileName?: string): Record<string, any>[];
    startsWith(key: string, fileName?: string): Record<string, any>[];
    some(callback: (key: string, value: any, index: number, entries: [string, any][]) => boolean, fileName?: string): boolean;
    forEach(callback: (key: string, value: any, index: number, entries: [string, any][]) => void, fileName?: string): void;
    every(callback: (key: string, value: any, index: number, entries: [string, any][]) => boolean, fileName?: string): boolean;
    findAndDelete(callback: (key: string, value: any, index: number, entries: [string, any][]) => boolean, fileName?: string): any;
    filterAndDelete(callback: (key: string, value: any, index: number, entries: [string, any][]) => boolean, limit?: number, fileName?: string): any[];
  
    delete(key: string, fileName?: string): any;
    deleteMany(keys: string[], fileName?: string): any[];
    deleteAll(fileName?: string): Record<string, any>;
  
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
  
    toJSON(fileName?: string): Record<string, any>;
    toArray(fileName?: string): [string, any][];
  
    destroy(fileName?: string): boolean;
    reset(fileName?: string): Record<string, any>;
    create(fileName: string, file?: Record<string, any>, isDefaultFile?: boolean): Record<string, any>;
    clone(cloneFileName: string, fileName?: string): Record<string, any>;
  
    typeof(key: string, fileName?: string): string;
  }