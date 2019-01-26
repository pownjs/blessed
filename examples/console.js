const { screen } = require('../lib/blessed')
const Quit = require('../lib/auxiliary/quit')
const Console = require('../lib/auxiliary/console')

const s = screen({
    title: 'HTTPView'
})

const q = new Quit()
const c = new Console({hidden: false})

q.bindKeys()
c.hijackConsole()

s.append(q)
s.append(c)

s.render()

setInterval(() => {
    console.log(`${Math.random().toString(32).slice(2)}`)
}, 1000)

setInterval(() => {
    console.warn(`${Math.random().toString(32).slice(2)}`)
}, 2000)

setInterval(() => {
    console.error(`${Math.random().toString(32).slice(2)}`)
}, 3000)
