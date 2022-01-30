import React from "react";
import { TextField, Button } from "@mui/material";
import {useForm} from 'react-hook-form';


export default ({ handleData })=>{
  const { register, handleSubmit, formState: {errors} } = useForm()

  const onSubmit = (values)=>{
    handleData('ADD', {id: 4, ...values})
  }

  return(
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="form-row">
        <div className="col-md-8">
          <TextField
            label="Color Name" 
            size="small"
            fullWidth
            margin="normal"
            error={errors.name}
            inputProps={register('name', {required: true})}
          />
        </div>
        <div className="col-md-4 col-12">
          <TextField
            label="Choose Color"
            size="small"
            fullWidth
            type="color"
            margin="normal"
            inputProps={register('code')}
          />
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <Button type="submit" variant="contained" size="small">Add</Button>
      </div>
    </form>
  )
}