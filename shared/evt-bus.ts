type Handler = (...params: any[]) => void;

type EventKey = string | symbol;

const evtHandlers = new Map<EventKey, Set<Handler>>();

export function getHandlers(evt: EventKey) {
  let hs = evtHandlers.get(evt);
  if (!hs) {
    hs = new Set();
    evtHandlers.set(evt, hs);
  }
  return hs;
}

export function on(evt: EventKey, handler: Handler) {
  const hs = getHandlers(evt);
  hs.add(handler);
}

// store the once version of the handlers
// firstly use the handler itself to retrieve a map which records
// the pairs to relate the evt-name to the once-handler
const onceHandlerStore = new Map<Handler, Map<EventKey, Handler>>();
export function makeOnceHandler(evt: EventKey, h: Handler) {
  let ehs = onceHandlerStore.get(h);
  if (!ehs) {
    ehs = new Map();
    onceHandlerStore.set(h, ehs);
  }
  // evt-name to once-handler
  let oh = ehs.get(evt);
  if (!oh) {
    oh = (...args: any[]) => {
      h(...args);
      off(evt, oh);
    };
    ehs.set(evt, oh);
  }
  return oh;
}

export function once(evt: EventKey, handler: Handler) {
  const oh = makeOnceHandler(evt, handler);
  const hs = getHandlers(evt);
  hs.add(oh);
}

export function off(evt: EventKey, handler?: Handler) {
  if (!handler) {
    evtHandlers.delete(evt);
    return;
  }
  const hs = getHandlers(evt);
  hs.delete(handler);
}

export function emit(evt: EventKey, ...args: any[]) {
  const hs = getHandlers(evt);
  hs.forEach((h) => h(...args));
}
