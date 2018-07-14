import subprocess
import time
import os


def run_command(command, **args):
	start_time = time.time()
	subprocess.call(command, **args)
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
		subprocess.call('generators/gener.exe ' + str(n) + ' ' + str(mx) + rest, stdout=open('files/input.txt', 'w'))
		#print('generated')
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
		subprocess.call('generators/gener_circle.exe ' + s_params, stdout=open('files/input.txt', 'w'))
		#print('generated')
	except Exception as e:
		print(e)
	
	
def show(params):
	command = 'python show.py'
	for i in range(1, len(params)):
		command += ' ' + params[i]
	subprocess.call(command)
		

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
			#print('Running ' + solution + '...')
			tm = run_command('solutions/' + solution + '.exe', stdin=open('files/input.txt', 'r'), stdout=open('files/output_' + solution + '.txt', 'w'))
			return tm
			#print('Done, the score is {:.2f}, time = {:.2f}s'.format(get_score(solution), tm))
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
				#print('Applying {} for the '.format(opt) + solution + '...')
				tm = run_command('solutions/{}.exe files/output_'.format(opt) + solution + '.txt', 
								  stdin=open('files/input.txt', 'r'),
								  stdout=open('files/output_' + solution + '_{}.txt'.format(opt), 'w'))
				return tm
				#print('Done, the score is {:.2f}, time = {:.2f}s'.format(get_score(solution + '_{}'.format(opt)), tm))
		if not ok:
			print('Please, specify correct name of the program:', solutions)
	else:
		print('Please, specify correct name of the optimization')
			

def run_small_tests():			
	tests_params = [[9, 100, 50],
				    [12, 100, 50],
				    [15, 100, 50],
				    [18, 100, 25],
				    [20, 100, 25]]
				   
	solutions = ['exponential', 'random', 'bitonic', 'closest_neighbor', '2_approximation', '15_approximation']
	opt = '3_opt'

	for test_params in tests_params:
		n = test_params[0]
		mx = test_params[1]
		tests = test_params[2]
		res = dict()
		for solution in solutions:
			res[solution] = 0
		for i in range(tests):
			gener(['', str(n), str(mx), str(i)])
			for solution in solutions:
				run(['', solution])
				full_name_solution = solution
				if opt != '':
					apply(['', opt, solution])
					full_name_solution += '_' + opt
				res[solution] += get_score(full_name_solution) / get_score('exponential')
		results = []
		for solution in solutions:
			results.append(float('{:.2f}'.format(res[solution] / tests)))
		print(test_params, opt)
		print(solutions)
		print(results)
		

def run_big_tests():			
	tests_params = [[100, 4000, 10],
				    [200, 5000, 10],
				    [400, 5000, 20],
				    [1000, 10000, 20]]
	
	tests_params = [[1000, 10000, 2]]
					
	solutions = ['random', 'bitonic', 'closest_neighbor', '2_approximation', '15_approximation']

	for test_params in tests_params:
		n = test_params[0]
		mx = test_params[1]
		tests = test_params[2]
		opts = ['2_opt']
		if n <= 1000:
			opts.append('3_opt')
		res = dict()
		tms = dict()
		all_names = []
		for solution in solutions:
			for suff in [''] + opts:
				full_name_solution = solution
				if suff != '':
					full_name_solution += '_' + suff
				all_names.append(full_name_solution)
				res[full_name_solution] = 0
				tms[full_name_solution] = 0
		for i in range(tests):
			print('Test #{}'.format(i))
			gener(['', str(n), str(mx), str(i)])
			best = 1000111222111.0
			for solution in solutions:
				tms[solution] += run(['', solution])
				for opt in opts:
					tms[solution + '_' + opt] += apply(['', opt, solution])
				for suff in [''] + opts:
					full_name_solution = solution
					if suff != '':
						full_name_solution += '_' + suff
					best = min(best, get_score(full_name_solution))
			for solution in solutions:
				for suff in [''] + opts:
					full_name_solution = solution
					if suff != '':
						full_name_solution += '_' + suff
					res[full_name_solution] += get_score(full_name_solution) / best
		print(test_params)
		for solution in all_names:
			print(solution, float('{:.2f}'.format(res[solution] / tests)), float('{:.2f}'.format(tms[solution] / tests)), 'sec')
			
	
run_big_tests()