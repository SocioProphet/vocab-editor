const html = require('choo/html')

module.exports = (state, prev, send) => {
  return html`
    <content>
      <h2>{label}</h2>
      <ul>
        <li>{statement}</li>
        <li><a href="">+ Add a statement about this resource</a></li>
      </ul>
    </content>
  `
}