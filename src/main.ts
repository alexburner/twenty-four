import { bgColor } from './constants'
import './style.css'
import { test } from './views/test'

document.body.style.backgroundColor = bgColor

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Missing #root')

const view = document.location.hash

console.log(view)

switch (view) {
  case '#test':
    test(rootEl)
}
