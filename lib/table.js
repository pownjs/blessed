const stripAnsi = require('strip-ansi')

const {
    Box,
    List
} = require('neo-blessed')

class Table extends Box {
    // TODO: table requires several performance improvements

    constructor(options) {
        const {
            style = {}
        } = options

        const {
            columns: columnsStyle = {},
            rows: rowsStyle = {}
        } = style

        const {
            selected: rowsSelectedStyle = {},
            item: rowsItemStyle
        } = rowsStyle

        options = {
            columnSpacing: 10,
            columns: [],

            items: [],

            keys: true,
            mouse: true,
            vi: false,
            interactive: true,

            ...options,

            style: {
                ...style,

                columns: {
                    bold: true,

                    ...columnsStyle
                },

                rows: {
                    selected: {
                        fg: 'white',
                        bg: 'blue',

                        ...rowsSelectedStyle
                    },

                    item: {
                        fg: 'white',
                        bg: '',

                        ...rowsItemStyle
                    }
                }
            }
        }

        super(options)

        this.columns = new Box({
            screen: this.screen,
            parent: this,
            top: 0,
            left: 0,
            height: 1,
            width: 'shrink',
            ailgn: 'left',
            style: this.options.style.columns
        })

        this.rows = new List({
            screen: this.screen,
            parent: this,
            top: 2,
            left: 0,
            width: '100%',
            align: 'left',
            style: this.options.style.rows,

            keys: options.keys,
            mouse: options.mouse,
            vi: options.vi,
            interactive: options.interactive
        })

        this.append(this.columns)
        this.append(this.rows)

        this.on('attach', () => {
            this.setColumns(options.columns)
            this.setItems(options.items)
        })

        this.rows.on('focus', () => {
            this.style = {
                ...this.options.style.focus
            }
        })

        this.rows.on('blur', () => {
            this.style = {
                ...this.options.style
            }
        })

        this.rows.on('select', (_, index) => {
            this.emit('select', this.items[index], index)
        })
    }

    focus() {
        this.rows.focus()
    }

    render() {
        if (this.screen.focused === this.rows) {
            this.rows.focus()
        }

        this.rows.width = this.width - 3
        this.rows.height = this.height - 4

        super.render()
    }

    fieldsToContent(fields) {
        let str = ''

        fields.forEach((field = '', index) => {
            field = stripAnsi(String(field))

            const columnWidth = this.columnWidths[index]

            field = field.substring(0, columnWidth)

            let spaceLength = columnWidth - field.length + this.options.columnSpacing

            if (spaceLength < 0) {
                spaceLength = 0
            }

            const spaces = new Array(spaceLength).join(' ')

            str += field + spaces
        })

        return str
    }

    dataToContentItem(d) {
        return this.fieldsToContent(this.columnFields.map((f) => d[f]))
    }

    setColumns(columns) {
        this.columnFields = []
        this.columnNames = []
        this.columnWidths = []

        columns.forEach((column) => {
            const {
                field,
                name,
                width
            } = column

            this.columnFields.push(field)
            this.columnNames.push(name)
            this.columnWidths.push(width)
        })

        this.columns.setContent(this.fieldsToContent(this.columnNames))
    }

    setItems(items) {
        this.items = [...items]

        this.rows.setItems(items.map((item) => this.dataToContentItem(item)))
    }

    addItem(item) {
        this.items.push(item)

        this.rows.addItem(this.dataToContentItem(item))
    }
}

module.exports = Table
