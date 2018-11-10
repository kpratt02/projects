import math
import random

def print_board(board):
	top_row = "+-----------------------+"
	print(top_row)
	for row in board: 
		print_string = '| '
		print_string += " ".join(map(str,row[:3]))
		print_string += ' | '
		print_string += " ".join(map(str,row[3:6]))
		print_string += ' | '
		print_string += " ".join(map(str,row[6:9]))
		print_string += ' |'
		print(print_string)
		if (board.index(row)+1) % 3 == 0:
			print(top_row)

def row_to_col(board,col_index):
	arr=[]
	for row in board:
		arr.append(row[col_index])
	return arr

def get_box(board,row_index,col_index):
	arr=[]
	if row_index < 3:
		if col_index < 3:
			arr = board[0][:3]
			arr += board[1][:3]
			arr += board[2][:3]
		elif col_index < 6:
			arr = board[0][3:6]
			arr += board[1][3:6]
			arr += board[2][3:6]
		elif col_index < 9:
			arr = board[0][6:9]
			arr += board[1][6:9]
			arr += board[2][6:9]
	elif row_index < 6:
		if col_index < 3:
			arr = board[3][:3]
			arr += board[4][:3]
			arr += board[5][:3]
		elif col_index < 6:
			arr = board[3][3:6]
			arr += board[4][3:6]
			arr += board[5][3:6]
		elif col_index < 9:
			arr = board[3][6:9]
			arr += board[4][6:9]
			arr += board[5][6:9]
	elif row_index < 9:
		if col_index < 3:
			arr = board[6][:3]
			arr += board[7][:3]
			arr += board[8][:3]
		elif col_index < 6:
			arr = board[6][3:6]
			arr += board[7][3:6]
			arr += board[8][3:6]
		elif col_index < 9:
			arr = board[6][6:9]
			arr += board[7][6:9]
			arr += board[8][6:9]
	return arr

def check_row(row):
	flip_array = [False,False,False,False,False,False,False,False,False]
	for i in range(9):
		if row[i] != 0:
			if flip_array[(row[i] - 1)] == True:
				return False
			flip_array[(row[i] - 1)] = True
	return flip_array

def same_box(row_one, row_two, col_one, col_two):
	box_1 = [0,1,2]
	box_2 = [3,4,5]
	box_3 = [6,7,8]
	if (row_one in box_1 and row_two not in box_1) or (row_one in box_2 and row_two not in box_2) or (row_one in box_3 and row_two not in box_3):
		return False
	if (col_one in box_1 and col_two not in box_1) or (col_one in box_2 and col_two not in box_2) or (col_one in box_3 and col_two not in box_3):
		return False
	return True

def get_constraints(board,row_index,col_index):
	con_arr = []
	row_con = check_row(board[row_index])
	col_con = check_row(row_to_col(board,col_index))
	box_con = check_row(get_box(board,row_index,col_index))
	for i in range(9):
		if row_con and col_con and box_con:
			if not row_con[i] and not col_con[i] and not box_con[i]:
				con_arr.append(i+1)
	return con_arr

def get_relations(board,row_index,col_index):
	rel_arr = []
	for y in range(9):
		if board[row_index][y] == 0 and y != col_index:
			rel_arr.append((row_index,y))
		if board[y][col_index] == 0 and y != row_index:
			rel_arr.append((y,col_index))
		for x in range(9):
			if same_box(x,row_index,y,col_index) and board[x][y] == 0:
			 	rel_arr.append((x,y))
	return rel_arr

def only_val(board,con_dict,x,y,value):
	only_one_row = True
	only_one_col = True
	only_one_box = True
	for c in range(9):
		if board[c][y] == 0 and c != x:
			if value in (con_dict.get((c,y))):
				only_one_row = False
	for c in range(9):
		if board[x][c] == 0 and c != y:
			if value in (con_dict.get((x,c))):
				only_one_col = False
	for c in range(9):
		for d in range(9):
			if (board[c][d] == 0) and ((c != x) or (d != y)) and same_box(c,x,d,y):
				if value in (con_dict.get((c,d))):
					only_one_box = False
	if only_one_row or only_one_col or only_one_box:
		return True
	return False

