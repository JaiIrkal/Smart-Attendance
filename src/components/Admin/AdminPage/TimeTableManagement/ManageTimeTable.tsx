import { ViewTimeTable } from "./VIewTImeTable"

import { useContext, useState } from "react"
import { InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import FormControl from "@mui/material/FormControl"
import AdminContext from "../../../../context/AdminContext"


export const ManageTimeTable = () => {

    const [className, setClassName] = useState("");
    const { branchList } = useContext(AdminContext);

    const handleChange = (event: SelectChangeEvent) => {
        setClassName(event.target.value);
    }

    return (
        <div>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-helper-label">Class</InputLabel>
                <Select
                    label="Select a Class"
                    defaultValue={className}
                    onChange={
                        handleChange
                    }
                    required
                    placeholder="Select Class"

                    sx={{ width: "150px", height: "40px" }}
                >
                    <MenuItem key={""} value="">None</MenuItem>
                    {
                        branchList.map((name) => (
                            <MenuItem key={name} value={name}>{name}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
            <ViewTimeTable className={'CSE_5_A'} />
            {className !== "" ? <ViewTimeTable className={'CSE_5_A'} /> : <div> Select a class</div>}
        </div>
    )
}