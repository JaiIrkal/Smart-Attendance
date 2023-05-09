import dayjs from "dayjs";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
    Button, Card, CardBody, CardFooter, Heading, List,
    ListItem, Stack, Image, Text, Flex, TableContainer, Table, TableCaption, Tr, Td, Th, Tbody
} from "@chakra-ui/react";
import { SemesterData } from "../../../../context/StudentProvider";

import { Pie, PieChart, Cell } from "recharts"
import { TableHead } from "@mui/material";




var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

function add(accumulator: number, a: number) {
    return accumulator + a;
}

const COLORS = ['green', 'red']

export const StudentAttendanceTable = ({ semData }: { semData: SemesterData }) => {




    return (
        <Flex width={'100%'} flexDir={'column'} minHeight='400px'>
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
                            direction={{ base: 'column', sm: 'row' }}
                            overflow='hidden'
                            variant='outline'
                        >
                            <PieChart width={730} height={250}>
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
                                <CardBody>
                                    <Text>Attendance Data for  {subject.Name}- {subject.Code}</Text>
                                    <TableContainer scrollBehavior={'auto'}>
                                        <Table variant={'simple'} border="2px solid" size={'sm'} minWidth='600px' maxWidth='800px'>
                                            <TableHead>
                                                <Tr border="2px solid">
                                                    {subject?.ClassesConducted?.map((date) => (<Th border="2px solid"> {date}</Th>))}
                                                </Tr>
                                            </TableHead>
                                            <Tbody>
                                                <Tr>
                                                    {subject?.Attendance?.map((attendance) => (<Td border="2px solid">{attendance}</Td>))}
                                                </Tr>
                                            </Tbody>
                                        </Table>
                                    </TableContainer>
                                </CardBody>


                            </Stack>
                        </Card>
                    )
                })
                : <Text align={'center'} justifySelf={'center'} fontSize='4xl'>No Data Available</Text>
            }



        </Flex>


    )
}

