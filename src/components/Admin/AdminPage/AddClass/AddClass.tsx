import { Button, Box, TextField, Stack, MenuItem, Divider, InputLabel, Typography } from "@mui/material";
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as yup from "yup"
import { useState } from "react"


const validationSchema = yup.object({

})



export const AddClass: React.FC = () => {

    const [divList, setDivList] = useState(['A'])


    const DeptList = ['CSE', 'ISE', 'MECH', 'CHEM', 'CIVIL', 'ECE', 'EEE']
    const SemList = ['1', '2', '3', '4', '5', '6', '7', '8']





    const formik = useFormik({
        initialValues: {
            branch: '',
            semester: '',
            division: '',
            subjects: [{
                code: '',
                shortform: '',
                fullname: ''
            }]
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            alert(JSON.stringify(values));
            console.log(JSON.stringify(values));
        },
        validateOnChange: false
    })


    return (
        <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                <Stack direction='column' gap='15px'>
                    <Stack direction={'row'} gap='15px'>
                        <TextField
                            sx={{
                                width: '25%'
                            }}
                            select
                            id='branch'
                            name='branch'
                            label="Branch"
                            value={formik.values.branch}
                            onChange={formik.handleChange}
                            error={formik.touched.branch && Boolean(formik.errors.branch)}
                            helperText={formik.touched.branch && formik.errors.branch}
                        >
                            {
                                DeptList.map((dept, j) => {
                                    return (
                                        <MenuItem value={dept} key={j}>{dept}</MenuItem>
                                    )
                                })
                            }
                        </TextField>
                        <TextField
                            sx={{ width: '25%' }}
                            select
                            id='semester'
                            name='semester'
                            label='Semester'
                            value={formik.values.semester}
                            onChange={formik.handleChange}
                            error={formik.touched.semester && Boolean(formik.errors.semester)}
                            helperText={formik.touched.semester && formik.errors.semester}
                        >
                            {SemList.map((sem) => {
                                return (<MenuItem value={sem}>{sem}</MenuItem>)
                            })}
                        </TextField>
                        <TextField
                            sx={{ width: '25%' }}
                            select
                            id='division'
                            name='division'
                            label='Division'
                            value={formik.values.division}
                            onChange={formik.handleChange}
                            error={formik.touched.division && Boolean(formik.errors.division)}
                            helperText={formik.touched.division && formik.errors.division}
                        >
                            {divList.map((div) => {
                                return (
                                    <MenuItem value={div}>{div}</MenuItem>
                                )
                            })}
                            <MenuItem value='' onClick={() => {
                                setDivList([...divList, String.fromCharCode(divList[divList.length - 1].charCodeAt(0) + 1)])
                            }}><em>Add Another Division</em></MenuItem>
                        </TextField>
                    </Stack>

                    <Divider orientation="horizontal" flexItem />
                    Subjects
                    <Stack direction={'column'} gap='15px'>
                        <FieldArray
                            name="subjects"
                            validateOnChange={false}
                            render={(arrayHelpers) => (
                                <Stack direction={'column'} gap='10px'>
                                    {formik.values.subjects.map((subject, index) => {
                                        return (<Stack direction={'row'} gap='10px' key={`subject${index}`} alignContent='center'>
                                            <Typography sx={{
                                                alignSelf: 'center'
                                            }}

                                            >Subject {index + 1}</Typography>
                                            <TextField
                                                name={`subjects[${index}].code`}
                                                label="Subject Code"
                                                value={formik.values.subjects[index].code}
                                                onChange={formik.handleChange}
                                            />
                                            <TextField
                                                name={`subjects[${index}].shortform`}
                                                label="Subject Abbr."
                                                value={formik.values.subjects[index].shortform}
                                                onChange={formik.handleChange}
                                            />
                                            <TextField
                                                name={`subjects[${index}].fullname`}
                                                label="Subject Abbr."
                                                value={formik.values.subjects[index].fullname}
                                                onChange={formik.handleChange}
                                            />
                                            <Button
                                                variant="outlined"
                                                color="warning"
                                                onClick={() => {
                                                    arrayHelpers.remove(index);
                                                }}>remove</Button>
                                        </Stack>
                                        )
                                    })}
                                    <Button
                                        variant='contained'
                                        sx={{ width: '25%' }}
                                        onClick={() => {
                                            arrayHelpers.push({
                                                code: '',
                                                shortform: '',
                                                fullname: ''
                                            });
                                        }}
                                    >Add Subject</Button>
                                </Stack>
                            )
                            }
                        />
                    </Stack>
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

        </FormikProvider>
    )
}

export default AddClass;