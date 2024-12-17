import React, { useState, useEffect } from "react";
import Contract from "./Contract";
import "./index.css";

const App = () => {
  const [contractData, setContractData] = useState(null);

  useEffect(() => {
    fetch("/input.json")
      .then((response) => response.json())
      .then((data) => setContractData(data))
      .catch((error) => console.error("Error loading contract data:", error));
  }, []);

  if (!contractData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Contract data={contractData} />
    </div>
  );
};

export default App;
