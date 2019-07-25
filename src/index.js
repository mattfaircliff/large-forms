import React from 'react'
import { render } from 'react-dom'

import App from './App'

export default render(
  <App />,
  document.getElementById('root') || document.createElement('div')
)