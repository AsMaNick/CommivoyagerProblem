import os
import sys
import subprocess


def ends_with(a, b):
	return len(a) >= len(b) and a[-len(b):] == b
	

extension_ending = sys.argv[1]
for dir in ['solutions/', 'generators/']:
	for file in os.listdir(dir):
		if ends_with(file, '.cpp'):
			print('Compiling {}...'.format(dir + file))
			subprocess.call('g++ -O3 -std=c++11 {}'.format(dir + file))
			if not os.path.isfile('a.' + extension_ending):
				continue
			if os.path.isfile(dir + file[:-4] + '.' + extension_ending):
				os.remove(dir + file[:-4] + '.' + extension_ending)
			os.rename('a.' + extension_ending, dir + file[:-4] + '.' + extension_ending)