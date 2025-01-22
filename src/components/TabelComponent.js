import React from 'react';
import DataTable from 'react-data-table-component';
import { Button } from 'react-bootstrap';

const TableComponent = ({ columns, data, loading, onEdit, onDelete, onCreate }) => {
  return (
    <div className="table-responsive" style={{ backgroundColor: 'white', borderRadius: '8px' }}>
      <DataTable
        columns={columns}
        data={data}
        progressPending={loading}
        pagination
        subHeader
        subHeaderComponent={
          <div className="d-flex justify-content-between align-items-center w-100 mt-4">
            <h5>List of Data</h5>
            <input
              type="text"
              placeholder="Search"
              className="form-control w-25"
            />
            <Button variant="success" onClick={onCreate}>Create New</Button>
          </div>
        }
      />
    </div>
  );
};

export default TableComponent;
