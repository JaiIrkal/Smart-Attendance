
import { Paper, Table, TableHead, TableBody, TableCell, TableRow, Typography, Stack } from "@mui/material"
import { time } from "console"
import { useState, useEffect } from "react"


const BreakCell = () => {

    return (
        <TableCell size="small" align="center" sx={{
            borderWidth: "2px",
            borderColor: "#8294C4",
            fontSize: '1rem',
            fontFamily: 'sans-serif'
        }}>
            Break
        </TableCell>
    )
}

const DayCell = ({ day }: { day: string }) => {

    return (
        <TableCell variant="head" align="center" padding="none"
            sx={{
                borderColor: "#19A7CE",
                borderWidth: "3px",
                bgcolor: "#AFD3E2",
                fontSize: '1rem'
            }}>
            {day}

        </TableCell>
    )
}

const generateTableCell = (keyid: string, subjectName: string) => {

    return (
        <TableCell id={keyid} align="center" width={'60px'} padding="none"
            sx={{
                borderColor: "black",
                borderWidth: "2px",
                borderRight: 1,
                borderLeft: 1,
                bgcolor: "F6F1F1",
                alignContentL: 'center',
                justifyContent: 'center'
            }}>{subjectName === '' ? "-" : subjectName}</TableCell>
    )
}