def fix_it(board):
	print("yikes")
	return board

def csp(board):
	empty_test = [0,0,0,0,0,0,0,0,0]
	con_dict = {}
	rel_dict = {}
	back_track = []
	size_of = 0
	last_one = False
	for x in range(9): 
		for y in range(9): 
			if board[x][y] == 0:
				con_dict[(x,y)] = get_constraints(board,x,y)
				rel_dict[(x,y)] = get_relations(board,x,y)
	while con_dict:
		for x in range(9):
			for y in range(9):
				if board[x][y] == 0:
					if len(con_dict.get((x,y),[1,2])) == 1:
						board[x][y] = (con_dict.get((x,y))[0])
						con_dict.pop((x,y))
						last_one = True
						break
					con_dict[(x,y)] = get_constraints(board,x,y)
					if len(con_dict.get((x,y),[1,2])) == 0:
						fix_it(board)
	## The code below was developed to attempt more complicated boards; it is not
	##      currently functional, but is illustrative of a larger thought process
		only = False
		if not last_one:
			for x in range(9):
				for y in range(9):
					if board[x][y] == 0: 
						con_dict[(x,y)] = get_constraints(board,x,y)
						for value in con_dict.get((x,y),[0,0]):
							only = only_val(board,con_dict,x,y,value)
							if only:
								board[x][y] = value
								con_dict.pop((x,y),[0,0])
								break
		if not only: 
			for x in range(9):
				for y in range(9):
					if board[x][y] == 0:
						con_dict[(x,y)] = get_constraints(board,x,y)
						num_solutions = len(con_dict.get((x,y),10))
						if len(con_dict.get((x,y),10)) >= 1:
							print(con_dict.get((x,y),10))
							while con_dict.get((x,y),10) == 10:
								test_one = back_track.remove(rel_dict[(x,y)][0])
								rel_arr = rel_dict.get((x,y))
								rel_arr = rel_arr[1::]
								rel_dict[(x,y)] = rel_arr
								board[test_one[0]][test_one[1]] = 0
								con_dict[test_one] = get_constraints(board,test_one[0],test_one[1])
								con_dict[(x,y)] = get_constraints(board,x,y)
							board[x][y] = (con_dict.get((x,y))[random.randint(0,num_solutions-1)])
							back_track.append((x,y))
							con_dict.pop((x,y))
							break
		last_one = False
	print_board(board)

def main():
	## This is where the board is created and defined; feel free to change numbers 
	## to test other inputs below
	board = []
	# board.append([6,0,8,7,0,2,1,0,0])
	# board.append([4,0,0,0,1,0,0,0,2])
	# board.append([0,2,5,4,0,0,0,0,0])
	# board.append([7,0,1,0,8,0,4,0,5])
	# board.append([0,8,0,0,0,0,0,7,0])
	# board.append([5,0,9,0,6,0,3,0,1])
	# board.append([0,0,0,0,0,6,7,5,0])
	# board.append([2,0,0,0,9,0,0,0,8])
	# board.append([0,0,6,8,0,5,2,0,3])
	board.append([0,7,0,0,4,2,0,0,0])
	board.append([0,0,0,0,0,8,6,1,0])
	board.append([3,9,0,0,0,0,0,2,7])
	board.append([0,0,0,0,0,4,0,0,9])
	board.append([0,0,3,0,0,0,7,0,0])
	board.append([5,0,0,1,0,0,0,0,0])
	board.append([8,0,0,0,0,0,0,7,6])
	board.append([0,5,4,8,0,0,0,0,0])
	board.append([0,0,0,6,1,0,0,5,0])
	csp(board)

if __name__ == '__main__':
	main()