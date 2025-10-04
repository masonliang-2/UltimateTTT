import unittest
import game

WIN_CONS = ((0,1,2),(3,4,5),(6,7,8), # rows
           (0,3,6),(1,4,7),(2,5,8), # columns
           (0,4,8),(2,4,6)          # diagonals
)
class TestCheckWinCon(unittest.TestCase):
    def test_all_wins(self):
        self.assertEqual(game.check_winner([1, 1, 1, 0, 2, 2, 0, 0, 0]), 1)
        self.assertEqual(game.check_winner([2, 2, 0, 1, 1, 1, 0, 0, 2]), 1)
        self.assertEqual(game.check_winner([2, 0, 0, 1, 0, 0, 1, 1, 1]), 1)


if __name__ == "__main__":
    unittest.main()