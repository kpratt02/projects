import random
import itertools
import copy

def total_weight(backpack):
	sum = 0
	for item in backpack:
		sum += item[0]
	return sum

def total_val(backpack):
	sum = 0
	for item in backpack:
		sum += item[1]
	return sum

def get_child(parent_1,parent_2):
	for item in parent_1:
		if item in parent_2:
			parent_2.remove(item)
	for item in parent_1:
		if total_weight(parent_2) >= 120:
			return parent_2
		else: 
			parent_2.append(item)
	return parent_2

def genetic_algo(population):
	max_weight = 120
	child_array = []
	to_check = copy.copy(population)
	while(1):
		if len(to_check) == 1 and total_weight(to_check[0]) <= max_weight:
			return to_check
		to_check = sorted(to_check, key = total_val, reverse = True)
		for x in range(len(to_check)/2):
			parent_1 = to_check[random.randint(0,len(to_check)-1)]
			parent_2 = to_check[random.randint(0,len(to_check)-1)]
			if total_weight(parent_1) > max_weight or total_weight(parent_1) == 0:
				parent_1 = to_check[random.randint(0,len(to_check)-1)]
			if total_weight(parent_2) > max_weight or total_weight(parent_2) == 0:
				parent_2 = to_check[random.randint(0,len(to_check)-1)]
			if parent_1 == parent_2:
				continue
			child = get_child(parent_1,parent_2)
			if random.randint(0,100) == 4:
				child = to_check[0]
			if total_weight(child) > 120:
				continue
			child_array.append(copy.copy(child))
		if child_array:
			to_check = child_array
			child_array = []
		elif not child_array or len(to_check) < 1:
			to_check = copy.copy(population)

def main():
	population = []
	pos_items = [(20,6),(30,5),(60,8),(90,7),(50,6),(70,9),(30,4)]
	for x in range(0,len(pos_items)+1):
		for item in itertools.combinations(pos_items,x):
			population.append(list(item))
	solutions = []
	to_add = []
	for x in range(100):
		to_add = genetic_algo(population)
		solutions += to_add
	max_val = 0
	pos = 0
	for x, solution in enumerate(solutions):
		if total_val(solution) > max_val:
			pos = x
			max_val = total_val(solution)
	print(solutions[pos])

if __name__ == '__main__':
	main()