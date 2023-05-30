import { MenuItem, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { FieldConfig, useField } from 'formik';
import React, { useContext } from 'react'
import AdminContext from '../../../../context/AdminContext';
import styles from './AddClass.module.css'
interface SelectProps extends FieldConfig {
    label: string;
    children?: React.ReactNode;
    fullWidth?: boolean;
    sx?: {}
}

function CreateTimetable() {

    const { subjectIndex, subjectList } = useContext(AdminContext);

    function createMenuItem(value: string, key: string, map: Map<string, string>) {
        return (<MenuItem value={key} key={key}>{value}</MenuItem>)
    }

    const TimeTableField = ({ label, ...props }: SelectProps) => {
        const [field, meta, helpers] = useField(props.name);


        return (<TextField
            select
            label={label}
            {...field}
            {...props}
            error={meta.touched && Boolean(meta.error)}
            helperText={meta.touched && meta.error}
            sx={{

            }}
        >
            {subjectList.map((value, index) => (<MenuItem value={value} key={index}>{subjectIndex?.get(value)}</MenuItem>))}
        </TextField>)
    }


    return (
        <><Paper>
            <Table stickyHeader padding="normal" sx={{ border: 1, borderColor: "#27E1C1", borderWidth: 3 }}>
                <TableHead>
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
                <TableBody>
                    <TableRow>
                        <TableCell>Monday</TableCell>
                        <TableCell>
                            <TimeTableField label="Select Subject" name='timetable.Day_1.P_1' />
                        </TableCell>
                        <TableCell>
                            <TimeTableField label="Select Subject" name='timetable.Day_1.P_2' />
                        </TableCell>
                        <TableCell>Break</TableCell>
                        <TableCell><TimeTableField label="Select Subject" name='timetable.Day_1.P_3' /> </TableCell>
                        <TableCell><TimeTableField label="Select Subject" name='timetable.Day_1.P_4' /> </TableCell>
                        <TableCell><TimeTableField label="Select Subject" name='timetable.Day_1.P_5' />  </TableCell>
                        <TableCell>Break</TableCell>
                        <TableCell><TimeTableField label="Select Subject" name='timetable.Day_1.P_6' /></TableCell>
                        <TableCell><TimeTableField label="Select Subject" name='timetable.Day_1.P_7' /> </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Tuesday</TableCell>
                        <TableCell> <TimeTableField label="Select Subject" name='timetable.Day_2.P_1' /></TableCell>
                        <TableCell>  <TimeTableField label="Select Subject" name='timetable.Day_2.P_2' /></TableCell>
                        <TableCell>Break</TableCell>
                        <TableCell> <TimeTableField label="Select Subject" name='timetable.Day_2.P_3' /> </TableCell>
                        <TableCell><TimeTableField label="Select Subject" name='timetable.Day_2.P_4' /> </TableCell>
                        <TableCell><TimeTableField label="Select Subject" name='timetable.Day_2.P_5' />  </TableCell>
                        <TableCell>Break</TableCell>
                        <TableCell><TimeTableField label="Select Subject" name='timetable.Day_2.P_6' />
                        </TableCell>
                        <TableCell>
                            <TimeTableField label="Select Subject" name='timetable.Day_2.P_7' />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Wednesday</TableCell>
                        <TableCell>  <TimeTableField label="Select Subject" name='timetable.Day_3.P_1' /></TableCell>
                        <TableCell> <TimeTableField label="Select Subject" name='timetable.Day_3.P_2' /></TableCell>
                        <TableCell>Break</TableCell>
                        <TableCell><TimeTableField label="Select Subject" name='timetable.Day_3.P_3' />  </TableCell>
                        <TableCell> <TimeTableField label="Select Subject" name='timetable.Day_3.P_4' /></TableCell>
                        <TableCell>  <TimeTableField label="Select Subject" name='timetable.Day_3.P_5' /></TableCell>
                        <TableCell>Break</TableCell>
                        <TableCell><TimeTableField label="Select Subject" name='timetable.Day_3.P_6' />  </TableCell>
                        <TableCell> <TimeTableField label="Select Subject" name='timetable.Day_3.P_7' /> </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Thursday</TableCell>
                        <TableCell>  </TableCell>
                        <TableCell>  </TableCell>
                        <TableCell>Break</TableCell>
                        <TableCell>  </TableCell>
                        <TableCell>  </TableCell>
                        <TableCell>  </TableCell>
                        <TableCell>Break</TableCell>
                        <TableCell>  </TableCell>
                        <TableCell>  </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Friday</TableCell>
                        <TableCell></TableCell>
                        <TableCell>  </TableCell>
                        <TableCell>Break</TableCell>
                        <TableCell></TableCell>
                        <TableCell> </TableCell>
                        <TableCell> </TableCell>
                        <TableCell>Break</TableCell>
                        <TableCell> </TableCell>
                        <TableCell> </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Saturday</TableCell>
                        <TableCell> </TableCell>
                        <TableCell></TableCell>
                        <TableCell>Break</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell>Break</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Paper>

        </>
    )

}

export default CreateTimetable