import React from "react";
import { Pagination } from "@mui/material";
import { gridPageCountSelector, gridPageSelector, useGridApiContext, useGridSelector } from "@mui/x-data-grid";


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


export default CustomPagination;