import './newProduct.css'
import TopBar from '../../components/topbar/TopBar';
import Sidebar from "../../components/sidebar/Sidebar";

export default function NewProduct() {
  return (
    <div className="body">
      <TopBar/>
     <div className="container">

      <Sidebar/>
    <div className='newProduct'>
        <h1 className="addProductTitle">New Product</h1>
        <form action="" className="addProductForm">
            <div className="addProductItem">
                <label htmlFor="">Image</label>
                <input type="file" id="file" />
            </div>
            <div className="addProductItem">
                <label htmlFor="">Name</label>
                <input type="text" placeholder='Apple AirPods'/>
            </div>
            <div className="addProductItem">
                <label htmlFor="">Stock</label>
                <input type="text" placeholder='123'/>
            </div>
            <div className="addProductItem">
                <label htmlFor="">Active</label>
                <select name="active" id="active">
                    <option value="yes">yes</option>
                    <option value="no">no</option>
                </select>
            </div>
            <button className='addProductButton'>Create</button>
        </form>
    </div>
    </div>
    </div>
  )
}
