const html = require('choo/html')

module.exports = (state, prev, send) => {
  return html`
    <nav>
      <form>
      <input id='subject' type='text' placeholder='subject'>
      <input id='predicate' type='text' placeholder='predicate'>
      <input id='object' type='text' placeholder='object'>
      <button onclick=${handleForm}>+</button>
      </form>
    </nav>
  `

  function handleForm (e) {
    e.preventDefault()
    send('put', {
      subject: e.target.form.subject.value,
      predicate: e.target.form.predicate.value,
      object: e.target.form.object.value
    })
    e.target.form.reset()
  }
}