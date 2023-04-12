
import { IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"

import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

import api from "../../../../api/axiosConfig"

// import { timetable } from "../../../../data";
import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import styles from "./TimeTable.module.css"
import { listofsubjects } from "../../../../data";



export const ViewTimeTable = ({ className }: { className: string }) => {

    type sampletimetable = {
        "Day_1"?: { "P_1"?: string; "P_2"?: string; "P_3"?: string; "P_4"?: string; "P_5"?: string; "P_6"?: string; "P_7"?: string; },
        "Day_2"?: { "P_1"?: string; "P_2"?: string; "P_3"?: string; "P_4"?: string; "P_5"?: string; "P_6"?: string; "P_7"?: string; },
        "Day_3"?: { "P_1"?: string; "P_2"?: string; "P_3"?: string; "P_4"?: string; "P_5"?: string; "P_6"?: string; "P_7"?: string; },
        "Day_4"?: { "P_1"?: string; "P_2"?: string; "P_3"?: string; "P_4"?: string; "P_5"?: string; "P_6"?: string; "P_7"?: string; },
        "Day_5"?: { "P_1"?: string; "P_2"?: string; "P_3"?: string; "P_4"?: string; "P_5"?: string; "P_6"?: string; "P_7"?: string; },
        "Day_6"?: { "P_1"?: string; "P_2"?: string; "P_3"?: string; "P_4"?: string; "P_5"?: string; "P_6"?: string; "P_7"?: string; },
        "Day_7"?: { "P_1"?: string; "P_2"?: string; "P_3"?: string; "P_4"?: string; "P_5"?: string; "P_6"?: string; "P_7"?: string; }
    }
    const obj: sampletimetable = {};
    const [timetable, setClassTimeTableData] = useState(obj);

    const [updatedSubject, setUpdatedSubject] = useState("");

    const [editCellId, setEditCellId] = useState("");

    const gettimetable = async (className: string) => {

        try {

            const url = "/timetable/".concat(className)
            const response = await api.get(url);
            setClassTimeTableData(response.data);

        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        console.log(className);
        gettimetable(className);
    }, [className])



    const BreakCell = () => {

        return (
            <TableCell size="small" sx={{ border: 1, borderColor: "#27E1C1", borderWidth: 3 }}>
                <Flex fontSize={'20px'} align='center' justify={'center'}>
                    Break
                </Flex >
            </TableCell>
        )
    }

    const DayCell = ({ day }: { day: string }) => {

        return (
            <TableCell variant="head" align="center" padding="none">
                <Typography fontSize={"30px"} bgcolor="gray" width={"100%"}>
                    {day}
                </Typography>
            </TableCell>
        )
    }

    const ReadOnlyCell = ({ keyid, subject }: { keyid: string, subject: string }) => {

        return (
            <TableCell size="small" sx={{ border: 1, borderColor: "#27E1C1", borderWidth: 3 }}>
                <Flex fontSize={'20px'} align='center' justify={'center'}>{subject}
                    <IconButton type="button" onClick={(event) => { handleEditClick(event, keyid) }}>
                        <EditIcon />
                    </IconButton>
                </Flex>
            </TableCell>
        )
    }
    const EditableCell = ({ keyid, subject }: { keyid: string, subject: string }) => {
        return (
            <TableCell size="small" sx={{ border: 1, borderColor: "#27E1C1", borderWidth: 3 }}>
                <form onSubmit={event => { event.preventDefault(); handleSubmitClick() }}>
                    <TextField
                        select
                        variant="filled"
                        label="Select Class"
                        fullWidth
                        size="medium"
                        onChange={event => { setUpdatedSubject(event.target.value) }}
                        SelectProps={{
                            native: true,
                        }}
                        defaultValue={subject}
                    >
                        {listofsubjects.map((sub) => (
                            <option key={sub.Subject_Name} value={sub.Subject_Name}>
                                {sub.Subject_Name}
                            </option>
                        ))}
                    </TextField>
                    <IconButton size='small' type="submit"
                    ><DoneIcon /></IconButton>
                    <IconButton type="button" onClick={(event) => { handleCancelClick(event) }}>
                        <CloseIcon />
                    </IconButton>
                </form>
            </TableCell>
        )
    }

    const subject = (temp: any) => {
        return temp ? temp : "No Class"
    }

    const handleEditClick = (event: any, key: string) => {
        event.preventDefault();
        setEditCellId(key)
    }

    const handleCancelClick = (event: any) => {
        event.preventDefault();
        setEditCellId("");
    }

    const handleSubmitClick = () => {
        console.log(updatedSubject);
        setUpdatedSubject("");

    }

    const generateTableCell = (keyid: string, subjectName?: string) => {

        if (editCellId === keyid) {
            return (<EditableCell keyid={keyid} subject={subject(subjectName)} />)
        }
        else {
            return (<ReadOnlyCell keyid={keyid} subject={subject(subjectName)} />)
        }
    }

    return (
        <Paper>

            <Table stickyHeader padding="normal" sx={{ border: 1, borderColor: "#27E1C1", borderWidth: 3 }}>
                <TableHead sx={{ border: 1, borderColor: "#27E1C1" }}>
                    <TableRow sx={{ border: 1, borderColor: "#27E1C1" }}>
                        <TableCell className={styles.tablehead}>Day</TableCell>
                        <TableCell className={styles.tablehead}>8:00 - 9:00</TableCell>
                        <TableCell className={styles.tablehead}>9:00 - 10:00</TableCell>
                        <TableCell className={styles.tablehead}>10:00 - 10:30</TableCell>
                        <TableCell className={styles.tablehead}>10:30 - 11:30</TableCell>
                        <TableCell className={styles.tablehead}>11:30 - 12:30</TableCell>
                        <TableCell className={styles.tablehead}>12:30 - 1:30</TableCell>
                        <TableCell className={styles.tablehead}>1:30 - 2:30</TableCell>
                        <TableCell className={styles.tablehead}>2:30 - 3:30</TableCell>
                        <TableCell className={styles.tablehead}>3:30 - 4:30</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody >
                    <TableRow>
                        <DayCell day="Monday"></DayCell>
                        {generateTableCell("Day_1.P_1", timetable.Day_1?.P_1)}
                        {generateTableCell("Day_1.P_2", timetable.Day_1?.P_2)}
                        <BreakCell />
                        {generateTableCell("Day_1.P_3", timetable.Day_1?.P_3)}
                        {generateTableCell("Day_1.P_4", timetable.Day_1?.P_4)}
                        {generateTableCell("Day_1.P_5", timetable.Day_1?.P_5)}
                        <BreakCell />
                        {generateTableCell("Day_1.P_6", timetable?.Day_1?.P_6)}
                        {generateTableCell("Day_1.P_7", timetable?.Day_1?.P_7)}
                    </TableRow>
                    <TableRow>
                        <DayCell day="Tuesday"></DayCell>
                        {generateTableCell("Day_2.P_1", timetable.Day_2?.P_1)}
                        {generateTableCell("Day_2.P_2", timetable.Day_2?.P_2)}
                        <BreakCell />
                        {generateTableCell("Day_2.P_3", timetable.Day_2?.P_3)}
                        {generateTableCell("Day_2.P_4", timetable.Day_2?.P_4)}
                        {generateTableCell("Day_2.P_5", timetable.Day_2?.P_5)}
                        <BreakCell />
                        {generateTableCell("Day_2.P_6", timetable.Day_2?.P_6)}
                        {generateTableCell("Day_2.P_7", timetable.Day_2?.P_7)}
                    </TableRow>
                    <TableRow>
                        <DayCell day="Wednesday"></DayCell>
                        {generateTableCell("Day_3.P_1", timetable.Day_3?.P_1)}
                        {generateTableCell("Day_3.P_2", timetable.Day_3?.P_2)}
                        <BreakCell />
                        {generateTableCell("Day_3.P_3", timetable.Day_3?.P_3)}
                        {generateTableCell("Day_3.P_4", timetable.Day_3?.P_4)}
                        {generateTableCell("Day_3.P_5", timetable.Day_3?.P_5)}
                        <BreakCell />
                        {generateTableCell("Day_3.P_6", timetable.Day_3?.P_6)}
                        {generateTableCell("Day_4.P_7", timetable.Day_3?.P_7)}
                    </TableRow>
                    <TableRow>
                        <DayCell day="Thursday"></DayCell>

                        {generateTableCell("Day_4.P_1", timetable.Day_4?.P_1)}
                        {generateTableCell("Day_4.P_2", timetable.Day_4?.P_2)}
                        <BreakCell />
                        {generateTableCell("Day_4.P_3", timetable.Day_4?.P_3)}
                        {generateTableCell("Day_4.P_4", timetable.Day_4?.P_4)}
                        {generateTableCell("Day_4.P_5", timetable.Day_4?.P_5)}
                        <BreakCell />
                        {generateTableCell("Day_4.P_6", timetable.Day_4?.P_6)}
                        {generateTableCell("Day_4.P_7", timetable.Day_4?.P_7)}
                    </TableRow>
                    <TableRow>
                        <DayCell day="Friday"></DayCell>
                        {generateTableCell("Day_5.P_1", timetable.Day_5?.P_1)}
                        {generateTableCell("Day_5.P_2", timetable.Day_5?.P_2)}
                        <BreakCell />
                        {generateTableCell("Day_5.P_3", timetable.Day_5?.P_3)}
                        {generateTableCell("Day_5.P_4", timetable.Day_5?.P_4)}
                        {generateTableCell("Day_5.P_5", timetable.Day_5?.P_5)}
                        <BreakCell />
                        {generateTableCell("Day_5.P_6", timetable.Day_5?.P_6)}
                        {generateTableCell("Day_5.P_7", timetable.Day_5?.P_7)}
                    </TableRow>
                    <TableRow>
                        <DayCell day="Saturday"></DayCell>

                        {generateTableCell("Day_6.P_1", timetable.Day_6?.P_1)}
                        {generateTableCell("Day_6.P_2", timetable.Day_6?.P_2)}
                        <BreakCell />
                        {generateTableCell("Day_6.P_3", timetable.Day_6?.P_3)}
                        {generateTableCell("Day_6.P_4", timetable.Day_6?.P_4)}
                        {generateTableCell("Day_6.P_5", timetable.Day_6?.P_5)}
                        <BreakCell />
                        {generateTableCell("Day_6.P_6", timetable.Day_6?.P_6)}
                        {generateTableCell("Day_6.P_7", timetable.Day_6?.P_7)}
                    </TableRow>
                </TableBody>
            </Table>
        </Paper >
    )
}