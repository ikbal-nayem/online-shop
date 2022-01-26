import React from "react";
import { TextField, Button } from "@mui/material";


export default ()=>{
  return(
    <form noValidate>
      <div className="form-row">
        <div className="col-md-8">
          <TextField
            label="Color Name" 
            size="small"
            fullWidth
            margin="normal"
          />
        </div>
        <div className="col-md-4 col-12">
          <TextField
            label="Choose Color"
            size="small"
            fullWidth
            type="color"
            margin="normal"
          />
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <Button variant="contained" size="small">Save</Button>
      </div>
    </form>
  )
}