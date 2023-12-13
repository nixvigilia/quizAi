import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./components/Home";
import CreateQuiz from "./components/CreateQuiz";
import Login from "./components/Login";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<CreateQuiz />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
