const html = require('choo/html')
const level = require('level-browserify')
const levelgraph = require('levelgraph')
const db = levelgraph(level('test'))

module.exports = {
  state: {
    selected: null,
    classes: [],
    properties: [],
    instances: [],
    imports: []
  },
  reducers: {
    select: (state, data) => {
      return {
        selected: data
      }
    },
    add: (state, data) => {
      console.log(data)
      return {

      }
    },
    remove: (state, data) => {
      console.log(data)
      return {

      }
    },
    addClass: (state, data) => {
      const str = JSON.stringify(data)
      const i = state.classes.findIndex(c => JSON.stringify(c) === str)

      return {
        classes: i
          ? state.classes.concat(data)
          : state.classes
      }
    },
    removeClass: (state, data) => {
      const str = JSON.stringify(data)
      const i = state.classes.findIndex(c => JSON.stringify(c) === str)

      return {
        classes: [
          ...state.classes.slice(0, i),
          ...state.classes.slice(i + 1)
        ]
      }
    }
  },
  effects: {
    handleRouteChange: (state, data, send, done) => {
      if (data.resource) {
        send('get', {subject: data.resource}, (err, graph) => {
          send('select', graph, done)
        })
      }
    },
    get: (state, data, send, done) => {
      db.get(data, (err, graph) => {
        done(err, graph)
      })
    },
    put: (state, data, send, done) => {
      db.put(data, err => {
        if (err) return console.error(err)
        send('add', data, done)
      })
    },
    del: (state, data, send, done) => {
      db.del(data, err => {
        if (err) return console.error(err)
        send('remove', data, done)
      })
    },
    delClass: (state, data, send, done) => {
      db.get({subject: state.subject}, (err, graph) => {
        graph.forEach(triple => {
          db.del(triple, err => {
            if (err) return console.error(err)
            send('removeClass', triple, done)
          })
        })
      })
    },
    import: (state, data, send, done) => {
      const reader = new FileReader()
      reader.readAsText(data)
      reader.onload = e => {
        const content = JSON.parse(e.target.result)
      }
    },
    export: (state, data, send, done) => {
      const json = JSON.stringify({hello: 'world'}, null, 2)
      const blob = new Blob([json], {type: 'octet/stream'})
      const url = URL.createObjectURL(blob)
      const a = html`<a href=${url} download='vocab-export.json'></a>`
      a.click()
      URL.revokeObjectURL(url)
    }
  },
  subscriptions: {
    init: (send, done) => {
      db.get({predicate: 'rdf:type', object: 'rdfs:Class'}, (err, graph) => {
        graph.forEach(triple => send('addClass', triple, done))
      })
    }
  }
}