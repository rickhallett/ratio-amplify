import React, { useState } from 'react';
import AWS, { Credentials } from 'aws-sdk';
import './App.css';

const credentials = new Credentials({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.REACT_APP_AWS_SESSION_TOKEN
});

console.log({credentials, env: process.env})

let s3 = new AWS.S3({region: 'eu-north-1', credentials});

const fetchData = async (setTableData) => {
  const params = {
    Bucket: 'ratio-expenses',
    Key: 'shared_expenses.txt',
  };

  s3.getObject(params, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    const fileContent = data.Body.toString('utf-8');
    const lines = fileContent.split('\n');
    const headers = lines[0].split(',');
    const records = lines.slice(1).map(line => line.split(','));

    setTableData({ headers, records });
  });
};

const MyTable = () => {
  const [tableData, setTableData] = useState(null);

  return (
    <div>
      <button onClick={() => fetchData(setTableData)}>Fetch Data</button>
      {tableData && (
        <table>
          <thead>
            <tr>
              {tableData.headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.records.map((record, index) => (
              <tr key={index}>
                {record.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <MyTable />
    </div>
  );
}

export default App;
