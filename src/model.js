const html = require('choo/html')
const level = require('level-browserify')
const levelgraph = require('levelgraph')
const db = levelgraph(level('test'))
const FuzzySearch = require('./lib/FuzzySearch')

module.exports = {
  state: {
    results: [],
    selected: null,
    classes: [],
    properties: [],
    instances: [],
    imports: []
  },
  reducers: {
    update: (state, data) => {
      return data
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
    search: (state, data, send, done) => {
      db.get({}, (err, graph) => {
        const searcher = new FuzzySearch({
          source: graph,
          keys: ['subject'],
          highlight_before: '<span class="quick-search-hl">',
          highlight_after: '</span>'
        })
        let results = searcher.search(data)
        if (results.length) {
          results = results.map(result => {
            Object.keys(result).forEach(key => {
              result[key] = searcher.highlight(result[key])
            })
            return result
          })
        }
        send('update', {results}, done)
      })
    },
    handleRouteChange: (state, data, send, done) => {
      if (data.resource) {
        db.get(data, (err, graph) => {
          send('update', {select: graph}, done)
        })
      }
    },
    put: (state, data, send, done) => {
      db.put(data, err => {
        if (err) return console.error(err)
        send('add', data, done)
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