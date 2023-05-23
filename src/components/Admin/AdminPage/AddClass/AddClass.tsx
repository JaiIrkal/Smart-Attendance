import { Button, Box, TextField, Stack, MenuItem, Divider, InputLabel, Typography, MenuList } from "@mui/material";
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as yup from "yup"
import { useState, useContext, useEffect } from "react"
import { semList, TypeSemData } from "../../../../context/AdminContext";
import AdminContext from "../../../../context/AdminContext";
import api from "../../../../api/axiosConfig";



const validationSchema = yup.object({

})



export const AddClass: React.FC = () => {
    const [divList, setDivList] = useState<string[] | undefined>([]);
    const { branchList } = useContext(AdminContext);
    const [semData, setSemData] = useState<TypeSemData | null>(null);
    const [message, setMessage] = useState('')


    const formik = useFormik({
        initialValues: {
            branch: '',
            semester: '',
            division: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            console.log(JSON.stringify(values));
            api.post(`/admin/createclass`, values).then((response) => {
                setMessage(response.data);
            })
        },
        validateOnChange: false
    })
    useEffect(() => {
        const getSemesterData = async () => {
            await api.get(`/admin/semdata/${formik.values.branch}/${formik.values.semester}`)
                .then((response) => {
                    console.log(response.data);
                    setSemData(response.data);
                }).catch((error) => {
                    console.error(error);
                })
        }
        if (formik.values.branch !== '' && formik.values.semester !== '') {
            getSemesterData()
        }
        return () => {
            console.log(semData)
        }
    }, [formik.values.branch, formik.values.semester])

    useEffect(() => {
        setDivList(semData?.divlist)
    }, [semData])


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