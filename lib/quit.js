const { Question, Box } = require('neo-blessed')

class Quit extends Box {
    constructor(options) {
        super(options)

        this.screen.key(['q', 'C-c', 'C-x'], () => {
            const question = new Question({
                keys: true,
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
                    }
                }
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
