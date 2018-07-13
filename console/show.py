import cv2
import sys
import numpy as np


city_radius = 3
shift_y = 22
add_x = 200


def normalize(city, coef):
	return int(city[0] * coef) + add_x // 2, int(city[1] * coef) + city_radius + shift_y // 2
	
	
def read_cities():
	f = open('files/input.txt', 'r')
	number_of_cities = int(f.readline())
	cities = [0] * number_of_cities
	mx = 0
	for i in range(number_of_cities):
		cities[i] = tuple(map(int, f.readline().split()))
		mx = max(mx, cities[i][0], cities[i][1])
	for i in range(number_of_cities):
		cities[i] = normalize(cities[i], (n - city_radius - 1) / mx)
	return cities
	

def ends_with(a, b):
	return len(a) >= len(b) and a[-len(b):] == b
	
	
def read_path(solution):
	f = open('files/output_' + solution + '.txt', 'r')
	was_score = float(f.readline())
	steps = -1
	score = was_score
	if ends_with(solution, 'opt'):
		steps = int(f.readline())
		score = float(f.readline())
	path = list(map(int, f.readline().split()))
	f.close()
	return was_score, path, steps, score
	
	
def put_cities(img, cities):
	for city in cities:
		cv2.circle(img, city, city_radius, (0, 0, 0), -1)


def get_optimal_score():
	try:
		f = open('files/optimal.txt', 'r')
		score = float(f.readline())
		return score
	except Exception as e:
		return -1
		
		
def put_header(solution, was_score, steps, score):
	global color_num, all_headers
	header = np.zeros((shift_y, n + add_x, 3), np.uint8)
	header[::] = 255
	opt_score = get_optimal_score()
	header_text = solution + ': ' + str(was_score)
	if steps >= 0:
		header_text += ' => ' + str(score) + ' (' + str(steps) + ' steps)'
	if opt_score >= 0:
		k = score / opt_score
		header_text += ', optimal = ' + str(opt_score) + ', k = ' + str(k)[:str(k).find('.') + 3]
	cv2.putText(header, header_text, (10, 20), cv2.FONT_HERSHEY_COMPLEX, 0.5, colors[color_num])
	all_headers = np.vstack((all_headers, header))
	
	
def put_path(img, cities, path):
	global color_num, all_headers
	for i in range(len(path)):
		cv2.line(img, cities[path[i]], cities[path[(i + 1) % len(path)]], colors[color_num], lineType=16)
	color_num += 1
		
		
colors = [(255, 0, 0), (0, 255, 0), (0, 0, 255), (200, 200, 0), (255, 0, 255), (0, 200, 200)]
global color_num, all_headers
color_num = 0
n = 550
all_headers = np.zeros((1, n + add_x, 3), np.uint8)
all_headers[::] = 255
img = np.zeros((n + shift_y + 2 * city_radius, n + add_x, 3), np.uint8)
img[::] = 255
cities = read_cities()
put_cities(img, cities)
solution_list = sys.argv[1:]
if len(sys.argv) > 1 and sys.argv[1] == 'all':
	solution_list = ['exponential', 'random', 'closest_neighbor', '2_approximation', 'bitonic', '15_approximation']
if len(sys.argv) > 1 and sys.argv[1] == 'all_2_opt':
	solution_list = ['exponential_2_opt', 'random_2_opt', 'closest_neighbor_2_opt', '2_approximation_2_opt', 'bitonic_2_opt', '15_approximation_2_opt']
for solution in solution_list:
	try:
		was_score, path, steps, score = read_path(solution)
		put_header(solution, was_score, steps, score)
		put_path(img, cities, path)
	except Exception as e:
		print(e)
img = np.vstack((all_headers, img))
cv2.imshow('Graph', img)
cv2.waitKey(0)
