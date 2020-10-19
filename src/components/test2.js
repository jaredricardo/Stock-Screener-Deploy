const util = require('util')
const data = require('../common_stocks/test.json')

class TrieNode {
  constructor(key, value) {
    if (value === undefined) value = null

    this.key = key
    this.value = value
    this.children = {}
    this.terminal = false
  }

  static _build(node, letters) {
    if (letters.length === 0) {
      node.terminal = true
    } else {
      const l = letters[0]
      const next = node.children.hasOwnProperty(l) ? node.children[l]: new TrieNode(l)
      node.children[l] = next
      TrieNode._build(next, letters.slice(1))
    }
  }

  static fromList(list) {
    const root = new TrieNode(null)
    list.forEach(word => {
      TrieNode._build(root, word.split(''))
    })

    return root
  }

  _suggestions(prefix) {
    return Object.values(this.children).reduce((list, child) => {
      return list.concat(child._suggestions(prefix + child.key))
    }, this.terminal ? [prefix] : [])
  }

  _traverse(prefix) {
    if (prefix.length === 0) return this
    const l = prefix[0]
    if (!this.children.hasOwnProperty(l)) return null
    return this.children[l]._traverse(prefix.slice(1))
  }

  suggestions(prefix) {
    const node = this._traverse(prefix)
    if (node === null) return []
    return node._suggestions(prefix)
  }
}

// const words  = ['to', 'te', 'tea', 'ted', 'ten', 'a', 'inn']
// const trie = TrieNode.fromList(words)
// console.log(util.inspect(trie, {showHidden: true, depth: null}))
// console.log('t', trie.suggestions('a'))
// console.log('te', trie.suggestions('te'))
// console.log('ten', trie.suggestions('ten'))
// console.log('in', trie.suggestions('in'))
// console.log('a', trie.suggestions('a'))

const arr = []

const createArr = (data) => {
  for(i = 0; i < data.length; i++) {
    arr.push(data[i]["Symbol"])
  }
  return arr
}

createArr(data)



const trie = TrieNode.fromList(arr)
console.log(util.inspect(trie, {showHidden: true, depth: null}))
console.log('a', trie.suggestions('a'))
console.log('a', trie.suggestions('b'))
console.log('ab', trie.suggestions('abc'))
console.log('a', trie.suggestions('aa'))
console.log('a', trie.suggestions('al'))


