import uuid
import datetime

# List of users to seed notes for
users = [
    {"username": "newtestuser888", "id": "a61deacd-252a-4cee-a1fa-987e2d11c881"},
    {"username": "vamsi_tester", "id": "e7f6e0ac-1b2d-4f78-9234-84bd4c5e1fb2"},
    {"username": "spiritt", "id": "f049ce6e-7685-49cc-8161-57f7c1424869"}
]

# 4 beautiful markdown notes about DSA
notes_list = [
    {
        "title": "Mastering Recursion & Call Stacks",
        "category": "DSA_CONCEPT",
        "tags": ["recursion", "basics", "callstack"],
        "content": """### Understanding Recursion

Recursion occurs when a function calls itself directly or indirectly to solve a smaller instance of the same problem. Every recursive function requires two primary components:

1. **Base Case**: The condition under which the recursion terminates, preventing infinite execution and stack overflow.
2. **Recursive Step**: The logic where the function invokes itself with updated, smaller inputs.

```java
// Classic Factorial Example
public int factorial(int n) {
    if (n <= 1) return 1; // Base Case
    return n * factorial(n - 1); // Recursive Step
}
```

#### How the Call Stack Works:
Each recursive call allocates a new stack frame in memory to store local variables and parameters.
- **Pushing**: As recursion goes deeper, frames are pushed onto the stack.
- **Popping**: When the base case is hit, stack frames pop off one-by-one in Last-In-First-Out (LIFO) order, returning evaluations up the chain.
"""
    },
    {
        "title": "Graph Traversals: DFS vs BFS",
        "category": "DSA_CONCEPT",
        "tags": ["graphs", "dfs", "bfs"],
        "content": """### DFS vs BFS Traversals

Graphs are non-linear data structures consisting of nodes (vertices) and connections (edges). Navigating these requires systematic traversal algorithms:

| Traversal | Core Data Structure | Search Direction | Best Used For |
| :--- | :--- | :--- | :--- |
| **DFS** (Depth-First) | Stack / Recursion | Plunges deep down a branch first | Pathfinding, Cycle detection, Topological sort |
| **BFS** (Breadth-First) | Queue (FIFO) | Explores neighbor-by-neighbor | Shortest path in unweighted graphs |

#### DFS Implementation:
```javascript
function dfs(node, visited) {
  if (visited.has(node)) return;
  visited.add(node);
  console.log(node);
  for (let neighbor of node.neighbors) {
    dfs(neighbor, visited);
  }
}
```

#### BFS Implementation:
```javascript
function bfs(startNode) {
  const queue = [startNode];
  const visited = new Set([startNode]);
  while (queue.length > 0) {
    const node = queue.shift();
    console.log(node);
    for (let neighbor of node.neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}
```
"""
    },
    {
        "title": "Dynamic Programming: Tabulation",
        "category": "DSA_CONCEPT",
        "tags": ["dp", "optimization", "tabulation"],
        "content": """### Dynamic Programming (DP) Cheat Sheet

Dynamic Programming is an algorithmic technique used to solve complex problems by breaking them down into simpler subproblems, solving each subproblem exactly once, and storing their solutions.

#### Key Prerequisites:
1. **Overlapping Subproblems**: The same subproblems are solved repeatedly.
2. **Optimal Substructure**: The optimal solution to the main problem is composed of optimal solutions to its subproblems.

#### Tabulation (Bottom-Up Approach):
Tabulation builds the solution iteratively from the base case up, storing intermediate solutions in a 1D or 2D array. This avoids call stack overhead.

```java
// Bottom-Up Coin Change
public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);
    dp[0] = 0; // Base Case
    
    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (i - coin >= 0) {
                dp[i] = Math.min(dp[i], 1 + dp[i - coin]);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}
```
"""
    },
    {
        "title": "Sliding Window Templates & Patterns",
        "category": "CODE_SNIPPET",
        "tags": ["slidingwindow", "templates", "arrays"],
        "content": """### Sliding Window Patterns

The Sliding Window pattern is used to reduce nested loops (O(N^2)) to linear time complexity (O(N)) on arrays or strings when looking for contiguous subarrays or substrings.

#### Variable Size Sliding Window Template:
```javascript
function variableSlidingWindow(arr) {
  let left = 0;
  let maxLength = 0;
  const charMap = new Map();

  for (let right = 0; right < arr.length; right++) {
    // 1. Expand Window by incorporating right element
    const rightChar = arr[right];
    charMap.set(rightChar, (charMap.get(rightChar) || 0) + 1);

    // 2. Contract Window from the left if criteria is violated
    while (isInvalidCondition()) {
      const leftChar = arr[left];
      // decrement count or remove left element
      left++; // shrink window
    }

    // 3. Update Result
    maxLength = Math.max(maxLength, right - left + 1);
  }
  return maxLength;
}
```
"""
    }
]

# Generate SQL insertions
sql_statements = []

# Clear existing entries first to avoid overlapping primary keys or duplicate test data
sql_statements.append("DELETE FROM note_tags WHERE note_id IN (SELECT id FROM notes WHERE user_id IN ('a61deacd-252a-4cee-a1fa-987e2d11c881', 'e7f6e0ac-1b2d-4f78-9234-84bd4c5e1fb2', 'f049ce6e-7685-49cc-8161-57f7c1424869'));")
sql_statements.append("DELETE FROM notes WHERE user_id IN ('a61deacd-252a-4cee-a1fa-987e2d11c881', 'e7f6e0ac-1b2d-4f78-9234-84bd4c5e1fb2', 'f049ce6e-7685-49cc-8161-57f7c1424869');")

for user in users:
    print(f"Generating 4 classic DSA study notes for user: {user['username']}")
    for i, n in enumerate(notes_list):
        note_id = str(uuid.uuid4())
        content_escaped = n["content"].replace("'", "''")
        title_escaped = n["title"].replace("'", "''")
        
        # Pinned logic (first note pinned by default for premium look)
        pinned = 1 if i == 0 else 0
        
        # Note insert
        note_sql = (
            f"INSERT INTO notes (id, user_id, title, content, category, is_attachment, pinned, created_at, updated_at) "
            f"VALUES ('{note_id}', '{user['id']}', '{title_escaped}', '{content_escaped}', '{n['category']}', 0, {pinned}, NOW(), NOW());"
        )
        sql_statements.append(note_sql)
        
        # Tags inserts
        for t in n["tags"]:
            tag_sql = f"INSERT INTO note_tags (note_id, tag) VALUES ('{note_id}', '{t}');"
            sql_statements.append(tag_sql)

# Write to file
output_path = "c:/Users/ACER/.gemini/antigravity/brain/185bfd39-7f90-4e6d-b74a-414d382e6ac6/scratch/seed_notes.sql"
with open(output_path, "w", encoding="utf-8") as f:
    f.write("\n".join(sql_statements))

print(f"Successfully generated SQL notes seed file with {len(sql_statements)} statements at: {output_path}")
