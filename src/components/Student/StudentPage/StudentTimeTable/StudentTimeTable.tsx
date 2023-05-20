
import { Paper, Table, TableHead, TableBody, TableCell, TableRow } from "@mui/material"


type DaySchedule = {
    P_1: string
    P_2: string
    P_3: string
    P_4: string
    P_5: string
    P_6: string
    P_7: string
}

type sampletimetable = {
    Day_1: DaySchedule
    Day_2: DaySchedule
    Day_3: DaySchedule
    Day_4: DaySchedule
    Day_5: DaySchedule
    Day_6: DaySchedule
}


const BreakCell = () => {

    return (
        <TableCell size="small" sx={{
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
        <TableCell id={keyid} align="center" padding="none"
            sx={{
                borderColor: "#AFD3E2",
                borderWidth: "2px",
                bgcolor: "F6F1F1",
                alignContentL: 'center',
                justifyContent: 'center'

            }}>{subjectName === "" ? "-" : subjectName}</TableCell>
    )
}



const StudentTimeTable = ({ timetable }: { timetable: sampletimetable }) => {


    return (
        <Paper>

            <Table stickyHeader padding="normal" sx={{ border: 1, borderColor: "#212A3E", borderWidth: 3 }}>
                <TableHead >
                    <TableRow >
                        <TableCell sx={{ borderWidth: "2px", borderColor: "#146C94", bgcolor: "#19A7CE" }}>Day</TableCell>
                        <TableCell sx={{ borderWidth: "1px", borderColor: "#146C94", bgcolor: "#19A7CE" }}>8:00 - 9:00</TableCell>
                        <TableCell sx={{ borderWidth: "1px", borderColor: "#146C94", bgcolor: "#19A7CE" }}>9:00 - 10:00</TableCell>
                        <TableCell sx={{ borderWidth: "1px", borderColor: "#146C94", bgcolor: "#19A7CE" }}>10:00 - 10:30</TableCell>
                        <TableCell sx={{ borderWidth: "1px", borderColor: "#146C94", bgcolor: "#19A7CE" }}>10:30 - 11:30</TableCell>
                        <TableCell sx={{ borderWidth: "1px", borderColor: "#146C94", bgcolor: "#19A7CE" }}>11:30 - 12:30</TableCell>
                        <TableCell sx={{ borderWidth: "1px", borderColor: "#146C94", bgcolor: "#19A7CE" }}>12:30 - 1:30</TableCell>
                        <TableCell sx={{ borderWidth: "1px", borderColor: "#146C94", bgcolor: "#19A7CE" }}>1:30 - 2:30</TableCell>
                        <TableCell sx={{ borderWidth: "1px", borderColor: "#146C94", bgcolor: "#19A7CE" }}>2:30 - 3:30</TableCell>
                        <TableCell sx={{ borderWidth: "1px", borderColor: "#146C94", bgcolor: "#19A7CE" }}>3:30 - 4:30</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody >
                    <TableRow>
                        <DayCell day="Monday"></DayCell>
                        {generateTableCell("Day_1.P_1", timetable?.Day_1?.P_1)}
                        {generateTableCell("Day_1.P_2", timetable?.Day_1.P_2)}
                        <BreakCell />
                        {generateTableCell("Day_1.P_3", timetable?.Day_1.P_3)}
                        {generateTableCell("Day_1.P_4", timetable?.Day_1.P_4)}
                        {generateTableCell("Day_1.P_5", timetable?.Day_1.P_5)}
                        <BreakCell />
                        {generateTableCell("Day_1.P_6", timetable?.Day_1.P_6)}
                        {generateTableCell("Day_1.P_7", timetable?.Day_1.P_7)}
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