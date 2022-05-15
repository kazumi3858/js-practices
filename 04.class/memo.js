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

  listFirstLines () {
    this.memos.forEach(memo => console.log(memo.name))
  }

  listChoices (action) {
    return new Select({
      message: `Choose a note you want to ${action}`,
      choices: this.memos,
      result () {
        return this.selected
      }
    })
  }

  showDetails () {
    this.listChoices('see').run()
      .then(answer => {
        this.memos.forEach(memo => {
          if (memo.time === answer.time) {
            console.log(memo.content)
          }
        })
      })
      .catch(console.error)
  }

  deleteMemo () {
    this.listChoices('delete').run()
      .then(answer => {
        const memos = this.memos.map(memo => (({ name, content, time }) => ({ name, content, time }))(memo))
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

  runApp (option) {
    if (this.memos.length === 0) {
      console.log('Not found.')
    } else {
      switch (option) {
        case '-l':
          this.listFirstLines()
          break
        case '-r':
          this.showDetails()
          break
        case '-d':
          this.deleteMemo()
          break
        default:
          console.log('Please type a correct option.')
      }
    }
  }
}

const file = './memo_list.json'
const option = process.argv[2]

if (option) {
  new MemoApp(file).runApp(option)
} else {
  Memo.createMemo(file)
}
