import React from "react";
import { withCookies } from 'react-cookie';
import env from "react-dotenv";
import jwt_decode from "jwt-decode";
import { Route, Redirect } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";

class App extends React.Component {

  constructor(props) {
    super(props);

    // Check cookies
    const { cookies } = props;
    let isRedirect = env.REDIRECT === 'false' ? false : true;
    
    let cookieVal = cookies.get('auth_accessToken')

    if (typeof cookieVal !== 'undefined' && cookieVal !== null ) {
      let decoded = jwt_decode(cookieVal)

      if ((new Date().getTime() / 1000) < decoded.exp // Check if not expired
        && decoded.iss.includes(env.TOKEN_ISSUER) // Check if same pool
      ) { 
        console.log('Cookie is valid')
        isRedirect = false
      }

      if (isRedirect === true) { // Will be redirected to authentication page
        console.log('Redirecting')
        response.clearCookie('auth_accessToken', {path: '/'}) //clear cookies
        response.clearCookie('auth_idToken', {path: '/'}) //clear cookies
      }
    }

    this.state = {
      isRedirect: isRedirect
    };
  }

  render() {
    return (
      <Route path="/">
        {this.state.isRedirect ? <Redirect to="/auth" /> : <Home/>}
      </Route>
    );
  }
}

export default withCookies(App);
