import './userList.css'
import { DataGrid} from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { useState,useEffect } from 'react';
import TopBar from '../../components/topbar/TopBar';
import Sidebar from "../../components/sidebar/Sidebar";
import axios from "axios";

export default function UserList() {
  const [data,setData] =useState([]);
  const handleDelete = (id)=> {
    setData(data.filter((item)=>item.id !== id));
  };
  function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [ mnth, day,date.getFullYear()].join("/");
  }
  useEffect(() => {
    const fetchUsers = async () => {
      const {data} = await axios.get("/api/user");
      setData(data);
    };
    fetchUsers();
  }, []);
    const columns = [
  { field: '_id', headerName: 'ID', width: 60 },
  { field: 'name', headerName: 'NAME', width: 120 },
  { field: 'email', headerName: 'EMAIL', width: 160},
  { field: 'isActive', headerName: 'ACTIVE', width: 160 },
  { field: 'isAdmin', headerName: 'ADMIN', width: 160 },
  {
    field: 'createdAt',
    headerName: 'CREATED',
    description: 'This column has a value getter and is not sortable.',
    sortable: false
    , renderCell: (params)=>{
      return(
        <>
       <p> {convert(params.row.createdAt)}</p>
        </>
      );
    }
  },
  {
    field:'action', headerName:'ACTION', width:150, renderCell: (params)=>{
      return(
        <>
        <Link to={'/user/'+params.row.id}>
        <button className="userListEdit">Edit</button>
        </Link>
        <div className='icon'>
        <a className='iq-bg-primary'>
        <svg onClick={()=>handleDelete(params.row.id)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 userListDelete" >
  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
</svg>
</a>
</div>
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
    <div class="iq-header-title "> <h4 class="card-title">Editable Table</h4> </div>
    <div class="iq-card-header-toolbar d-flex align-items-center"><a class="btn btn-primary" href="/streamit/dashboard/react/build/add-movie">Add movie</a></div>
    <DataGrid
      rows={data}
      getRowId={(row) => row._id} 
      disableSelectionOnClick
      columns={columns}
      pageSize={8}
      rowsPerPageOptions={[5]}
      checkboxSelection
    />
  </div>
  </div>
  <div className='test'></div>
  </div>
  );
}
