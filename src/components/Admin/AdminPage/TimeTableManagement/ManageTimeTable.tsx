import { ViewTimeTable } from "./VIewTImeTable"
import { Text } from "@chakra-ui/react"

import api from "../../../../api/axiosConfig"

import { useState, useEffect } from "react"
import { InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import FormControl from "@mui/material/FormControl"


export const ManageTimeTable: React.FC<{ classList: string[] }> = ({ classList }) => {

    const [className, setClassName] = useState("");

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
                        classList.map((name) => (
                            <MenuItem key={name} value={name}>{name}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
            {className !== "" ? <ViewTimeTable className={className} /> : <div> Select a class</div>}
        </div>
    )
}