import type { Algorithm } from '../engine/types';
import { insertionSort } from './insertionSort';
import { bubbleSort } from './bubbleSort';
import { bfs } from './bfs';
import { dfs } from './dfs';
import { bst } from './bst';
import { treeTraversal } from './treeTraversal';
import { primeCheck } from './primeCheck';

// Registry of all algorithms, keyed by id. Adding a new algorithm = add one
// entry here and one MDX article. The engine and widgets stay untouched.
export const ALGORITHMS: Record<string, Algorithm> = {
  'insertion-sort': insertionSort,
  'bubble-sort': bubbleSort,
  bfs,
  dfs,
  'binary-search-tree': bst,
  'tree-traversal': treeTraversal,
  'prime-check': primeCheck,
};
