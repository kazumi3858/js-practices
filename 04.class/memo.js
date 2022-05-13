const fs = require('fs')
const { Select } = require('enquirer')
process.stdin.setEncoding('utf8')

class Memo {
  constructor (name, content, value) {
    this.name = name
    this.content = content
    this.value = value
  }
}

class MemoApp {
  readMemos () {
    const jsonFile = fs.readFileSync('./memo_list.json', 'utf8')
    return JSON.parse(jsonFile).map(memo => new Memo(memo.name, memo.content, memo.value))
  }

  saveMemo () {
    process.stdin.on('data', async input => {
      const name = input.trim().split('\n')[0]
      const content = input.trim()
      const value = new Date().getTime()
      const memos = await this.readMemos()
      memos.push(new Memo(name, content, value))
      fs.writeFileSync('./memo_list.json', JSON.stringify(memos))
    })
  }

  showFirstLines () {
    const memos = this.readMemos()
    if (memos.length === 0) {
      console.log('Not found.')
    } else {
      memos.forEach(memo => console.log(memo.name))
    }
  }

  createChoices (action) {
    return new Select({
      name: 'value',
      message: `Choose a note you want to ${action}`,
      choices: this.readMemos(),
      result (names) {
        return this.map(names)
      }
    })
  }

  showDetails () {
    const memoChoices = this.createChoices('see')
    if (memoChoices.choices.length === 0) {
      console.log('Not found.')
    } else {
      memoChoices.run()
        .then(answer => {
          memoChoices.choices.forEach(memo => {
            if (memo.value === Object.values(answer)[0]) {
              console.log(memo.content)
            }
          })
        })
        .catch(console.error)
    }
  }

  deleteMemo () {
    const memos = this.readMemos()
    if (memos.length === 0) {
      console.log('Not found.')
    } else {
      this.createChoices('delete').run()
        .then(answer => {
          memos.forEach((memo, index) => {
            if (memo.value === Object.values(answer)[0]) {
              memos.splice(index, 1)
              fs.writeFileSync('./memo_list.json', JSON.stringify(memos))
              console.log('The note has been deleted.')
            }
          })
        })
        .catch(console.error)
    }
  }
}

switch (process.argv[2]) {
  case undefined:
    new MemoApp().saveMemo()
    break
  case '-l':
    new MemoApp().showFirstLines()
    break
  case '-r':
    new MemoApp().showDetails()
    break
  case '-d':
    new MemoApp().deleteMemo()
}
