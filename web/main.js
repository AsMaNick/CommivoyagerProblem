var MAX_POINTS = 100;
var MAX_X = 750;
var MAX_Y = 370;
var TIME_INTERVAL = 1500;
var rad_vert = 2;
var big_rad_vert = 5;

function get_speed() {
	return TIME_INTERVAL * (1001 - get_int_field('speed')) / 1000;
}

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

function rand_int(mx) {
	return Math.floor(Math.random() * mx);
}

function rand_int(l, r) {
	if (r == null) {
		return Math.floor(Math.random() * l);
	}
	return l + rand_int(r - l + 1);
}

function is_int_txt(txt) {
	if (txt == "") {
		return false;
	}
	for (var i = 0; i < txt.length; ++i) {
		if ('0' <= txt[i] && txt[i] <= '9') {
			continue;
		}
		return false;
	}	
	return true;
}

function is_int(name) {
	var elem = document.getElementsByName(name)[0];
	var txt = elem.value;
	return is_int_txt(txt);
}

function get_field(name) {
	var elem = document.getElementsByName(name)[0];
	var txt = elem.value;
	return txt;
}
	
function get_int_field(name) {
	return parseInt(get_field(name));
}

function write_error(num, txt, red=true) {
	elem = document.getElementById('sp{0}'.format(num));
	if (red) {
		elem.setAttribute('style', '');
	} else {
		elem.setAttribute('style', 'color: green');
	}
	elem.innerHTML = txt;
}

function clear_errors() {
	for (var i = 1; i <= 10; ++i) {
		if (i != 99) {
			write_error(i, "");
		}
	}
}

function get_elem(cls) {
	var element = document.getElementsByClassName(cls)[0];
	return element;
}

function write_log(s) {
	output.innerHTML = '<span> {0} </span> <br>'.format(s) + output.innerHTML;
}

function Point(x, y) {
	this.x = Math.round(x);
	this.y = Math.round(y);
}

function dist(p1, p2) {
	var dx = p1.x - p2.x;
	var dy = p1.y - p2.y;
	return Math.sqrt(dx * dx + dy * dy);
}

function Graphics() {
	this.nodes = {};
	this.edges = {};
	
	this.clear = function clear() {
		d3.select("svg").remove();
		this.svg = d3.select("body").select("div.canvas").append("svg").attr("onclick", "map_onclick(event.clientX, event.clientY)").attr("name", "svg");
		this.height = 400;
		this.width = 900;
		this.svg.attr("height", this.height).attr("width", this.width);
	}
	
	this.check_size = function check_size(x, y) {
		if (this.width < x) {
			this.width = x;
		}
		if (this.height < y) {
			this.height = y + 5;
		}
		this.svg.attr("height", this.height).attr("width", this.width);
	}
	
	this.clear();
	
	this.draw_node = function draw_vertex(v, x, y) {
		var g = this.svg.append("g").attr("onclick", "node_onclick({0})".format(v));
		
		g.append("circle")
			.style("fill", "white")
			.style("stroke", "steelblue")
			.style("stroke-width", "2") 
			.attr("r", rad_vert)
			
		/*g.append("text")
			.attr("y", 5)
			.attr('text-anchor', 'middle')
			.attr("fill", "black")
			.style('font-weight', 'bold')
			.text('{0}'.format(v));*/
		
		this.nodes[v] = g._groups[0][0];
		x += rad_vert;
		y += rad_vert;
		this.set_node_coords(v, x, y);
		this.check_size(x + rad_vert, y + rad_vert);
	}
	
	this.draw_edge = function draw_edge(u, v) {
		c1 = this.get_node_coords(u);
		c2 = this.get_node_coords(v);
		
		var g = this.svg.append("g")
			.attr("onclick", "edge_onclick({0}, {1})".format(u, v));
		
		g.append('path')
			.attr("d", "M{0},{1}L{2},{3}".format(c1.x, c1.y, c2.x, c2.y))
			.attr("stroke", "gray")
			.attr("stroke-width", 1);
		
		this.edges[[u, v]] = g._groups[0][0];
		this.edges[[v, u]] = g._groups[0][0];
	}
	
	this.get_node_coords = function(index) {
		//console.log(this.nodes[index]);
		var attr = this.nodes[index].getAttribute("transform").substr(10).split(',');
		var x = parseInt(attr[0]), y = parseInt(attr[1]);
		return {x:x, y:y};
	}
	
	this.set_node_coords = function(index, x, y) {
		this.nodes[index].setAttribute("transform", "translate(" + x + ", " + y + ")");
	}
	
	this.set_node_col = function(index, col) {
		this.nodes[index].firstChild.style.fill = col;
	}
	
	this.set_node_rad = function(index, rad) {
		this.nodes[index].firstChild.setAttribute('r', rad);
	}
	
	this.set_node_text = function(index, txt) {
		this.nodes[index].childNodes[1].textContent = txt;
	}
	
	this.set_node_coords = function(index, x, y) {
		this.nodes[index].setAttribute("transform", "translate(" + x + ", " + y + ")");
	}
	
	this.set_edge_stroke_width = function(u, v, width) {
		this.edges[[u, v]].childNodes[0].setAttribute('stroke-width', width);
	}
	
	this.set_edge_col = function(u, v, col) {
		this.edges[[u, v]].childNodes[0].setAttribute('stroke', col);
	}
	
	this.get_edge_coords = function(u, v) {
		var d = this.edges[[u, v]].childNodes[0].getAttribute('d');
		var first = d.substr(1, d.indexOf('L') - 1);
		var second = d.substr(d.indexOf('L') + 1);
		return {first:coords_from_str(first), second:coords_from_str(second)};
	}
	
	this.set_edge_coords = function(u, v, coords) {
		var first = coords.first;
		var second = coords.second;
		var d = "M{0},{1}L{2},{3}".format(first.x, first.y, second.x, second.y);
		this.edges[[u, v]].childNodes[0].setAttribute('d', d);
	}
	
	this.del_edge = function(u, v) {
		this.edges[[u, v]].remove();
	}
}

