import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'
import {
  Checkbox,
  Divider,
  Grid,
  Header,
  Image,
  Loader,
  Select
} from 'semantic-ui-react'

import { search, getUserIds } from '../api/todos-api'
import Auth from '../auth/Auth'
import { Todo } from '../types/Todo'
import { UserId } from '../types/UserId'

interface SearchsProps {
  auth: Auth
  history: History
}

interface SearchsState {
  todos: Todo[]
  userIds: UserId[]
  loadingTodos: boolean
}

export class Searchs extends React.PureComponent<SearchsProps, SearchsState> {
  state: SearchsState = {
    todos: [],
    userIds: [],
    loadingTodos: true
  }

  onTodoSearch = async (event: React.ChangeEvent<HTMLInputElement>, value:any) => {
    try {
      console.log(value)
      const todos = await search(this.props.auth.getIdToken(), value)
      this.setState({
        todos,
        loadingTodos: false
      })
    } catch (e) {
      alert(`Failed to fetch todos: ${(e as Error).message}`)
    }
  }



  async componentDidMount() {
    try {
      const userIds = await getUserIds(this.props.auth.getIdToken())
      this.setState({
        userIds,
        loadingTodos: false
      })
    } catch (e) {
      alert(`Failed to fetch todos: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Search to do for userIds</Header>

        {this.renderCreateTodoInput()}

        {this.renderTodos()}
      </div>
    )
  }

  renderCreateTodoInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Select onChange={(e:any, {value}) => this.onTodoSearch(e, value)} placeholder='Select user accountId' options={this.state.userIds} />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderTodos() {
    if (this.state.loadingTodos) {
      return this.renderLoading()
    }

    return this.renderTodosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading TODOs
        </Loader>
      </Grid.Row>
    )
  }

  renderTodosList() {
    return (
      <Grid padded>
        {this.state.todos.map((todo, pos) => {
          return (
            <Grid.Row key={todo.todoId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  disable = 'true'
                  checked={todo.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {todo.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {todo.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
              </Grid.Column>
              <Grid.Column width={1} floated="right">
              </Grid.Column>
              {todo.attachmentUrl && (
                <Image src={todo.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
