function split_on_words(s) {
	var all_text = "";
	var res = [];
	var last = "";
	for (var i = 0; i < s.length; ++i) {
		var c = s[i];
		//if (('a' <= c && c <= 'z') || ('A' <= c && c <= 'z') || ('0' <= c && c <= '9') || '.,+-'.indexOf(c) != -1) {
		if ('0' <= c && c <= '9') {
			last += c;
			all_text += c;
		} else {
			res.push(last);
			last = "";
			if (c == '\n') {
				all_text += c;
			} else {
				all_text += " ";
			}
		}
	}
	if (last != "") {
		res.push(last);
	}
	elem = document.getElementsByName('test_area')[0];
	elem.value = all_text;
	return [0, res];
}

function read(data) {
	if (data[0] < data[1].length) {
		var res = data[1][data[0]];
		data[0] += 1;
		return [true, res];
	}
	return [false, 0];
}

function check_interval(l, r, x) {
	return l <= x && x <= r;
}

function interval_error(l, r, param) {
	return "Параметр {0} должен быть в пределах от {1} до {2}".format(param, l, r);
}

function parse_test(s) {
	var data = split_on_words(s);
	var tmp;
	tmp = read(data);
	if (!tmp[0]) {
		return ["Не хватает параметра 'n'", 0];
	}
	if (!is_int_txt(tmp[1])) {
		return ["Параметр 'n' должен быть целым", 0];
	}
	var n = parseInt(tmp[1]);
	if (!check_interval(3, MAX_POINTS, n)) {
		return [interval_error(3, MAX_POINTS, 'n'), 0];
	}
	var points = [];
	for (var i = 1; i <= n; ++i) {
		tmp = read(data);
		if (!tmp[0]) {
			return ["Не хватает параметра 'x'", 0];
		}
		if (!is_int_txt(tmp[1])) {
			return ["Параметр 'x' должен быть целым", 0];
		}
		var x = parseInt(tmp[1]);
		if (!check_interval(1, MAX_X, x)) {
			return [interval_error(1, MAX_X, 'x'), 0];
		}
		tmp = read(data);
		if (!tmp[0]) {
			return ["Не хватает параметра 'y'", 0];
		}
		if (!is_int_txt(tmp[1])) {
			return ["Параметр 'y' должен быть целым", 0];
		}
		var y = parseInt(tmp[1]);
		if (!check_interval(1, MAX_Y, y)) {
			return [interval_error(1, MAX_Y, 'y'), 0];
		}
		points.push(new Point(x, y));
	}
	return ["", points];
}

function go_to_the_top() {
	$("html, body").animate({ scrollTop: 0 }, 500);
	return;
}