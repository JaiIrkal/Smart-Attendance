import { Button, TextField, Stack, MenuItem, Divider, Typography, List, ListItem, Paper, Table, TableHead, TableCell, TableRow, TableBody, Box, Stepper, Step, StepLabel } from "@mui/material";
import { useFormik, FormikProvider } from "formik";
import * as yup from "yup"
import { useState, useContext, useEffect } from "react"
import { semList, TypeSemData } from "../../../../context/AdminContext";
import AdminContext from "../../../../context/AdminContext";
import api from "../../../../api/axiosConfig";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import styles from './AddClass.module.css'
import { GridKeyboardArrowRight } from "@mui/x-data-grid";

const validationSchema = yup.object({

})

const steps = ['Select Branch', 'Assign Teachers', 'Create TimeTable']



export const AddClass: React.FC = () => {
    const [divList, setDivList] = useState<string[] | undefined>([]);
    const [subjectList, setSubjectList] = useState<string[]>([''])
    const [subjectIndex, setSubjectIndex] = useState<Map<string, string>>();
    const { branchList } = useContext(AdminContext);
    const [semData, setSemData] = useState<TypeSemData | null>(null);
    const [message, setMessage] = useState('')
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set<number>());

    const isStepOptional = (step: number) => {
        return false;
    };

    const isStepSkipped = (step: number) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = () => {
        setActiveStep(0);
    };


    const formik = useFormik({
        initialValues: {
            branch: '',
            semester: '',
            division: '',
            subjects: [''],
            timetable: {
                Day_1: { P_1: '', P_2: '', P_3: '', P_4: '', P_5: '', P_6: '', P_7: '' },
                Day_2: { P_1: '', P_2: '', P_3: '', P_4: '', P_5: '', P_6: '', P_7: '' },
                Day_3: { P_1: '', P_2: '', P_3: '', P_4: '', P_5: '', P_6: '', P_7: '' },
                Day_4: { P_1: '', P_2: '', P_3: '', P_4: '', P_5: '', P_6: '', P_7: '' },
                Day_5: { P_1: '', P_2: '', P_3: '', P_4: '', P_5: '', P_6: '', P_7: '' },
                Day_6: { P_1: '', P_2: '', P_3: '', P_4: '', P_5: '', P_6: '', P_7: '' }
            },
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


    const subjectOptions = () => {

        return (
            subjectList.map((value, index) => {
                return (
                    <MenuItem key={index} value={value}>{subjectIndex?.get(value)}</MenuItem>
                )
            })
        )
    }


    return (

        <Box sx={{
            width: 1,
            height: 1,
            justifyContent: 'center',

        }}>
            <FormikProvider value={formik}>
                <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                    <Box sx={{ width: 1 }}>
                        <Stepper
                            activeStep={activeStep}
                            alternativeLabel
                            sx={{
                                width: 1,
                                alignSelf: 'center',
                                marginBottom: '10px'
                            }}
                        >
                            {
                                steps.map((label, index) => {

                                    const stepProps: { completed?: boolean } = {}
                                    const labelProps: {
                                        optional?: React.ReactNode;
                                    } = {};

                                    if (isStepOptional(index)) {
                                        labelProps.optional = (
                                            <Typography variant="caption">Optional</Typography>
                                        );
                                    }
                                    if (isStepSkipped(index)) {
                                        stepProps.completed = false;
                                    }

                                    return (
                                        <Step key={label} {...stepProps}>
                                            <StepLabel {...labelProps}>{label}</StepLabel>
                                        </Step>
                                    );

                                })
                            }
                        </Stepper>
                        <Divider orientation="horizontal" sx={{
                            mb: '20px'
                        }}></Divider>


                        {
                            activeStep === steps.length ? (<>
                                <Typography sx={{ mt: 2, mb: 1 }}>
                                    All steps completed - you&apos;re finished
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, }}>
                                    <Box sx={{ flex: '1 1 auto' }} />
                                    <Button onClick={handleReset}>Reset</Button>
                                </Box>
                            </>) : (
                                <>
                                    {
                                        activeStep === 0 ? (
                                            <Stack direction='column' gap='15px' justifyItems={'center'} >
                                                <Stack direction='row'
                                                    gap='50px'
                                                    justifyContent={'space-between'}
                                                    width={1}
                                                >
                                                    <Button
                                                        disabled={activeStep === 0}
                                                        onClick={handleBack}
                                                        variant='contained'
                                                        startIcon={<ArrowBackIosIcon />}
                                                        sx={{
                                                            left: 0,

                                                        }}
                                                    >
                                                        Back</Button>
                                                    <Button disabled={Boolean(formik.values.semester === '')}
                                                        variant='contained'
                                                        onClick={handleNext}
                                                        sx={{
                                                            right: 0,
                                                        }}
                                                        endIcon={<ArrowForwardIosIcon />}
                                                    >
                                                        Next
                                                    </Button>
                                                </Stack>
                                                <Stack direction={'row'} gap='15px' >
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
                                                        disabled={Boolean(formik.values.branch === '')}
                                                        select
                                                        name='semester'
                                                        label='Semester'
                                                        value={formik.values.semester}
                                                        onChange={formik.handleChange}
                                                        error={formik.touched.semester && Boolean(formik.errors.semester)}
                                                        helperText={formik.touched.semester && formik.errors.semester}
                                                    >
                                                        {semList(8)}
                                                    </TextField>
                                                    {divList?.length === 0 ? (<Typography>
                                                        No Existing Divisions Found!!
                                                    </Typography>) : (<>
                                                        <Typography>
                                                            Existing Divisions:  &nbsp;
                                                            {
                                                                divList?.map((values, index) => {
                                                                    return (<>
                                                                        {
                                                                            index === 0 ? (<Typography>
                                                                                {values}
                                                                            </Typography>) : (
                                                                                <Typography>
                                                                                    , &nbsf;{values}
                                                                                </Typography>
                                                                            )
                                                                        }
                                                                    </>)
                                                                })
                                                            }
                                                        </Typography>

                                                    </>)}


                                                </Stack>


                                            </Stack>
                                        ) : activeStep === 1 ? (<>
                                            <Divider orientation="horizontal" textAlign="left"><Typography>Subjects</Typography></Divider>
                                            <Stack direction={'row'}>
                                                <List>
                                                    <Typography> Core Subjects</Typography>
                                                    {semData?.coresubjects.map((subject, index) => (
                                                        <ListItem key={index}>{subject.code}-{subject.name}-{subject.short}</ListItem>
                                                    ))}
                                                </List>
                                                {semData?.branchelectives.length !== 0 ? <List>
                                                    <Typography>Branch Electives</Typography>
                                                    {semData?.branchelectives.map((subject, index) => (
                                                        <ListItem key={index}>{subject.code}- {subject.name}-{subject.short}</ListItem>
                                                    ))}
                                                </List> : null}
                                                {semData?.openelectives.length !== 0 ? <List>
                                                    <Typography>Open Electives</Typography>
                                                    {semData?.openelectives.map((subject, index) => (
                                                        <ListItem key={index}>{subject.code}- {subject.name}</ListItem>
                                                    ))}
                                                </List> : null}
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

                                                                    select
                                                                    name="timetable.Day_1.P_1"
                                                                    label="Select Subject"
                                                                    value={formik.values.timetable.Day_1.P_1}
                                                                    onChange={formik.handleChange}
                                                                >
                                                                    {subjectOptions()}
                                                                </TextField>
                                                            </TableCell>
                                                            <TableCell>
                                                                <TextField
                                                                    select
                                                                    name="timetable.Day_1.P_2"
                                                                    label="Select Subject"
                                                                    value={formik.values.timetable.Day_1.P_2}
                                                                    onChange={formik.handleChange}
                                                                >
                                                                    {subjectOptions()}
                                                                </TextField>
                                                            </TableCell>
                                                            <TableCell>Break</TableCell>
                                                            <TableCell>  <TextField
                                                                select
                                                                name="timetable.Day_1.P_3"
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_1.P_3}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                            <TableCell>  <TextField
                                                                select
                                                                name="timetable.Day_1.P_4"
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_1.P_4}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                            <TableCell>  <TextField
                                                                select
                                                                name="timetable.Day_1.P_5"
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_1.P_5}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                            <TableCell>Break</TableCell>
                                                            <TableCell>  <TextField
                                                                select
                                                                name='timetable.Day_1.P_6'
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_1.P_6}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                            <TableCell>  <TextField
                                                                select
                                                                name='timetable.Day_1.P_7'
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_1.P_7}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Tuesday</TableCell>
                                                            <TableCell>  <TextField
                                                                select
                                                                name='timetable.Day_1.P_1'
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_2.P_1}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                            <TableCell>  <TextField
                                                                select
                                                                name="timetable.Day_2.P_2"
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_2.P_2}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                            <TableCell>Break</TableCell>
                                                            <TableCell>  <TextField
                                                                select
                                                                name="timetable.Day_2.P_3"
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_2.P_3}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                            <TableCell>  <TextField
                                                                select
                                                                name="timetable.Day_2.P_4"
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_2.P_4}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                            <TableCell>  <TextField
                                                                select
                                                                name="timetable.Day_2.P_5"
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_2.P_5}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                            <TableCell>Break</TableCell>
                                                            <TableCell>  <TextField
                                                                select
                                                                name="timetable.Day_2.P_6"
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_2.P_6}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField>
                                                            </TableCell>
                                                            <TableCell>
                                                                <TextField
                                                                    select
                                                                    name="timetable.Day_2.P_7"
                                                                    label="Select Subject"
                                                                    value={formik.values.timetable.Day_2.P_7}
                                                                    onChange={formik.handleChange}
                                                                >
                                                                    {subjectOptions()}
                                                                </TextField>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Wednesday</TableCell>
                                                            <TableCell>  <TextField
                                                                select
                                                                label="Select Subject"
                                                                name="timetable.Day_3.P_1"
                                                                value={formik.values.timetable.Day_3.P_1}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                            <TableCell>  <TextField
                                                                select
                                                                name="timetable.Day_3.P_2"
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_3.P_2}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                            <TableCell>Break</TableCell>
                                                            <TableCell>  <TextField
                                                                select
                                                                name="timetable.Day_3.P_3"
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_3.P_3}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                            <TableCell>  <TextField
                                                                select
                                                                name="timetable.Day_3.P_4"
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_3.P_4}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                            <TableCell>  <TextField
                                                                select
                                                                name="timetable.Day_3.P_5"
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_3.P_5}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                            <TableCell>Break</TableCell>
                                                            <TableCell>  <TextField
                                                                select
                                                                name="timetable.Day_3.P_6"
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_3.P_6}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                            <TableCell>  <TextField
                                                                select
                                                                name="timetable.Day_3.P_7"
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_3.P_7}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Thursday</TableCell>
                                                            <TableCell>  <TextField
                                                                select
                                                                name="timetable.Day_4.P_1"
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_4.P_1}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                            <TableCell>  <TextField
                                                                select
                                                                name="timetable.Day_4.P_2"
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_4.P_2}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                            <TableCell>Break</TableCell>
                                                            <TableCell>  <TextField
                                                                select
                                                                name="timetable.Day_4.P_3"
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_4.P_3}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                            <TableCell>  <TextField
                                                                select
                                                                label="Select Subject"
                                                                name="timetable.Day_4.P_4"
                                                                value={formik.values.timetable.Day_4.P_4}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                            <TableCell>  <TextField
                                                                select
                                                                label="Select Subject"
                                                                name="timetable.Day_4.P_5"
                                                                value={formik.values.timetable.Day_4.P_5}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                            <TableCell>Break</TableCell>
                                                            <TableCell>  <TextField
                                                                select
                                                                name="timetable.Day_4.P_6"
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_4.P_6}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                            <TableCell>  <TextField
                                                                select
                                                                name="timetable.Day_4.P_7"
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_4.P_7}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Friday</TableCell>
                                                            <TableCell>  <TextField
                                                                select
                                                                name="timetable.Day_5.P_1"
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_5.P_1}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                            <TableCell>  <TextField
                                                                select
                                                                name="timetable.Day_5.P_2"
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_5.P_2}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                            <TableCell>Break</TableCell>
                                                            <TableCell> <TextField
                                                                select
                                                                name="timetable.Day_5.P_3"
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_5.P_3}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                            <TableCell> <TextField
                                                                select
                                                                name="timetable.Day_5.P_4"
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_5.P_4}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                            <TableCell> <TextField
                                                                select
                                                                name="timetable.Day_5.P_5"
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_5.P_5}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                            <TableCell>Break</TableCell>
                                                            <TableCell> <TextField
                                                                select
                                                                name="timetable.Day_5.P_6"
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_5.P_6}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                            <TableCell> <TextField
                                                                select
                                                                name="timetable.Day_5.P_7"
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_5.P_7}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Saturday</TableCell>
                                                            <TableCell> <TextField
                                                                select
                                                                name="timetable.Day_6.P_1"
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_6.P_1}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                            <TableCell><TextField
                                                                select
                                                                name="timetable.Day_6.P_2"
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_6.P_2}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                            <TableCell>Break</TableCell>
                                                            <TableCell><TextField
                                                                select
                                                                name="timetable.Day_6.P_3"
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_6.P_3}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                            <TableCell><TextField
                                                                select
                                                                name="timetable.Day_6.P_4"
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_6.P_4}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                            <TableCell><TextField
                                                                select
                                                                name="timetable.Day_6.P_5"
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_6.P_5}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                            <TableCell>Break</TableCell>
                                                            <TableCell><TextField
                                                                select
                                                                name="timetable.Day_6.P_6"
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_6.P_6}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                            <TableCell><TextField
                                                                select
                                                                name="timetable.Day_6.P_7"
                                                                label="Select Subject"
                                                                value={formik.values.timetable.Day_6.P_7}
                                                                onChange={formik.handleChange}
                                                            >
                                                                {subjectOptions()}
                                                            </TextField></TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </Paper>
                                        </>
                                        ) : (
                                            <>
                                                <Typography>Assign Teachers</Typography>
                                            </>
                                        )
                                    }
                                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                        <Box sx={{ flex: '1 1 auto' }} />
                                        {isStepOptional(activeStep) && (
                                            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                                Skip
                                            </Button>
                                        )}

                                    </Box>
                                </>
                            )
                        }
                        <Stack
                            sx={{
                                justifyContent: 'center'
                            }}
                            direction={'row'} gap='15px'>
                            <Button variant='outlined' type="reset">Reset</Button>
                        </Stack>
                    </Box>
                </form>
                <Typography fontSize='6xl'>{message}</Typography>
            </FormikProvider>
        </Box >
    )
}

export default AddClass;