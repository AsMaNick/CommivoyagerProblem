import os
import sys
import time
import subprocess


extension_ending = sys.argv[1]
shell_value = True
if extension_ending == 'exe':
	shell_value = False
	

def run_command(command, **args):
	start_time = time.time()
	subprocess.call(command, shell=shell_value, **args)
	return time.time() - start_time
	
	
def clear_directory(directory):
	for file in os.listdir(directory):
		os.remove(directory + file)
		
		
def gener(params):
	clear_directory('files/')
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
		subprocess.call('generators/gener.{} '.format(extension_ending) + str(n) + ' ' + str(mx) + rest, stdout=open('files/input.txt', 'w'), shell=shell_value)
		print('generated')
	except Exception as e:
		print(e)
		
		
def gener_circle(params):
	clear_directory('files/')
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
		subprocess.call('generators/gener_circle.{} {}'.format(extension_ending, s_params), stdout=open('files/input.txt', 'w'), shell=shell_value)
		print('generated')
	except Exception as e:
		print(e)
	
	
def show(params):
	command = 'python show.py'
	for i in range(1, len(params)):
		command += ' ' + params[i]
	subprocess.call(command, shell=shell_value)
		

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
			

def show_help(params):
	commands_list = ['gener', 'gener_circle', 'show', 'run', 'apply']
	if len(params) == 1:
		print('This is a console utility, in which you can generate different maps of cities and run/compare different approaches to the commivoyager problem.')
		print('You can run such commands:')
		for command in commands_list:
			print('  - {}'.format(command))
		print('To see the purpose of the concrete command run "help your_command"')
	elif len(params) >= 2:
		if params[1] == 'gener':
			print('gener n mx - generates test with n random points each of them has coordinates x y (1 <= x, y <= mx)')
		elif params[1] == 'gener_circle':
			print('gener_circle n rad_1 rad_2 ... rad_k - generate test with n random points each of them is lies on some of k circles')
		elif params[1] == 'show':
			print('1) show - show the generated graph')
			print('2) show solution_name_1 solution_name_2 ... solution_name_k - show the results of all specified solutions; to show the result of optimized solution you should write solution_name_optimization_name')
			print('3) show all - show the results of all solutions')
			print('4) show solution_name* - show the result of solution and all its optimizations')
		elif params[1] == 'run':
			print('1) run solution_name - execute one of the compiled solutions on the generated graph')
			print('2) run all - execute all of the compiled solutions on the generated graph')
		elif params[1] == 'apply':
			print('1) apply optimization_name solution_name - apply specified optimization to the specified solution')
			print('2) apply optimization_name all - apply specified optimization to all solutions that were previously run')
		else:
			print('Incorrect command, specify command from the list', commands_list)
			
	
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
		elif params[0] == 'help':
			show_help(params)
		else:
			print('Unknown command')
	except Exception as e:
		print(e)