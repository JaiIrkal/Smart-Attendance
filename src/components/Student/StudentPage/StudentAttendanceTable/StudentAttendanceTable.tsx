import dayjs from "dayjs";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import { SemesterData } from "../../../../context/StudentProvider";

import { Pie, PieChart, Cell } from "recharts"
import { Box, Card, CardContent, Stack, Table, TableContainer, TableHead, TableBody, TableRow, Typography as Text, TableCell, Typography } from "@mui/material";




var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

function add(accumulator: number, a: number) {
    return accumulator + a;
}

const COLORS = ['green', 'red']

export const StudentAttendanceTable = ({ semData }: { semData: SemesterData }) => {

    return (
        <Box >
            {semData.subjects.length !== 0 ?
                semData.subjects.map((subject) => {

                    const present = subject.attendance.reduce(add, 0);
                    const absent = subject.attendance.length - present;
                    const data = [
                        {
                            "Name": "Present",
                            'value': present
                        },
                        {
                            "Name": "Absent",
                            'value': absent
                        }
                    ]
                    return (
                        <Card

                            sx={{
                                border: "2px solid black",
                                margin: ["10px", "10px", "10px", "10px"],
                                boxShadow: "0px 0px 3px 7px blue"

                            }}
                        ><Stack direction={'row'}>
                                <PieChart width={200} height={220} >
                                    <Pie data={data} dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%" innerRadius={60}
                                        outerRadius={80} fill="#82ca9d" label>
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>

                                <Stack>
                                    <CardContent>
                                        <Text>Attendance Data for  {subject.subject_code}</Text>
                                        {subject.isdetained && <Typography color={'error'} fontSize={'1rem'}>Detained</Typography>}
                                        {subject.ClassesConducted.length === 0 ?
                                            <Box width={1} height={1} sx={{
                                            }}>
                                                <Typography color='error'>Attendance Data Not Available for this subject</Typography></Box>
                                            : present === 0 ? (<Typography color={'error'}>No Classes Attended</Typography>) : (<TableContainer >
                                                <Table >
                                                    <TableHead>
                                                        <TableRow >
                                                            {subject?.ClassesConducted?.map((date) => (<TableCell> {date}</TableCell>))}
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        <TableRow>
                                                            {subject?.ClassesConducted?.map((attendance, index) =>
                                                            (<TableCell>{subject.attendance[index] === 1 ?
                                                                <Typography color='green'>Present</Typography> :
                                                                <Typography color='red'>Absent</Typography>}</TableCell>))}
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>)}
                                    </CardContent>
                                </Stack>
                            </Stack>
                        </Card>
                    )
                })
                : <Text >No Data Available</Text>
            }

        </ Box>


    )
}

