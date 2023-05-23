import { Box, Stack, TextField, Button, Divider, Typography } from "@mui/material"
import { FormikProvider, useFormik, } from "formik";
import * as yup from "yup"
import api, { axiosPrivate } from "../../../../../api/axiosConfig"
import { useEffect, useState } from "react";
import { StudentData } from "../../../../../context/StudentProvider";
import { MuiTelInput } from "mui-tel-input";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";


type TypeBasicStudent = {
    usn: string
    firstname: string
    middlename: string
    lastname: string
    dob: string
    mobile: string
    email: string
    parentsmobile: string
    parentsemail: string
}

const validationSchema = yup.object({

})


const EditStudent = ({ usn }: { usn: string }) => {
    const [loading, setLoading] = useState(false);
    const [studentData, setStudentData] = useState<TypeBasicStudent | null>(null);

    const formik = useFormik({
        initialValues: {
            usn: '',
            firstname: '',
            middlename: '',
            lastname: '',
            dob: '',
            mobile: '',
            email: '',
            parentsmobile: '',
            parentsemail: '',
        },
        onSubmit(values, formikHelpers) {
            console.log(values);
        },
        validationSchema: validationSchema
    })



    useEffect(() => {
        let isMounted = true;
        let controller = new AbortController();
        const fetchStudentData = async () => {
            try {
                setLoading(true);
                const response = await axiosPrivate.get('/admin/studentdata/'.concat(usn), {
                    signal: controller.signal
                })
                isMounted && setStudentData(response.data)

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchStudentData();
        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])

    useEffect(() => {
        if (studentData) {
            formik.setValues(studentData);
        }
        return () => {
        }
    }, [studentData])



    return (
        <>
            {
                (studentData == null) ?
                    <div>Loading....</div>
                    :
                    <FormikProvider value={formik}>
                        <form onSubmit={formik.handleSubmit} >
                            <Stack direction='column' gap='15px'
                                sx={{
                                    marginTop: '15px',
                                    minHeight: '600px',
                                    minWidth: '500px'
                                }}>
                                <TextField
                                    name="firstname"
                                    label='First Name'
                                    value={formik.values.firstname}
                                    onChange={formik.handleChange}
                                />
                                <TextField
                                    name='middlename'
                                    label='Middle Name'
                                    value={formik.values.middlename}
                                    onChange={formik.handleChange}
                                />
                                <TextField
                                    name="lastname"
                                    label='Last Name'
                                    value={formik.values.lastname}
                                    onChange={formik.handleChange}
                                />
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        value={''}
                                    />
                                </LocalizationProvider>
                                <MuiTelInput
                                    name="moblie"
                                    label="Mobile No."
                                    value={formik.values.mobile}
                                    onChange={formik.handleChange}
                                ></MuiTelInput>
                                <TextField
                                    name="email"
                                    type='email'
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                />
                                <Divider orientation='horizontal' textAlign="left"><Typography> Parent's Contact</Typography></Divider>
                                <MuiTelInput
                                    name="parentsmobile"
                                    value={formik.values.parentsmobile}
                                    onChange={formik.handleChange}
                                />
                                <TextField
                                    name='parentsemail'
                                    value={formik.values.parentsemail}
                                    onChange={formik.handleChange}

                                />

                                <Button
                                    variant="contained"
                                    type='submit'> Submit</Button>
                            </Stack>
                        </form>
                    </FormikProvider >

            }
        </>
    )
}

export default EditStudent;