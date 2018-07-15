import os
import subprocess


def ends_with(a, b):
	return len(a) >= len(b) and a[-len(b):] == b
	
	
for dir in ['solutions/', 'generators/']:
	for file in os.listdir(dir):
		if ends_with(file, '.cpp'):
			print('Compiling {}...'.format(dir + file))
			subprocess.call('g++ -O3 -std=c++11 {}'.format(dir + file))
			if not os.path.isfile('a.exe'):
				continue
			if os.path.isfile(dir + file[:-4] + '.exe'):
				os.remove(dir + file[:-4] + '.exe')
			os.rename('a.exe', dir + file[:-4] + '.exe')