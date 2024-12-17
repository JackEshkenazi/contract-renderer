import React from "react";
import renderNode from "./renderNode";


const Contract = ({ data }) => {
    if (!data || !Array.isArray(data)) {
      return <div>Loading contract...</div>; // Show a fallback while loading
    }
    
  
    return (
      <div className="contract">
        {data.map((node, index) => (
          <React.Fragment key={index}>{renderNode(node)}</React.Fragment>
        ))}
      </div>
    );
};  
  
  
export default Contract;
