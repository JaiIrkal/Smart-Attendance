import { Box, Button, Dialog, DialogContent, DialogTitle, useTheme } from '@mui/material';
import { DataGrid, GridApi, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import api from '../../../../../api/axiosConfig'
import useMediaQuery from '@mui/material/useMediaQuery';

import EditIcon from '@mui/icons-material/Edit';
import EditStudent from '../EditStudent/EditStudent';


export const StudentsList: React.FC = () => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

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
        <Box sx={{}}>
            <DataGrid
                rows={listofstudents}
                columns={[
                    {
                        field: 'id',
                        headerName: 'USN',
                        width: 150,
                        filterable: true,
                        sortable: true,

                    },
                    {
                        field: 'Name',
                        headerName: 'Student name',
                        width: 200,
                    },
                    {
                        field: 'Branch',
                        headerName: 'Branch',
                        width: 100,
                    },
                    {
                        field: 'Semester',
                        headerName: 'Semester',
                        width: 100,
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
                            };
                            return <Button onClick={handleClickOpen} startIcon={<EditIcon />}>Edit</Button>;
                        }
                    }
                ]}
                checkboxSelection
                disableRowSelectionOnClick
            /><Dialog
                scroll='paper'
                open={open}
                onClose={handleClose}
                fullScreen={fullScreen}
            >
                <DialogTitle> Edit Student Form</DialogTitle>
                <DialogContent>
                    <EditStudent usn='2SD20CS017' />
                </DialogContent>

            </Dialog>

        </Box>
    )
}