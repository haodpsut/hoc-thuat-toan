import type { Algorithm } from '../engine/types';
import { insertionSort } from './insertionSort';
import { bubbleSort } from './bubbleSort';
import { selectionSort } from './selectionSort';
import { linearSearch } from './linearSearch';
import { binarySearch } from './binarySearch';
import { bfs } from './bfs';
import { dfs } from './dfs';
import { bst } from './bst';
import { treeTraversal } from './treeTraversal';
import { primeCheck } from './primeCheck';
import { sieve } from './sieve';
import { reverseArray } from './reverseArray';
import { moveZeroes } from './moveZeroes';
import { twoSumSorted } from './twoSumSorted';
import { maxSubarray } from './maxSubarray';
import { lis } from './lis';
import { maxWindowSum } from './maxWindowSum';
import { movingSums } from './movingSums';
import { stringPalindrome } from './stringPalindrome';
import { patternSearch } from './patternSearch';
import { dijkstra } from './dijkstra';
import { nextGreater } from './nextGreater';
import { josephus } from './josephus';
import { recursiveSum } from './recursiveSum';
import { recursiveMax } from './recursiveMax';

// Registry of all algorithms, keyed by id. Adding a new algorithm = add one
// entry here and one MDX article. The engine and widgets stay untouched.
export const ALGORITHMS: Record<string, Algorithm> = {
  'insertion-sort': insertionSort,
  'bubble-sort': bubbleSort,
  'selection-sort': selectionSort,
  'linear-search': linearSearch,
  'binary-search': binarySearch,
  bfs,
  dfs,
  'binary-search-tree': bst,
  'tree-traversal': treeTraversal,
  'prime-check': primeCheck,
  sieve,
  'reverse-array': reverseArray,
  'move-zeroes': moveZeroes,
  'two-sum-sorted': twoSumSorted,
  'max-subarray': maxSubarray,
  lis,
  'max-window-sum': maxWindowSum,
  'moving-sums': movingSums,
  palindrome: stringPalindrome,
  'pattern-search': patternSearch,
  dijkstra,
  'next-greater': nextGreater,
  josephus,
  'recursive-sum': recursiveSum,
  'recursive-max': recursiveMax,
};
