import subprocess
import os


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
		print('generated')
	except Exception as e:
		print(e)
	
	
def show(params):
	command = 'python show.py'
	for i in range(1, len(params)):
		command += ' ' + params[i]
	subprocess.call(command)
		
		
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
			subprocess.call('solutions/' + solution + '.exe', stdin=open('files/input.txt', 'r'), stdout=open('files/output_' + solution + '.txt', 'w'))
			print('done')
	if not ok:
		print('Please, specify correct name of the program:', solutions)
	
		
while True:
	params = input().split()
	if len(params) == 0:
		continue
	try:
		if params[0] == 'gener':
			gener(params)
		elif params[0] == 'show':
			show(params)
		elif params[0] == 'run':
			run(params)
		else:
			print('Unknown command')
	except Exception as e:
		print(e)