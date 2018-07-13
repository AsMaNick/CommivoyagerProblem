function split_on_words(s) {
	var all_text = "";
	var res = [];
	var last = "";
	for (var i = 0; i < s.length; ++i) {
		var c = s[i];
		if (('a' <= c && c <= 'z') || ('A' <= c && c <= 'z') || ('0' <= c && c <= '9') || '.,+-'.indexOf(c) != -1) {
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
	var MAX_N = 100;
	var MAX_X = 1000;
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
	if (!check_interval(2, MAX_N, n)) {
		return [interval_error(2, MAX_N, 'n'), 0];
	}
	var all_parents = new Array(n + 1);
	for (var i = 2; i <= n; ++i) {
		tmp = read(data);
		if (!tmp[0]) {
			return ["Не хватает параметра 'parent'", 0];
		}
		if (!is_int_txt(tmp[1])) {
			return ["Параметр 'parent' должен быть целым", 0];
		}
		var par = parseInt(tmp[1]);
		if (!check_interval(1, i - 1, par)) {
			return [interval_error(1, i - 1, 'parent'), 0];
		}
		all_parents[i] = par;
		tmp = read(data);
		if (!tmp[0]) {
			return ["Не хватает параметра 'weight'", 0];
		}
		if (!is_int_txt(tmp[1])) {
			return ["Параметр 'weight' должен быть целым", 0];
		}
		var weight = parseInt(tmp[1]);
		if (!check_interval(1, MAX_DIST, weight)) {
			return [interval_error(1, MAX_DIST, 'weight'), 0];
		}
		graph.push([par - 1, i - 1, weight]);
	}
	tmp = read(data);
	if (!tmp[0]) {
		return ["Не хватает параметра 'q'", 0];
	}
	if (!is_int_txt(tmp[1])) {
		return ["Параметр 'q' должен быть целым", 0];
	}
	var q = parseInt(tmp[1]);
	if (!check_interval(1, MAX_Q, q)) {
		return [interval_error(1, MAX_Q, 'q'), 0];
	}
	for (var i = 0; i < q; ++i) {
		tmp = read(data);
		if (!tmp[0]) {
			return ["Не хватает параметра 'tp'", 0];
		}
		var tp = tmp[1];
		if (tp != 'update' && tp != 'getmax') {
			return ["Параметр 'tp' должен быть либо 'update', либо 'getmax'", 0];
		}
		var u, v, weight = 0;
		tmp = read(data);
		if (!tmp[0]) {
			return ["Не хватает параметра 'u'", 0];
		}
		if (!is_int_txt(tmp[1])) {
			return ["Параметр 'u' должен быть целым", 0];
		}
		u = parseInt(tmp[1]);
		if (!check_interval(1, n, u)) {
			return [interval_error(1, n, 'u'), 0];
		}
		tmp = read(data);
		if (!tmp[0]) {
			return ["Не хватает параметра 'v'", 0];
		}
		if (!is_int_txt(tmp[1])) {
			return ["Параметр 'v' должен быть целым", 0];
		}
		v = parseInt(tmp[1]);
		if (!check_interval(1, n, v)) {
			return [interval_error(1, n, 'v'), 0];
		}
		
		if (tp == "update") {
			tmp = read(data);
			if (!tmp[0]) {
				return ["Не хватает параметра 'weight'", 0];
			}
			if (!is_int_txt(tmp[1])) {
				return ["Параметр 'weight' должен быть целым", 0];
			}
			weight = parseInt(tmp[1]);
			if (!check_interval(1, MAX_DIST, weight)) {
				return [interval_error(1, MAX_DIST, 'weight'), 0];
			}
		}
		
		if (tp == "update") {
			if (u >= v) {
				return ["Параметр 'u' должен быть меньше 'v'", 0];
			}
			if (all_parents[v] != u) {
				return ["Указанного ребра ({0}, {1}) нет в дереве".format(u, v), 0];
			}
		} else {
			if (u == v) {
				return ["Параметр 'u' должен быть не равен 'v'", 0];
			}
		}
		querries.push([tp, u - 1, v - 1, weight]);
	}
	return ["", [graph, querries]];
}

function go_to_the_top() {
	$("html, body").animate({ scrollTop: 0 }, 500);
	return;
}