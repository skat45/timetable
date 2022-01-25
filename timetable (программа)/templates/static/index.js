let const_sheet = false;
let not_const_sheet = false;
let day_of_week;

$(document).ready(function() {
	let date = new Date;
	day_of_week = date.getDay();
	indicate_day();
	setInterval(function() {
		$('body').css('height', $(window).height());

		let now = new Date();
		let now_h = String(now.getHours());
		let now_m = String(now.getMinutes());
		if (now_m.length < 2) now_m = '0' + now_m;
		$('span[time]').text(now_h + ':' + now_m);

		let now_d_w = get_day_of_week(now);
		let now_d = String(now.getDate());
		if (now_d.length < 2) now_d = '0' + now_d;
		let now_month = String(now.getMonth() + 1);
		if (now_month.length < 2) now_month = '0' + now_month;
		let now_y = String(now.getFullYear());
		$('span[date]').text(now_d_w + ' ' + now_d + '.' + now_month + '.' + now_y);

	}, 1000);

	get_weather();
	get_const();
	get_not_const();
	get_birthadys();
	setTimeout(function() {setInterval(function() {make_tables();}, 1000 * 1);}, 1000 * 1);
	setInterval(function() {get_weather();}, 1000 * 60 * 20); //every 20 minutes
	setInterval(function() {get_const()}, 1000 * 5); //every 5 seconds
	setInterval(function() {get_not_const()}, 1000 * 5); //every 5 seconds
	setTimeout(function() {setInterval(function() {get_birthadys();}, 1000 * 60 * 30);}, 1000 * 60 * 30);

	$(document).keyup(function(e) {
		if (e.keyCode === 39) {
			next_day();
		}
		if (e.keyCode === 37) {
			previous_day();
		}
	});
});

function get_day_of_week(now) {
	now_d = now.getDay();
		switch (now_d) {
			case 0:
				now_d = 'Вс';
				break;
			case 1:
				now_d = 'Пн';
				break;
			case 2:
				now_d = 'Вт';
				break;
			case 3:
				now_d = 'Ср';
				break;
			case 4:
				now_d = 'Чт';
				break;
			case 5:
				now_d = 'Пт';
				break;
			case 6:
				now_d = 'Сб';
				break;	
		}
	return now_d;
}

function get_weather() {
	$.ajax({
		type: "GET",
		url: "/get_weather",
		dataType: "json",
		success: function (response) {
			$('span[t_now]').text(response['temperature']);
			$('span[wind]').text(response['wind']);
		}
	});
}

function get_const() {
	$.ajax({
		type: "GET",
		url: "/get_const",
		dataType: "json",
		success: function (response) {
			if (JSON.stringify(const_sheet) != JSON.stringify(response['data'])) {
				const_sheet = response['data'];
			}
			console.log(const_sheet);
		},
		error: function() {
			let elem = new Message({
				text: 'Server error',
				type: 'dang'
			}, false);
			elem.delay = 1500;
			elem.add();
			return 0;
		}
	});
}

function get_not_const() {
	$.ajax({
		type: "GET",
		url: "/get_not_const",
		dataType: "json",
		success: function (response) {
			if (JSON.stringify(not_const_sheet) != JSON.stringify(response['data'])) {
				not_const_sheet = response['data'];
			}
			console.log(not_const_sheet);
		},
		error: function() {
			let elem = new Message({
				text: 'Server error',
				type: 'dang'
			}, false);
			elem.delay = 1500;
			elem.add();
			return 0;
		}
	});
}

function get_birthadys() {
	$.ajax({
		type: "GET",
		url: "/get_bd_today",
		dataType: "json",
		success: function (response) {
			if (response['data'].length != 0) {
				$('#birthdats_div').css('display', '');
				$('#birthdats_div').empty();
				$('#birthdats_div').append('<div h>Дни рождения:</div h>');
				for (let person of response['data']) {
					if (person['photo'] == '-') $('#birthdats_div').append('<div class="Person"><div class="NameDesc"><div name>' + person['name'] + '</div><div persondesctiption>' + person['description'] + '</div></div><img src="static/Изображения/безфото.jpg"></img></div>'); 
					else $('#birthdats_div').append('<div class="Person"><div class="NameDesc"><div name>' + person['name'] + '</div><div persondesctiption>' + person['description'] + '</div></div><img src="static/Изображения/'+ person['photo'] + '"></img></div>');
				}
			}
			else {
				$('#birthdats_div').css('display', 'none');
			}
		},
		error: function() {
			let elem = new Message({
				text: 'Server error',
				type: 'dang'
			}, false);
			elem.delay = 1500;
			elem.add();
			return 0;
		}
	});
}

