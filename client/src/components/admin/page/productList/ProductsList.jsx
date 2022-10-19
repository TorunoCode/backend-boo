import './productList.css'
import { DataGrid} from '@mui/x-data-grid';
import { productRows } from '../../dummyData';
import { Link } from 'react-router-dom';
import { useState } from 'react';
export default function ProductsList() {
  const [data,setData] =useState(productRows);
  const handleDelete = (id)=> {
    setData(data.filter((item)=>item.id !== id));
  };
    const columns = [
  { field: 'id', headerName: 'ID', width: 60 },
  { field: 'product', headerName: 'Product', width: 160, renderCell:(params) =>{
    return (
      <div className="productListItem">
        <img className='productListImg' src={params.row.avatar} alt=""/>
        {params.row.name}
      </div>
    )
  } },
  { field: 'stock', headerName: 'Stock', width: 160 },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
  },
  {
    field: 'price',
    headerName: 'Price',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 130
    },
    {
      field:'action', headerName:'Action', width:150, renderCell: (params)=>{
        return(
          <>
          <Link to={'/product/'+params.row.id}>
          <button className="productListEdit">Edit</button>
          </Link>
          <svg  onClick={()=>handleDelete(params.row.id)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 productListDelete">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>

          </>
        );
      }
    }
];
  return (
    <div className='productList'>
      <DataGrid
      rows={data}
      disableSelectionOnClick
      columns={columns}
      pageSize={8}
      rowsPerPageOptions={[5]}
      checkboxSelection
    />
    </div>
  )
}
