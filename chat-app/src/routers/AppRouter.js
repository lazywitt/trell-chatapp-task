import React from 'react'
import {Switch,Route, BrowserRouter} from 'react-router-dom'
import LoginPage from '../components/LoginPage'
import SignUpPage from '../components/SignUpPage'
import PrivateRoute from './PrivateRoute'
import Dashboard from '../components/Dashboard'

export default () => {

    

    return (
        <BrowserRouter>
        <Switch>
        
        <Route path="/login" component={LoginPage}/>

        <Route path="/signup" component={SignUpPage}/>

        <PrivateRoute path="/" component={Dashboard}/>
        
        </Switch>
        </BrowserRouter>


    )



}