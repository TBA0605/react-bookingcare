import eventEmitter from "events";  //events của nodejs --> không cần cài 
const _emitter = new eventEmitter();

_emitter.setMaxListeners(0); //unlimit listener
export const emitter = _emitter;
