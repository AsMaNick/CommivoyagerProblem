import cv2
import sys
import numpy as np


city_radius = 3
shift_y = 22

def normalize(city, coef):
	return int(city[0] * coef), int(city[1] * coef) + city_radius
	
	
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
	

def read_path(solution):
	f = open('files/output_' + solution + '.txt', 'r')
	score = float(f.readline())
	path = list(map(int, f.readline().split()))
	return score, path
	
	
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
		
		
		
def put_header(solution, score):
	global color_num, all_headers
	header = np.zeros((shift_y, n, 3), np.uint8)
	header[::] = 255
	opt_score = get_optimal_score()
	header_text = solution + ': ' + str(score)
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
n = 600
all_headers = np.zeros((1, n, 3), np.uint8)
all_headers[::] = 255
img = np.zeros((n + 2 * city_radius, n, 3), np.uint8)
img[::] = 255
cities = read_cities()
put_cities(img, cities)
solution_list = sys.argv[1:]
if len(sys.argv) > 1 and sys.argv[1] == 'all':
	solution_list = ['exponential', 'random', 'closest_neighbor', '2_approximation', 'bitonic', '15_approximation']
for solution in solution_list:
	try:
		score, path = read_path(solution)
		put_header(solution, score)
		put_path(img, cities, path)
	except Exception as e:
		print(e)
img = np.vstack((all_headers, img))
cv2.imshow('Graph', img)
cv2.waitKey(0)
