import React from 'react';
import PageWrapper from 'components/common/PageWrapper';
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector
} from '@mui/x-data-grid';
import Pagination from '@mui/material/Pagination';
import ColorForm from 'components/forms/product-configuration/color-form';




const rows = [
  { id: 1, col1: 'Hello', col2: 'World' },
  { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
  { id: 3, col1: 'MUI', col2: 'is Amazing' },
  { id: 4, col1: 'gaer', col2: 'is Amazing' },
  { id: 5, col1: 'sdrf', col2: 'is Amazing' },
  { id: 6, col1: 'ssg', col2: 'is Amazing' },
  { id: 7, col1: 'sf', col2: 'is Amazing' },
  { id: 8, col1: 'MUI', col2: 'is Amazing' },
  { id: 9, col1: 'xv', col2: 'is Amazing' },
  { id: 10, col1: 'gg', col2: 'is Amazing' }
];

const columns = [
  { field: 'col1', headerName: 'Color Name', width: 180, editable: true },
  { field: 'col2', headerName: 'Color', width: 200, editable: true },
];


const style = {
  '& .MuiDataGrid-row--editing .MuiDataGrid-cell': {
    background: 'var(--primary-lite)'
  }
}



function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      color="primary"
      className="d-flex justify-content-center anign-items-center mb-3"
      count={pageCount}
      page={page + 1}
      variant='outlined'
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

function Color() {
  return (
    <PageWrapper page_title="Color Setup">
      <div className="form-row">
        <div className="col-md-4">
          <div className="card p-2">
            <ColorForm/>
          </div>
        </div>
        <div className='col'>
          <div className='card' style={{ height: '80vh' }}>
            <DataGrid
              autoPageSize
              rows={rows}
              columns={columns}
              editMode="row"
              density="compact"
              sx={style}
              components={{
                Footer: CustomPagination
              }}
            />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Color;

