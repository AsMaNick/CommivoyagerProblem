﻿function build_n_random_cities_onclick() {
	clear_errors();
	var n = get_int_field('n_cities');
	if (isNaN(n) || n < 1 || n > 100) {
		write_error(1, 'Enter number of cities from 1 to 100')
		return;
	}
	write_log('Сгенерирована карта из {0} городов'.format(n));
	points = new Array(n);
	for (var i = 0; i < n; ++i) {
		points[i] = new Point(rand_int(1, MAX_X), rand_int(1, MAX_Y));
	}
	redraw_points();
}

function enable_adding_city() {
	clear_errors();
	var elem = document.getElementsByName('add_city_button')[0];
	if (!add_city_mode) {
		add_city_mode = true;
		elem.innerHTML = 'Готово';
	} else {
		add_city_mode = false;
		elem.innerHTML = 'Добавить город вручную';
	}
}

function map_onclick(x, y) {
	if (add_city_mode) {
		points.push(new Point(x - document.getElementsByName("svg")[0].getBoundingClientRect().left, y - document.getElementsByName("svg")[0].getBoundingClientRect().top));
		redraw_points();
	}
}

function clear_cities() {
	clear_errors();
	points = [];
	redraw_points();
}

function load_sample_onclick() {
	clear_errors();
	var sample = get_field('select_sample');
	load_sample(sample);
}

function closest_neighbor_onclick() {
	clear_errors();
	redraw_points();
	find_path_closest_neighbor();
	animation = new Animation();
	for (var i = 0; i < path.length; ++i) {
		var block = new Block();
		var u = path[i];
		var v = path[(i + 1) % path.length];
		block.add(new Operation('edge', 'Добавлено ребро {0} {1}'.format(u, v), 'grey', u, v));
		animation.add(block);
	}
	animation.start();
}

function random_path_onclick() {
	clear_errors();
	redraw_points();
	find_random_path();
	animation = new Animation();
	for (var i = 0; i < path.length; ++i) {
		var block = new Block();
		var u = path[i];
		var v = path[(i + 1) % path.length];
		block.add(new Operation('edge', 'Добавлено ребро {0} {1}'.format(u, v), 'grey', u, v));
		animation.add(block);
	}
	animation.start();
}

function minimum_spaning_tree_onclick() {
	clear_errors();
	redraw_points();
	var root = 0;
	var edges = find_minimum_spaning_tree(0);
	animation = new Animation();
	for (var i = 0; i < edges.length; ++i) {
		var block = new Block();
		block.add(new Operation('edge', 'Построение минимального остовного дерево: добавлено ребро {0} {1}'.format(edges[i][0], edges[i][1]), 'grey', edges[i][0], edges[i][1]));
		animation.add(block);
	}
	var g = new Array(points.length);
	for (var i = 0; i < points.length; ++i) {
		g[i] = [];
	}
	for (var i = 0; i < edges.length; ++i) {
		g[edges[i][0]].push(edges[i][1]);
	}
	path = [];
	dfs(root, g, path, -1);
	var block = new Block();
	block.add(new Operation('node_rad', '', rad_vert, root));
	block.add(new Operation('edge', 'Добавляем ребро между последней и первой вершиной пути', 'grey', path[path.length - 1], path[0]));
	animation.add(block);
	animation.start();
}

function opt_2_onclick() {
	clear_errors();
    if (path.length != points.length) {
		write_error(7, 'Для начала необходимо построить путь');
		return;
	}
	steps = 0;
	n = points.length;
	pos = new Array(n.length);
	dir = new Array(n.length);
	allt = [];
	animation = new Animation();
	cur_len = evaluate(path);
	improve();
	animation.start();
}