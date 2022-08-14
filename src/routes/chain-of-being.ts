// const end = 'Oneness'

const left = [
  'Cultures',
  'Collectives',
  'Organisms',
  'Biomes',
  'Lands',
  'Planets',
  'Stars',
  'Galaxies',
  'Cosmic Web',
]

const right = [
  'Meaning',
  'Awareness',
  'Organs',
  'Cells',
  'Biomolecules',
  'Molecules',
  'Atoms',
  'Particles',
  'Quantum Bloom',
]

// const beginning = 'Big Bloom'

export const chainOfBeing = (): void => {
  const styleEl = document.createElement('style')
  styleEl.textContent = styleText
  document.head.appendChild(styleEl)

  const rootEl = document.createElement('div')
  rootEl.className = 'root'
  document.body.appendChild(rootEl)

  const middleEl = document.createElement('div')
  middleEl.className = 'middle'
  rootEl.appendChild(middleEl)

  const leftEl = document.createElement('div')
  leftEl.className = 'left'
  middleEl.appendChild(leftEl)

  const rightEl = document.createElement('div')
  rightEl.className = 'right'
  middleEl.appendChild(rightEl)

  left.forEach((stage) => {
    const stageEl = document.createElement('div')
    stageEl.className = 'stage'
    leftEl.appendChild(stageEl)

    const coreEl = document.createElement('div')
    coreEl.className = 'core'
    stageEl.appendChild(coreEl)

    const labelEl = document.createElement('div')
    labelEl.className = 'label'
    labelEl.textContent = stage
    coreEl.appendChild(labelEl)
  })

  right.forEach((stage) => {
    const stageEl = document.createElement('div')
    stageEl.className = 'stage'
    rightEl.appendChild(stageEl)

    const coreEl = document.createElement('div')
    coreEl.className = 'core'
    stageEl.appendChild(coreEl)

    const labelEl = document.createElement('div')
    labelEl.className = 'label'
    labelEl.textContent = stage
    coreEl.appendChild(labelEl)
  })
}

const styleText = `
  .root {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: white;
  }

  .middle {
    display: flex;
  }

  .left, .right {
    width: 50%;
  }

  .stage {
    padding: 10px;
  }

  .core {
    position: relative;
    width: 50px;
    height: 50px;
    background-color: red;
  }

  .left .core {
    margin-left: auto;
  }

  .right .core {
    margin-right: auto;
  }

  .label {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  .right .label {
    left: calc(100% + 10px);
  }

  .left .label {
    right: calc(100% + 10px);
  }
`
