const html = require('choo/html')
const nav = require('./views/nav.view')
const sidebar = require('./views/sidebar.view')
const content = require('./views/content.view')

module.exports = function view (state, prev, send) {
  return html`
    <div id='app'>
      <header>
        ${nav(state, prev, send)}
      </header>

      <main>
        ${sidebar(state, prev, send)}
        ${content(state, prev, send)}
      </main>
    </div>
  `
}