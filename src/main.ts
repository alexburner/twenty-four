import { bgColor } from './constants'
import './style.css'
import { colorTest } from './views/color-test'

document.body.style.backgroundColor = bgColor

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root')

const canvas = document.createElement('canvas')
root.appendChild(canvas)

const view = document.location.search

switch (view) {
  case '?color-test':
    colorTest(canvas)
    break
}
