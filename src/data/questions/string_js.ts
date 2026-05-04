import { Question } from '../../types';

const questions: Question[] = [
{ id:"sj1", level:"beginner", q:'Reverse a string without using built-in reverse().\nExample: "hello" → "olleh"', a:`// Method 1: Loop
function reverseString(str) {
  let result = '';
  for (let i = str.length - 1; i >= 0; i--) {
    result += str[i];
  }
  return result;
}

// Method 2: Two pointers on array
function reverseString2(str) {
  const arr = str.split('');
  let l = 0, r = arr.length - 1;
  while (l < r) {
    [arr[l], arr[r]] = [arr[r], arr[l]];
    l++; r--;
  }
  return arr.join('');
}

// Method 3: Spread + reduce
const reverse = str => [...str].reduce((acc, c) => c + acc, '');

console.log(reverseString("hello")); // "olleh"` },
  { id:"sj2", level:"beginner", q:'Check if a string is a palindrome.\nExample: "racecar" → true, "hello" → false', a:`// Method 1: Compare with reverse
function isPalindrome(str) {
  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === [...clean].reverse().join('');
}

// Method 2: Two pointers (O(n) time, O(1) space)
function isPalindrome2(str) {
  const s = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  let l = 0, r = s.length - 1;
  while (l < r) {
    if (s[l] !== s[r]) return false;
    l++; r--;
  }
  return true;
}

isPalindrome("A man, a plan, a canal: Panama"); // true
isPalindrome("racecar"); // true` },
  { id:"sj3", level:"beginner", q:'Count the occurrence of each character in a string.\nExample: "hello" → { h:1, e:1, l:2, o:1 }', a:`function charCount(str) {
  const count = {};
  for (const char of str) {
    count[char] = (count[char] || 0) + 1;
  }
  return count;
}

// Using reduce:
const charCount2 = str =>
  [...str].reduce((acc, c) => ({ ...acc, [c]: (acc[c] || 0) + 1 }), {});

// ES2022 Map approach (preserves insertion order):
function charCountMap(str) {
  const map = new Map();
  for (const c of str) map.set(c, (map.get(c) || 0) + 1);
  return map;
}

charCount("hello"); // { h:1, e:1, l:2, o:1 }` },
  { id:"sj4", level:"beginner", q:'Check if two strings are anagrams.\nExample: "listen" and "silent" → true', a:`// Method 1: Sort both strings and compare
function isAnagram(s1, s2) {
  if (s1.length !== s2.length) return false;
  const sort = s => s.toLowerCase().split('').sort().join('');
  return sort(s1) === sort(s2);
}

// Method 2: Character frequency map (O(n), better)
function isAnagram2(s1, s2) {
  if (s1.length !== s2.length) return false;
  const count = {};
  for (const c of s1) count[c] = (count[c] || 0) + 1;
  for (const c of s2) {
    if (!count[c]) return false;
    count[c]--;
  }
  return true;
}

isAnagram("listen", "silent"); // true
isAnagram("hello", "world");   // false` },
  { id:"sj5", level:"intermediate", q:'Find all unique permutations of a string.\nExample: "abc" → ["abc","acb","bac","bca","cab","cba"]', a:`function permutations(str) {
  const result = [];
  
  function permute(current, remaining) {
    if (remaining.length === 0) {
      result.push(current);
      return;
    }
    const seen = new Set();
    for (let i = 0; i < remaining.length; i++) {
      const char = remaining[i];
      if (seen.has(char)) continue; // skip duplicates
      seen.add(char);
      permute(
        current + char,
        remaining.slice(0, i) + remaining.slice(i + 1)
      );
    }
  }
  
  permute('', str);
  return result;
}

permutations("abc").length; // 6
permutations("aab").length; // 3 (unique)` },
  { id:"sj6", level:"intermediate", q:'Find the longest substring without repeating characters.\nExample: "abcabcbb" → 3 ("abc")', a:`// Sliding window approach — O(n)
function lengthOfLongestSubstring(s) {
  const seen = new Map(); // char → last index
  let maxLen = 0;
  let left = 0;
  
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    
    // If char was seen and is within current window
    if (seen.has(char) && seen.get(char) >= left) {
      left = seen.get(char) + 1; // shrink window from left
    }
    
    seen.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  
  return maxLen;
}

lengthOfLongestSubstring("abcabcbb"); // 3
lengthOfLongestSubstring("pwwkew");   // 3 ("wke")
lengthOfLongestSubstring("bbbbb");    // 1` },
  { id:"sj7", level:"intermediate", q:'Implement a function to check if parentheses, brackets, and braces are balanced.\nExample: "{[()]}" → true, "{[(])}" → false', a:`function isBalanced(str) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const open = new Set(['(', '[', '{']);
  
  for (const char of str) {
    if (open.has(char)) {
      stack.push(char);
    } else if (pairs[char]) {
      if (stack.pop() !== pairs[char]) return false;
    }
  }
  
  return stack.length === 0;
}

isBalanced("{[()]}");  // true
isBalanced("{[(])}");  // false
isBalanced("((()))");  // true
isBalanced("(");       // false` },
  { id:"sj8", level:"intermediate", q:'Convert a string to camelCase.\nExample: "hello world foo" → "helloWorldFoo", "hello-world" → "helloWorld"', a:`function toCamelCase(str) {
  return str
    .toLowerCase()
    .replace(/[-_\s]+(.)/g, (_, char) => char.toUpperCase());
}

// More explicit version:
function toCamelCase2(str) {
  const words = str.split(/[-_\s]+/);
  return words[0].toLowerCase() +
    words.slice(1).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join('');
}

toCamelCase("hello world foo"); // "helloWorldFoo"
toCamelCase("hello-world");     // "helloWorld"
toCamelCase("HELLO_WORLD");     // "helloWorld"` },
  { id:"sj9", level:"intermediate", q:'Find the first non-repeating character in a string.\nExample: "leetcode" → "l", "aabb" → ""', a:`// O(n) — two passes
function firstNonRepeating(str) {
  const count = {};
  for (const c of str) count[c] = (count[c] || 0) + 1;
  for (const c of str) if (count[c] === 1) return c;
  return '';
}

// Using Map (preserves insertion order):
function firstNonRepeating2(str) {
  const map = new Map();
  for (const c of str) map.set(c, (map.get(c) || 0) + 1);
  for (const [char, count] of map) if (count === 1) return char;
  return '';
}

firstNonRepeating("leetcode"); // "l"
firstNonRepeating("loveleetcode"); // "v"
firstNonRepeating("aabb"); // ""` },
  { id:"sj10", level:"advanced", q:'Implement a basic string compression.\nExample: "aabcccdddd" → "a2b1c3d4". If compressed is longer, return original.', a:`function compress(str) {
  if (!str.length) return str;
  
  let result = '';
  let count = 1;
  
  for (let i = 1; i <= str.length; i++) {
    if (i < str.length && str[i] === str[i - 1]) {
      count++;
    } else {
      result += str[i - 1] + count;
      count = 1;
    }
  }
  
  return result.length < str.length ? result : str;
}

compress("aabcccdddd"); // "a2b1c3d4"
compress("abcd");       // "abcd" (compressed would be longer)
compress("aaaa");       // "a4"` },
  { id:"sj11", level:"advanced", q:'Find all substrings that are palindromes.\nExample: "aab" → ["a","a","aa","b"]', a:`// Expand around center approach
function palindromicSubstrings(s) {
  const result = [];
  
  function expand(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      result.push(s.slice(left, right + 1));
      left--;
      right++;
    }
  }
  
  for (let i = 0; i < s.length; i++) {
    expand(i, i);     // odd-length palindromes
    expand(i, i + 1); // even-length palindromes
  }
  
  return result.sort();
}

// Just count (LeetCode 647):
function countPalindromicSubstrings(s) {
  let count = 0;
  const expand = (l, r) => { while (l >= 0 && r < s.length && s[l] === s[r]) { count++; l--; r++; } };
  for (let i = 0; i < s.length; i++) { expand(i, i); expand(i, i+1); }
  return count;
}

palindromicSubstrings("aab"); // ["a","a","aa","b"]` },
  { id:"sj12", level:"advanced", q:'Implement a function to find the longest common prefix of an array of strings.\nExample: ["flower","flow","flight"] → "fl"', a:`// Sort + compare first and last
function longestCommonPrefix(strs) {
  if (!strs.length) return '';
  strs.sort();
  const first = strs[0];
  const last = strs[strs.length - 1];
  let i = 0;
  while (i < first.length && first[i] === last[i]) i++;
  return first.slice(0, i);
}

// Alternative: Vertical scanning
function longestCommonPrefix2(strs) {
  if (!strs.length) return '';
  for (let i = 0; i < strs[0].length; i++) {
    const char = strs[0][i];
    for (let j = 1; j < strs.length; j++) {
      if (strs[j][i] !== char) return strs[0].slice(0, i);
    }
  }
  return strs[0];
}

longestCommonPrefix(["flower","flow","flight"]); // "fl"
longestCommonPrefix(["dog","racecar","car"]);     // ""` },
  { id:"sj13", level:"advanced", q:'Given a string, find all words that can be formed using only unique characters (no repeats).\nWrite a function: uniqueCharWords(sentence)', a:`function uniqueCharWords(sentence) {
  return sentence.split(' ').filter(word => {
    const lower = word.toLowerCase().replace(/[^a-z]/g, '');
    return new Set(lower).size === lower.length;
  });
}

// Checking unique chars without Set:
function hasAllUnique(word) {
  const seen = {};
  for (const c of word) {
    if (seen[c]) return false;
    seen[c] = true;
  }
  return true;
}

function uniqueCharWords2(sentence) {
  return sentence.split(' ').filter(hasAllUnique);
}

uniqueCharWords("Hello world cat"); // ["world", "cat"]
// "Hello" has repeated 'l', so excluded.` },
  { id:"sj14", level:"advanced", q:'Implement atoi (string to integer) — handle sign, whitespace, overflow, non-numeric chars.', a:`function myAtoi(str) {
  const INT_MAX = 2 ** 31 - 1;  // 2147483647
  const INT_MIN = -(2 ** 31);   // -2147483648
  
  let i = 0;
  // Step 1: Skip leading whitespace
  while (i < str.length && str[i] === ' ') i++;
  
  // Step 2: Handle sign
  let sign = 1;
  if (str[i] === '+') { i++; }
  else if (str[i] === '-') { sign = -1; i++; }
  
  // Step 3: Read digits
  let result = 0;
  while (i < str.length && str[i] >= '0' && str[i] <= '9') {
    result = result * 10 + (str[i].charCodeAt(0) - 48);
    i++;
    // Early overflow check
    if (result * sign > INT_MAX) return INT_MAX;
    if (result * sign < INT_MIN) return INT_MIN;
  }
  
  return Math.max(INT_MIN, Math.min(INT_MAX, result * sign));
}

myAtoi("  -42");     // -42
myAtoi("4193words"); // 4193
myAtoi("words123");  // 0` },
  { id:"sj15", level:"expert", q:'Implement a function to find the minimum window substring.\nGiven s="ADOBECODEBANC", t="ABC" → return "BANC"', a:`// Sliding window — O(n)
function minWindow(s, t) {
  const need = {};
  for (const c of t) need[c] = (need[c] || 0) + 1;
  
  let have = 0, required = Object.keys(need).length;
  let left = 0, minLen = Infinity, minStart = 0;
  const window = {};
  
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    window[c] = (window[c] || 0) + 1;
    
    if (need[c] && window[c] === need[c]) have++;
    
    // Shrink window from left when we have all required chars
    while (have === required) {
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        minStart = left;
      }
      window[s[left]]--;
      if (need[s[left]] && window[s[left]] < need[s[left]]) have--;
      left++;
    }
  }
  
  return minLen === Infinity ? '' : s.slice(minStart, minStart + minLen);
}

minWindow("ADOBECODEBANC", "ABC"); // "BANC"
minWindow("a", "a");               // "a"
minWindow("a", "aa");              // ""` },
  { id:"sj16", level:"expert", q:'Implement wildcard pattern matching: "?" matches any single char, "*" matches any sequence.\nExample: s="adceb", p="*a*b" → true', a:`// Dynamic programming — O(m*n)
function isMatch(s, p) {
  const m = s.length, n = p.length;
  // dp[i][j] = does s[0..i-1] match p[0..j-1]?
  const dp = Array.from({length: m+1}, () => new Array(n+1).fill(false));
  dp[0][0] = true;
  
  // Handle patterns like "***" matching empty string
  for (let j = 1; j <= n; j++) {
    if (p[j-1] === '*') dp[0][j] = dp[0][j-1];
  }
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j-1] === '*') {
        dp[i][j] = dp[i-1][j] || dp[i][j-1];
        // dp[i-1][j]: * matches one char
        // dp[i][j-1]: * matches empty
      } else if (p[j-1] === '?' || s[i-1] === p[j-1]) {
        dp[i][j] = dp[i-1][j-1];
      }
    }
  }
  
  return dp[m][n];
}

isMatch("adceb", "*a*b"); // true
isMatch("acdcb", "a*c?b"); // false` },
  { id:"sj17", level:"expert", q:'Implement a basic regex matcher that supports "." (any char) and "*" (zero or more of preceding).\nExample: s="aab", p="c*a*b" → true', a:`// Recursive with memoization
function isMatch(s, p) {
  const memo = new Map();
  
  function dp(i, j) {
    const key = i + ',' + j;
    if (memo.has(key)) return memo.get(key);
    
    if (j === p.length) return i === s.length;
    
    const firstMatch = i < s.length && (p[j] === '.' || p[j] === s[i]);
    
    let result;
    if (j + 1 < p.length && p[j + 1] === '*') {
      // '*' matches zero (skip pattern) OR matches one and advance s
      result = dp(i, j + 2) || (firstMatch && dp(i + 1, j));
    } else {
      result = firstMatch && dp(i + 1, j + 1);
    }
    
    memo.set(key, result);
    return result;
  }
  
  return dp(0, 0);
}

isMatch("aa", "a*");    // true
isMatch("ab", ".*");    // true
isMatch("aab", "c*a*b"); // true
isMatch("mississippi", "mis*is*p*."); // false` },
  { id:"sj18", level:"expert", q:'Find the longest palindromic substring.\nExample: "babad" → "bab" or "aba"', a:`// Expand around center — O(n^2) time, O(1) space
function longestPalindrome(s) {
  let start = 0, maxLen = 0;
  
  function expand(l, r) {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      if (r - l + 1 > maxLen) {
        maxLen = r - l + 1;
        start = l;
      }
      l--; r++;
    }
  }
  
  for (let i = 0; i < s.length; i++) {
    expand(i, i);     // odd-length
    expand(i, i + 1); // even-length
  }
  
  return s.slice(start, start + maxLen);
}

// O(n) Manacher's algorithm exists but expand-around-center suffices for interviews.
longestPalindrome("babad");  // "bab"
longestPalindrome("cbbd");   // "bb"
longestPalindrome("racecar"); // "racecar"` },
  { id:"sj19", level:"intermediate", q:'Remove duplicate characters from a string, keeping only the first occurrence.\nExample: "programming" → "progamin"', a:`// Method 1: Set (preserves insertion order in JS)
function removeDuplicates(str) {
  return [...new Set(str)].join('');
}

// Method 2: Manual tracking
function removeDuplicates2(str) {
  const seen = new Set();
  let result = '';
  for (const c of str) {
    if (!seen.has(c)) {
      seen.add(c);
      result += c;
    }
  }
  return result;
}

removeDuplicates("programming"); // "progamin"
removeDuplicates("hello world"); // "helo wrd"` },
  { id:"sj20", level:"advanced", q:'Implement a function to group anagrams together.\nExample: ["eat","tea","tan","ate","nat","bat"] → [["eat","tea","ate"],["tan","nat"],["bat"]]', a:`// Sort each word as key — O(n * k log k) where k = max word length
function groupAnagrams(strs) {
  const map = new Map();
  
  for (const str of strs) {
    const key = str.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(str);
  }
  
  return [...map.values()];
}

// Alternative: Count-based key (O(n*k), no sorting)
function groupAnagrams2(strs) {
  const map = new Map();
  for (const str of strs) {
    const count = new Array(26).fill(0);
    for (const c of str) count[c.charCodeAt(0) - 97]++;
    const key = count.join(',');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(str);
  }
  return [...map.values()];
}

groupAnagrams(["eat","tea","tan","ate","nat","bat"]);
// [["eat","tea","ate"],["tan","nat"],["bat"]]` }
];

export default questions;
