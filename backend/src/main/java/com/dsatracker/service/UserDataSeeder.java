package com.dsatracker.service;

import com.dsatracker.model.Note;
import com.dsatracker.model.Problem;
import com.dsatracker.model.enums.Difficulty;
import com.dsatracker.model.enums.NoteCategory;
import com.dsatracker.model.enums.Platform;
import com.dsatracker.model.enums.ProblemStatus;
import com.dsatracker.repository.NoteRepository;
import com.dsatracker.repository.ProblemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class UserDataSeeder {

    private final ProblemRepository problemRepository;
    private final NoteRepository noteRepository;

    private static class ProblemTemplate {
        String name;
        String topic;
        Difficulty difficulty;
        Platform platform;
        List<String> tags;
        String notes;

        public ProblemTemplate(String name, String topic, Difficulty difficulty, Platform platform, List<String> tags, String notes) {
            this.name = name;
            this.topic = topic;
            this.difficulty = difficulty;
            this.platform = platform;
            this.tags = tags;
            this.notes = notes;
        }
    }

    private static class NoteTemplate {
        String title;
        NoteCategory category;
        List<String> tags;
        String content;

        public NoteTemplate(String title, NoteCategory category, List<String> tags, String content) {
            this.title = title;
            this.category = category;
            this.tags = tags;
            this.content = content;
        }
    }

    private static final List<ProblemTemplate> PROBLEMS_TEMPLATES = Arrays.asList(
        // Arrays (Problems 1 - 15)
        new ProblemTemplate("Two Sum", "Arrays", Difficulty.EASY, Platform.LEETCODE, Arrays.asList("Arrays", "Hash Map"), ""),
        new ProblemTemplate("Best Time to Buy and Sell Stock", "Arrays", Difficulty.EASY, Platform.LEETCODE, Arrays.asList("Arrays", "Two Pointers"), ""),
        new ProblemTemplate("Maximum Subarray", "Arrays", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Arrays", "Dynamic Programming"), ""),
        new ProblemTemplate("3Sum", "Arrays", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Arrays", "Two Pointers"), ""),
        new ProblemTemplate("Container With Most Water", "Arrays", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Arrays", "Two Pointers"), ""),
        new ProblemTemplate("Merge Sorted Array", "Arrays", Difficulty.EASY, Platform.LEETCODE, Arrays.asList("Arrays", "Two Pointers"), ""),
        new ProblemTemplate("Remove Element", "Arrays", Difficulty.EASY, Platform.LEETCODE, Arrays.asList("Arrays", "Two Pointers"), ""),
        new ProblemTemplate("Pascal's Triangle", "Arrays", Difficulty.EASY, Platform.LEETCODE, Arrays.asList("Arrays"), ""),
        new ProblemTemplate("Intersection of Two Arrays", "Arrays", Difficulty.EASY, Platform.LEETCODE, Arrays.asList("Arrays", "Hash Map"), ""),
        new ProblemTemplate("Subarray Sum Equals K", "Arrays", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Arrays", "Prefix Sum"), ""),
        new ProblemTemplate("Rotate Array", "Arrays", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Arrays"), ""),
        new ProblemTemplate("Product of Array Except Self", "Arrays", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Arrays", "Prefix Sum"), ""),
        new ProblemTemplate("Move Zeroes", "Arrays", Difficulty.EASY, Platform.LEETCODE, Arrays.asList("Arrays", "Two Pointers"), ""),
        new ProblemTemplate("Sort Colors", "Arrays", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Arrays", "Two Pointers"), ""),
        new ProblemTemplate("Trapping Rain Water", "Arrays", Difficulty.HARD, Platform.LEETCODE, Arrays.asList("Arrays", "Two Pointers"), ""),

        // Strings (Problems 16 - 30)
        new ProblemTemplate("Valid Anagram", "Strings", Difficulty.EASY, Platform.LEETCODE, Arrays.asList("Strings", "Hash Map"), ""),
        new ProblemTemplate("Valid Parentheses", "Strings", Difficulty.EASY, Platform.LEETCODE, Arrays.asList("Strings", "Stack"), ""),
        new ProblemTemplate("Group Anagrams", "Strings", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Strings", "Hash Map"), ""),
        new ProblemTemplate("Longest Palindromic Substring", "Strings", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Strings", "Dynamic Programming"), ""),
        new ProblemTemplate("Valid Palindrome", "Strings", Difficulty.EASY, Platform.LEETCODE, Arrays.asList("Strings", "Two Pointers"), ""),
        new ProblemTemplate("Reverse String", "Strings", Difficulty.EASY, Platform.LEETCODE, Arrays.asList("Strings", "Two Pointers"), ""),
        new ProblemTemplate("First Unique Character in a String", "Strings", Difficulty.EASY, Platform.LEETCODE, Arrays.asList("Strings", "Hash Map"), ""),
        new ProblemTemplate("Longest Common Prefix", "Strings", Difficulty.EASY, Platform.LEETCODE, Arrays.asList("Strings"), ""),
        new ProblemTemplate("String to Integer atoi", "Strings", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Strings"), ""),
        new ProblemTemplate("Implement strStr", "Strings", Difficulty.EASY, Platform.LEETCODE, Arrays.asList("Strings", "Two Pointers"), ""),
        new ProblemTemplate("Longest Repeating Character Replacement", "Strings", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Strings", "Sliding Window"), ""),
        new ProblemTemplate("Simplify Path", "Strings", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Strings", "Stack"), ""),
        new ProblemTemplate("Decode String", "Strings", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Strings", "Stack"), ""),
        new ProblemTemplate("Minimum Window Substring", "Strings", Difficulty.HARD, Platform.LEETCODE, Arrays.asList("Strings", "Sliding Window"), ""),
        new ProblemTemplate("Palindromic Substrings", "Strings", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Strings", "Dynamic Programming"), ""),

        // Linked Lists (Problems 31 - 45)
        new ProblemTemplate("Reverse Linked List", "Linked Lists", Difficulty.EASY, Platform.LEETCODE, Arrays.asList("Linked Lists", "Recursion"), ""),
        new ProblemTemplate("Merge Two Sorted Lists", "Linked Lists", Difficulty.EASY, Platform.LEETCODE, Arrays.asList("Linked Lists", "Two Pointers"), ""),
        new ProblemTemplate("Linked List Cycle", "Linked Lists", Difficulty.EASY, Platform.LEETCODE, Arrays.asList("Linked Lists", "Two Pointers"), ""),
        new ProblemTemplate("Remove Nth Node From End of List", "Linked Lists", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Linked Lists", "Two Pointers"), ""),
        new ProblemTemplate("LRU Cache", "Linked Lists", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Linked Lists", "Hash Map"), ""),
        new ProblemTemplate("Merge k Sorted Lists", "Linked Lists", Difficulty.HARD, Platform.LEETCODE, Arrays.asList("Linked Lists", "Heaps"), ""),
        new ProblemTemplate("Middle of the Linked List", "Linked Lists", Difficulty.EASY, Platform.LEETCODE, Arrays.asList("Linked Lists", "Two Pointers"), ""),
        new ProblemTemplate("Palindrome Linked List", "Linked Lists", Difficulty.EASY, Platform.LEETCODE, Arrays.asList("Linked Lists", "Two Pointers"), ""),
        new ProblemTemplate("Odd Even Linked List", "Linked Lists", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Linked Lists", "Two Pointers"), ""),
        new ProblemTemplate("Reorder List", "Linked Lists", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Linked Lists", "Two Pointers"), ""),
        new ProblemTemplate("Add Two Numbers", "Linked Lists", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Linked Lists", "Math"), ""),
        new ProblemTemplate("Copy List with Random Pointer", "Linked Lists", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Linked Lists", "Hash Map"), ""),
        new ProblemTemplate("Remove Duplicates from Sorted List", "Linked Lists", Difficulty.EASY, Platform.LEETCODE, Arrays.asList("Linked Lists"), ""),
        new ProblemTemplate("Intersection of Two Linked Lists", "Linked Lists", Difficulty.EASY, Platform.LEETCODE, Arrays.asList("Linked Lists", "Two Pointers"), ""),
        new ProblemTemplate("Flatten a Multilevel Doubly Linked List", "Linked Lists", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Linked Lists"), ""),

        // Trees (Problems 46 - 60)
        new ProblemTemplate("Invert Binary Tree", "Trees", Difficulty.EASY, Platform.LEETCODE, Arrays.asList("Trees", "DFS"), ""),
        new ProblemTemplate("Maximum Depth of Binary Tree", "Trees", Difficulty.EASY, Platform.LEETCODE, Arrays.asList("Trees", "DFS"), ""),
        new ProblemTemplate("Binary Tree Level Order Traversal", "Trees", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Trees", "BFS"), ""),
        new ProblemTemplate("Validate Binary Search Tree", "Trees", Difficulty.MEDIUM, Platform.GFG, Arrays.asList("Trees", "DFS"), ""),
        new ProblemTemplate("Kth Smallest Element in a BST", "Trees", Difficulty.MEDIUM, Platform.GFG, Arrays.asList("Trees", "DFS"), ""),
        new ProblemTemplate("Binary Tree Maximum Path Sum", "Trees", Difficulty.HARD, Platform.LEETCODE, Arrays.asList("Trees", "DFS"), ""),
        new ProblemTemplate("Serialize and Deserialize Binary Tree", "Trees", Difficulty.HARD, Platform.LEETCODE, Arrays.asList("Trees", "DFS"), ""),
        new ProblemTemplate("Path Sum", "Trees", Difficulty.EASY, Platform.LEETCODE, Arrays.asList("Trees", "DFS"), ""),
        new ProblemTemplate("Symmetric Tree", "Trees", Difficulty.EASY, Platform.LEETCODE, Arrays.asList("Trees", "DFS"), ""),
        new ProblemTemplate("Same Tree", "Trees", Difficulty.EASY, Platform.LEETCODE, Arrays.asList("Trees", "DFS"), ""),
        new ProblemTemplate("Subtree of Another Tree", "Trees", Difficulty.EASY, Platform.LEETCODE, Arrays.asList("Trees", "DFS"), ""),
        new ProblemTemplate("Binary Tree Zigzag Level Order Traversal", "Trees", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Trees", "BFS"), ""),
        new ProblemTemplate("Lowest Common Ancestor of a Binary Tree", "Trees", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Trees", "DFS"), ""),
        new ProblemTemplate("Diameter of Binary Tree", "Trees", Difficulty.EASY, Platform.GFG, Arrays.asList("Trees", "DFS"), ""),
        new ProblemTemplate("Construct Binary Tree from Preorder and Inorder Traversal", "Trees", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Trees"), ""),

        // Graphs (Problems 61 - 75)
        new ProblemTemplate("Flood Fill", "Graphs", Difficulty.EASY, Platform.GFG, Arrays.asList("Graphs", "DFS"), ""),
        new ProblemTemplate("Number of Islands", "Graphs", Difficulty.MEDIUM, Platform.GFG, Arrays.asList("Graphs", "BFS"), ""),
        new ProblemTemplate("Clone Graph", "Graphs", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Graphs", "DFS"), ""),
        new ProblemTemplate("Course Schedule", "Graphs", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Graphs", "DFS"), ""),
        new ProblemTemplate("Is Graph Bipartite?", "Graphs", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Graphs", "BFS"), ""),
        new ProblemTemplate("Redundant Connection", "Graphs", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Graphs", "Union Find"), ""),
        new ProblemTemplate("Network Delay Time", "Graphs", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Graphs", "Shortest Path"), ""),
        new ProblemTemplate("Min Cost to Connect All Points", "Graphs", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Graphs", "Kruskal"), ""),
        new ProblemTemplate("Rotting Oranges", "Graphs", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Graphs", "BFS"), ""),
        new ProblemTemplate("Word Ladder", "Graphs", Difficulty.HARD, Platform.LEETCODE, Arrays.asList("Graphs", "BFS"), ""),
        new ProblemTemplate("Surrounded Regions", "Graphs", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Graphs", "DFS"), ""),
        new ProblemTemplate("Pacific Atlantic Water Flow", "Graphs", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Graphs", "DFS"), ""),
        new ProblemTemplate("Cheapest Flights Within K Stops", "Graphs", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Graphs", "Dijkstra"), ""),
        new ProblemTemplate("Reconstruct Itinerary", "Graphs", Difficulty.HARD, Platform.LEETCODE, Arrays.asList("Graphs", "Eulerian Path"), ""),
        new ProblemTemplate("Alien Dictionary", "Graphs", Difficulty.HARD, Platform.LEETCODE, Arrays.asList("Graphs", "Topological Sort"), ""),

        // Dynamic Programming (Problems 76 - 90)
        new ProblemTemplate("Climbing Stairs", "Dynamic Programming", Difficulty.EASY, Platform.LEETCODE, Arrays.asList("Dynamic Programming"), ""),
        new ProblemTemplate("Coin Change", "Dynamic Programming", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Dynamic Programming"), ""),
        new ProblemTemplate("Longest Common Subsequence", "Dynamic Programming", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Dynamic Programming"), ""),
        new ProblemTemplate("Edit Distance", "Dynamic Programming", Difficulty.HARD, Platform.LEETCODE, Arrays.asList("Dynamic Programming"), ""),
        new ProblemTemplate("House Robber", "Dynamic Programming", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Dynamic Programming"), ""),
        new ProblemTemplate("House Robber II", "Dynamic Programming", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Dynamic Programming"), ""),
        new ProblemTemplate("Unique Paths", "Dynamic Programming", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Dynamic Programming"), ""),
        new ProblemTemplate("Min Cost Climbing Stairs", "Dynamic Programming", Difficulty.EASY, Platform.LEETCODE, Arrays.asList("Dynamic Programming"), ""),
        new ProblemTemplate("Word Break", "Dynamic Programming", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Dynamic Programming"), ""),
        new ProblemTemplate("Partition Equal Subset Sum", "Dynamic Programming", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Dynamic Programming"), ""),
        new ProblemTemplate("Longest Increasing Subsequence", "Dynamic Programming", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Dynamic Programming"), ""),
        new ProblemTemplate("Decode Ways", "Dynamic Programming", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Dynamic Programming"), ""),
        new ProblemTemplate("Maximal Square", "Dynamic Programming", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Dynamic Programming"), ""),
        new ProblemTemplate("Best Time to Buy and Sell Stock with Cooldown", "Dynamic Programming", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Dynamic Programming"), ""),
        new ProblemTemplate("Burst Balloons", "Dynamic Programming", Difficulty.HARD, Platform.LEETCODE, Arrays.asList("Dynamic Programming"), ""),

        // Binary Search & Heaps (Problems 91 - 99)
        new ProblemTemplate("Binary Search", "Binary Search", Difficulty.EASY, Platform.LEETCODE, Arrays.asList("Binary Search"), ""),
        new ProblemTemplate("Search in Rotated Sorted Array", "Binary Search", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Binary Search"), ""),
        new ProblemTemplate("Median of Two Sorted Arrays", "Binary Search", Difficulty.HARD, Platform.LEETCODE, Arrays.asList("Binary Search"), ""),
        new ProblemTemplate("Koko Eating Bananas", "Binary Search", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Binary Search"), ""),
        new ProblemTemplate("Find Peak Element", "Binary Search", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Binary Search"), ""),
        new ProblemTemplate("Kth Largest Element in an Array", "Heaps", Difficulty.MEDIUM, Platform.HACKERRANK, Arrays.asList("Heaps"), ""),
        new ProblemTemplate("Top K Frequent Elements", "Heaps", Difficulty.MEDIUM, Platform.HACKERRANK, Arrays.asList("Heaps", "Hash Map"), ""),
        new ProblemTemplate("Find Median from Data Stream", "Heaps", Difficulty.HARD, Platform.LEETCODE, Arrays.asList("Heaps"), ""),
        new ProblemTemplate("Kth Largest Element in a Stream", "Heaps", Difficulty.EASY, Platform.LEETCODE, Arrays.asList("Heaps"), ""),

        // Backtracking, Tries, & Competitive Coding (Problems 100 - 106)
        new ProblemTemplate("Combination Sum", "Backtracking", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Backtracking"), ""),
        new ProblemTemplate("N-Queens", "Backtracking", Difficulty.HARD, Platform.LEETCODE, Arrays.asList("Backtracking"), ""),
        new ProblemTemplate("Permutations", "Backtracking", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Backtracking"), ""),
        new ProblemTemplate("Implement Trie Prefix Tree", "Tries", Difficulty.MEDIUM, Platform.LEETCODE, Arrays.asList("Tries"), ""),
        new ProblemTemplate("Watermelon", "Arrays", Difficulty.EASY, Platform.CODEFORCES, Arrays.asList("Math", "Strings"), ""),
        new ProblemTemplate("Way Too Long Words", "Strings", Difficulty.EASY, Platform.CODEFORCES, Arrays.asList("Strings"), ""),
        new ProblemTemplate("Chef and Division 3", "Arrays", Difficulty.EASY, Platform.CODECHEF, Arrays.asList("Greedy", "Arrays"), "")
    );

    private static final List<NoteTemplate> NOTES_TEMPLATES = Arrays.asList(
        new NoteTemplate(
            "Mastering Recursion & Call Stacks",
            NoteCategory.DSA_CONCEPT,
            Arrays.asList("recursion", "basics", "callstack"),
            "### Understanding Recursion\n\nRecursion occurs when a function calls itself directly or indirectly to solve a smaller instance of the same problem. Every recursive function requires two primary components:\n\n1. **Base Case**: The condition under which the recursion terminates, preventing infinite execution and stack overflow.\n2. **Recursive Step**: The logic where the function invokes itself with updated, smaller inputs.\n\n```java\n// Classic Factorial Example\npublic int factorial(int n) {\n    if (n <= 1) return 1; // Base Case\n    return n * factorial(n - 1); // Recursive Step\n}\n```\n\n#### How the Call Stack Works:\nEach recursive call allocates a new stack frame in memory to store local variables and parameters.\n- **Pushing**: As recursion goes deeper, frames are pushed onto the stack.\n- **Popping**: When the base case is hit, stack frames pop off one-by-one in Last-In-First-Out (LIFO) order, returning evaluations up the chain.\n"
        ),
        new NoteTemplate(
            "Graph Traversals: DFS vs BFS",
            NoteCategory.DSA_CONCEPT,
            Arrays.asList("graphs", "dfs", "bfs"),
            "### DFS vs BFS Traversals\n\nGraphs are non-linear data structures consisting of nodes (vertices) and connections (edges). Navigating these requires systematic traversal algorithms:\n\n| Traversal | Core Data Structure | Search Direction | Best Used For |\n| :--- | :--- | :--- | :--- |\n| **DFS** (Depth-First) | Stack / Recursion | Plunges deep down a branch first | Pathfinding, Cycle detection, Topological sort |\n| **BFS** (Breadth-First) | Queue (FIFO) | Explores neighbor-by-neighbor | Shortest path in unweighted graphs |\n\n#### DFS Implementation:\n```javascript\nfunction dfs(node, visited) {\n  if (visited.has(node)) return;\n  visited.add(node);\n  console.log(node);\n  for (let neighbor of node.neighbors) {\n    dfs(neighbor, visited);\n  }\n}\n```\n\n#### BFS Implementation:\n```javascript\nfunction bfs(startNode) {\n  const queue = [startNode];\n  const visited = new Set([startNode]);\n  while (queue.length > 0) {\n    const node = queue.shift();\n    console.log(node);\n    for (let neighbor of node.neighbors) {\n      if (!visited.has(neighbor)) {\n        visited.add(neighbor);\n        queue.push(neighbor);\n      }\n    }\n  }\n}\n```\n"
        ),
        new NoteTemplate(
            "Dynamic Programming: Tabulation",
            NoteCategory.DSA_CONCEPT,
            Arrays.asList("dp", "optimization", "tabulation"),
            "### Dynamic Programming (DP) Cheat Sheet\n\nDynamic Programming is an algorithmic technique used to solve complex problems by breaking them down into simpler subproblems, solving each subproblem exactly once, and storing their solutions.\n\n#### Key Prerequisites:\n1. **Overlapping Subproblems**: The same subproblems are solved repeatedly.\n2. **Optimal Substructure**: The optimal solution to the main problem is composed of optimal solutions to its subproblems.\n\n#### Tabulation (Bottom-Up Approach):\nTabulation builds the solution iteratively from the base case up, storing intermediate solutions in a 1D or 2D array. This avoids call stack overhead.\n\n```java\n// Bottom-Up Coin Change\npublic int coinChange(int[] coins, int amount) {\n    int[] dp = new int[amount + 1];\n    Arrays.fill(dp, amount + 1);\n    dp[0] = 0; // Base Case\n    \n    for (int i = 1; i <= amount; i++) {\n        for (int coin : coins) {\n            if (i - coin >= 0) {\n                dp[i] = Math.min(dp[i], 1 + dp[i - coin]);\n            } \n        }\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n}\n```\n"
        ),
        new NoteTemplate(
            "Sliding Window Templates & Patterns",
            NoteCategory.CODE_SNIPPET,
            Arrays.asList("slidingwindow", "templates", "arrays"),
            "### Sliding Window Patterns\n\nThe Sliding Window pattern is used to reduce nested loops (O(N^2)) to linear time complexity (O(N)) on arrays or strings when looking for contiguous subarrays or substrings.\n\n#### Variable Size Sliding Window Template:\n```javascript\nfunction variableSlidingWindow(arr) {\n  let left = 0;\n  let maxLength = 0;\n  const charMap = new Map();\n\n  for (let right = 0; right < arr.length; right++) {\n    // 1. Expand Window by incorporating right element\n    const rightChar = arr[right];\n    charMap.set(rightChar, (charMap.get(rightChar) || 0) + 1);\n\n    // 2. Contract Window from the left if criteria is violated\n    while (isInvalidCondition()) {\n      const leftChar = arr[left];\n      // decrement count or remove left element\n      left++; // shrink window\n    } \n\n    // 3. Update Result\n    maxLength = Math.max(maxLength, right - left + 1);\n  }\n  return maxLength;\n}\n```\n"
        )
    );

    @Transactional
    public void seedDataForUser(String userId) {
        // Seed Notes (Problems start at 0 so new user dashboards start empty)
        if (noteRepository.countByUserId(userId) == 0) {
            for (int i = 0; i < NOTES_TEMPLATES.size(); i++) {
                NoteTemplate template = NOTES_TEMPLATES.get(i);
                boolean pinned = (i == 0); // Pin first note to top

                Note note = Note.builder()
                    .id(UUID.randomUUID().toString())
                    .userId(userId)
                    .title(template.title)
                    .content(template.content)
                    .category(template.category)
                    .tags(new ArrayList<>(template.tags))
                    .pinned(pinned)
                    .isAttachment(false)
                    .build();

                noteRepository.save(note);
            }
        }

        // Seed 100+ preset DSA problems as UNSOLVED for the user!
        if (problemRepository.findByUserId(userId).isEmpty()) {
            for (int i = 0; i < PROBLEMS_TEMPLATES.size(); i++) {
                ProblemTemplate template = PROBLEMS_TEMPLATES.get(i);
                
                String problemLink = template.platform == Platform.LEETCODE
                    ? "https://leetcode.com/problems/" + template.name.toLowerCase().replace(" ", "-") + "/"
                    : template.platform == Platform.GFG
                        ? "https://practice.geeksforgeeks.org/problems/" + template.name.toLowerCase().replace(" ", "-") + "/"
                        : template.platform == Platform.CODEFORCES
                            ? "https://codeforces.com/problemset/problem/" + template.name.toLowerCase().replace(" ", "-") + "/"
                            : "https://codechef.com/problems/" + template.name.toLowerCase().replace(" ", "-") + "/";

                Problem problem = Problem.builder()
                    .id(UUID.randomUUID().toString())
                    .userId(userId)
                    .problemName(template.name)
                    .platform(template.platform)
                    .difficulty(template.difficulty)
                    .topic(template.topic)
                    .tags(new ArrayList<>(template.tags))
                    .timeTaken(0)
                    .notes("")
                    .problemLink(problemLink)
                    .revisionNeeded(false)
                    .status(ProblemStatus.UNSOLVED) // Starts as UNSOLVED (stats initially 0!)
                    .build();

                problemRepository.save(problem);
            }
        }
    }
}
