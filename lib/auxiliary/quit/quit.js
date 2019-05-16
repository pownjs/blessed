const { Question, Box } = require('neo-blessed')

class Quit extends Box {
    constructor(options) {
        options = {
            hidden: true,

            ...options
        }

        super(options)
    }

    bindKeys(keys = ['q', 'C-c', 'C-x']) {
        this.screen.key(keys, () => {
            const question = new Question({
                keys: true,
                mouse: true,

                top: 'center',
                left: 'center',

                width: '50%',
                height: 5,

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
                }
            })

            question.on('blur', () => {
                this.screen.remove(question)
                this.screen.render()
            })

            this.screen.append(question)

            question.ask('Do you really want to quit?', (err, result) => {
                if (err) {
                    return
                }

                if (result) {
                    return process.exit(0)
                }

                this.screen.remove(question)
                this.screen.render()
            })
        })
    }
}

module.exports = Quit
