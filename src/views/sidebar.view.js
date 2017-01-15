const html = require('choo/html')

module.exports = (state, prev, send) => {

  return html`
    <nav>
      <h2>classes</h2>
      <ul>
        <li>{class}</li>
      </ul>

      <h2>properties</h2>
      <ul>
        <li>{property}</li>
      </ul>

      <h2>instances</h2>
      <ul>
        <li>{instance}</li>
      </ul>

      <h2>external ontologies</h2>
      <ul>
        <li>{ontology}</li>
      </ul>

      <div>
        <input id='importInput' onchange=${e => send('import', e.target.files[0])} type='file' style='display:none'>
        <label class='btn' for='importInput'>Import</label>
        <button onclick=${e => send('export')}>Export</label>
      </div>
    </nav>
  `
}