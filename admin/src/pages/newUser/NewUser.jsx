import axios from "axios";
import { useContext, useState } from "react";
import CustomizedSnackbars from "../../components/CustomizeSnackbar";
import { AuthContext } from "../../context/Context";
import "./newUser.css";

const INITIAL_STATE = {
  username: "",
  email:"",
  password:"",
  isAdmin: false
}

export default function NewUser() {
  // add the profile picture 
  const {dispatch, isFetching, error} = useContext(AuthContext)
  const [open, setOpen] = useState(false)

  const [userInfo, setUserInfo] = useState(INITIAL_STATE)
  const handleChange = (e)=>{
    const name = e.target.name
    let value = e.target.value
    if(name === "isAdmin"){
      value = (e.target.value === "yes")
    }
    setUserInfo(prv => ({...prv , [name]: value}))
  }

  const handleSubmit = async(e)=>{
    dispatch({type: "FETCHING_START"})
    e.preventDefault()
    try {
      const {data} = await axios.post("/auth/register", userInfo)
      dispatch({type: "FETCHING_SUCCESS"})
      console.log(data)
    } catch ({response}) {
      console.log(response)
      dispatch({type: "FETCHING_FAILURE", payload: "Something went wrong"})
      setOpen(true)
    }
  }
  return (
    <div className="newUser">
      <h1 className="newUserTitle">New User</h1>
      <form className="newUserForm" onSubmit={handleSubmit}>
        <div className="newUserItem">
          <label>Username</label>
          <input name="username" type="text" placeholder="john" onChange={handleChange}/>
        </div>
        <div className="newUserItem">
          <label>Full Name</label>
          <input type="text" placeholder="John Smith" />
        </div>
        <div className="newUserItem">
          <label>Email</label>
          <input name="email" type="email" placeholder="john@gmail.com" onChange={handleChange}/>
        </div>
        <div className="newUserItem">
          <label>Password</label>
          <input name="password" type="password" placeholder="password" onChange={handleChange}/>
        </div>
        <div className="newUserItem">
          <label>Phone</label>
          <input type="text" placeholder="+1 123 456 78" />
        </div>
        <div className="newUserItem">
          <label>Address</label>
          <input type="text" placeholder="New York | USA" />
        </div>
        <div className="newUserItem">
          <label>Gender</label>
          <div className="newUserGender">
            <input type="radio" name="gender" id="male" value="male" />
            <label for="male">Male</label>
            <input type="radio" name="gender" id="female" value="female" />
            <label for="female">Female</label>
            <input type="radio" name="gender" id="other" value="other" />
            <label for="other">Other</label>
          </div>
        </div>
        <div className="newUserItem">
          <label>is Admin ?</label>
          <select className="newUserSelect" name="isAdmin" id="active" onChange={handleChange}>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <button className="newUserButton" type="submit">Create</button>
      </form>
      <CustomizedSnackbars open={open} setOpen={setOpen} msg={error} severity="error"/>
    </div>
  );
}
