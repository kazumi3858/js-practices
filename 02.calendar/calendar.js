const { DateTime } = require('luxon')

const argv = require('minimist')(process.argv.slice(2))

const selectedYear = argv.y ||= DateTime.local().year
const selectedMonth = argv.m ||= DateTime.local().month
const date = DateTime.local(selectedYear, selectedMonth)

const firstDay = date.startOf('month')
const lastDay = date.endOf('month')
console.log('      ' + date.month + '月 ' + date.year)

for (let i = 0; i < firstDay.weekday; i++) {
  process.stdout.write('   ')
}

for (let i = 0; i < lastDay.day; i++) {
  process.stdout.write(String(date.plus({ days: i }).day).padStart(2, ' ') + ' ')
  if (date.plus({ days: i }).weekday === 6) {
    process.stdout.write('\n')
  }
}

process.stdout.write('\n')
