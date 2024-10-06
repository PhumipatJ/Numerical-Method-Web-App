import React from 'react';
import { Table, Container } from 'react-bootstrap';
import '../../css all/IterationTable.css'

const IterationTable = ({ data }) => {
  return (
    <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Table className="rounded-table">
        <thead>
          <tr>
            <th style={{ textAlign: 'center', width: '10%', fontWeight: '600'}}>Iteration</th>
            <th style={{ textAlign: 'center', width: '10%', fontWeight: '600' }}>Xʟ</th>
            <th style={{ textAlign: 'center', width: '10%', fontWeight: '600' }}>Xᴍ</th>
            <th style={{ textAlign: 'center', width: '10%', fontWeight: '600' }}>Xʀ</th>
            <th style={{ textAlign: 'center', width: '10%', fontWeight: '600' }}>Error(%)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((element, index) => (
            <tr key={index}>
              <td style={{ textAlign: 'center' }}>{element.iteration}</td>
              <td style={{ textAlign: 'center' }}>{element.Xl.toFixed(7)}</td>
              <td style={{ textAlign: 'center' }}>{element.Xm.toFixed(7)}</td>
              <td style={{ textAlign: 'center' }}>{element.Xr.toFixed(7)}</td>
              <td style={{ textAlign: 'center' }}>{element.Error.toFixed(7)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default IterationTable;
