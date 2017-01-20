const html = require('choo/html')

module.exports = (state, prev, send) => {
  if (prev) {
    if (prev & prev.location.params.resource !== state.location.params.resource) {
      send('handleRouteChange', state.location.params)
    }
  }

  if (!state.selected || !state.selected) {
    return html`<div></div>`
  }

  return html`
    <content>
      <h2>${state.selected[0].subject}</h2>
      <ul>
        ${state.selected.map(s => html`<li>${s.predicate}: ${s.object}</li>`)}
      </ul>
    </content>
  `
}