import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './Auth';
import './LoginPage.css';

export default function LoginPage() {
  let navigate = useNavigate();
  let location = useLocation();
  let auth = useAuth();

  let from = location.state?.from?.pathname || "/";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let formData = new FormData(event.currentTarget);
    let username = formData.get("user") as string;
    let password = formData.get('pass') as string;

    await auth.signin({ username: username, password: password });
    // Send them back to the page they tried to visit when they were
    // redirected to the login page. Use { replace: true } so we don't create
    // another entry in the history stack for the login page.
    navigate(from, { replace: true });
  }

  return(
    <div className="login-wrapper">
      <h1>Please Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input name = 'user' type="text" />
        </label>
        <label>
          <p>Password</p>
          <input name='pass' type="password" />
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}