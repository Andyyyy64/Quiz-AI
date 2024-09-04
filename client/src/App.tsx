import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login"
import { Home } from "./pages/Home"
import { Register } from "./pages/Register";
import { VerifyEmail } from "./pages/Verify-Email";

import { Multiplayer } from "./pages/MultiPlayer";

import { PrivateRoute } from "./components/PrivateRoute";

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/multiplay" element={<Multiplayer />} />
        <Route path="*"
          element={
            <h2 className="text-xl ml-10">
              if you have some issue, contact s1300107@u-aizu.ac.jp or s1300106@u-aizu.ac.jp or
              <a href="https://twitter.com/Fukmylife44" className="ml-3">
                DM me on twitter
              </a>
            </h2>}
        />
      </Routes>
    </Router>
  )
}