var output = get_elem('log');
var points = [];
var path = [];
var graphics = new Graphics();
var mode = 'ordinary';
var visualization_type = 'auto';
var steps = 0;

function Operation(tp, desc, was_col, col, u, v) {
	this.tp = tp;
	this.desc = desc;
	this.col = col;
	this.was_col = was_col;
	this.u = u;
	this.v = v;
	
	this.apply = function() {
		if (this.desc != '') {
			write_log(this.desc);
		}
		if (tp == 'node_col') {
			graphics.set_node_col(this.u, this.col);
		} else if (tp == 'node_rad') {
			graphics.set_node_rad(this.u, this.col);
		} else if (tp == 'edge_col') {
			graphics.set_edge_col(this.u, this.v, this.col);
		} else if (tp == 'edge') {
			graphics.draw_edge(this.u, this.v, 0);
			graphics.set_edge_col(this.u, this.v, this.col);
		} else if (tp == 'edge_del') {
			graphics.del_edge(this.u, this.v);
		} else if (tp == 'edge_width') {
			graphics.set_edge_stroke_width(this.u, this.v, this.col);
		}
	}
	
	this.apply_back = function() {
		if (this.desc != '') {
			write_log('Отмена: ' + this.desc);
		}
		if (tp == 'node_col') {
			graphics.set_node_col(this.u, this.was_col);
		} else if (tp == 'node_rad') {
			graphics.set_node_rad(this.u, this.was_col);
		} else if (tp == 'edge_col') {
			graphics.set_edge_col(this.u, this.v, this.was_col);
		} else if (tp == 'edge') {
			graphics.del_edge(this.u, this.v);
		} else if (tp == 'edge_del') {
			graphics.draw_edge(this.u, this.v);
			graphics.set_edge_col(this.u, this.v, this.was_col);
			if (this.was_col == 'red') {
				graphics.set_edge_stroke_width(this.u, this.v, 2);
			}
		} else if (tp == 'edge_width') {
			graphics.set_edge_stroke_width(this.u, this.v, this.was_col);
		}
	}
}

function Block() {
	this.operations = [];
	
	this.add = function(operation) {
		this.operations.push(operation);
	}
	
	this.apply = function() {
		for (var i = 0; i < this.operations.length; ++i) {
			this.operations[i].apply();
		}
	}
	
	this.apply_back = function() {
		for (var i = this.operations.length - 1; i >= 0; --i) {
			this.operations[i].apply_back();
		}
	}
}

function enable_visualization_mode() {
	mode = 'visualization';
	if (get_field('select_v') == 'Автоматическая') {
		visualization_type = 'auto';
	} else {
		visualization_type = 'manual';
	}
}

function Animation() {
	this.blocks = [];
	this.block_id = 0;
	
	this.add = function(block) {
		this.blocks.push(block);
	}
	
	this.start = function() {
		enable_visualization_mode();
		this.block_id = 0;
		if (visualization_type == 'auto') {
			setTimeout(function() { show_block(); }, get_speed());
		} else {
			setTimeout(function() { show_block(); }, 100);
		}
	}
	
	this.show_block = function() {
		if (this.block_id < this.blocks.length) {
			this.blocks[this.block_id].apply();
			++this.block_id;			
			if (visualization_type == 'auto') {
				setTimeout(function() { show_block(); }, get_speed());
			}
		} else {
			write_log('Визуализация закончена. Итоговая длина пути {0}'.format(rounded(evaluate(path))));
			mode = 'ordinary';
		}
	}
	
	this.apply_back = function() {
		if (this.block_id > 0) {
			--this.block_id;
			this.blocks[this.block_id].apply_back();
		}
	}
}

function show_block() {
	animation.show_block();
}

function write_points() {
	var elem = document.getElementsByName('test_area')[0];
	var s = '';
	s += '{0}\n'.format(points.length);
	for (var i = 0; i < points.length; ++i) {
		//s += 'points.push(new Point({0}, {1}));\n'.format(points[i].x, points[i].y);
		s += '{0} {1}\n'.format(points[i].x, points[i].y);
	}
	elem.value = s;
}

function redraw_points() {
	write_points();
	graphics.clear();
	for (var i = 0; i < points.length; ++i) {
		graphics.draw_node(i, points[i].x, points[i].y);
	}
}