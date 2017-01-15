const html = require('choo/html')

module.exports = {
  state: {
  },
  reducers: {
  },
  effects: {
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
  }
}