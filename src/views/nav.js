const html = require('choo/html')

module.exports = function nav () {
  return html`
    <nav>
      <h2>classes</h2>
      <ul>
        <li></li>
      </ul>

      <h2>properties</h2>
      <ul>
        <li></li>
      </ul>

      <h2>objects</h2>
      <ul>
        <li></li>
      </ul>

      <h2>external ontologies</h2>
      <ul>
        <li></li>
      </ul>

      <div>
        <button>import</button>
        <button>export</button>
      </div>
    </nav>
  `
}