const html = require('choo/html')
const nav = require('./views/nav')

module.exports = function view () {
  return html`
    <div>
      ${nav()}
      <main>
        <h2>label</h2>
        <ul>
          <li></li>
          <li><a href="#">+ Add a statement about this resource</a></li>
        </ul>
      </main>
    </div>
  `
}