import { Paper, Table, TableBody, TableContainer, TableHead, TableCell, TableRow, Button, Box } from "@mui/material";
import { useState } from 'react'


import api from "../../../../api/axiosConfig"



export const ClassAttendanceTable = ({ data, subjectCode, className }: { data: any, subjectCode: string, className: string }) => {



    const [showDetainSelection, setShowDetainSelection] = useState(false);
    const [detainList, setDetainList] = useState<Array<string>>([])

    const onDetainClick = () => {
        setShowDetainSelection(!showDetainSelection);
    }

    return (

        <Box flexDirection={'column'}>
            <Box justifyContent={'right'}
                sx={{ padding: "2px 2px 2px 2px" }}
            > {!showDetainSelection ?
                <Button
                    variant="contained"
                    sx={{
                        width: '180px',
                        borderRadius: '20px',
                        color: "#F6F1F1",
                        marginBottom: '5px'
                    }}
                    onClick={() => { onDetainClick() }}
                >Select Detainees</Button> :
                <Button
                    size='medium'
                    className="detainButton"
                    onClick={() => {
                        api.post('/detainStudents', {
                            "className": className,
                            "subjectName": subjectCode,
                            "listofStudents": detainList
                        }).then((response) => {
                            console.log(response.data)
                            console.log(detainList);

                            setDetainList([]);
                            setShowDetainSelection(false)
                        }).catch((error) => { console.error(error); })

                    }}
                >Detain Selected</Button>}
            </Box>

            <TableContainer component={Paper} sx={{ width: 1200, height: 600 }}>
                <Table stickyHeader size='medium' >
                    <TableHead >
                        <TableRow >
                            <TableCell sx={{
                                bgcolor: '#B0DAFF',
                                left: 0, position: 'sticky',
                                zIndex: 9999, width: '100px', border: "2px solid #146C94", borderRight: '0'
                            }}>USN</TableCell>
                            <TableCell sx={{ bgcolor: '#B0DAFF', left: '100px', position: 'sticky', zIndex: 9999, border: "2px solid #146C94", borderRight: '0' }}>Name</TableCell>
                            {data.Classes_conducted.map((value: any) => (<TableCell sx={{ bgcolor: '#B0DAFF', border: "2px solid #146C94", borderRight: '0' }}>{value}</TableCell>))}
                            <TableCell sx={{ bgcolor: '#B0DAFF', right: 80, position: 'sticky', zIndex: 9999, border: "2px solid #146C94", borderRight: '0' }}>No. of Classes Attended</TableCell>
                            <TableCell sx={{ bgcolor: '#B0DAFF', right: 0, position: 'sticky', zIndex: 9999, width: '80px', border: "2px solid #146C94", }}> Attendance Percentage</TableCell>
                            {showDetainSelection ? <TableCell sx={{ bgcolor: '#B0DAFF', border: "2px solid #146C94" }}> Detain</TableCell> : <></>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.StudentsAttendance.map((value: any) => {
                            const attendanceCount = value.Attendance.reduce((partialSum: number, a: number) => partialSum + a)
                            const attendancePercent = attendanceCount / value.Attendance.length * 100;
                            return (
                                <TableRow>
                                    <TableCell sx={{ bgcolor: 'white', left: 0, position: 'sticky', zIndex: 9999 }}>{value.USN}</TableCell>
                                    <TableCell sx={{ bgcolor: 'white', left: '100px', position: 'sticky', zIndex: 9999 }}>{value.Name}</TableCell>
                                    {value.Attendance.map((i: number) => (<TableCell>{i}</TableCell>))}
                                    <TableCell sx={{ bgcolor: 'white', right: 80, position: 'sticky', zIndex: 9999 }}>{attendanceCount}</TableCell>
                                    <TableCell sx={{ bgcolor: 'white', right: 0, position: 'sticky', zIndex: 9999 }}>{attendancePercent.toPrecision(3) + "%"}</TableCell>
                                    {showDetainSelection ? <TableCell> <input type="checkbox" onChange={(event) => {
                                        var updatedList = [...detainList];
                                        if (event.target.checked) {
                                            updatedList = [...detainList, value.USN];
                                        } else {
                                            updatedList.splice(detainList.indexOf(value.USN), 1);
                                        }
                                        console.log(updatedList)
                                        setDetainList(updatedList);
                                    }}></input></TableCell> : <></>}
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

        </Box >

    )
}