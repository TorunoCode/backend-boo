import "./newProduct.css";
import TopBar from "../../components/topbar/TopBar";
import Sidebar from "../../components/sidebar/Sidebar";

export default function NewProduct() {
  return (
    <div className="body">
      <TopBar />
      <div className="container">
        <Sidebar />
        <div className="newProduct">
          <h1 className="addProductTitle">New Product</h1>
          <div>
            <form action="" class="addProductForm">
              <div className="table">
                <div className="info">
                <input placeholder="Title" className="title" />{" "}
                <input placeholder="Upload Image" />
                <div className="select">
                  <select placeholder="Upload Image" className="select">
                    <option value="volvo">Volvo</option>
                    <option value="saab">Saab</option>
                    <option value="vw">VW</option>
                    <option value="audi">Audi</option>
                  </select>
                  <select placeholder="Upload Image">
                    <option value="volvo">Volvo</option>
                    <option value="saab">Saab</option>
                    <option value="vw">VW</option>
                    <option value="audi">Audi</option>
                  </select>
                </div>
                <textarea placeholder="Description"></textarea>
                </div>
                <div className="info">
                  <div className="video"></div>
                </div>
                </div>
                <div className="infoo">
                <input placeholder="Title" />
                <input placeholder="Title" />
                </div>
                <input placeholder="Title" />

              
              <div className="submit">
                <button class="addProductButton">Create</button>
                <button class="addProductButton">Cancel</button>
              </div>
              
            </form>
            <div>
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
