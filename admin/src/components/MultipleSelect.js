import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState } from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


function getStyles(item, itemName, theme) {
  return {
    fontWeight:
      itemName.indexOf(item) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelect({propsRef, list, label}) {
  const theme = useTheme();
  const [items, setItems] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setItems(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-name-label">{label}</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={items}
          onChange={handleChange}
          inputRef={propsRef}
          input={<OutlinedInput label={label} />}
          MenuProps={MenuProps}
        >
          {list.map((items) => (
            <MenuItem
              key={items}
              value={items}
              style={getStyles(items, items, theme)}
            >
              {items}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
