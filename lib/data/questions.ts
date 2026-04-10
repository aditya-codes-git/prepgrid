export interface Problem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: {
    python: string;
    javascript: string;
    java: string;
  };
}

export const problems: Problem[] = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Array",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    starterCode: {
      python: "class Solution:\n    def twoSum(self, nums, target):\n        # Write your code here\n        pass",
      javascript: "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n    // Write your code here\n}",
      java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n}"
    }
  },
  {
    id: 2,
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    topic: "Array",
    description: "You are given an array prices where `prices[i]` is the price of a given stock on the `ith` day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
    examples: [
      { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5." },
      { input: "prices = [7,6,4,3,1]", output: "0" }
    ],
    constraints: [
      "1 <= prices.length <= 10^5",
      "0 <= prices[i] <= 10^4"
    ],
    starterCode: {
      python: "class Solution:\n    def maxProfit(self, prices):\n        # Write your code here\n        pass",
      javascript: "/**\n * @param {number[]} prices\n * @return {number}\n */\nfunction maxProfit(prices) {\n    // Write your code here\n}",
      java: "class Solution {\n    public int maxProfit(int[] prices) {\n        // Write your code here\n        return 0;\n    }\n}"
    }
  },
  {
    id: 3,
    title: "Contains Duplicate",
    difficulty: "Easy",
    topic: "Array",
    description: "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
    examples: [
      { input: "nums = [1,2,3,1]", output: "true" },
      { input: "nums = [1,2,3,4]", output: "false" }
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9"
    ],
    starterCode: {
      python: "class Solution:\n    def containsDuplicate(self, nums):\n        # Write your code here\n        pass",
      javascript: "/**\n * @param {number[]} nums\n * @return {boolean}\n */\nfunction containsDuplicate(nums) {\n    // Write your code here\n}",
      java: "class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        // Write your code here\n        return false;\n    }\n}"
    }
  },
  {
    id: 4,
    title: "Product of Array Except Self",
    difficulty: "Medium",
    topic: "Array",
    description: "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.\n\nThe product of any prefix or suffix of `nums` is guaranteed to fit in a 32-bit integer.\n\nYou must write an algorithm that runs in O(n) time and without using the division operation.",
    examples: [
      { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" },
      { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]" }
    ],
    constraints: [
      "2 <= nums.length <= 10^5",
      "-30 <= nums[i] <= 30",
      "The product of any prefix or suffix is guaranteed to fit in a 32-bit integer."
    ],
    starterCode: {
      python: "class Solution:\n    def productExceptSelf(self, nums):\n        # Write your code here\n        pass",
      javascript: "/**\n * @param {number[]} nums\n * @return {number[]}\n */\nfunction productExceptSelf(nums) {\n    // Write your code here\n}",
      java: "class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        // Write your code here\n        return new int[]{};\n    }\n}"
    }
  },
  {
    id: 5,
    title: "Maximum Subarray",
    difficulty: "Medium",
    topic: "DP",
    description: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
      { input: "nums = [1]", output: "1" }
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    starterCode: {
      python: "class Solution:\n    def maxSubArray(self, nums):\n        # Write your code here\n        pass",
      javascript: "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction maxSubArray(nums) {\n    // Write your code here\n}",
      java: "class Solution {\n    public int maxSubArray(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}"
    }
  },
  {
    id: 6,
    title: "Maximum Product Subarray",
    difficulty: "Medium",
    topic: "DP",
    description: "Given an integer array `nums`, find a subarray that has the largest product, and return the product.\n\nThe test cases are generated so that the answer will fit in a 32-bit integer.",
    examples: [
      { input: "nums = [2,3,-2,4]", output: "6", explanation: "[2,3] has the largest product 6." },
      { input: "nums = [-2,0,-1]", output: "0" }
    ],
    constraints: [
      "1 <= nums.length <= 2 * 10^4",
      "-10 <= nums[i] <= 10"
    ],
    starterCode: {
      python: "class Solution:\n    def maxProduct(self, nums):\n        # Write your code here\n        pass",
      javascript: "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction maxProduct(nums) {\n    // Write your code here\n}",
      java: "class Solution {\n    public int maxProduct(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}"
    }
  },
  {
    id: 7,
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "Medium",
    topic: "Array",
    description: "Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Given the sorted rotated array `nums` of unique elements, return the minimum element of this array.\n\nYou must write an algorithm that runs in O(log n) time.",
    examples: [
      { input: "nums = [3,4,5,1,2]", output: "1" },
      { input: "nums = [4,5,6,7,0,1,2]", output: "0" }
    ],
    constraints: [
      "n == nums.length",
      "1 <= n <= 5000",
      "-5000 <= nums[i] <= 5000",
      "All the integers of nums are unique."
    ],
    starterCode: {
      python: "class Solution:\n    def findMin(self, nums):\n        # Write your code here\n        pass",
      javascript: "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findMin(nums) {\n    // Write your code here\n}",
      java: "class Solution {\n    public int findMin(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}"
    }
  },
  {
    id: 8,
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    topic: "Array",
    description: "There is an integer array `nums` sorted in ascending order (with distinct values).\n\nPrior to being passed to your function, `nums` is possibly rotated at an unknown pivot index k. Given the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or -1 if it is not in `nums`.\n\nYou must write an algorithm with O(log n) runtime complexity.",
    examples: [
      { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" },
      { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1" }
    ],
    constraints: [
      "1 <= nums.length <= 5000",
      "-10^4 <= nums[i] <= 10^4",
      "All values of nums are unique."
    ],
    starterCode: {
      python: "class Solution:\n    def search(self, nums, target):\n        # Write your code here\n        pass",
      javascript: "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number}\n */\nfunction search(nums, target) {\n    // Write your code here\n}",
      java: "class Solution {\n    public int search(int[] nums, int target) {\n        // Write your code here\n        return -1;\n    }\n}"
    }
  },
  {
    id: 9,
    title: "3Sum",
    difficulty: "Medium",
    topic: "Array",
    description: "Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets.",
    examples: [
      { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" },
      { input: "nums = [0,1,1]", output: "[]" }
    ],
    constraints: [
      "3 <= nums.length <= 3000",
      "-10^5 <= nums[i] <= 10^5"
    ],
    starterCode: {
      python: "class Solution:\n    def threeSum(self, nums):\n        # Write your code here\n        pass",
      javascript: "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction threeSum(nums) {\n    // Write your code here\n}",
      java: "class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}"
    }
  },
  {
    id: 10,
    title: "Container With Most Water",
    difficulty: "Medium",
    topic: "Array",
    description: "You are given an integer array `height` of length n. There are n vertical lines drawn such that the two endpoints of the `ith` line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.",
    examples: [
      { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" },
      { input: "height = [1,1]", output: "1" }
    ],
    constraints: [
      "n == height.length",
      "2 <= n <= 10^5",
      "0 <= height[i] <= 10^4"
    ],
    starterCode: {
      python: "class Solution:\n    def maxArea(self, height):\n        # Write your code here\n        pass",
      javascript: "/**\n * @param {number[]} height\n * @return {number}\n */\nfunction maxArea(height) {\n    // Write your code here\n}",
      java: "class Solution {\n    public int maxArea(int[] height) {\n        // Write your code here\n        return 0;\n    }\n}"
    }
  },
  {
    id: 11,
    title: "Missing Number",
    difficulty: "Easy",
    topic: "Bit Manipulation",
    description: "Given an array `nums` containing n distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.",
    examples: [
      { input: "nums = [3,0,1]", output: "2" },
      { input: "nums = [0,1]", output: "2" }
    ],
    constraints: [
      "n == nums.length",
      "1 <= n <= 10^4",
      "0 <= nums[i] <= n",
      "All the numbers of nums are unique."
    ],
    starterCode: {
      python: "class Solution:\n    def missingNumber(self, nums):\n        # Write your code here\n        pass",
      javascript: "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction missingNumber(nums) {\n    // Write your code here\n}",
      java: "class Solution {\n    public int missingNumber(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}"
    }
  },
  {
    id: 12,
    title: "Reverse Linked List",
    difficulty: "Easy",
    topic: "Linked List",
    description: "Given the `head` of a singly linked list, reverse the list, and return the reversed list.",
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
      { input: "head = []", output: "[]" }
    ],
    constraints: [
      "The number of nodes in the list is the range [0, 5000].",
      "-5000 <= Node.val <= 5000"
    ],
    starterCode: {
      python: "class Solution:\n    def reverseList(self, head):\n        # Write your code here\n        pass",
      javascript: "/**\n * @param {ListNode} head\n * @return {ListNode}\n */\nfunction reverseList(head) {\n    // Write your code here\n}",
      java: "class Solution {\n    public ListNode reverseList(ListNode head) {\n        // Write your code here\n        return null;\n    }\n}"
    }
  },
  {
    id: 13,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    topic: "Linked List",
    description: "You are given the heads of two sorted linked lists `list1` and `list2`.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.",
    examples: [
      { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" },
      { input: "list1 = [], list2 = []", output: "[]" }
    ],
    constraints: [
      "The number of nodes in both lists is in the range [0, 50].",
      "-100 <= Node.val <= 100",
      "Both list1 and list2 are sorted in non-decreasing order."
    ],
    starterCode: {
      python: "class Solution:\n    def mergeTwoLists(self, list1, list2):\n        # Write your code here\n        pass",
      javascript: "/**\n * @param {ListNode} list1\n * @param {ListNode} list2\n * @return {ListNode}\n */\nfunction mergeTwoLists(list1, list2) {\n    // Write your code here\n}",
      java: "class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        // Write your code here\n        return null;\n    }\n}"
    }
  },
  {
    id: 14,
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    topic: "Linked List",
    description: "You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it.",
    examples: [
      { input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" },
      { input: "lists = []", output: "[]" }
    ],
    constraints: [
      "k == lists.length",
      "0 <= k <= 10^4",
      "0 <= lists[i].length <= 500",
      "-10^4 <= lists[i][j] <= 10^4"
    ],
    starterCode: {
      python: "class Solution:\n    def mergeKLists(self, lists):\n        # Write your code here\n        pass",
      javascript: "/**\n * @param {ListNode[]} lists\n * @return {ListNode}\n */\nfunction mergeKLists(lists) {\n    // Write your code here\n}",
      java: "class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        // Write your code here\n        return null;\n    }\n}"
    }
  },
  {
    id: 15,
    title: "Valid Parentheses",
    difficulty: "Easy",
    topic: "String",
    description: "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    examples: [
      { input: "s = \"()\"", output: "true" },
      { input: "s = \"()[]{}\"", output: "true" },
      { input: "s = \"(]\"", output: "false" }
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    starterCode: {
      python: "class Solution:\n    def isValid(self, s):\n        # Write your code here\n        pass",
      javascript: "/**\n * @param {string} s\n * @return {boolean}\n */\nfunction isValid(s) {\n    // Write your code here\n}",
      java: "class Solution {\n    public boolean isValid(String s) {\n        // Write your code here\n        return false;\n    }\n}"
    }
  },
  {
    id: 16,
    title: "Valid Anagram",
    difficulty: "Easy",
    topic: "String",
    description: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    examples: [
      { input: "s = \"anagram\", t = \"nagaram\"", output: "true" },
      { input: "s = \"rat\", t = \"car\"", output: "false" }
    ],
    constraints: [
      "1 <= s.length, t.length <= 5 * 10^4",
      "s and t consist of lowercase English letters."
    ],
    starterCode: {
      python: "class Solution:\n    def isAnagram(self, s, t):\n        # Write your code here\n        pass",
      javascript: "/**\n * @param {string} s\n * @param {string} t\n * @return {boolean}\n */\nfunction isAnagram(s, t) {\n    // Write your code here\n}",
      java: "class Solution {\n    public boolean isAnagram(String s, String t) {\n        // Write your code here\n        return false;\n    }\n}"
    }
  },
  {
    id: 17,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topic: "String",
    description: "Given a string `s`, find the length of the longest substring without repeating characters.",
    examples: [
      { input: "s = \"abcabcbb\"", output: "3", explanation: "The answer is \"abc\", with the length of 3." },
      { input: "s = \"bbbbb\"", output: "1" }
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    starterCode: {
      python: "class Solution:\n    def lengthOfLongestSubstring(self, s):\n        # Write your code here\n        pass",
      javascript: "/**\n * @param {string} s\n * @return {number}\n */\nfunction lengthOfLongestSubstring(s) {\n    // Write your code here\n}",
      java: "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Write your code here\n        return 0;\n    }\n}"
    }
  },
  {
    id: 18,
    title: "Clone Graph",
    difficulty: "Medium",
    topic: "Graph",
    description: "Given a reference of a node in a connected undirected graph.\n\nReturn a deep copy (clone) of the graph.\n\nEach node in the graph contains a value (`int`) and a list (`List[Node]`) of its neighbors.",
    examples: [
      { input: "adjList = [[2,4],[1,3],[2,4],[1,3]]", output: "[[2,4],[1,3],[2,4],[1,3]]" },
      { input: "adjList = [[]]", output: "[[]]" }
    ],
    constraints: [
      "The number of nodes in the graph is in the range [0, 100].",
      "1 <= Node.val <= 100",
      "Node.val is unique for each node."
    ],
    starterCode: {
      python: "class Solution:\n    def cloneGraph(self, node):\n        # Write your code here\n        pass",
      javascript: "/**\n * @param {Node} node\n * @return {Node}\n */\nfunction cloneGraph(node) {\n    // Write your code here\n}",
      java: "class Solution {\n    public Node cloneGraph(Node node) {\n        // Write your code here\n        return null;\n    }\n}"
    }
  }
];
