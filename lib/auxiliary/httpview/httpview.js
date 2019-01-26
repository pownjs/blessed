const url = require('url')
const debounce = require('debounce')

const { Box } = require('../../blessed')

const Bar = require('./bar')
const Request = require('./request')
const Response = require('./response')
const Transactions = require('./transactions')
const { HEADERS, BODY } = require('./consts')

class HTTPView extends Box {
    constructor(options) {
        super(options)

        this.debouncedRender = debounce(() => {
            this.screen.render()
        }, 1000)

        this.transactions = new Transactions({
            top: 0,
            left: 0,
            width: '100%',
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
            }
        })

        this.request = new Request({
            bottom: 1,
            left: 0,
            width: '50%-1',
            height: '50%-1',
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

        this.response = new Response({
            bottom: 1,
            right: 0,
            width: '50%-1',
            height: '50%-1',
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

        this.bar = new Bar({
            bottom: 0,
            left: 0,
            width: '100%',
            height: 1,
            style: {
                bg: '',
                fg: 'white'
            }
        })

        this.append(this.transactions)
        this.append(this.request)
        this.append(this.response)
        this.append(this.bar)

        this.transactions.focus()

        const focusElements = [this.transactions, this.request, this.response]

        let focusIndex = 0

        this.screen.key(['tab'], () => {
            if (++focusIndex > focusElements.length - 1) {
                focusIndex = 0
            }

            focusElements[focusIndex].focus()
        })

        this.transactions.on('select', (a) => {
            if (!a) {
                return
            }

            this.request.display(a)
            this.response.display(a)

            this.render()
        })
    }

    setMessage(message) {
        this.bar.setMessage(message)

        this.debouncedRender()
    }

    addTransaction(transaction) {
        const { uri, responseHeaders=HEADERS, responseBody=BODY } = transaction

        const { protocol, host, port, pathname, query, search } = url.parse(uri)

        transaction = {
            ...transaction,

            scheme: protocol.slice(0, -1),
            host: host,
            port: port || protocol === 'https:' ? 443 : 80,
            path: pathname || '',
            query: query || (search || '').slice(1),
            responseType: (responseHeaders['content-type'] || '').split(';')[0].trim().toLowerCase(),
            responseLength: responseBody.length
        }

        this.transactions.addItem(transaction)

        this.debouncedRender()
    }
}

module.exports = HTTPView
