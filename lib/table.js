const stripAnsi = require('strip-ansi')
const { Box, list } = require('neo-blessed')

class Table extends Box {
  constructor (options) {
    options = options || {}
    options.columnSpacing = options.columnSpacing == null ? 10 : options.columnSpacing
    options.bold = true
    options.selectedFg = options.selectedFg || 'white'
    options.selectedBg = options.selectedBg || 'blue'
    options.fg = options.fg || 'green'
    options.bg = options.bg || ''
    options.interactive = (typeof options.interactive === 'undefined') ? true : options.interactive

    super(options)

    this.rows = list({
      top: 2,
      width: 0,
      left: 1,
      style: {
        selected: {
          fg: options.selectedFg,
          bg: options.selectedBg
        },
        item: {
          fg: options.fg,
          bg: options.bg
        }
      },
      keys: options.keys,
      vi: options.vi,
      tags: true,
      interactive: options.interactive,
      screen: this.screen
    })

    this.append(this.rows)

    this.on('attach', () => {
      if (this.options.data) {
        this.setData(this.options.data)
      }
    })
  }

  focus () {
    this.rows.focus()
  }

  render () {
    if (this.screen.focused === this.rows) {
      this.rows.focus()
    }

    this.rows.width = this.width - 3
    this.rows.height = this.height - 4

    super.render()
  }

  dataToString (d) {
    let str = ''

    d.forEach((r, i) => {
      const colsize = this.options.columnWidth[i]
      const strip = stripAnsi(r.toString())
      const ansiLen = r.toString().length - strip.length

      r = r.toString().substring(0, colsize + ansiLen)

      // compensate for ansi len

      let spaceLength = colsize - strip.length + this.options.columnSpacing

      if (spaceLength < 0) {
        spaceLength = 0
      }

      const spaces = new Array(spaceLength).join(' ')

      str += r + spaces
    })

    return str
  }

  setData (table) {
    this.append(new Box({
      content: this.dataToString(table.headers),
      top: 0,
      left: 0,
      height: 1,
      width: 'shrink',
      ailgn: 'left',
      autoFocus: false
    }))

    this.rows.setItems(table.data.map((d) => this.dataToString(d)))
  }

  addItem (item) {
    this.rows.addItem(this.dataToString(item))
  }
}

module.exports = Table
