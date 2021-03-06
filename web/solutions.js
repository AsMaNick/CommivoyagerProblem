﻿function find_random_path() {
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
		block.add(new Operation('node_rad', '', big_rad_vert(), rad_vert, par));
	}
	block.add(new Operation('node_rad', 'Euler travelling: enter vertex {0}'.format(v), rad_vert, big_rad_vert(), v));
	if (path.length > 0 && par != path[path.length - 1]) {
		block.add(new Operation('edge_col', 'Euler travelling: delete edge {0} {1}'.format(par, v), 'grey', 'red', par, v));
		block.add(new Operation('edge_width', '', 1, 2, par, v));
	}
	animation.add(block);
	if (path.length > 0 && par != path[path.length - 1]) {
		block = new Block();
		block.add(new Operation('edge_del', '', 'red', 'null', par, v));
		block.add(new Operation('edge', 'Euler travelling: add edge {0} {1}'.format(path[path.length - 1], v), 'null', 'grey', path[path.length - 1], v));
		animation.add(block);
	}
	path.push(v);
	for (var i = 0; i < g[v].length; ++i) {
		var to = g[v][i];
		dfs(to, g, path, v);
		block = new Block();
		block.add(new Operation('node_rad', '', big_rad_vert(), rad_vert, to));
		block.add(new Operation('node_rad', 'Euler travelling: enter vertex {0}'.format(v), rad_vert, big_rad_vert(), v));
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

function update(pos1, pos2, diff, vis) {
	if (vis) {
		var block = new Block();
		block.add(new Operation('edge_col', '{0}. Delete edge {1} {2}'.format(steps, path[pos1], path[(pos1 + 1) % n]), 'grey', 'red', path[pos1], path[(pos1 + 1) % n]));
		block.add(new Operation('edge_col', '{0}. Delete edge {1} {2}'.format(steps, path[pos2], path[(pos2 + 1) % n]), 'grey', 'red', path[pos2], path[(pos2 + 1) % n]));
		block.add(new Operation('edge_width', '', 1, 2, path[pos1], path[(pos1 + 1) % n]));
		block.add(new Operation('edge_width', '', 1, 2, path[pos2], path[(pos2 + 1) % n]));
		animation.add(block);
		block = new Block();
		block.add(new Operation('edge', '{0}. Add edge {1} {2}'.format(steps, path[pos1], path[pos2]), 'grey', 'green', path[pos1], path[pos2]));
		block.add(new Operation('edge', '{0}. Add edge {1} {2}'.format(steps, path[(pos1 + 1) % n], path[(pos2 + 1) % n]), 'grey', 'green', path[(pos1 + 1) % n], path[(pos2 + 1) % n]));
		block.add(new Operation('edge_width', '', 1, 2, path[pos1], path[pos2]));
		block.add(new Operation('edge_width', '', 1, 2, path[(pos1 + 1) % n], path[(pos2 + 1) % n]));
		animation.add(block);
		block = new Block();
		cur_len -= diff;
		block.add(new Operation('edge_del', '{0}. Get improvement on {1}. New route length is eqaul to the {2}'.format(steps, rounded(diff), rounded(cur_len)), 'red', 'null', path[pos1], path[(pos1 + 1) % n]));
		block.add(new Operation('edge_del', '', 'red', 'null', path[pos2], path[(pos2 + 1) % n]));
		block.add(new Operation('edge_col', '', 'green', 'grey', path[pos1], path[pos2]));
		block.add(new Operation('edge_col', '', 'green', 'grey', path[(pos1 + 1) % n], path[(pos2 + 1) % n]));
		block.add(new Operation('edge_width', '', 2, 1, path[pos1], path[pos2]));
		block.add(new Operation('edge_width', '', 2, 1, path[(pos1 + 1) % n], path[(pos2 + 1) % n]));
		animation.add(block);
	}
	
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

function improve(rec_call) {
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
			++steps;
            update(pos1, pos2, diff, true);
        }
    }
	if (rec_call) {
		recalculate_all();
		if (allt.length > 0) {
			improve(rec_call);
		}
	}
}

function get_diff3(pos1, pos2, pos3) {
    var cur_dist = dist(points[path[pos1]], points[path[(pos1 + 1) % n]]) + 
				   dist(points[path[pos2]], points[path[(pos2 + 1) % n]]) +
				   dist(points[path[pos3]], points[path[(pos3 + 1) % n]]);
    var upd_dist = dist(points[path[pos1]], points[path[pos2]]) +
				   dist(points[path[(pos1 + 1) % n]], points[path[pos3 % n]]) +
				   dist(points[path[(pos2 + 1) % n]], points[path[(pos3 + 1) % n]]);
    return cur_dist - upd_dist;
}

