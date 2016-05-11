import { combineReducers } from 'redux'
import auth from './auth'

const expensesApp = combineReducers({
  auth
})

export default expensesApp
