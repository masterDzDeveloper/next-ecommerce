import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import "./App.css";
import Home from "./pages/home/Home";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import UserList from "./pages/userList/UserList";
import User from "./pages/user/User";
import NewUser from "./pages/newUser/NewUser";
import ProductList from "./pages/productList/ProductList";
import Product from "./pages/product/Product";
import NewProduct from "./pages/newProduct/NewProduct";
import SignIn from "./pages/signIn/signIn";
import { useContext } from "react";
import { AuthContext } from "./context/Context";

function App() {
  // tommorrow inchallah protected route 
  const {admin} = useContext(AuthContext)
  return (
    <Router>
      <Switch>
        <Route exact path="/login">
          {admin && admin.isAdmin ?  <Redirect to='/' /> : <SignIn />}
        </Route>
        <Route exact path="/">
          <Topbar />
          <div className="container">
            <Sidebar />
            <Home />
          </div>
        </Route>
        <Route exact path="/users">
          <Topbar />
          <div className="container">
            <Sidebar />
            <UserList />
          </div>
        </Route>
        <Route path="/user/:userId">
          <Topbar />
          <div className="container">
            <Sidebar />
            <User />
          </div>
        </Route>
        <Route path="/newUser">
          <Topbar />
          <div className="container">
            <Sidebar />
            <NewUser />
          </div>
        </Route>
        <Route exact path="/products">
          <Topbar />
          <div className="container">
            <Sidebar />
            <ProductList />
          </div>
        </Route>
        <Route path="/product/:productId">
          <Topbar />
          <div className="container">
            <Sidebar />
            <Product />
          </div>
        </Route>
        <Route path="/newproduct">
          <Topbar />
          <div className="container">
            <Sidebar />
            <NewProduct />
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
