import * as React from "react"
import { useEffect } from "react";
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from '@chakra-ui/react'
import { teacherData } from "./data"


function TeacherTable() {
    // get table column
    const column = Object.values(teacherData.Classes[0].Attendance[0].Classes_conducted);
    // get table heading data

    const ThData = () => {

        return teacherData.Classes[0].Attendance[0].Classes_conducted.map((data) => {

            return <Th key={data}>{data}</Th>
        })

    }
    // get table row data
    const tdData = () => {

        const studentData = teacherData.Classes[0].Attendance[0].StudentsAttendance;
        const classCount = teacherData.Classes[0].Attendance[0].Classes_conducted.length;
        return studentData.map((data) => {
            var studentAttendanceCount = 0;
            return (

                <Tr>
                    <Td>{data.USN}</Td>
                    <Td>{data.Name}</Td>
                    {

                        data.Attendance.map((record) => {

                            if (record == 1) {
                                studentAttendanceCount++;
                                return <Td>
                                    Present
                                </Td>
                            } else {
                                return <Td>
                                    Absent
                                </Td>
                            }


                        })
                    }
                    <Td>{studentAttendanceCount}</Td>
                    <Td>{(studentAttendanceCount / classCount * 100).toPrecision(2) + "%"}</Td>
                </Tr>

            )

        })
    }

    return (
        <TableContainer>
            <Table variant='simple' colorScheme={"teal"}>
                <Thead>
                    <Tr>
                        <Th>USN</Th>
                        <Th>Name</Th>
                        {ThData()}
                        <Th>Attendance Count</Th>
                        <Th>Percentage</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {tdData()}
                </Tbody>
            </Table>
        </TableContainer>

    )
}
export default TeacherTable