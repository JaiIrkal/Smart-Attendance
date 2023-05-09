import { Paper, Table, TableBody, TableContainer, TableHead, TableCell, TableRow, Button } from "@mui/material";
import { useState } from 'react'
import { Flex } from "@chakra-ui/react"


import "./ClassAttendanceTable.css"

import api from "../../../../api/axiosConfig"
import { bgcolor, width } from "@mui/system";



export const ClassAttendanceTable = ({ data, subjectCode, className }: { data: any, subjectCode: string, className: string }) => {



    const [showDetainSelection, setShowDetainSelection] = useState(false);
    const [detainList, setDetainList] = useState<Array<string>>([])



    const onDetainClick = () => {
        setShowDetainSelection(!showDetainSelection);
    }

    return (

        <Flex flexDir='column'>
            <Flex justifyContent={'right'}
                sx={{ padding: "2px 2px 2px 2px" }}
            > {!showDetainSelection ? <Button
                variant='contained'
                size='medium'
                sx={{ width: '180px', borderRadius: '20px' }}
                onClick={() => { onDetainClick() }}
            >Select Detainees</Button> :
                <Button
                    variant='contained'
                    size='medium'
                    sx={{ width: '180px', borderRadius: '20px', ":hover": { bgcolor: 'red' } }}
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
            </Flex>

            <TableContainer component={Paper} sx={{ width: 1200, height: 600 }}>
                <Table stickyHeader size='medium' >
                    <TableHead >
                        <TableRow >
                            <TableCell sx={{ bgcolor: '#B0DAFF', left: 0, position: 'sticky', zIndex: 9999, width: '100px' }}>USN</TableCell>
                            <TableCell sx={{ bgcolor: '#B0DAFF', left: '100px', position: 'sticky', zIndex: 9999 }}>Name</TableCell>
                            {data.Classes_conducted.map((value: any) => (<TableCell sx={{ bgcolor: '#B0DAFF' }}>{value}</TableCell>))}
                            <TableCell sx={{ bgcolor: '#B0DAFF', right: 80, position: 'sticky', zIndex: 9999 }}>No. of Classes Attended</TableCell>
                            <TableCell sx={{ bgcolor: '#B0DAFF', right: 0, position: 'sticky', zIndex: 9999, width: '80px' }}> Attendance Percentage</TableCell>
                            {showDetainSelection ? <TableCell sx={{ bgcolor: '#B0DAFF' }}> Detain</TableCell> : <></>}
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

        </Flex >

    )
}