function build_n_random_cities_onclick() {
	clear_errors();
	if (mode == 'visualization') {
		write_error(1, 'Дождитесь окончания визуализации');
		return;
	}
	if (mode == 'add_city') {
		write_error(1, 'Закончите построение городов');
		return;
	}
	var n = get_int_field('n_cities');
	if (isNaN(n) || n < 1 || n > MAX_POINTS) {
		write_error(1, 'Введите кол-во городов от 1 до {0}'.format(MAX_POINTS))
		return;
	}
	write_log('Сгенерирована карта из {0} городов'.format(n));
	points = new Array(n);
	for (var i = 0; i < n; ++i) {
		points[i] = new Point(rand_int(1, MAX_X), rand_int(1, MAX_Y));
	}
	redraw_points();
}

function load_sample_onclick() {
	clear_errors();
	if (mode == 'visualization') {
		write_error(2, 'Дождитесь окончания визуализации');
		return;
	}
	if (mode == 'add_city') {
		write_error(2, 'Закончите построение городов');
		return;
	}
	var sample = get_field('select_sample');
	load_sample(sample);
}

function enable_adding_city_onclick() {
	clear_errors();
	if (mode == 'visualization') {
		write_error(3, 'Дождитесь окончания визуализации');
		return;
	}
	var elem = document.getElementsByName('add_city_button')[0];
	if (mode == 'ordinary') {
		mode = 'add_city';
		elem.innerHTML = 'Готово';
	} else {
		mode = 'ordinary';
		elem.innerHTML = 'Добавить город вручную';
	}
}

function map_onclick(x, y) {
	if (mode == 'add_city' && points.length < MAX_POINTS) {
		points.push(new Point(x - document.getElementsByName("svg")[0].getBoundingClientRect().left, y - document.getElementsByName("svg")[0].getBoundingClientRect().top));
		redraw_points();
	}
}

function clear_cities_onclick() {
	clear_errors();
	if (mode == 'visualization') {
		write_error(4, 'Дождитесь окончания визуализации');
		return;
	}
	if (mode == 'add_city') {
		write_error(4, 'Закончите построение городов');
		return;
	}	
	points = [];
	redraw_points();
}

function random_path_onclick() {
	clear_errors();
	if (mode == 'visualization') {
		write_error(5, 'Дождитесь окончания визуализации');
		return;
	}
	if (mode == 'add_city') {
		write_error(5, 'Закончите построение городов');
		return;
	}
	redraw_points();
	find_random_path();
	animation = new Animation();
	for (var i = 0; i < path.length; ++i) {
		var block = new Block();
		var u = path[i];
		var v = path[(i + 1) % path.length];
		block.add(new Operation('edge', 'Добавлено ребро {0} {1}'.format(u, v), 'null', 'grey', u, v));
		animation.add(block);
	}
	animation.start();
}

function closest_neighbor_onclick() {
	clear_errors();
	if (mode == 'visualization') {
		write_error(6, 'Дождитесь окончания визуализации');
		return;
	}
	if (mode == 'add_city') {
		write_error(6, 'Закончите построение городов');
		return;
	}
	enable_visualization_mode();
	redraw_points();
	find_path_closest_neighbor();
	animation = new Animation();
	for (var i = 0; i < path.length; ++i) {
		var block = new Block();
		var u = path[i];
		var v = path[(i + 1) % path.length];
		block.add(new Operation('edge', 'Добавлено ребро {0} {1}'.format(u, v), 'null', 'grey', u, v));
		animation.add(block);
	}
	animation.start();
}

function minimum_spaning_tree_onclick() {
	clear_errors();
	if (mode == 'visualization') {
		write_error(7, 'Дождитесь окончания визуализации');
		return;
	}
	if (mode == 'add_city') {
		write_error(7, 'Закончите построение городов');
		return;
	}
	redraw_points();
	var root = 0;
	var edges = find_minimum_spaning_tree(0);
	animation = new Animation();
	for (var i = 0; i < edges.length; ++i) {
		var block = new Block();
		block.add(new Operation('edge', 'Построение минимального остовного дерево: добавлено ребро {0} {1}'.format(edges[i][0], edges[i][1]), 'null', 'grey', edges[i][0], edges[i][1]));
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
	block.add(new Operation('node_rad', '', big_rad_vert, rad_vert, root));
	block.add(new Operation('edge', 'Добавляем ребро между последней и первой вершиной пути', 'null', 'grey', path[path.length - 1], path[0]));
	animation.add(block);
	animation.start();
}

function opt_2_onclick() {
	clear_errors();
	if (mode == 'visualization') {
		write_error(8, 'Дождитесь окончания визуализации');
		return;
	}
	if (mode == 'add_city') {
		write_error(8, 'Закончите построение городов');
		return;
	}
    if (path.length != points.length) {
		write_error(8, 'Для начала необходимо построить путь');
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

function undo_onclick() {
	clear_errors();
	if (mode != 'visualization') {
		write_error(9, 'Визуализация еще не начата');
		return;
	}
	if (visualization_type == 'auto') {
		write_error(9, 'Режим автоматической визуализации');
		return;
	}
	if (animation.block_id == 0) {
		write_error(9, 'Вы находитесь на первом шаге');
		return;
	}
	animation.apply_back();
}

function redo_onclick() {
	clear_errors();
	if (mode != 'visualization') {
		write_error(9, 'Визуализация еще не начата');
		return;
	}
	if (visualization_type == 'auto') {
		write_error(9, 'Режим автоматической визуализации');
		return;
	}
	show_block();
}