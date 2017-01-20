const html = require('choo/html')

module.exports = function (state, prev, send) {
  return html`
    <div id="quick-search">
      <input
        type='text'
        placeholder='Search...'
        oninput=${e => send('search', e.target.value)}
        autofocus />
      ${!state.results.length ? '' : html`
        <ul>
          ${state.results.map(r => html`
            <li>
              <button>
                ${highlight(r.subject)}
              </button>
            </li>
          `)}
        </ul>`
      }
    </div>
  `

  function highlight (str) {
    const el = html`<span class="quick-search-result-segment"></span>`
    el.innerHTML = str
    return el
  }
}