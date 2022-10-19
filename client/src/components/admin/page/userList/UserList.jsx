import './userList.css'
import { DataGrid} from '@mui/x-data-grid';
import { userRows } from '../../dummyData';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import TopBar from '../../components/topbar/TopBar';
import Sidebar from "../../components/sidebar/Sidebar";

export default function UserList() {
  const [data,setData] =useState(userRows);
  const handleDelete = (id)=> {
    setData(data.filter((item)=>item.id !== id));
  };
    const columns = [
  { field: 'id', headerName: 'ID', width: 60 },
  { field: 'user', headerName: 'User', width: 130, renderCell:(params) =>{
    return (
      <div className="userListUser">
        <img className='userListImg' src={params.row.avatar} alt=""/>
        {params.row.username}
      </div>
    )
  } },
  { field: 'username', headerName: 'Username', width: 160 },
  { field: 'email', headerName: 'Email', width: 160 },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
  },
  {
    field: 'transaction',
    headerName: 'Transaction',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 130
    },
    {
      field:'action', headerName:'Action', width:150, renderCell: (params)=>{
        return(
          <>
          <Link to={'/user/'+params.row.id}>
          <button className="userListEdit">Edit</button>
          </Link>
          <svg onClick={()=>handleDelete(params.row.id)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 userListDelete">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>

          </>
        );
      }
    }
];


  return (
    <div className="body">
      <TopBar/>
     <div className="container">
      <Sidebar/>
    <div className="userList">
    <DataGrid
      rows={data}
      disableSelectionOnClick
      columns={columns}
      pageSize={8}
      rowsPerPageOptions={[5]}
      checkboxSelection
    />
  </div>
  </div>
  </div>
  )
}
