const choo = require('choo')
const model = require('./model')
const view = require('./view')

const app = choo()

app.model(model)
app.router(['/', view])

const tree = app.start()

document.body.appendChild(tree)