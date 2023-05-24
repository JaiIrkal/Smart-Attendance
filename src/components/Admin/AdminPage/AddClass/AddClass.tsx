import { Button, TextField, Stack, MenuItem, Divider, Typography, List, ListItem, Paper, Table, TableHead, TableCell, TableRow, TableBody } from "@mui/material";
import { useFormik, FormikProvider } from "formik";
import * as yup from "yup"
import { useState, useContext, useEffect } from "react"
import { semList, TypeSemData } from "../../../../context/AdminContext";
import AdminContext from "../../../../context/AdminContext";
import api from "../../../../api/axiosConfig";

import styles from './AddClass.module.css'

const validationSchema = yup.object({

})

type DaySchedule = {
    P_1: string | null
    P_2: string | null
    P_3: string | null
    P_4: string | null
    P_5: string | null
    P_6: string | null
    P_7: string | null
}

type sampletimetable = {
    Day_1: DaySchedule
    Day_2: DaySchedule
    Day_3: DaySchedule
    Day_4: DaySchedule
    Day_5: DaySchedule
    Day_6: DaySchedule
}


export const AddClass: React.FC = () => {
    const [divList, setDivList] = useState<string[] | undefined>([]);
    const [timetable, setTimeTable] = useState<sampletimetable>({
        Day_1: { P_1: '', P_2: '', P_3: '', P_4: '', P_5: '', P_6: '', P_7: '' },
        Day_2: { P_1: '', P_2: '', P_3: '', P_4: '', P_5: '', P_6: '', P_7: '' },
        Day_3: { P_1: '', P_2: '', P_3: '', P_4: '', P_5: '', P_6: '', P_7: '' },
        Day_4: { P_1: '', P_2: '', P_3: '', P_4: '', P_5: '', P_6: '', P_7: '' },
        Day_5: { P_1: '', P_2: '', P_3: '', P_4: '', P_5: '', P_6: '', P_7: '' },
        Day_6: { P_1: '', P_2: '', P_3: '', P_4: '', P_5: '', P_6: '', P_7: '' }
    });

    const [subjectList, setSubjectList] = useState<string[]>([''])
    const [subjectIndex, setSubjectIndex] = useState<Map<string, string>>();
    const { branchList } = useContext(AdminContext);
    const [semData, setSemData] = useState<TypeSemData | null>(null);
    const [message, setMessage] = useState('')


    const formik = useFormik({
        initialValues: {
            branch: '',
            semester: '',
            division: '',
            subjects: [''],
            timetable: {},
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {

            console.log(JSON.stringify(values));
            // api.post(`/admin/createclass`, values).then((response) => {
            //     setMessage(response.data);
            // })
        },
        validateOnChange: false
    })
    useEffect(() => {
        const getSemesterData = async () => {
            await api.get(`/admin/semdata/${formik.values.branch}/${formik.values.semester}`)
                .then((response) => {
                    setSemData(response.data);
                }).catch((error) => {
                    console.error(error);
                })
        }
        if (formik.values.branch !== '' && formik.values.semester !== '') {
            getSemesterData()
        }
        return () => {

        }
    }, [formik.values.branch, formik.values.semester])

    useEffect(() => {
        let subjects: string[] = [];
        const getsubjects = () => {
            if (semData !== null) {
                semData.coresubjects.forEach((value) => {
                    subjects.push(value.code);
                    setSubjectIndex(map => new Map(map?.set(value.code, value.short)))

                });
                semData.branchelectives.forEach((value) => {
                    subjects.push(value.code);
                    setSubjectIndex(map => new Map(map?.set(value.code, value.short)))
                });
            }
        }
        setDivList(semData?.divlist)
        getsubjects()
        setSubjectList(subjects);
    }, [semData])

    useEffect(() => {
        formik.setFieldValue('subjects', subjectList);
    }, [subjectList])

    useEffect(
        () => {
            console.log(timetable?.Day_1.P_1)
        }
        , [timetable])




    return (
        <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                <Stack direction='column' gap='15px'>
                    <Stack direction={'row'} gap='15px'>
                        <TextField
                            sx={{
                                width: '25%',
                                minWidth: '100px'
                            }}
                            select
                            name='branch'
                            label="Branch"
                            value={formik.values.branch}
                            onChange={formik.handleChange}
                            error={formik.touched.branch && Boolean(formik.errors.branch)}
                            helperText={formik.touched.branch && formik.errors.branch}
                        >

                            {branchList.map((branch, index) => (<MenuItem key={index} value={branch}>{branch}</MenuItem>))}

                        </TextField>
                        <TextField
                            sx={{
                                width: '25%',
                                minWidth: '120px'
                            }}
                            select
                            name='semester'
                            label='Semester'
                            value={formik.values.semester}
                            onChange={formik.handleChange}
                            error={formik.touched.semester && Boolean(formik.errors.semester)}
                            helperText={formik.touched.semester && formik.errors.semester}
                        >
                            {
                                semList(8)
                            }
                        </TextField>
                        <TextField
                            sx={{
                                width: '25%',
                                minWidth: '110px'
                            }}
                            select
                            name='division'
                            label='Division'
                            value={formik.values.division}
                            onChange={formik.handleChange}
                            error={formik.touched.division && Boolean(formik.errors.division)}
                            helperText={formik.touched.division && formik.errors.division}
                        >


                            {divList && divList.map((div) => (<MenuItem value={div}
                                onClick={(event) => {
                                    formik.setFieldValue('divison', event.currentTarget.value);
                                }}
                            >{div}</MenuItem>))}


                            {divList && <MenuItem value=''
                                onClick={() => {
                                    if (divList.length === 0) {
                                        setDivList(['A'])
                                    } else {
                                        setDivList([...divList, String.fromCharCode(divList[divList.length - 1].charCodeAt(0) + 1)])
                                    }
                                }}>
                                <em>Add Another Division</em>
                            </MenuItem>}
                        </TextField>
                    </Stack>
                    <Divider orientation="horizontal" textAlign="left"><Typography>Subjects</Typography></Divider>
                    <Stack direction={'row'}>
                        <List>
                            <Typography> Core Subjects</Typography>
                            {
                                semData?.coresubjects.map((subject, index) => (
                                    <ListItem key={index}>{subject.code}-{subject.name}-{subject.short}</ListItem>
                                ))
                            }
                        </List>
                        <List>
                            <Typography>Branch Electives</Typography>
                            {
                                semData?.branchelectives.map((subject, index) => (
                                    <ListItem key={index}>{subject.code}- {subject.name}-{subject.short}</ListItem>
                                ))
                            }
                        </List>
                        <List>
                            <Typography>Open Electives</Typography>
                            {
                                semData?.openelectives.map((subject, index) => (
                                    <ListItem key={index}>{subject.code}- {subject.name}</ListItem>
                                ))
                            }
                        </List>
                    </Stack>

                    <Paper>
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
                                        <TextField
                                            sx={{
                                                width: '180px'
                                            }}
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_1.P_1}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_1: { ...timetable?.Day_1, P_1: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}-{subjectIndex?.get(value)}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField>
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_1.P_2}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_1: { ...timetable?.Day_1, P_2: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField>
                                    </TableCell>
                                    <TableCell>Break</TableCell>
                                    <TableCell>  <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_1.P_3}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_1: { ...timetable?.Day_1, P_3: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell>  <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_1.P_4}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_1: { ...timetable?.Day_1, P_4: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell>  <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_1.P_5}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_1: { ...timetable?.Day_1, P_5: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell>Break</TableCell>
                                    <TableCell>  <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_1.P_6}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_1: { ...timetable?.Day_1, P_6: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell>  <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_1.P_7}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_1: { ...timetable?.Day_1, P_7: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Tuesday</TableCell>
                                    <TableCell>  <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_2.P_1}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_2: { ...timetable?.Day_1, P_2: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell>  <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_2.P_2}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_2: { ...timetable?.Day_2, P_2: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell>Break</TableCell>
                                    <TableCell>  <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_2.P_3}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_2: { ...timetable?.Day_2, P_3: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell>  <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_2.P_4}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_2: { ...timetable?.Day_2, P_4: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell>  <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_2.P_5}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_2: { ...timetable?.Day_2, P_5: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell>Break</TableCell>
                                    <TableCell>  <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_2.P_6}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_2: { ...timetable?.Day_2, P_6: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell>  <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_2.P_7}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_2: { ...timetable?.Day_2, P_7: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Wednesday</TableCell>
                                    <TableCell>  <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_3.P_1}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_3: { ...timetable?.Day_3, P_1: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell>  <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_3.P_2}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_3: { ...timetable?.Day_3, P_2: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell>Break</TableCell>
                                    <TableCell>  <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_3.P_3}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_3: { ...timetable?.Day_3, P_3: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell>  <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_3.P_4}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_3: { ...timetable?.Day_3, P_4: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell>  <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_3.P_5}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_3: { ...timetable?.Day_3, P_5: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell>Break</TableCell>
                                    <TableCell>  <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_3.P_6}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_3: { ...timetable?.Day_3, P_6: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell>  <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_3.P_7}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_3: { ...timetable?.Day_3, P_7: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Thursday</TableCell>
                                    <TableCell>  <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_4.P_1}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_4: { ...timetable?.Day_4, P_1: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell>  <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_4.P_2}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_4: { ...timetable?.Day_4, P_2: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell>Break</TableCell>
                                    <TableCell>  <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_4.P_3}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_4: { ...timetable?.Day_4, P_3: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell>  <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_4.P_4}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_4: { ...timetable?.Day_4, P_4: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell>  <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_4.P_5}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_4: { ...timetable?.Day_4, P_5: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell>Break</TableCell>
                                    <TableCell>  <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_4.P_6}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_4: { ...timetable?.Day_4, P_6: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell>  <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_4.P_7}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_4: { ...timetable?.Day_4, P_7: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Friday</TableCell>
                                    <TableCell>  <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_5.P_1}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_5: { ...timetable?.Day_5, P_1: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell>  <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_5.P_2}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_5: { ...timetable?.Day_5, P_2: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell>Break</TableCell>
                                    <TableCell> <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_5.P_3}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_5: { ...timetable?.Day_5, P_3: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell> <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_5.P_4}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_5: { ...timetable?.Day_5, P_4: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell> <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_5.P_5}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_5: { ...timetable?.Day_5, P_5: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell>Break</TableCell>
                                    <TableCell> <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_5.P_6}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_5: { ...timetable?.Day_5, P_6: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell> <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_5.P_7}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_5: { ...timetable?.Day_5, P_7: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Saturday</TableCell>
                                    <TableCell> <TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_6.P_1}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_6: { ...timetable?.Day_6, P_1: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell><TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_6.P_2}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_6: { ...timetable?.Day_6, P_2: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell>Break</TableCell>
                                    <TableCell><TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_6.P_3}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_6: { ...timetable?.Day_6, P_3: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell><TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_6.P_4}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_6: { ...timetable?.Day_6, P_4: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell><TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_6.P_5}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_6: { ...timetable?.Day_6, P_5: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell>Break</TableCell>
                                    <TableCell><TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_6.P_6}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_6: { ...timetable?.Day_6, P_6: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                    <TableCell><TextField
                                            select
                                            label="Select Subject"
                                            value={timetable?.Day_6.P_7}
                                            onChange={(e) => {
                                                setTimeTable({ ...timetable, Day_6: { ...timetable?.Day_6, P_7: e.target.value } })
                                            }}
                                        >
                                            {
                                                subjectList.map((value, index) => {
                                                    return (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    )
                                                })
                                            }
                                        </TextField></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Paper>


                    <Stack
                        sx={{
                            justifyContent: 'center'
                        }}
                        direction={'row'} gap='15px' >

                        <Button variant='outlined' type="reset">Reset</Button>

                        <Button
                            sx={{
                                width: "20%"
                            }}
                            type="submit" variant='contained'>
                            Submit
                        </Button>
                    </Stack>


                </Stack>
            </form>

            <Typography fontSize='6xl'>{message}</Typography>

        </FormikProvider >
    )
}

export default AddClass;