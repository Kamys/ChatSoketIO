import * as React from 'react'
import * as ReactDOM from 'react-dom'
import styled from 'styled-components'
import 'semantic-ui-css/semantic.min.css'
import Auth from './components/Auth'

const PageContained = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

ReactDOM.render(
  <PageContained>
    <Auth />
  </PageContained>,
  document.getElementById('root')
)
