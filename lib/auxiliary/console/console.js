const { Log } = require('neo-blessed')

class Console extends Log {
    constructor(options) {
        options = {
            label: 'Log',

            keys: true,
            mouse: true,

            scrollable: true,
            alwaysScroll: true,
            scrollbar: {
                ch: ' ',
                inverse: true
            },

            top: 'center',
            left: 'center',

            width: '100%-2',
            height: '50%',

            border: {
                type: 'line'
            },

            style: {
                border: {
                    fg: 'grey'
                },
                focus: {
                    border: {
                        fg: 'white'
                    }
                }
            },

            hidden: true,

            ...options,

            tags: true
        }

        super(options)

        this.on('blur', () => {
            this.hide()

            this.screen.render()
        })
    }

    bindKeys(keys = ['C-l']) {
        this.screen.key(keys, () => {
            this.toggle()

            if (this.visible) {
                this.focus()
                this.setFront()
            }

            this.screen.render()
        })
    }

    hijackConsole() {
        console.log = (...args) => {
            this.add(args.map((a) => String(a)).join(' '))
        }

        console.info = (...args) => {
            this.add(args.map((a) => String(a)).join(' '))
        }

        console.debug = (...args) => {
            this.add(args.map((a) => String(a)).join(' '))
        }

        console.warn = (...args) => {
            this.add(args.map((a) => String(a)).join(' '))
        }

        console.error = (...args) => {
            this.add(args.map((a) => String(a)).join(' '))
        }

        console.table = (...args) => {
            // TODO: not implemented
        }
    }

    unjackConsole() {
        // TODO: add code here
    }
}

module.exports = Console
