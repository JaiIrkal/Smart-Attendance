import { Paper, Table, TableBody, Stack, TableContainer, TableHead, TableCell, TableRow, Button, Box, CircularProgress, Dialog, DialogContent, DialogTitle, useTheme, TextField, MenuItem } from "@mui/material";
import { useState } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery';
import api from "../../../../api/axiosConfig"
import { Form, Formik, Field, FieldProps } from "formik";
import { FormProps } from "react-router-dom";

export const ClassAttendanceTable = ({ data, subjectCode, branch, semester, division }:
    { data: any, subjectCode: string, branch: string, semester: number, division: string }) => {
    const [submitting, setSubmitting] = useState(false);
    const [showSelection, setShowSelection] = useState(false);
    const [option, setOption] = useState(false);
    const [selectionList, setSelectionList] = useState<Array<string>>([]);

    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box flexDirection={'column'}>
            <Stack justifyContent={'left'} direction='row' gap='10px'
                sx={{ padding: "2px 2px 2px 2px" }}
            > {!option ?
                (<><Button
                    variant="contained"
                    sx={{
                        width: '180px',
                        borderRadius: '20px',
                        color: "#F6F1F1",
                        marginBottom: '5px'
                    }}
                    onClick={() => {
                        setShowSelection(!showSelection)
                        setOption(true)
                    }}
                >Select Students
                </Button>
                    <Button
                        variant='contained'
                        sx={{
                            borderRadius: '20px',
                            mb: '5px'
                        }}
                        onClick={handleClickOpen}>Schedule Extra Class</Button>

                </>
                )
                :
                <>
                    <Button
                        size='medium'
                        variant="contained"
                        className="detainButton"
                        color="error"
                        sx={{
                            width: '180px',
                            borderRadius: '20px',
                            marginBottom: '5px'
                        }}
                        startIcon={
                            submitting ? <CircularProgress size="1rem" /> : null
                        }
                        onClick={(event) => {
                            event.preventDefault()
                            if (selectionList.length !== 0) {
                                setSubmitting(true);
                                api.post('/detainStudents', {
                                    "branch": branch,
                                    "semester": semester,
                                    "division": division,
                                    "subjectName": subjectCode,
                                    "listofStudents": selectionList
                                }).then((response) => {
                                    if (response.status === 200) {
                                        setSelectionList([]);
                                        setShowSelection(false)
                                        setSubmitting(false);
                                        window.alert("Selected students have been Detained!!")
                                    }
                                }).catch((error) => { console.error(error); })
                            } else {
                                setShowSelection(false)
                                window.alert('No Student Selected')
                            }

                        }}
                    >{submitting ? 'Submitting' : 'Detain Selected'}</Button>
                    <Button
                        variant='contained'
                        color='error'
                        onClick={async () => {
                            await api.post('/teacher/sendwarning', {
                                "subjectName": subjectCode,
                                "listofStudents": selectionList
                            }).then((response) => {
                                if (response.status === 200) {
                                    setSelectionList([]);
                                    setShowSelection(false);
                                    window.alert("Warning sent to the selected Students.");
                                }
                            }).catch((error) => { console.log(error) })
                        }}
                    >
                        Send Warning
                    </Button>
                </>
                }
                {option && <Button
                    variant="contained"
                    color='warning'
                    sx={{
                        borderRadius: '20px'
                    }}
                    onClick={() => { setOption(false); setShowSelection(false); }}>Cancel</Button>}
            </Stack>

            <TableContainer component={Paper} sx={{ width: 1200, height: 600 }}>
                <Table stickyHeader size='medium' >
                    <TableHead >
                        <TableRow >
                            {showSelection && <TableCell sx={{
                                bgcolor: '#B0DAFF',
                                width: '80px', border: "2px solid #146C94", borderRight: '0'
                            }}>Selection</TableCell>}
                            <TableCell sx={{
                                bgcolor: '#B0DAFF',
                                width: '100px', border: "2px solid #146C94", borderRight: '0'
                            }}>USN</TableCell>
                            <TableCell sx={{ bgcolor: '#B0DAFF', border: "2px solid #146C94", borderRight: '0' }}>Name</TableCell>
                            {data.Classes_conducted.map((value: any) => (<TableCell sx={{ bgcolor: '#B0DAFF', border: "2px solid #146C94", borderRight: '0' }}>{value}</TableCell>))}
                            <TableCell sx={{ bgcolor: '#B0DAFF', border: "2px solid #146C94", borderRight: '0' }}>No. of Classes Attended</TableCell>
                            <TableCell sx={{ bgcolor: '#B0DAFF', width: '80px', border: "2px solid #146C94", }}> Attendance Percentage</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.StudentsAttendance.length !== 0 && data.StudentsAttendance.map((value: any) => {
                            const attendanceCount = value.Attendance.reduce((partialSum: number, a: number) => partialSum + a, 0)
                            const attendancePercent = attendanceCount / value.Attendance.length * 100;
                            return (
                                <TableRow>
                                    {showSelection ? <TableCell sx={{
                                        position: 'absolute',
                                    }}> <input type="checkbox" onChange={(event) => {
                                        var updatedList = [...selectionList];
                                        if (event.target.checked) {
                                            updatedList = [...selectionList, value.USN];
                                        } else {
                                            updatedList.splice(selectionList.indexOf(value.USN), 1);
                                        }
                                        console.log(updatedList)
                                        setSelectionList(updatedList);
                                    }}></input></TableCell> : <></>}
                                    {value.Detain ? <TableCell sx={{ bgcolor: '#ED2B2A' }}
                                    >
                                        {value.USN}</TableCell> :
                                        <TableCell sx={{ bgcolor: '#ADE4DB' }}
                                        >
                                            {value.USN}</TableCell>}
                                    <TableCell sx={{ bgcolor: 'white' }}>{value.Name}</TableCell>
                                    {data.Classes_conducted.map((i: number, index: number) => (<TableCell>{value.Attendance[index]}</TableCell>))}
                                    <TableCell sx={{ bgcolor: 'white', }}>{attendanceCount}</TableCell>
                                    <TableCell sx={{ bgcolor: 'white', }}>{attendancePercent.toPrecision(3) + "%"}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog
                scroll='paper'
                open={open}
                onClose={handleClose}
                fullScreen={fullScreen}
            >
                <DialogTitle> Schedule Class for {subjectCode}</DialogTitle>
                <DialogContent>
                    <Formik initialValues={{
                        day: '',
                        period: ''
                    }}
                        onSubmit={async (values) => {
                            await api.post('/teacher/schedule', {
                                "branch": branch,
                                "semester": semester,
                                "division": division,
                                "sub": subjectCode,
                                'day': values.day,
                                'period': values.period,
                            }
                            ).then((response) => {
                                if (response.status === 200) {
                                    handleClose()
                                    window.alert("Class Scheduled")
                                }

                            }).catch((error) => {
                                console.error(error);
                            })
                        }}>
                        <Form>
                            <Stack gap={'20px'} mt='10px'>
                                <Field name='day'>
                                    {({ field, form }: FieldProps) =>
                                    (
                                        <TextField
                                            fullWidth
                                            select
                                            {...field}
                                            label='Select Day'
                                        >
                                            <MenuItem value={1}>Monday</MenuItem>
                                            <MenuItem value={2}>Tuesday</MenuItem>
                                            <MenuItem value={3}>Wednesday</MenuItem>
                                            <MenuItem value={4}>Thursday</MenuItem>
                                            <MenuItem value={5}>Friday</MenuItem>
                                            <MenuItem value={6}>Saturday</MenuItem>
                                        </TextField>)}
                                </Field>

                                <Field name='period'>
                                    {({ field, form }: FieldProps) =>
                                    (
                                        <TextField
                                            fullWidth
                                            select
                                            {...field}
                                            label='Select Time'
                                        >
                                            <MenuItem value={1}>8:00</MenuItem>
                                            <MenuItem value={2}>9:00</MenuItem>
                                            <MenuItem value={3}>10:30</MenuItem>
                                            <MenuItem value={4}>11:30</MenuItem>
                                            <MenuItem value={5}>12:30</MenuItem>
                                            <MenuItem value={6}>14:30</MenuItem>
                                            <MenuItem value={7}>15:30</MenuItem>
                                        </TextField>)}
                                </Field>
                                <Button
                                    variant="contained"
                                    type="submit">Submit</Button>
                            </Stack>
                        </Form>
                    </Formik>
                </DialogContent>
            </Dialog>
        </Box >

    )
}