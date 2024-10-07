import React from 'react';
import { Table, Container } from 'react-bootstrap';
import '../../css all/IterationTable.css'

const IterationTable = () => {
  return (
    <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Table className="rounded-table">
        <thead>
          <tr>
            <th style={{ textAlign: 'center', width: '10%', fontWeight: '600'}}>Iteration</th>

          </tr>
        </thead>
        <tbody>
            <tr>
              <td style={{ textAlign: 'center' }}>5</td>
            </tr>
        </tbody>
      </Table>
    </Container>
  );
};

export default IterationTable;
