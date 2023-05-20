import dayjs from "dayjs";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import { SemesterData } from "../../../../context/StudentProvider";

import { Pie, PieChart, Cell } from "recharts"
import { Box, Card, CardContent, Stack, Table, TableContainer, TableHead, TableBody, TableRow, Typography as Text, TableCell } from "@mui/material";




var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

function add(accumulator: number, a: number) {
    return accumulator + a;
}

const COLORS = ['green', 'red']

export const StudentAttendanceTable = ({ semData }: { semData: SemesterData }) => {




    return (
        <Box >
            {semData.Subjects.length !== 0 ?
                semData.Subjects.map((subject) => {

                    const present = subject.Attendance.reduce(add, 0);
                    const absent = subject.Attendance.length - present;
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
                        >
                            <PieChart width={200} height={180} >
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
                                    <Text>Attendance Data for  {subject.Name}- {subject.Code}</Text>
                                    <TableContainer >
                                        <Table >
                                            <TableHead>
                                                <TableRow >
                                                    {subject?.ClassesConducted?.map((date) => (<TableCell> {date}</TableCell>))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    {subject?.Attendance?.map((attendance) => (<TableCell>{attendance}</TableCell>))}
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>


                            </Stack>
                        </Card>
                    )
                })
                : <Text >No Data Available</Text>
            }

        </ Box>


    )
}