const StudentTimeTable = ({ schedule }: { schedule: any }) => {

    const [timetable, setSchedule] = useState({
        Day_1: { P_1: '', P_2: '', P_3: '', P_4: '', P_5: '', P_6: '', P_7: '' },
        Day_2: { P_1: '', P_2: '', P_3: '', P_4: '', P_5: '', P_6: '', P_7: '' },
        Day_3: { P_1: '', P_2: '', P_3: '', P_4: '', P_5: '', P_6: '', P_7: '' },
        Day_4: { P_1: '', P_2: '', P_3: '', P_4: '', P_5: '', P_6: '', P_7: '' },
        Day_5: { P_1: '', P_2: '', P_3: '', P_4: '', P_5: '', P_6: '', P_7: '' },
        Day_6: { P_1: '', P_2: '', P_3: '', P_4: '', P_5: '', P_6: '', P_7: '' },
    })

    useEffect(() => {
        setSchedule(schedule)

        return () => {

        }
    }, [schedule])

    return (
        <Paper>
            {/* <Typography color={'#9336B4'}> Extra Classes </Typography>
            {
                schedule['extra'].map((value: any, index: number) => {

                    var day = '';
                    var time = '';
                    var id = value['key']
                    var arr = id.split('.')

                    if (arr[0] === 'Day_1')
                        day = 'Monday'
                    else if (arr[0] === 'Day_2')
                        day = 'Tuesday'
                    else if (arr[0] === 'Day_3')
                        day = 'Wednesday'
                    else if (arr[0] === 'Day_4')
                        day = 'Thursday'
                    else if (arr[0] === 'Day_5')
                        day = 'Friday'
                    else if (arr[0] === 'Day_6')
                        day = 'Saturday'

                    if (arr[1] === 'P_1')
                        time = '8:00'
                    else if (arr[1] === 'P_2')
                        time = '9:00'
                    else if (arr[1] === 'P_3')
                        time = '10:30'
                    else if (arr[1] === 'P_4')
                        time = '11:30'
                    else if (arr[1] === 'P_5')
                        time = '12:30'
                    else if (arr[1] === 'P_6')
                        time = '14:30'
                    else if (arr[1] === 'P_7')
                        time = '15:30'


                    return (
                        <Stack direction={'row'} gap='10px' >
                            <Typography>Day: {day} </Typography>
                            <Typography> Time: {time}</Typography>
                            <Typography> Subject:
                                {value['sub']}
                            </Typography>
                        </Stack>
                    )
                })
            } */}

            <Table stickyHeader padding="normal" sx={{ border: 1, borderColor: "#212A3E", borderWidth: 3 }}>



                <TableHead >
                    <TableRow >
                        <TableCell width={'60px'} align="center" sx={{ borderWidth: "2px", borderColor: "#146C94", bgcolor: "#19A7CE", }}>Day</TableCell>
                        <TableCell width={'60px'} align="center" sx={{ borderWidth: "1px", borderColor: "#146C94", bgcolor: "#19A7CE" }}>8:00 - 9:00</TableCell>
                        <TableCell width={'60px'} align="center" sx={{ borderWidth: "1px", borderColor: "#146C94", bgcolor: "#19A7CE" }}>9:00 - 10:00</TableCell>
                        <TableCell width={'60px'} align="center" sx={{ borderWidth: "1px", borderColor: "#146C94", bgcolor: "#19A7CE", }}>10:00 - 10:30</TableCell>
                        <TableCell width={'60px'} align="center" sx={{ borderWidth: "1px", borderColor: "#146C94", bgcolor: "#19A7CE" }}>10:30 - 11:30</TableCell>
                        <TableCell width={'60px'} align="center" sx={{ borderWidth: "1px", borderColor: "#146C94", bgcolor: "#19A7CE" }}>11:30 - 12:30</TableCell>
                        <TableCell width={'80px'} align="center" sx={{ borderWidth: "1px", borderColor: "#146C94", bgcolor: "#19A7CE" }}>12:30 - 1:30</TableCell>
                        <TableCell width={'80px'} align="center" sx={{ borderWidth: "1px", borderColor: "#146C94", bgcolor: "#19A7CE" }}>1:30 - 2:30</TableCell>
                        <TableCell width={'80px'} align="center" sx={{ borderWidth: "1px", borderColor: "#146C94", bgcolor: "#19A7CE" }}>2:30 - 3:30</TableCell>
                        <TableCell width={'80px'} align="center" sx={{ borderWidth: "1px", borderColor: "#146C94", bgcolor: "#19A7CE" }}>3:30 - 4:30</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody >
                    <TableRow>
                        <DayCell day="Monday"></DayCell>
                        {generateTableCell("Day_1.P_1", timetable?.Day_1?.P_1)}
                        {generateTableCell("Day_1.P_2", timetable?.Day_1?.P_2)}
                        <BreakCell />
                        {generateTableCell("Day_1.P_3", timetable?.Day_1?.P_3)}
                        {generateTableCell("Day_1.P_4", timetable?.Day_1?.P_4)}
                        {generateTableCell("Day_1.P_5", timetable?.Day_1?.P_5)}
                        <BreakCell />
                        {generateTableCell("Day_1.P_6", timetable?.Day_1?.P_6)}
                        {generateTableCell("Day_1.P_7", timetable?.Day_1?.P_7)}
                    </TableRow>
                    <TableRow>
                        <DayCell day="Tuesday"></DayCell>
                        {generateTableCell("Day_2.P_1", timetable?.Day_2?.P_1)}
                        {generateTableCell("Day_2.P_2", timetable?.Day_2?.P_2)}
                        <BreakCell />
                        {generateTableCell("Day_2.P_3", timetable?.Day_2?.P_3)}
                        {generateTableCell("Day_2.P_4", timetable?.Day_2?.P_4)}
                        {generateTableCell("Day_2.P_5", timetable?.Day_2?.P_5)}
                        <BreakCell />
                        {generateTableCell("Day_2.P_6", timetable?.Day_2?.P_6)}
                        {generateTableCell("Day_2.P_7", timetable?.Day_2?.P_7)}
                    </TableRow>
                    <TableRow>
                        <DayCell day="Wednesday"></DayCell>
                        {generateTableCell("Day_3.P_1", timetable?.Day_3?.P_1)}
                        {generateTableCell("Day_3.P_2", timetable?.Day_3?.P_2)}
                        <BreakCell />
                        {generateTableCell("Day_3.P_3", timetable?.Day_3?.P_3)}
                        {generateTableCell("Day_3.P_4", timetable?.Day_3?.P_4)}
                        {generateTableCell("Day_3.P_5", timetable?.Day_3?.P_5)}
                        <BreakCell />
                        {generateTableCell("Day_3.P_6", timetable?.Day_3?.P_6)}
                        {generateTableCell("Day_4.P_7", timetable?.Day_3?.P_7)}
                    </TableRow>
                    <TableRow>
                        <DayCell day="Thursday"></DayCell>

                        {generateTableCell("Day_4.P_1", timetable?.Day_4?.P_1)}
                        {generateTableCell("Day_4.P_2", timetable?.Day_4?.P_2)}
                        <BreakCell />
                        {generateTableCell("Day_4.P_3", timetable?.Day_4?.P_3)}
                        {generateTableCell("Day_4.P_4", timetable?.Day_4?.P_4)}
                        {generateTableCell("Day_4.P_5", timetable?.Day_4?.P_5)}
                        <BreakCell />
                        {generateTableCell("Day_4.P_6", timetable?.Day_4?.P_6)}
                        {generateTableCell("Day_4.P_7", timetable?.Day_4?.P_7)}
                    </TableRow>
                    <TableRow>
                        <DayCell day="Friday"></DayCell>
                        {generateTableCell("Day_5.P_1", timetable?.Day_5?.P_1)}
                        {generateTableCell("Day_5.P_2", timetable?.Day_5?.P_2)}
                        <BreakCell />
                        {generateTableCell("Day_5.P_3", timetable?.Day_5?.P_3)}
                        {generateTableCell("Day_5.P_4", timetable?.Day_5?.P_4)}
                        {generateTableCell("Day_5.P_5", timetable?.Day_5?.P_5)}
                        <BreakCell />
                        {generateTableCell("Day_5.P_6", timetable?.Day_5?.P_6)}
                        {generateTableCell("Day_5.P_7", timetable?.Day_5?.P_7)}
                    </TableRow>
                    <TableRow>
                        <DayCell day="Saturday"></DayCell>
                        {generateTableCell("Day_6.P_1", timetable?.Day_6?.P_1)}
                        {generateTableCell("Day_6.P_2", timetable?.Day_6?.P_2)}
                        <BreakCell />
                        {generateTableCell("Day_6.P_3", timetable?.Day_6?.P_3)}
                        {generateTableCell("Day_6.P_4", timetable?.Day_6?.P_4)}
                        {generateTableCell("Day_6.P_5", timetable?.Day_6?.P_5)}
                        <BreakCell />
                        {generateTableCell("Day_6.P_6", timetable?.Day_6?.P_6)}
                        {generateTableCell("Day_6.P_7", timetable?.Day_6?.P_7)}
                    </TableRow>
                </TableBody>
            </Table>
        </Paper >
    )
}

export default StudentTimeTable; 