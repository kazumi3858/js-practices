const fs = require('fs')
process.stdin.setEncoding('utf8')

const jsonMemo = fs.readFileSync('./memo_list.json', 'utf8')
const stringMemo = JSON.parse(jsonMemo)

process.stdin.on('data', input => {
  const memoObject = { content: input }
  stringMemo.push(memoObject)
  const memo = JSON.stringify(stringMemo)
  fs.writeFileSync('./memo_list.json', memo)
})
