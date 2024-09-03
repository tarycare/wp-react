// i want a + button for new document upload when click it will open in table row that have 3 column 1st is upload input file 2nd file type public or private 3d mdoule type dropdown list that have 3 options 1st Employee 2nd Customer 3rd Vendor , i can add multiple row and when i click on New Document button it will add new row in table and make style by tailwind css
// i want a - button for delete row when click it will delete that row
// i want a save button when click it will save all data in table in json format and show in console
// i want a clear button when click it will clear all data in table

import React, { useState } from "react";
import ReactDOM from "react-dom";

const App = () => {
  const [rows, setRows] = useState([{ id: 1 }]);

  const addRow = () => {
    setRows([...rows, { id: rows.length + 1 }]);
  };

  const deleteRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const saveData = () => {
    console.log(rows);
    // fetch post to wordpress api to save data
  };

  const clearData = () => {
    setRows([]);
  };

  return (
    <div>
      <button onClick={addRow}>New Document</button>
      <button onClick={saveData}>Save</button>
      <button onClick={clearData}>Clear</button>
      <table className="border border-1 border-black">
        <thead>
          <tr>
            <th>Upload Input File</th>
            <th>File Type</th>
            <th>Module Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <input type="file" />
              </td>
              <td>
                <select>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </td>
              <td>
                <select>
                  <option value="employee">Employee</option>
                  <option value="customer">Customer</option>
                  <option value="vendor">Vendor</option>
                </select>
              </td>
              <td>
                <button onClick={() => deleteRow(row.id)}>-</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;

// Get the DOM element where your app will be rendered
const rootElement = document.getElementById("wp-react-app");

if (rootElement) {
  // Use createRoot instead of ReactDOM.render
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
