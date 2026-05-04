import { Question } from '../../types';

const questions: Question[] = [
{ id:"sc_s1", level:"beginner", q:'Reverse a string in C# — multiple approaches.', a:`// Method 1: Array.Reverse
string Reverse(string s) {
  char[] arr = s.ToCharArray();
  Array.Reverse(arr);
  return new string(arr);
}

// Method 2: LINQ
string Reverse2(string s) => new string(s.Reverse().ToArray());

// Method 3: StringBuilder (efficient for large strings)
string Reverse3(string s) {
  var sb = new StringBuilder(s.Length);
  for (int i = s.Length - 1; i >= 0; i--)
    sb.Append(s[i]);
  return sb.ToString();
}

// Method 4: Two-pointer on Span<char>
string Reverse4(string s) {
  Span<char> chars = s.ToCharArray();
  for (int l = 0, r = chars.Length - 1; l < r; l++, r--)
    (chars[l], chars[r]) = (chars[r], chars[l]);
  return new string(chars);
}` },
  { id:"sc_s2", level:"beginner", q:'Check if a string is a palindrome in C# (case-insensitive, ignore spaces).', a:`bool IsPalindrome(string s) {
  // Clean: lowercase, only alphanumeric
  string clean = new string(
    s.ToLower().Where(char.IsLetterOrDigit).ToArray()
  );
  
  int l = 0, r = clean.Length - 1;
  while (l < r) {
    if (clean[l] != clean[r]) return false;
    l++; r--;
  }
  return true;
}

// Using Span for zero allocation:
bool IsPalindrome2(ReadOnlySpan<char> s) {
  int l = 0, r = s.Length - 1;
  while (l < r) {
    if (s[l] != s[r]) return false;
    l++; r--;
  }
  return true;
}

IsPalindrome("A man a plan a canal Panama"); // true` },
  { id:"sc_s3", level:"intermediate", q:'Count word frequency in a string in C#.', a:`Dictionary<string, int> WordFrequency(string text) {
  return text
    .Split(new[] {' ', '.', ',', '!', '?'}, StringSplitOptions.RemoveEmptyEntries)
    .Select(w => w.ToLower())
    .GroupBy(w => w)
    .ToDictionary(g => g.Key, g => g.Count());
}

// Without LINQ:
Dictionary<string, int> WordFrequency2(string text) {
  var freq = new Dictionary<string, int>();
  foreach (var word in text.ToLower().Split(' '))
  {
    var clean = word.Trim('.', ',', '!');
    if (!string.IsNullOrEmpty(clean))
      freq[clean] = freq.GetValueOrDefault(clean) + 1;
  }
  return freq;
}

WordFrequency("the cat sat on the mat the cat");
// { "the":3, "cat":2, "sat":1, "on":1, "mat":1 }` },
  { id:"sc_s4", level:"intermediate", q:'Check if two strings are anagrams in C# — O(n) approach.', a:`bool AreAnagrams(string s1, string s2) {
  if (s1.Length != s2.Length) return false;
  
  Span<int> count = stackalloc int[26]; // zero-allocation!
  
  for (int i = 0; i < s1.Length; i++) {
    count[s1[i] - 'a']++;
    count[s2[i] - 'a']--;
  }
  
  foreach (var c in count)
    if (c != 0) return false;
    
  return true;
}

// LINQ alternative:
bool AreAnagrams2(string s1, string s2) =>
  s1.Length == s2.Length &&
  s1.OrderBy(c => c).SequenceEqual(s2.OrderBy(c => c));

AreAnagrams("listen", "silent"); // true` },
  { id:"sc_s5", level:"intermediate", q:'Find the longest common prefix among an array of strings in C#.', a:`string LongestCommonPrefix(string[] strs) {
  if (strs.Length == 0) return "";
  
  string prefix = strs[0];
  
  foreach (var s in strs.Skip(1)) {
    while (!s.StartsWith(prefix, StringComparison.Ordinal)) {
      prefix = prefix[..^1]; // remove last char
      if (prefix.Length == 0) return "";
    }
  }
  
  return prefix;
}

// Using Span for efficiency:
string LongestCommonPrefix2(string[] strs) {
  if (!strs.Any()) return "";
  int maxLen = strs.Min(s => s.Length);
  int i = 0;
  while (i < maxLen && strs.All(s => s[i] == strs[0][i])) i++;
  return strs[0][..i];
}

LongestCommonPrefix(["flower","flow","flight"]); // "fl"` },
  { id:"sc_s6", level:"intermediate", q:'Implement string compression in C# (run-length encoding).\nExample: "aabcccdddd" → "a2b1c3d4"', a:`string Compress(string s) {
  if (string.IsNullOrEmpty(s)) return s;
  
  var sb = new StringBuilder();
  int count = 1;
  
  for (int i = 1; i <= s.Length; i++) {
    if (i < s.Length && s[i] == s[i - 1]) {
      count++;
    } else {
      sb.Append(s[i - 1]);
      sb.Append(count);
      count = 1;
    }
  }
  
  string result = sb.ToString();
  return result.Length < s.Length ? result : s;
}

Compress("aabcccdddd"); // "a2b1c3d4"
Compress("abcd");       // "abcd" (not shorter)` },
  { id:"sc_s7", level:"intermediate", q:'Check balanced parentheses in C# using a stack.', a:`bool IsBalanced(string s) {
  var stack = new Stack<char>();
  var pairs = new Dictionary<char, char> {
    [')'] = '(',
    [']'] = '[',
    ['}'] = '{'
  };
  var open = new HashSet<char> { '(', '[', '{' };
  
  foreach (char c in s) {
    if (open.Contains(c)) {
      stack.Push(c);
    } else if (pairs.TryGetValue(c, out char match)) {
      if (!stack.TryPop(out char top) || top != match)
        return false;
    }
  }
  
  return stack.Count == 0;
}

IsBalanced("{[()]}");  // true
IsBalanced("{[(])}");  // false` },
  { id:"sc_s8", level:"advanced", q:'Find all permutations of a string in C#.', a:`IList<string> Permutations(string s) {
  var result = new List<string>();
  PermuteHelper(s.ToCharArray(), 0, result);
  return result;
}

void PermuteHelper(char[] arr, int start, List<string> result) {
  if (start == arr.Length - 1) {
    result.Add(new string(arr));
    return;
  }
  
  var seen = new HashSet<char>(); // for unique permutations
  for (int i = start; i < arr.Length; i++) {
    if (seen.Contains(arr[i])) continue;
    seen.Add(arr[i]);
    
    (arr[start], arr[i]) = (arr[i], arr[start]); // swap
    PermuteHelper(arr, start + 1, result);
    (arr[start], arr[i]) = (arr[i], arr[start]); // swap back
  }
}

Permutations("abc"); // 6 unique permutations
Permutations("aab"); // 3 unique permutations` },
  { id:"sc_s9", level:"advanced", q:'Find the longest substring without repeating characters in C# using sliding window.', a:`int LengthOfLongestSubstring(string s) {
  var lastSeen = new Dictionary<char, int>();
  int maxLen = 0, left = 0;
  
  for (int right = 0; right < s.Length; right++) {
    char c = s[right];
    
    if (lastSeen.TryGetValue(c, out int prevIdx) && prevIdx >= left)
      left = prevIdx + 1;
    
    lastSeen[c] = right;
    maxLen = Math.Max(maxLen, right - left + 1);
  }
  
  return maxLen;
}

// Using Span for character indexing (only for ASCII):
int LongestSubstringAscii(ReadOnlySpan<char> s) {
  Span<int> lastPos = stackalloc int[128];
  lastPos.Fill(-1);
  int maxLen = 0, left = 0;
  for (int i = 0; i < s.Length; i++) {
    int c = s[i];
    if (lastPos[c] >= left) left = lastPos[c] + 1;
    lastPos[c] = i;
    maxLen = Math.Max(maxLen, i - left + 1);
  }
  return maxLen;
}

LengthOfLongestSubstring("abcabcbb"); // 3
LengthOfLongestSubstring("pwwkew");   // 3` },
  { id:"sc_s10", level:"advanced", q:'Parse a CSV line in C# correctly handling quoted fields with commas inside.\nExample: \'name,"city, state",age\' → ["name", "city, state", "age"]', a:`IList<string> ParseCsvLine(string line) {
  var fields = new List<string>();
  var current = new StringBuilder();
  bool inQuotes = false;
  
  for (int i = 0; i < line.Length; i++) {
    char c = line[i];
    
    if (c == '"') {
      if (inQuotes && i + 1 < line.Length && line[i + 1] == '"') {
        // Escaped quote "" → single "
        current.Append('"');
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c == ',' && !inQuotes) {
      fields.Add(current.ToString());
      current.Clear();
    } else {
      current.Append(c);
    }
  }
  
  fields.Add(current.ToString());
  return fields;
}

ParseCsvLine(@"name,""city, state"",age");
// ["name", "city, state", "age"]` },
  { id:"sc_s11", level:"advanced", q:'Implement a trie (prefix tree) in C# for efficient string prefix search.', a:`public class TrieNode {
  public Dictionary<char, TrieNode> Children = new();
  public bool IsEnd;
}

public class Trie {
  private readonly TrieNode _root = new();
  
  public void Insert(string word) {
    var node = _root;
    foreach (char c in word) {
      node.Children.TryGetValue(c, out var child);
      if (child is null) { child = new TrieNode(); node.Children[c] = child; }
      node = child;
    }
    node.IsEnd = true;
  }
  
  public bool Search(string word) {
    var node = Find(word);
    return node is { IsEnd: true };
  }
  
  public bool StartsWith(string prefix) => Find(prefix) is not null;
  
  private TrieNode? Find(string s) {
    var node = _root;
    foreach (char c in s) {
      if (!node.Children.TryGetValue(c, out node)) return null;
    }
    return node;
  }
}

var trie = new Trie();
trie.Insert("apple");
trie.Search("apple");   // true
trie.StartsWith("app"); // true` },
  { id:"sc_s12", level:"expert", q:'Implement KMP (Knuth-Morris-Pratt) string search algorithm in C#.\nFind pattern in text efficiently O(n+m).', a:`// Brute force is O(n*m). KMP is O(n+m).
int[] BuildLPS(string pattern) {
  // Longest Proper Prefix that is also Suffix
  int m = pattern.Length;
  int[] lps = new int[m];
  int len = 0, i = 1;
  
  while (i < m) {
    if (pattern[i] == pattern[len]) {
      lps[i++] = ++len;
    } else if (len > 0) {
      len = lps[len - 1]; // fallback
    } else {
      lps[i++] = 0;
    }
  }
  return lps;
}

List<int> KmpSearch(string text, string pattern) {
  var matches = new List<int>();
  if (pattern.Length == 0) return matches;
  
  int[] lps = BuildLPS(pattern);
  int i = 0, j = 0;
  
  while (i < text.Length) {
    if (text[i] == pattern[j]) { i++; j++; }
    if (j == pattern.Length) {
      matches.Add(i - j); // found at index i-j
      j = lps[j - 1];
    } else if (i < text.Length && text[i] != pattern[j]) {
      j = j > 0 ? lps[j - 1] : 0;
      if (j == 0) i++;
    }
  }
  return matches;
}

KmpSearch("AABAACAADAABAABA", "AABA"); // [0, 9, 12]` },
  { id:"sc_s13", level:"expert", q:'Implement a function to decode a string encoded as k[encoded_string].\nExample: "3[a]2[bc]" → "aaabcbc", "2[abc]3[cd]ef" → "abcabccdcdcdef"', a:`string DecodeString(string s) {
  var countStack = new Stack<int>();
  var strStack = new Stack<string>();
  string current = "";
  int k = 0;
  
  foreach (char c in s) {
    if (char.IsDigit(c)) {
      k = k * 10 + (c - '0'); // handle multi-digit k
    } else if (c == '[') {
      countStack.Push(k);
      strStack.Push(current);
      current = "";
      k = 0;
    } else if (c == ']') {
      int repeat = countStack.Pop();
      string prefix = strStack.Pop();
      var sb = new StringBuilder(prefix);
      for (int i = 0; i < repeat; i++) sb.Append(current);
      current = sb.ToString();
    } else {
      current += c;
    }
  }
  
  return current;
}

DecodeString("3[a]2[bc]");          // "aaabcbc"
DecodeString("3[a2[c]]");           // "accaccacc"
DecodeString("2[abc]3[cd]ef");      // "abcabccdcdcdef"` },
  { id:"sc_s14", level:"expert", q:'Given a string containing words, reverse the words but keep each word\'s characters in order.\nExample: "the sky is blue" → "blue is sky the"', a:`// Method 1: Split and join (simple)
string ReverseWords(string s) =>
  string.Join(' ', s.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries).Reverse());

// Method 2: In-place using Span<char> (interview-grade)
string ReverseWords2(string s) {
  Span<char> chars = s.ToCharArray();
  
  // Step 1: Reverse entire string
  Reverse(chars, 0, chars.Length - 1);
  
  // Step 2: Reverse each word
  int start = 0;
  for (int i = 0; i <= chars.Length; i++) {
    if (i == chars.Length || chars[i] == ' ') {
      Reverse(chars, start, i - 1);
      start = i + 1;
    }
  }
  
  return new string(chars).Trim();
}

void Reverse(Span<char> s, int l, int r) {
  while (l < r) { (s[l], s[r]) = (s[r], s[l]); l++; r--; }
}

ReverseWords("the sky is blue"); // "blue is sky the"` },
  { id:"sc_s15", level:"expert", q:'Find the minimum window substring in C# — given s and t, find the smallest window in s that contains all chars in t.', a:`string MinWindow(string s, string t) {
  if (s.Length == 0 || t.Length == 0) return "";
  
  var need = new Dictionary<char, int>();
  foreach (char c in t) need[c] = need.GetValueOrDefault(c) + 1;
  
  var have = new Dictionary<char, int>();
  int formed = 0, required = need.Count;
  int left = 0, minLen = int.MaxValue, minStart = 0;
  
  for (int right = 0; right < s.Length; right++) {
    char c = s[right];
    have[c] = have.GetValueOrDefault(c) + 1;
    
    if (need.ContainsKey(c) && have[c] == need[c]) formed++;
    
    while (formed == required) {
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        minStart = left;
      }
      char leftChar = s[left++];
      have[leftChar]--;
      if (need.ContainsKey(leftChar) && have[leftChar] < need[leftChar])
        formed--;
    }
  }
  
  return minLen == int.MaxValue ? "" : s.Substring(minStart, minLen);
}

MinWindow("ADOBECODEBANC", "ABC"); // "BANC"` },
],
// ─── EXTRA REACT ───
];

export default questions;
