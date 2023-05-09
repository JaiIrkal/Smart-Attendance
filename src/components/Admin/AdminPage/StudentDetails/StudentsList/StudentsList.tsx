import { Box, Button } from '@mui/material';
import { DataGrid, GridApi, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import api from '../../../../../api/axiosConfig'

import EditIcon from '@mui/icons-material/Edit';

const columns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'USN',
        width: 150
    },
    {
        field: 'Name',
        headerName: 'Student name',
        width: 200,
        // editable: true,
    },
    {
        field: 'Branch',
        headerName: 'Branch',
        width: 100,
        // editable: true
    },
    {
        field: 'Semester',
        headerName: 'Semester',
        width: 100,
        editable: true
    }, {
        field: 'Division',
        headerName: 'Division',
        width: 100
    }, {
        field: 'Batch',
        headerName: "Batch",
        width: 100
    }, {
        field: 'EditForm',
        headerName: 'Edit',
        width: 100,
        renderCell: (params) => {
            const onClick = (e: any) => {
                e.stopPropagation(); // don't select this row after clicking
                console.log(params['id']);
            };
            return <Button onClick={onClick} startIcon={<EditIcon />}>Edit</Button>;
        }
    }
];


export const StudentsList: React.FC = () => {

    const [listofstudents, setlistofstudents] = useState([]);

    const getlistofStudents = async () => {
        try {
            const response = await api.get('/students/all');
            setlistofstudents(response.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getlistofStudents();
    }, []);

    return (
        <Box sx={{ height: 400, width: 1000 }}>
            <DataGrid
                rows={listofstudents}
                columns={columns}
                checkboxSelection
                disableRowSelectionOnClick

            />

        </Box>
    )
}