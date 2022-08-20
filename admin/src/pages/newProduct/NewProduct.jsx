import { useContext, useRef, useState } from "react";
import "./newProduct.css";

import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { Autocomplete, Button, CircularProgress } from "@mui/material";
import MultipleSelect from "../../components/MultipleSelect";
import axios from "axios";
import { AuthContext } from "../../context/Context";
import CustomizedSnackbars from "../../components/CustomizeSnackbar";

const INITIAL_STATE = {
  title: "",
  desc: "",
  price: 0,
};

export default function NewProduct() {

  // ****************************************************************************
  const [productInfo, setProductInfo] = useState(INITIAL_STATE);
  const [categories, setCategories] = useState([]);
  const [fileData, setFileData] = useState(null);
  const sizesRef = useRef();
  const colorsRef = useRef();

  const { admin } = useContext(AuthContext);
  let  accessToken ;
  if(admin){
    accessToken = admin.accessToken
  }

  const handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    if (name === "price") {
      value = Number(value);
    }
    setProductInfo((prv) => ({ ...prv, [name]: value }));
  };

  const fileChangeHandler = (e) => {
    setFileData(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisFetching(true)
    // uploading the image first
    if (!fileData) {
      // change
      setisFetching(false)
      setMsgAndSeverity({msg: "Image required", severity:"error"})
      setOpen(true)
      return;
    }
    const data = new FormData();
    console.log(fileData);
    data.append("image", fileData);
    let filename;
    try {
      const result = await axios.post("/upload/single", data);
      filename = result.data;
    } catch ({ response }) {
      console.log(response);
      return;
    }

    try {
      const config = { headers: { token: `barear ${accessToken}` } };
      const body = {
        title: productInfo?.title,
        desc: productInfo?.desc,
        price: productInfo?.price,
        categories,
        size: sizesRef.current.value,
        color: colorsRef.current.value,
        img: filename,
      };
      const { data } = await axios.post("/products", body, config);
      console.log(data);
      setisFetching(false)
      setMsgAndSeverity({msg: "Product added Succesfully", severity: "success"})
      setOpen(true)
    } catch ({ response }) {
      console.log(response);
      setisFetching(false)
      setMsgAndSeverity({msg:"Something went wrong, please try again later!", severity:"error"})
      setOpen(true)
    }
  };

  const [open, setOpen] = useState(false)
  const [msgAndSeverity, setMsgAndSeverity] = useState({msg:"", severity:""})
  const [isFetching, setisFetching] = useState(false)
  // ***********************************************************************************

  return (
    <div className="newProduct">
      <h1 className="addProductTitle">New Product</h1>
      <form className="addProductForm" onSubmit={handleSubmit}>
        <div className="addProductItem">
          <label>Image</label>
          {/* try to change this */}
          <input type="file" id="file" onChange={fileChangeHandler} />
        </div>
        <Box sx={{ display: "flex", flexWrap: "wrap", width: "80%" }}>
          <TextField
            label="Product title"
            name="title"
            onChange={handleChange}
            id="outlined-start-adornment"
            sx={{ m: 1, width: "25ch" }}
          />
          <TextField
            label="Price"
            name="price"
            onChange={handleChange}
            id="outlined-start-adornment"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            sx={{ m: 1, width: "25ch" }}
          />
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel htmlFor="outlined-adornment-amount">
              Description
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              label="Description"
              name="desc"
              onChange={handleChange}
            />
          </FormControl>
          <FormControl fullWidth sx={{ m: 1 }}>
            <Autocomplete
              multiple
              sx={{ width: "70%" }}
              id="tags-outlined"
              options={categoriesList}
              name={"cat"}
              onChange={(e, value) => setCategories(value)}
              getOptionLabel={(option) => option}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Categories"
                  placeholder="Add a category"
                />
              )}
            />
          </FormControl>
          <MultipleSelect
            propsRef={sizesRef}
            list={sizesList}
            label={"Sizes"}
          />
          <MultipleSelect
            propsRef={colorsRef}
            list={colorsList}
            label={"Colors"}
          />
        </Box>
        <Button sx={{ m: 1 }} variant="contained" color="primary" type="submit" >
          {isFetching ?<CircularProgress color="success"/> : "ADD PRODUCT"}
        </Button>
        <CustomizedSnackbars open={open} setOpen={setOpen} msg={msgAndSeverity.msg} severity={msgAndSeverity.severity}/>
      </form>
    </div>
  );
}

const categoriesList = [
  "Clothes",
  "Shoes",
  "T-shirt",
  "Food",
  "Groceries",
  "Tools",
];
const sizesList = ["S", "L", "M", "XS", "XL", "XXL", "XXXL"];
const colorsList = ["White", "Yeloow", "Red", "Purple", "Blue", "Green"];
