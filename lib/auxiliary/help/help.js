const { Box } = require('neo-blessed')

class Help extends Box {
    constructor(options) {
        options = {
            label: 'Help',

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

    bindKeys(keys = ['?']) {
        this.screen.key(keys, () => {
            this.toggle()

            if (this.visible) {
                this.setFront()
                this.focus()
            }

            this.screen.render()
        })
    }
}

module.exports = Help
