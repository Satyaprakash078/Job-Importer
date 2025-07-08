// /client/src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ImportLogList from "./components/ImportLogList";
import ImportLogDetails from "./components/ImportLogDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ImportLogList />} />
        <Route path="/logs/:id" element={<ImportLogDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
