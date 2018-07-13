function find_random_path() {
	var n = points.length;
	path = new Array(n);
	for (var i = 0; i < n; ++i) {
		path[i] = i;
	}
	for (var i = 0; i < n; ++i) {
		var ind = rand_int(n);
		var tmp = path[i];
		path[i] = path[ind];
		path[ind] = tmp;
	}
}

function find_path_closest_neighbor() {
	var n = points.length;
	var used = new Array(n);
	path = new Array(n);
	for (var i = 0; i < n; ++i) {
		used[i] = 0;
	}
	used[0] = 1;
	path[0] = 0;
	for (var i = 1; i < n; ++i) {
		var cur = path[i - 1];
		var to = -1;
		for (var j = 0; j < n; ++j) {
			if (used[j] == 0 && (to == -1 || dist(points[cur], points[j]) < dist(points[cur], points[to]))) {
				to = j;
			}
		}
		path[i] = to;
		used[to] = 1;
	}
}

function find_minimum_spaning_tree(root) {
	var n = points.length;
	var used = new Array(n);
	var edges = [];
	var min_dists = new Array(n);
	var pid = new Array(n);
	for (var i = 0; i < n; ++i) {
		used[i] = 0;
		min_dists[i] = dist(points[root], points[i]);
		pid[i] = root;
	}
	used[root] = 1;
	for (var i = 1; i < n; ++i) {
		var to = -1;
		for (var j = 0; j < n; ++j) {
			if (used[j] == 0 && (to == -1 || min_dists[j] < min_dists[to])) {
				to = j;
			}
		}
		edges.push([pid[to], to]);
		used[to] = 1;
		for (var j = 0; j < n; ++j) {
			if (used[j] == 0 && dist(points[to], points[j]) < min_dists[j]) {
				min_dists[j] = dist(points[to], points[j]);
				pid[j] = to;
			}
		}
	}
	return edges;
}

function dfs(v, g, path, par) {
	var block = new Block();
	if (par != -1) {
		block.add(new Operation('node_rad', '', rad_vert, par));
	}
	block.add(new Operation('node_rad', 'Эйлеров обход: зашли в вершину {0}'.format(v), 5, v));
	if (path.length > 0 && par != path[path.length - 1]) {
		block.add(new Operation('edge_col', 'Эйлеров обход: удаляем ребро {0} {1}'.format(par, v), 'red', par, v));
	}
	animation.add(block);
	if (path.length > 0 && par != path[path.length - 1]) {
		block = new Block();
		block.add(new Operation('edge_del', '', 'grey', par, v));
		block.add(new Operation('edge', 'Эйлеров обход: добавляем ребро {0} {1}'.format(path[path.length - 1], v), 'grey', path[path.length - 1], v));
		animation.add(block);
	}
	path.push(v);
	for (var i = 0; i < g[v].length; ++i) {
		var to = g[v][i];
		dfs(to, g, path, v);
		block = new Block();
		block.add(new Operation('node_rad', ''.format(v), rad_vert, to));
		block.add(new Operation('node_rad', 'Эйлеров обход: зашли в вершину {0}'.format(v), 5, v));
		animation.add(block);
	}
}

function evaluate(path) {
	var res = 0;
	for (var i = 0; i < path.length; ++i) {
		res += dist(points[path[i]], points[path[(i + 1) % path.length]]);
	}
	return res;
}

var pos = [];
var dir = [];
var allt = [];
var n;
var cur_len;

function get_pos(v) {
    var res = pos[v];
    if (dir[v] == -1) {
        res += (n - 1);
        res %= n;
    }
    return res;
}

function rounded(number){
    return +number.toFixed(2);
}

