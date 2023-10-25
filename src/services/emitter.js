import mitt from 'mitt';

const EventBus = mitt();
const emitter = mitt();

export { EventBus, emitter };
