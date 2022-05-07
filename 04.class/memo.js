const fs = require('fs')
const { Select } = require('enquirer')
process.stdin.setEncoding('utf8')

class SavedMemo {
  readJson = () => {
    const jsonFile = fs.readFileSync('./memo_list.json', 'utf8')
    return JSON.parse(jsonFile)
  }
}

class NewMemo {
  createMemo () {
    process.stdin.on('data', async input => {
      const memoObject = {
        name: input.trim().split('\n')[0],
        content: input.trim(),
        value: new Date().getTime()
      }
      const memos = await new SavedMemo().readJson()
      memos.push(memoObject)
      fs.writeFileSync('./memo_list.json', JSON.stringify(memos))
    })
  }
}

class MemoList {
  showTitles () {
    new SavedMemo().readJson().forEach(memo => console.log(memo.name))
  }
}

class MemoDetails {
  showDetails () {
    const prompt = new Select({
      name: 'value',
      message: 'Choose a note you want to see',
      choices: new SavedMemo().readJson(),
      result (names) {
        return this.map(names)
      }
    })

    prompt.run()
      .then(answer => {
        prompt.choices.forEach(memo => {
          if (memo.value === Object.values(answer)[0]) {
            console.log(memo.content)
          }
        })
      })
      .catch(console.error)
  }
}

class MemoRemoval {
  deleteMemo () {
    const prompt = new Select({
      name: 'value',
      message: 'Choose a note you want to delete',
      choices: new SavedMemo().readJson(),
      result (names) {
        return this.map(names)
      }
    })

    prompt.run()
      .then(answer => {
        const memos = new SavedMemo().readJson()
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

switch (process.argv[2]) {
  case undefined:
    new NewMemo().createMemo()
    break
  case '-l':
    new MemoList().showTitles()
    break
  case '-r':
    new MemoDetails().showDetails()
    break
  case '-d':
    new MemoRemoval().deleteMemo()
}
