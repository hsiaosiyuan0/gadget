declare type Handler = (...params: any[]) => void;
declare type EventKey = string | symbol;
export declare function getHandlers(evt: EventKey): Set<Handler>;
export declare function on(evt: EventKey, handler: Handler): void;
export declare function makeOnceHandler(evt: EventKey, h: Handler): Handler;
export declare function once(evt: EventKey, handler: Handler): void;
export declare function off(evt: EventKey, handler?: Handler): void;
export declare function emit(evt: EventKey, ...args: any[]): void;
export {};
