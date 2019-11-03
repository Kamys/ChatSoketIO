import * as React from 'react'
import { ChangeEvent, useCallback, useState } from 'react'
import user from '../../store/user'
import { Button, Card, Form, Header, Message, Popup } from 'semantic-ui-react'
import styled from 'styled-components'

interface IProps {}

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const StyledCard = styled.div`
  &&& {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 250px;
    width: 300px;
  }
`

const StyledButton = styled(Button)`
  &&& {
    margin: 0;
  }
`

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const useForm = <T extends {}>(
  defaultState: T
): [T, (event: ChangeEvent<HTMLInputElement>) => void] => {
  const [form, setForm] = useState<T>(defaultState)

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target
      setForm({ ...form, [name]: value })
    },
    [form]
  )

  return [form, onChange]
}

const Auth: React.FC<IProps> = () => {
  const [error, setError] = useState<string>()
  const [form, onChange] = useForm({
    userName: '',
    password: '',
  })

  const handleLogin = useCallback(() => {
    user.login(form).catch(error => {
      if (error.isAxiosError) {
        if (error.response.status === 400) {
          setError(error.response.data)
          return
        }
        setError(error.message)
        return
      }
      setError(error.toString())
    })
  }, [form])

  const handleSingUp = useCallback(() => {
    user.singUp(form).catch(error => {
      if (error.response) {
        setError(error.response.data)
        return
      }
      setError(error.toString())
    })
  }, [form])

  console.log('error: ', error)

  return (
    <Popup
      open={!!error}
      position="right center"
      trigger={
        <Card as={StyledCard}>
          <Header as="h2">Ratatosk</Header>
          <StyledForm>
            <Form.Field>
              <input
                value={form.userName}
                onChange={onChange}
                name="userName"
                placeholder="UserName"
              />
            </Form.Field>
            <Form.Field>
              <input
                value={form.password}
                onChange={onChange}
                name="password"
                placeholder="Password"
              />
            </Form.Field>
            <Controls>
              <StyledButton onClick={handleSingUp} type="submit">
                SingUp
              </StyledButton>
              <StyledButton onClick={handleLogin} type="submit">
                Login
              </StyledButton>
            </Controls>
          </StyledForm>
        </Card>
      }
    >
      <Popup.Content>
        <Message negative>
          <p>{error}</p>
        </Message>
      </Popup.Content>
    </Popup>
  )
}

export default Auth
