import { bgColor } from './constants'
import './style.css'
import { test } from './views/test'

document.body.style.backgroundColor = bgColor

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root')

const canvas = document.createElement('canvas')
root.appendChild(canvas)

const view = document.location.hash
switch (view) {
  case '#test':
    test(canvas)
}
