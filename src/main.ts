import { bgColor } from './constants'
import './style.css'
import { colorTest } from './views/color-test'
import { test } from './views/test'

document.body.style.backgroundColor = bgColor

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root')

const canvas = document.createElement('canvas')
root.appendChild(canvas)

const view = document.location.search

switch (view) {
  case '?test':
    test(canvas)
    break
  case '?color-test':
    colorTest(canvas)
    break
}
