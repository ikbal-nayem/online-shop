import React from 'react';
import PageWrapper from 'components/common/PageWrapper';
import { kaReducer, Table } from 'ka-table';
import { updateData, updateEditorValue } from 'ka-table/actionCreators';
import { DataType, FilteringMode, PagingPosition, SortingMode } from 'ka-table/enums';
import ColorForm from 'components/forms/product-configuration/color-form';
import { EditButton, SaveButton } from 'components/table-components/ka-table';



const rows = [
  { id: 1, name: 'Back', code: '#000000' },
  { id: 2, name: 'Blue', code: '#0044aa' },
  { id: 3, name: 'Red', code: '#ff0000' },
];


const ColorInput = ({ column, dispatch, rowKeyValue, value}) => (
  <input type="color" defaultValue={value} onChange={(e) => dispatch(updateEditorValue(rowKeyValue, column.key, e.target.value))} />
)


const tablePropsInit = {
  columns: [
    { key: 'name', title: 'Name', dataType: DataType.String, isResizable: true },
    { key: 'code', title: 'Color Code', dataType: DataType.String, style: { textAlign: 'center' } },
    { key: 'editColumn', style: { width: 80 } },
  ],
  format: ({ column, value }) => {
    if (column.dataType === DataType.Date) {
      return value && value.toLocaleDateString('en', { month: '2-digit', day: '2-digit', year: 'numeric' });
    }
  },
  data: [],
  rowKeyField: 'id',
  sortingMode: SortingMode.Single,
  filteringMode: FilteringMode.FilterRow,
  paging: {
    enabled: true,
    pageSize: 10,
    position: PagingPosition.Bottom
  },
  validation: ({ column, value }) => {
    if (column.key === 'name') {
      return value ? '' : 'value must be specified';
    }
  }
};


function Color() {
  const [tableProps, changeTableProps] = React.useState(tablePropsInit);

  const dispatch = (action) => {
    changeTableProps((prevState) => kaReducer(prevState, action));
  };


  const handleData = React.useCallback((action, data)=>{
    if(action === 'ADD'){
      dispatch(updateData([data, ...tableProps.data]))
    } else if(action === 'DELETE'){
      dispatch(updateData(tableProps.data.filter((row) => row.id !== data)))
    }
  }, [tableProps])

  React.useEffect(()=>{
    dispatch(updateData([...rows]))
  },[])


  return (
    <PageWrapper page_title="Color Setup">
      <div className="form-row">
        <div className="col-md-4">
          <div className="card p-2">
            <ColorForm handleData={handleData}/>
          </div>
        </div>
        <div className='col'>
          <div className='card' style={{ maxHeight: '80vh' }}>
            <Table
              {...tableProps}
              dispatch={dispatch}
              childComponents={{
                filterRowCell: {
                  content: (props) => {
                    switch (props.column.key) {
                      case 'name': return;
                      default: return <React.Fragment/>
                    }
                  }
                },
                cellText: {
                  content: (props) => {
                    if (props.column.key === 'editColumn'){
                      return <EditButton {...props} />
                    } else if(props.column.key === 'code'){
                      return  <div className='text-center' style={{ background: props.value }}>
                                <span className='bg-light p-1' style={{borderRadius: 15}}>
                                  {props.value}
                                </span>
                              </div>
                    }
                  }
                },
                cellEditor: {
                  content: (props) => {
                    if (props.column.key === 'editColumn') {
                      return <SaveButton {...props} />
                    } else if (props.column.key === 'code'){
                      return <ColorInput {...props} />
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Color;

