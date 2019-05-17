var EventEmitter = require('events');

var custom_event = new EventEmitter();

custom_event.on('call', function() {
	console.log('이벤트 콜');
});

custom_event.emit('call');

custom_event.removeAllListeners();  // 이벤트 삭제

custom_event.emit('call');