function update(pos1, pos2, diff) {
	var block = new Block();
	block.add(new Operation('edge_col', '{0}. Удаляем ребро {1} {2}'.format(steps, path[pos1], path[(pos1 + 1) % n]), 'red', path[pos1], path[(pos1 + 1) % n]));
	block.add(new Operation('edge_col', '{0}. Удаляем ребро {1} {2}'.format(steps, path[pos2], path[(pos2 + 1) % n]), 'red', path[pos2], path[(pos2 + 1) % n]));
	block.add(new Operation('edge_width', '', 2, path[pos1], path[(pos1 + 1) % n]));
	block.add(new Operation('edge_width', '', 2, path[pos2], path[(pos2 + 1) % n]));
	animation.add(block);
	block = new Block();
	block.add(new Operation('edge', '{0}. Добавляем ребро {1} {2}'.format(steps, path[pos1], path[pos2]), 'green', path[pos1], path[pos2]));
	block.add(new Operation('edge', '{0}. Добавляем ребро {1} {2}'.format(steps, path[(pos1 + 1) % n], path[(pos2 + 1) % n]), 'green', path[(pos1 + 1) % n], path[(pos2 + 1) % n]));
	block.add(new Operation('edge_width', '', 2, path[pos1], path[pos2]));
	block.add(new Operation('edge_width', '', 2, path[(pos1 + 1) % n], path[(pos2 + 1) % n]));
	animation.add(block);
	block = new Block();
	cur_len -= diff;
	block.add(new Operation('edge_del', '{0}. Получили улучшение на {1}. Новая длина маршрута равна {2}'.format(steps, rounded(diff), rounded(cur_len)), 'red', path[pos1], path[(pos1 + 1) % n]));
	block.add(new Operation('edge_del', '', 'red', path[pos2], path[(pos2 + 1) % n]));
	block.add(new Operation('edge_col', '', 'grey', path[pos1], path[pos2]));
	block.add(new Operation('edge_col', '', 'grey', path[(pos1 + 1) % n], path[(pos2 + 1) % n]));
	block.add(new Operation('edge_width', '', 1, path[pos1], path[pos2]));
	block.add(new Operation('edge_width', '', 1, path[(pos1 + 1) % n], path[(pos2 + 1) % n]));
	animation.add(block);
	
	++steps;
    ++pos1;
    for (var i = pos1; i < pos2 - i + pos1; ++i) {
		var tmp = pos[path[i]];
		pos[path[i]] = pos[path[pos2 - i + pos1]];
		pos[path[pos2 - i + pos1]] = tmp;
		
        dir[path[i]] *= -1;
        dir[path[pos2 - i + pos1]] *= -1;
		
        tmp = path[i];
		path[i] = path[pos2 - i + pos1];
		path[pos2 - i + pos1] = tmp;
    }
}

function get_diff(pos1, pos2) {
    var cur_dist = dist(points[path[pos1]], points[path[(pos1 + 1) % n]]) + dist(points[path[pos2]], points[path[(pos2 + 1) % n]]);
    var upd_dist = dist(points[path[pos1]], points[path[pos2]]) + dist(points[path[(pos1 + 1) % n]], points[path[(pos2 + 1) % n]]);
    return cur_dist - upd_dist;
}

function recalculate_all() {
    for (var pos1 = 0; pos1 < n; ++pos1) {
        pos[path[pos1]] = pos1;
        dir[path[pos1]] = 1;
    }
    for (var pos1 = 0; pos1 < n; ++pos1) {
        for (var pos2 = pos1 + 2; pos2 < n; ++pos2) {
            var diff = get_diff(pos1, pos2);
            if (diff > 0) {
                allt.push([diff, path[pos1], path[pos2]]);
            }
        }
    }
    allt.sort(function(a, b) { return a[0] - b[0] } );
}

function improve() {
    while (allt.length > 0) {
        var u = allt[allt.length - 1][1];
        var v = allt[allt.length - 1][2];
        var pos1 = get_pos(u);
        var pos2 = get_pos(v);
        if (pos1 > pos2) {
			var tmp = pos1;
			pos1 = pos2;
			pos2 = tmp;
        }
        allt.pop();
        if (pos1 + 1 >= pos2) {
            continue;
        }
        var diff = get_diff(pos1, pos2);
        if (diff > 0) {
            update(pos1, pos2, diff);
        }
    }
    recalculate_all();
    if (allt.length > 0) {
        improve();
    }
}