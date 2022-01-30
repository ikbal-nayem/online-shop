import React from "react";
import { closeRowEditors, openRowEditors, saveRowEditors, deleteRow } from "ka-table/actionCreators";
import { IconButton } from "@mui/material";
import { CloseTwoTone, DeleteTwoTone, EditTwoTone, SaveTwoTone } from "@mui/icons-material";


const EditButton = ({ dispatch, rowKeyValue }) => (
  <div className='d-flex'>
    <IconButton size='small' onClick={() => dispatch(openRowEditors(rowKeyValue))}>
      <EditTwoTone fontSize='small' color='primary' />
    </IconButton>
    <IconButton size='small' onClick={() => dispatch(deleteRow(rowKeyValue))}>
      <DeleteTwoTone fontSize='small' color='danger' />
    </IconButton>
  </div>
)

const SaveButton = ({ dispatch, rowKeyValue }) => (
  <div className='d-flex'>
    <IconButton size='small' onClick={() => dispatch(saveRowEditors(rowKeyValue, { validate: true }))}>
      <SaveTwoTone fontSize='small' color='primary' />
    </IconButton>
    <IconButton size='small' onClick={() => dispatch(closeRowEditors(rowKeyValue))}>
      <CloseTwoTone fontSize='small' color='danger' />
    </IconButton>
  </div>
)


export {EditButton, SaveButton}