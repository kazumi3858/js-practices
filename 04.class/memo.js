const fs = require('fs')
const { Select } = require('enquirer')
process.stdin.setEncoding('utf8')

const readJsonFile = () => {
  const jsonFile = fs.readFileSync('./memo_list.json', 'utf8')
  return JSON.parse(jsonFile)
}

class NewMemo {
  createMemo() {
    process.stdin.on('data', async input => {
      const memoObject = {
        title: input.split('\n')[0].trim(),
        content: input.trim()
      }
      const memos = await readJsonFile()
      memos.push(memoObject)
      const newMemos = JSON.stringify(memos)
      fs.writeFileSync('./memo_list.json', newMemos)
    })
  }
}

class MemoList {
  readFirstLine() {
    readJsonFile().forEach(element => console.log(element.title))
  }
}

class MemoDetails {
  showDetails() {
    const prompt = new Select({
      message: 'Choose a note you want to see',
      choices: readJsonFile()
    })

    prompt.run()
      .then(answer => {
        prompt.choices.forEach(obj => {
          if (obj.title === answer) {
            console.log(obj.content)
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
    new MemoList().readFirstLine()
    break
  case '-r':
    new MemoDetails().showDetails()
    break
  case '-d':
    console.log('MemoRemoval')
}
