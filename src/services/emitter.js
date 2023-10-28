import mitt from 'mitt';

const EventBus = mitt();
const emitter = mitt();
const AddressEmitter = mitt()
export { EventBus, emitter ,AddressEmitter};
