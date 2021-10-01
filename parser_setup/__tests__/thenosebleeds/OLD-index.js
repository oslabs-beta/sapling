import React from 'react';
import ReactDOM from 'react-dom';
import { useHistory,
        BrowserRouter as Router,
        Link,
        Route,
        Switch
    } from 'react-router-dom';

import HomePage from './components/homepage';
import './styles/styles.css';

let validUser = true;
//let linkTo = '/';


const App = () => {
  const signUp = (user, pass) => {
      console.log(user);
    fetch("/post", {
      method: 'POST',
      body: JSON.stringify(
        {username : user,
      password: pass}),
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then(res => res.json())
        .then(result => {result}
        )};

        const Login = (user, pass) => {
            console.log(user);
          fetch("/login", {
            method: 'POST',
            body: JSON.stringify(
              {username : user,
            password: pass}),
              headers: {
                'Content-Type': 'application/json',
              }
            })
              .then(res => res.json())
              .then(result => {
                if (result) {
                  //linkTo = '/homepage';
                  return validUser = true;
                } else {
                  return validUser = false;
                }
                console.log(result)
              })
        };

  const getData = () =>{fetch('https://api.seatgeek.com/2/events?client_id=MjMwODQ2OTZ8MTYzMDA5MTEwMy4xMjAzNg&geoip=true&performers.slug=los-angeles-dodgers')
  .then(response => response.json())
  .then(data => console.log(data))}

//   const usernameTest = document.getElementById('username').value
//   console.log(usernameTest);
// console.log('here')
// if (validUser === true) {
//   console.log('on line 71')
//   linkTo = '/homepage';
// } else {
//   linkTo = '/';
// }
validUser = Login()
console.log()
  return(
    // console.log(linkTo)
    <Router>
      <Switch>
      <Route exact path="/" component={App}>
          <h1 className="primary">THE NOSEBLEEDS</h1>
          <div id='login'>
           <input type ='text' id='username' placeholder="username"></input>
          <input type = 'password' id="password" placeholder="password"></input>
            <Link to='/homepage'><button onClick={() => Login((document.getElementById('username').value), (document.getElementById('password').value))} type="button" className="buttons">Login</button></Link>
            <button onClick={() => signUp((document.getElementById('username').value), (document.getElementById('password').value))} type="button" className="buttons">Sign up</button>
          </div>
      </Route>
      <Route path='/homepage' component={HomePage}>
          <HomePage />
      </Route>
      </Switch>
      </Router>
  )
//       return (
//         <button onClick {/*some logic returns boolean*/}></button>
//         if (/*logic returns true*)
//       )
}

ReactDOM.render(<App />, document.getElementById("root"))

