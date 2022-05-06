const fs = require('fs')
process.stdin.setEncoding('utf8')

class NewMemo {
  readMemo () {
    const jsonMemo = fs.readFileSync('./memo_list.json', 'utf8')
    return JSON.parse(jsonMemo)
  }

  createMemo () {
    process.stdin.on('data', async input => {
      const memoObject = { content: input }
      const memos = await this.readMemo()
      memos.push(memoObject)
      const newMemos = JSON.stringify(memos)
      fs.writeFileSync('./memo_list.json', newMemos)
    })
  }
}

new NewMemo().createMemo()
