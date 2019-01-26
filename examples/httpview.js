const { screen } = require('../lib/blessed')
const Quit = require('../lib/auxiliary/quit')
const HTTPView = require('../lib/auxiliary/httpview')

const s = screen({
    title: 'HTTPView'
})

const q = new Quit()
const h = new HTTPView()

q.bindKeys()

s.append(q)
s.append(h)

s.render()

setInterval(() => {
    h.setMessage(`${Math.random().toString(32).slice(2)}`)
}, 1000)

setInterval(() => {
    h.addTransaction({uri: `http://test/${Math.random().toString(32).slice(2)}`})
}, 1000)
