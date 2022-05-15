const fs = require('fs')
const { Select } = require('enquirer')
process.stdin.setEncoding('utf8')

class Memo {
  constructor (name, content, time) {
    this.name = name
    this.content = content
    this.time = time
  }

  static all (file) {
    const jsonFile = fs.readFileSync(file, 'utf8')
    return JSON.parse(jsonFile).map(memo => new Memo(memo.name, memo.content, memo.time))
  }

  static createMemo (file) {
    process.stdin.on('data', async input => {
      const name = input.trim().split('\n')[0]
      const content = input.trim()
      const time = new Date().getTime()
      const memos = await this.all(file)
      memos.push(new Memo(name, content, time))
      fs.writeFileSync(file, JSON.stringify(memos))
    })
  }
}

class MemoApp {
  constructor (file) {
    this.file = file
    this.memos = Memo.all(file)
  }

  showFirstLines () {
    if (this.memos.length === 0) {
      console.log('Not found.')
    } else {
      this.memos.forEach(memo => console.log(memo.name))
    }
  }

  createChoices (action) {
    return new Select({
      name: 'time',
      message: `Choose a note you want to ${action}`,
      choices: this.memos,
      result () {
        return this.selected
      }
    })
  }

  showDetails () {
    if (this.memos.length === 0) {
      console.log('Not found.')
    } else {
      this.createChoices('see').run()
        .then(answer => {
          this.memos.forEach(memo => {
            if (memo.time === answer.time) {
              console.log(memo.content)
            }
          })
        })
        .catch(console.error)
    }
  }

  deleteMemo () {
    if (this.memos.length === 0) {
      console.log('Not found.')
    } else {
      this.createChoices('delete').run()
        .then(answer => {
          const memos = this.memos.map (memo => (({name, content, time}) => ({name, content, time}))(memo))
          memos.forEach((memo, index) => {
            if (memo.time === answer.time) {
              memos.splice(index, 1)
              fs.writeFileSync(this.file, JSON.stringify(memos))
              console.log('The note has been deleted.')
            }
          })
        })
        .catch(console.error)
    }
  }
}

const file = './memo_list.json'
const memoApp = new MemoApp(file)

switch (process.argv[2]) {
  case undefined:
    Memo.createMemo(file)
    break
  case '-l':
    memoApp.showFirstLines()
    break
  case '-r':
    memoApp.showDetails()
    break
  case '-d':
    memoApp.deleteMemo()
}
