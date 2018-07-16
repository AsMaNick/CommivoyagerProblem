import os
import sys
import time
import subprocess


extension_ending = sys.argv[1]


def run_command(command, **args):
	start_time = time.time()
	subprocess.call(command, **args, shell=True)
	return time.time() - start_time
	
	
def gener(params):
	if os.path.isfile('files/optimal.txt'):
		os.remove('files/optimal.txt')
	try:
		n = int(params[1])
		mx = int(params[2])
		assert(1 <= n <= 1000 and 1 <= mx <= 10000)
	except Exception:
		print('Provide correct paremeters for generation: n (1 <= n <= 1000), mx (1 <= mx <= 10000)')
		return
	try:
		rest = ''
		for i in range(3, len(params)):
			rest += ' ' + params[i]
		subprocess.call('generators/gener.{} '.format(extension_ending) + str(n) + ' ' + str(mx) + rest, stdout=open('files/input.txt', 'w'), shell=True)
		print('generated')
	except Exception as e:
		print(e)
		
		
def gener_circle(params):
	if os.path.isfile('files/optimal.txt'):
		os.remove('files/optimal.txt')
	try:
		n = int(params[1])
		rs = []
		s_params = str(n)
		for i in range(2, len(params)):
			rs.append(int(params[i]))
			s_params += ' ' + str(rs[-1])
			assert(1 <= rs[-1] <= 20000)
		assert(1 <= n <= 1000 and len(rs) > 0)
	except Exception:
		print('Provide correct paremeters for generation: n (1 <= n <= 1000), rs (1 <= rs[i] <= 20000)')
		return
	try:
		subprocess.call('generators/gener_circle.{} {}'.format(extension_ending, s_params), stdout=open('files/input.txt', 'w'), shell=True)
		print('generated')
	except Exception as e:
		print(e)
	
	
def show(params):
	command = 'python show.py'
	for i in range(1, len(params)):
		command += ' ' + params[i]
	subprocess.call(command, shell=True)
		

def ends_with(a, b):
	return len(a) >= len(b) and a[-len(b):] == b
	
	
def get_score(solution):
	try:
		f = open('files/output_' + solution + '.txt', 'r')
		score = float(f.readline())
		if ends_with(solution, 'opt'):
			steps = f.readline()
			score = float(f.readline())
		f.close()
		return score
	except Exception as e:
		print(e)
		return -1
		
		
def run(params):
	if len(params) == 1:
		print('Please, specify the program to run')
		return
	solutions = ['exponential', 'random', 'closest_neighbor', '2_approximation', 'bitonic', '15_approximation']
	ok = False
	for solution in solutions:	
		if params[1] == solution or params[1] == 'all':
			ok = True
			print('Running ' + solution + '...')
			tm = run_command('solutions/{}.{}'.format(solution, extension_ending), stdin=open('files/input.txt', 'r'), stdout=open('files/output_' + solution + '.txt', 'w'))
			print('Done, the score is {:.2f}, time = {:.2f}s'.format(get_score(solution), tm))
	if not ok:
		print('Please, specify correct name of the program:', solutions)
	

def apply(params):
	if len(params) == 1:
		print('Please, specify optimization to apply')
		return
	if len(params) == 2:
		print('Please specify result for which apply optimization')
		return
	opts = ['2_opt', '3_opt']
	opt = params[1]
	if opt in opts:
		solutions = ['exponential', 'random', 'closest_neighbor', '2_approximation', 'bitonic', '15_approximation']
		ok = False
		for solution in solutions:	
			if params[2] == solution or params[2] == 'all':
				ok = True
				if not os.path.isfile('files/output_' + solution + '.txt'):
					print('Can not apply optimization for the ' + solution + ', because do not have results for this solution')
					continue
				print('Applying {} for the '.format(opt) + solution + '...')
				tm = run_command('solutions/{}.{} files/output_'.format(opt, extension_ending) + solution + '.txt', 
								  stdin=open('files/input.txt', 'r'),
								  stdout=open('files/output_' + solution + '_{}.txt'.format(opt), 'w'))
				print('Done, the score is {:.2f}, time = {:.2f}s'.format(get_score(solution + '_{}'.format(opt)), tm))
		if not ok:
			print('Please, specify correct name of the program:', solutions)
	else:
		print('Please, specify correct name of the optimization')
			

if not os.path.isdir('./files'):
	os.mkdir('./files')
while True:
	params = input().split()
	if len(params) == 0:
		continue
	try:
		if params[0] == 'gener':
			gener(params)
		elif params[0] == 'gener_circle':
			gener_circle(params)
		elif params[0] == 'show':
			show(params)
		elif params[0] == 'run':
			run(params)
		elif params[0] == 'apply':
			apply(params)
		else:
			print('Unknown command')
	except Exception as e:
		print(e)