function recalculate_all3() {
    for (var pos1 = 0; pos1 < n; ++pos1) {
        pos[path[pos1]] = pos1;
        dir[path[pos1]] = 1;
    }
    for (var pos1 = 0; pos1 < n && allt.length < n * n; ++pos1) {
        for (var pos2 = pos1 + 2; pos2 < n; ++pos2) {
            for (var pos3 = pos2 + 2; pos3 < n; ++pos3) {
                var diff = get_diff3(pos1, pos2, pos3);
                if (diff > 0) {
                    allt.push([diff, path[pos1], path[pos2], path[pos3]]);
                }
            }
        }
    }
    allt.sort(function(a, b) { return a[0] - b[0] } );
}

function animate3(pos1, pos2, pos3, diff) {
	var block = new Block();
	block.add(new Operation('edge_col', '{0}. Delete edge {1} {2}'.format(steps, path[pos1], path[(pos1 + 1) % n]), 'grey', 'red', path[pos1], path[(pos1 + 1) % n]));
	block.add(new Operation('edge_col', '{0}. Delete edge {1} {2}'.format(steps, path[pos2], path[(pos2 + 1) % n]), 'grey', 'red', path[pos2], path[(pos2 + 1) % n]));
	block.add(new Operation('edge_col', '{0}. Delete edge {1} {2}'.format(steps, path[pos3], path[(pos3 + 1) % n]), 'grey', 'red', path[pos3], path[(pos3 + 1) % n]));
	block.add(new Operation('edge_width', '', 1, 2, path[pos1], path[(pos1 + 1) % n]));
	block.add(new Operation('edge_width', '', 1, 2, path[pos2], path[(pos2 + 1) % n]));
	block.add(new Operation('edge_width', '', 1, 2, path[pos3], path[(pos3 + 1) % n]));
	animation.add(block);
	cur_len -= diff;
	block = new Block();
	block.add(new Operation('edge', '{0}. Add edge {1} {2}'.format(steps, path[pos1], path[pos2]), 'grey', 'green', path[pos1], path[pos2]));
	block.add(new Operation('edge', '{0}. Add edge {1} {2}'.format(steps, path[(pos1 + 1) % n], path[(pos3) % n]), 'grey', 'green', path[(pos1 + 1) % n], path[(pos3) % n]));
	block.add(new Operation('edge', '{0}. Add edge {1} {2}'.format(steps, path[(pos2 + 1) % n], path[(pos3 + 1) % n]), 'grey', 'green', path[(pos2 + 1) % n], path[(pos3 + 1) % n]));
	block.add(new Operation('edge_width', '', 1, 2, path[pos1], path[pos2]));
	block.add(new Operation('edge_width', '', 1, 2, path[(pos1 + 1) % n], path[(pos3) % n]));
	block.add(new Operation('edge_width', '', 1, 2, path[(pos2 + 1) % n], path[(pos3 + 1) % n]));
	animation.add(block);
	block = new Block();
	block.add(new Operation('edge_del', '{0}. Get improvement on {1}. New route length is eqaul to the {2}'.format(steps, rounded(diff), rounded(cur_len)), 'red', 'null', path[pos1], path[(pos1 + 1) % n]));
	block.add(new Operation('edge_del', '', 'red', 'null', path[pos2], path[(pos2 + 1) % n]));
	block.add(new Operation('edge_del', '', 'red', 'null', path[pos3], path[(pos3 + 1) % n]));
	block.add(new Operation('edge_col', '', 'green', 'grey', path[pos1], path[pos2]));
	block.add(new Operation('edge_col', '', 'green', 'grey', path[(pos1 + 1) % n], path[(pos3) % n]));
	block.add(new Operation('edge_col', '', 'green', 'grey', path[(pos2 + 1) % n], path[(pos3 + 1) % n]));
	block.add(new Operation('edge_width', '', 2, 1, path[pos1], path[pos2]));
	block.add(new Operation('edge_width', '', 2, 1, path[(pos1 + 1) % n], path[(pos3) % n]));
	block.add(new Operation('edge_width', '', 2, 1, path[(pos2 + 1) % n], path[(pos3 + 1) % n]));
	animation.add(block);
}

function improve3() {
    while (allt.length > 0) {
        var u = allt[allt.length - 1][1];
        var v = allt[allt.length - 1][2];
        var z = allt[allt.length - 1][3];
        var pos1 = get_pos(u);
        var pos2 = get_pos(v);
        var pos3 = get_pos(z);
		if (pos2 > pos3) {
			var tmp = pos2;
			pos2 = pos3;
			pos3 = tmp;
        }
        if (pos1 > pos2) {
			var tmp = pos1;
			pos1 = pos2;
			pos2 = tmp;
        }
		if (pos2 > pos3) {
			var tmp = pos2;
			pos2 = pos3;
			pos3 = tmp;
        }
        allt.pop();
        if (pos1 + 1 >= pos2 || pos2 + 1 >= pos3) {
            continue;
        }
        var diff = get_diff3(pos1, pos2, pos3);
        if (diff > 0) {
			++steps;
			animate3(pos1, pos2, pos3, diff);
            update(pos1, pos2, diff, false);
            update(pos2, pos3, diff, false);
        }
    }
    recalculate_all3();
    if (allt.length > 0) {
        improve3();
		return true;
    } else {
		return false;
	}
}