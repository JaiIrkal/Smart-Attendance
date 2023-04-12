import { ViewTimeTable } from "./VIewTImeTable"
import { Text } from "@chakra-ui/react"

import api from "../../../../api/axiosConfig"

import { useState, useEffect } from "react"
import { MenuItem, Select, SelectChangeEvent } from "@mui/material"


export const ManageTimeTable: React.FC = () => {

    const [className, setClassName] = useState("");

    const [classList, setClassList] = useState([""]);


    const getlistofClass = async () => {

        try {
            const response = await api.get('/listofclass');
            setClassList(response.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getlistofClass();
    }, [])

    const handleChange = (event: SelectChangeEvent) => {
        setClassName(event.target.value);
    }

    return (
        <div>
            <Text>
                Select the class:
            </Text>

            <Select
                label="Select a Class"
                defaultValue={className}
                onChange={
                    handleChange
                }
            >
                <MenuItem key={""} value=""> None</MenuItem>
                {
                    classList.map((name) => (
                        <MenuItem key={name} value={name}>{name}</MenuItem>
                    ))
                }

            </Select>



            {className !== "" ? <ViewTimeTable className={className} /> : <div> Select a class</div>}
        </div>
    )
}