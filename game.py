class Board:
    def __init__(self):
        # 0 = empty, 1 = O, 2 = X
        # Winning combination
        #
        self.small_board = [
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
        ]
        self.big_board = [0,0,0,0,0,0,0,0,0]
        
WIN_CONS = ((0,1,2),(3,4,5),(6,7,8), # rows
           (0,3,6),(1,4,7),(2,5,8), # columns
           (0,4,8),(2,4,6)          # diagonals
)

def check_winner(small_board: list[int]) -> int:
    
    for player in [1, 2]:
        for combo in WIN_CONS:
            if all(small_board[i] == player for i in combo):
                return player
    return 0

def print_board(board: Board, player_turn: int) -> None:
    for i in range(9):
        if i % 3 == 0 and i != 0:
            print("- - - + - - - + - - -")
        row = ""
        for j in range(9):
            if j % 3 == 0 and j != 0:
                row += "| "
            small_board_row = j // 3 + (i // 3) * 3
            small_board_col = j % 3 + (i % 3) * 3
            cell_value = board.small_board[small_board_row][small_board_col]
            if cell_value == 0:
                row += ". "
            elif cell_value == 1:
                row += "O "
            else:
                row += "X "
        print(row)

    print("\nBig Board Status:")
    for i in range(3):
        row = ""
        for j in range(3):
            idx = i * 3 + j
            if board.big_board[idx] == 0:
                row += ". "
            elif board.big_board[idx] == 1:
                row += "O "
            else:
                row += "X "
        print(row)
    if player_turn == 1:
        print("O's turn")
    else:
        print("X's turn")
        
def get_input_row_col() -> tuple[int, int]:
    while True:
        try:
            row = int(input("Enter row (0-8): "))
            col = int(input("Enter column (0-8): "))
            if 0 <= row < 9 and 0 <= col < 9:
                return row, col
            else:
                print("Row and column must be between 0 and 8.")
        except ValueError:
            print("Invalid input. Please enter numbers only.")
        
def main():
    board = Board()
    game_over = False
    player_turn = 1  # 1 for O, 2 for X
    current_small_board = -1  # -1 means any board is allowed
    next_small_board = -1
    while(game_over == False):
        print_board(board, player_turn)
        print(board.big_board)
        print(board.small_board)

        if next_small_board != -1 and board.big_board[next_small_board] == 0:
            print(f"Player {'O' if player_turn == 1 else 'X'} must play in small board {next_small_board}.")
        else:
            next_small_board = -1  # Any board is allowed
            print(f"Player {'O' if player_turn == 1 else 'X'} can play in any small board.")

        
        row, col = get_input_row_col()
        current_small_board = (row // 3) * 3 + (col // 3)
        position = (row % 3) * 3 + (col % 3)
        small_board_row = col // 3 + (row // 3) * 3
        small_board_col = col % 3 + (row % 3) * 3
        print(f"Current small board: {current_small_board} Position: {position}")


        if next_small_board != -1 and current_small_board != next_small_board:
            print("Invalid move. You must play in the indicated small board.")
            continue
        
        if board.big_board[current_small_board] != 0:
            print("Invalid move. This board is already won.")
            continue

        if board.small_board[small_board_row][small_board_col] != 0:
            print("Invalid move. Cell already occupied.")
            continue
        
        board.small_board[current_small_board][position] = player_turn

        winner = check_winner(board.small_board[current_small_board])

        if winner != 0:
            board.big_board[current_small_board] = winner
            if check_winner(board.big_board) != 0:
                print(f"Player {player_turn} wins the game!")
                game_over = True
                continue
            
        player_turn = 2 if player_turn == 1 else 1
        next_small_board = position
        
    

if __name__ == "__main__":
    main()
