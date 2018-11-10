import heapq
import math

def get_children(test_arr, test_val,visited):
#returns an array containing the possible children of a parent
	child_array = []
	for x in range(1,6): 
		end = test_arr[x::]
		front = test_arr[:x]
		front = front[::-1]
		front += end
		string_form = ''.join(str(x) for x in front)
		if visited.has_key(string_form):
			continue
		temp_val = test_val #previous parent cost
		to_push = (temp_val,front)
		child_array.append(to_push)
	return(child_array)

def AStar(pstack):
# Sets up the problem with initial state, pushes initial state onto frontier,
# 	and calls looping algorithm while specifying break conditions
	frontier = []
	visited = {}
	value = 1
	to_test = (value,pstack)
	heapq.heappush(frontier,to_test)
	print_check = ''.join(str(x) for x in pstack)
	final = [1,2,3,4,5,6]
	while (1):
		if not (frontier):
			return False
		head = heapq.heappop(frontier)
		test_arr = head[1]
		test_val = head[0]
		string_form = ''.join(str(x) for x in test_arr)
		if test_arr == final:
			print("Your pancakes have been stacked in the following order: ")
			print(string_form)
			while (1):
				if string_form == print_check:
					break
				string_form = visited[string_form]
				print(string_form)
			print("The total number of flips to this point was: ")
			print(test_val)
			return
		child_array = get_children(test_arr,value,visited)
		inserted = False
		for child in child_array:
			for x in frontier:
				if x == child:
					if x[0] > child[0]:
						frontier.remove(x)
						heapq.heappush(frontier,child)
						inserted = True
			if not inserted:
				heapq.heappush(frontier,child)
			string_child = ''.join(str(x) for x in child[1])
			visited.update({string_child:string_form})
		value += 1
	return(frontier)

def main():
	print("Welcome to Polly's Pancake Parlor!")
	pstack = input("Please input your stack of pancakes in the following format [x,x,x,x,x]: ")
	pstack.append(6)
	test_stack = sorted(pstack)
	while test_stack != [1,2,3,4,5,6]:
		print("Invalid Input, please try again")
		print("Input must be a 5 number array with values 1-5")
		pstack  = input("Input your pancake stack here: ")
		test_stack = sorted(pstack)
	return(AStar(pstack))

if __name__ == '__main__':
	main()
