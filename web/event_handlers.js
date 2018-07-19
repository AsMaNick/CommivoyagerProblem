function build_n_random_cities_onclick() {
	clear_errors();
	if (mode == 'visualization') {
		write_error(1, 'Wait until the end of the visualization');
		return;
	}
	if (mode == 'add_city') {
		write_error(1, 'Finish building cities');
		return;
	}
	var n = get_int_field('n_cities');
	if (isNaN(n) || n < 3 || n > MAX_POINTS) {
		write_error(1, 'Enter number of citis from 3 to {0}'.format(MAX_POINTS))
		return;
	}
	write_log('The map consisting of {0} cities has been generated'.format(n));
	points = new Array(n);
	for (var i = 0; i < n; ++i) {
		points[i] = new Point(rand_int(1, MAX_X), rand_int(1, MAX_Y));
	}
	redraw_points();
}

function load_sample_onclick() {
	clear_errors();
	if (mode == 'visualization') {
		write_error(2, 'Wait until the end of the visualization');
		return;
	}
	if (mode == 'add_city') {
		write_error(2, 'Finish building cities');
		return;
	}
	var sample = get_field('select_sample');
	load_sample(sample);
}

function enable_adding_city_onclick() {
	clear_errors();
	if (mode == 'visualization') {
		write_error(3, 'Wait until the end of the visualization');
		return;
	}
	var elem = document.getElementsByName('add_city_button')[0];
	if (mode == 'ordinary') {
		mode = 'add_city';
		elem.innerHTML = 'Ready';
	} else {
		mode = 'ordinary';
		elem.innerHTML = 'Add city manually';
	}
}

function map_onclick(x, y) {
	if (mode == 'add_city' && points.length < MAX_POINTS) {
		x -= document.getElementsByName("svg")[0].getBoundingClientRect().left;
		y -= document.getElementsByName("svg")[0].getBoundingClientRect().top;
		x /= get_scale();
		y /= get_scale();
		points.push(new Point(x, y));
		redraw_points();
	}
}

function clear_cities_onclick() {
	clear_errors();
	if (mode == 'visualization') {
		write_error(4, 'Wait until the end of the visualization');
		return;
	}
	if (mode == 'add_city') {
		write_error(4, 'Finish building cities');
		return;
	}
	points = [];
	redraw_points();
}

function random_path_onclick() {
	clear_errors();
	if (mode == 'visualization') {
		write_error(5, 'Wait until the end of the visualization');
		return;
	}
	if (mode == 'add_city') {
		write_error(5, 'Finish building cities');
		return;
	}
	if (points.length < 3) {
		write_error(5, 'Add at least 3 cities');
		return;
	}
	redraw_points();
	find_random_path();
	animation = new Animation();
	for (var i = 0; i < path.length; ++i) {
		var block = new Block();
		var u = path[i];
		var v = path[(i + 1) % path.length];
		block.add(new Operation('edge', 'Added edge {0} {1}'.format(u, v), 'null', 'grey', u, v));
		animation.add(block);
	}
	animation.start();
}

function closest_neighbor_onclick() {
	clear_errors();
	if (mode == 'visualization') {
		write_error(6, 'Wait until the end of the visualization');
		return;
	}
	if (mode == 'add_city') {
		write_error(6, 'Finish building cities');
		return;
	}
	if (points.length < 3) {
		write_error(6, 'Add at least 3 cities');
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
		block.add(new Operation('edge', 'Added edge {0} {1}'.format(u, v), 'null', 'grey', u, v));
		animation.add(block);
	}
	animation.start();
}

