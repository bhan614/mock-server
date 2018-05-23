import Event from 'events';

const EVENT_NAME = 'InterfaceChangeEvent';
class InterfaceChangeEvent{
	constructor(){
		this.emitter = new Event.EventEmitter();
	}
	addEvent(cb){
		cb && this.emitter.on(EVENT_NAME,cb)
	}
	dispatch(data){
		this.emitter.emit(EVENT_NAME,data);
	}
}

export default new InterfaceChangeEvent();