function next_day() {
	day_of_week += 1;
	if (day_of_week > 6) day_of_week = 0;
	indicate_day();
	make_tables();
}

function previous_day() {
	day_of_week -= 1;
	if (day_of_week < 0) day_of_week = 6;
	indicate_day();
	make_tables();
}

function indicate_day() {
	$('div[day]').removeAttr('active');
	$('div[day="' + day_of_week + '"]').attr('active', '');
}

function make_tables() {

	$('.Tables').empty();

	if (Object.keys(const_sheet[day_of_week]).length == 0) {
		$('.Tables').append('<br><br><br><br><div class="NoLessons">В этот день нет уроков</div>');
		return 0;
	}

	for (class_num of Object.keys(const_sheet[day_of_week])) {
		let classes = Object.keys(const_sheet[day_of_week][class_num]);
		let lessons_num = const_sheet[day_of_week][class_num][classes[0]].length;
		let lesson_counter = 1;

		$('.Tables').append('<div mediumbr></div>');
		$('.Tables').append('<div class_num>' + class_num + ' классы</div>');
		$('.Tables').append('<div smallbr></div>');
		$('.Tables').append('<table id="new_table"></table>');
		let table = $('#new_table');
		table.attr('id', '');
		table.append('<tr id="label_tr"></tr>');
		let ltr = $('#label_tr');
		ltr.attr('id', '');
		ltr.append('<td>#!++</td>');
		for (i of classes) {
			ltr.append('<td class classtitle>' + i + '</td>');
			ltr.append('<td room roomtitle>' + 'Каб' + '</td>');
		}

		for (let i = 0; i < lessons_num; i++) {
			table.append('<tr id="new_tr"></tr>');
			let tr = $('#new_tr');
			tr.attr('id', '');
			if (const_sheet[day_of_week][class_num][classes[0]][i][0] != 'ClassHour') {
				tr.append('<td num>' + lesson_counter + ' урок</td>');
				lesson_counter += 1;
			}
			else {
				tr.append('<td>#!++</td>');
			}

			for (let this_class = 0; this_class < classes.length; this_class++) {
				if (const_sheet[day_of_week][class_num][classes[0]][i][0] != 'ClassHour') {
					if (not_const_sheet[day_of_week][class_num][classes[0]][i][0] == undefined) {
						tr.append('<td lessons>' + const_sheet[day_of_week][class_num][classes[this_class]][i][0] +'</td>');
					}
					else if (const_sheet[day_of_week][class_num][classes[this_class]][i][0] == not_const_sheet[day_of_week][class_num][classes[this_class]][i][0]) {
						tr.append('<td lessons>' + const_sheet[day_of_week][class_num][classes[this_class]][i][0] +'</td>');
					}
					else {
						tr.append('<td lessons><span not_const_tt>' + not_const_sheet[day_of_week][class_num][classes[this_class]][i][0] +'</span></td>');
					}
				}
				else tr.append('<td lessons>Классный час</td>');
				if (not_const_sheet[day_of_week][class_num][classes[this_class]][i][1] == undefined) {
					tr.append('<td room>' + const_sheet[day_of_week][class_num][classes[this_class]][i][1] +'</td>');
				}
				else if (not_const_sheet[day_of_week][class_num][classes[this_class]][i][1] == const_sheet[day_of_week][class_num][classes[this_class]][i][1]) {
					tr.append('<td room>' + const_sheet[day_of_week][class_num][classes[this_class]][i][1] +'</td>');
				}
				else {
					tr.append('<td room><span not_const_tt>' + not_const_sheet[day_of_week][class_num][classes[this_class]][i][1] +'</span></td>');
				}
			}
		}
	}

	if (Object.keys(const_sheet[day_of_week]).length < 3) {
		$('table').css('font-size', '1.3em');
		$('div[smallbr]').css('height', '1.2em');
		$('div[mediumbr]').css('height', '2em');
	}
	else {
		$('div[smallbr]').css('height', '0');
		$('div[mediumbr]').css('height', '0');
		$('table').css('font-size', '1em');
	}
}