function minimum_spaning_tree_onclick() {
	clear_errors();
	if (mode == 'visualization') {
		write_error(7, 'Wait until the end of the visualization');
		return;
	}
	if (mode == 'add_city') {
		write_error(7, 'Finish building cities');
		return;
	}
	if (points.length < 3) {
		write_error(7, 'Add at least 3 cities');
		return;
	}
	redraw_points();
	var root = 0;
	var edges = find_minimum_spaning_tree(0);
	animation = new Animation();
	for (var i = 0; i < edges.length; ++i) {
		var block = new Block();
		block.add(new Operation('edge', 'Building minimum spanning tree: added edge {0} {1}'.format(edges[i][0], edges[i][1]), 'null', 'grey', edges[i][0], edges[i][1]));
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
	block.add(new Operation('edge', 'Added edge between last and first vertex on the path', 'null', 'grey', path[path.length - 1], path[0]));
	animation.add(block);
	animation.start();
}

function opt_2_onclick() {
	clear_errors();
	if (mode == 'visualization') {
		write_error(8, 'Wait until the end of the visualization');
		return;
	}
	if (mode == 'add_city') {
		write_error(8, 'Finish building cities');
		return;
	}
    if (path.length != points.length) {
		write_error(8, 'Please, build path');
		return;
	}
	if (points.length < 3) {
		write_error(8, 'Add at least 3 cities');
		return;
	}
	steps = 0;
	n = points.length;
	pos = new Array(n.length);
	dir = new Array(n.length);
	allt = [];
	animation = new Animation();
	cur_len = evaluate(path);
	improve(true);
	animation.start();
}

function opt_3_onclick() {
	clear_errors();
	if (mode == 'visualization') {
		write_error(8, 'Wait until the end of the visualization');
		return;
	}
	if (mode == 'add_city') {
		write_error(8, 'Finish building cities');
		return;
	}
    if (path.length != points.length) {
		write_error(8, 'Please, build path');
		return;
	}
	if (points.length < 3) {
		write_error(8, 'Add at least 3 cities');
		return;
	}
	steps = 0;
	n = points.length;
	pos = new Array(n.length);
	dir = new Array(n.length);
	allt = [];
	animation = new Animation();
	cur_len = evaluate(path);
	while (true) {
		var ok = improve3();
		recalculate_all();
		if (allt.length > 0) {
			improve(false);
		} else if (!ok) {
			break;
		}
	}
	animation.start();
}

function undo_onclick() {
	clear_errors();
	if (mode != 'visualization') {
		write_error(9, 'Visualization is not started');
		return;
	}
	if (visualization_type == 'auto') {
		write_error(9, 'Auto visualization mode');
		return;
	}
	if (animation.block_id == 0) {
		write_error(9, 'You are at the first step');
		return;
	}
	animation.apply_back();
}

function redo_onclick() {
	clear_errors();
	if (mode != 'visualization') {
		write_error(9, 'Visualization is not started');
		return;
	}
	if (visualization_type == 'auto') {
		write_error(9, 'Auto visualization mode');
		return;
	}
	show_block();
}

function build_test() {
	clear_errors();
	var elem = document.getElementsByName('test_area')[0];
	var try_test = parse_test(elem.value);
	if (try_test[0] != '') {
		write_error(10, try_test[0]);
		return;
	}
	points = try_test[1];
	redraw_points();
	go_to_the_top();
}

function end_visualization() {
	clear_errors();
	if (mode != 'visualization') {
		write_error(9, 'Visualization is not started');
		return;
	}
	var need_call = (visualization_type == 'manual');
	visualization_type = 'end';
	if (need_call) {
		animation.show_block();
	}
}

var scales = [0.25, 0.35, 0.5, 0.75, 0.9, 1, 1.2, 1.5, 2, 2.8, 4];
var cur_scale = scales.indexOf(1);

function get_scale() {
	return scales[cur_scale];
}

function rescale() {
	var scale = get_scale();
	var elem = document.getElementsByName('svg')[0];
	//elem.setAttribute("transform", "translate({0}, {1}), scale({2})".format(SVG_WIDTH * 1 / scale, SVG_HEIGHT * 1 / scale, scale));
	elem.setAttribute("transform", "translate({0}, {1}), scale({2})".format(SVG_WIDTH * (scale / 2 - 0.5), SVG_HEIGHT * (scale / 2 - 0.5), scale));
}

function scale_up() {
	if (cur_scale + 1 < scales.length) {
		++cur_scale;
		rescale();
	}
}

function scale_down() {
	if (cur_scale - 1 >= 0) {
		--cur_scale;
		rescale();
	}
}