let message_place_x = 'l';
let message_place_y = 'b';
let x_syble = '✗'; //╳☓☒☑✓✔✗✘×
let maxMessageId = 0;

$('document').ready(function() {
	if ($('#message_place').length == 0) {$('body').append('<div id="message_place"></div>');}
	$('#message_place').css('position', 'fixed');
	$('#message_place').css('bottom', '0.5em');
	$('#message_place').css('left', '0.5em');
	$(document).on('click','.x', function(){$(this).parent().remove();});
});

function message_place_setting(x, y, xVal, yVal) {
	if (x == 'l') {
		$('#message_place').css('left', xVal);
		$('#message_place').css('right', 'auto');
		message_place_x = 'l';
	}
	else {
		$('#message_place').css('left', 'auto');
		$('#message_place').css('right', xVal);
		message_place_x = 'r';
	}

	if (y == 't') {
		$('#message_place').css('top', yVal);
		$('#message_place').css('bottom', 'auto');
		message_place_y = 't';
	}
	else {
		$('#message_place').css('top', 'auto');
		$('#message_place').css('bottom', yVal);
		message_place_y = 'b';
	}
}


class Message {
	xNeed = false;
	autoClose = true;
	delay = 10000;


	constructor(dict, settingIsOver=true) {
		this.text = dict['text'];
		this.type = dict['type'];
		maxMessageId++;
		this.id = maxMessageId;

		if (settingIsOver) {this.add();}
	}

	add() {
		let x = '';
		let data = '';
		if (this.xNeed) {x = '<div class="x">'+x_syble+'</div>';}
		if (message_place_x == 'l') {data = '<div class="Message" lr="'+message_place_x+'" msgType="'+this.type+'" id="message'+this.id+'">'+this.text+x+'</div>';}
		else {data = '<div class="Message" lr="'+message_place_x+'" msgType="'+this.type+'" id="message'+this.id+'">'+x+this.text+'</div>';}
		if (message_place_y == 'b') {$('#message_place').append(data);}
		else {$('#message_place').prepend(data);}
		$('#message' + this.id).hide();
		$('#message' + this.id).slideDown(); 
		if (this.autoClose == true) {
			let msgDelTimer = setTimeout("msgId = '#message' + "+ this.id + "; $(msgId).remove();", this.delay);
		}
	}

	close() {
		let msgId = '#message' + this.id;
		$(msgId).remove();
	}
}

function dellMsg(id) {
	let msgId = '#message' + id;
	$(msgId).remove();
}