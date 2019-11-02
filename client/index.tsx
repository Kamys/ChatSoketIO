import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Chat from './components/Chat/Chat'
import styled from 'styled-components'
import 'semantic-ui-css/semantic.min.css'

const PageContained = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

ReactDOM.render(
  <PageContained>
    <Chat />
  </PageContained>,
  document.getElementById('root')
)
