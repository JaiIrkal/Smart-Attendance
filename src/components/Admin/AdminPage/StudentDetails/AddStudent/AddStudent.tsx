import { Divider, MenuItem, Stack, TextField, Typography, Button } from "@mui/material";
import { FormikProvider, useFormik } from "formik";
import * as yup from "yup"
import dayjs from "dayjs";
import { useContext, useState, useCallback, useRef } from "react";
import AdminContext from "../../../../../context/AdminContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Webcam from 'react-webcam'

import api from '../../../../../api/axiosConfig'


const validationSchema = yup.object({

})

const videoConstraints = {
    width: 720,
    height: 360,
    facingMode: "user"
};


const AddStudent: React.FC = () => {
    const [isCaptureEnable, setCaptureEnable] = useState<boolean>(false);
    // const [imageSrc, setImageSrc] = useState(null);
    const [url, setUrl] = useState<string>('');
    const webcamRef = useRef<Webcam>(null);
    const capture = useCallback(
        () => {
            const imageSrc = webcamRef.current?.getScreenshot();
            setUrl(imageSrc ?? '');
            formik.setFieldValue('photo', url);
        },
        [webcamRef]
    );


    const { branchList } = useContext(AdminContext)

    const divList = ['A'];

    const formik = useFormik({
        initialValues: {
            usn: '',
            firstname: '',
            middlename: '',
            lastname: '',
            dob: dayjs(null),
            branch: '',
            semester: '',
            division: '',
            photo: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            api.post('/addstudent', values)
        }
    })


    return (
        <FormikProvider value={formik} >
            <form onSubmit={formik.handleSubmit} encType='multipart/form-data'>
                <Stack direction={'column'} gap='15px' rowGap='15px'
                    sx={{
                        height: '1000px'
                    }}>
                    <TextField
                        name="usn"
                        label="USN"
                        value={formik.values.usn}
                        onChange={formik.handleChange}
                    />
                    <Stack direction='row' gap='10px' rowGap={'15px'}>
                        <TextField
                            name='firstname'
                            label="First Name"
                            value={formik.values.firstname}
                            onChange={formik.handleChange}
                        />
                        <TextField
                            name="middlename"
                            label='Middle Name'
                            value={formik.values.firstname}
                            onChange={formik.handleChange}
                        />
                        <TextField
                            name="lastname"
                            label='Last Name'
                            value={formik.values.lastname}
                            onChange={formik.handleChange}
                        />
                    </Stack>
                    <Stack direction='row' gap='10px' rowGap={'15px'}>
                        <TextField
                            sx={
                                {
                                    width: '0.33'
                                }
                            }
                            select
                            name="branch"
                            label='Branch'
                            value={formik.values.branch}
                            onChange={formik.handleChange}
                        >
                            {branchList.map((branch, index) => (<MenuItem key={index} value={branch}>{branch}</MenuItem>))}
                        </TextField>

                        <TextField
                            sx={
                                {
                                    width: '0.33'
                                }
                            }
                            select
                            name='semester'
                            label='Semester'
                            value={formik.values.semester}
                            onChange={formik.handleChange}
                        >
                            {divList.map((div, index) => (
                                <MenuItem value={div} key={index}>{div}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            sx={
                                {
                                    width: '0.33'
                                }
                            }
                            select
                            name='division'
                            label='Division'
                            value={formik.values.division}
                            onChange={formik.handleChange}
                        >
                            {divList.map((div, index) => (
                                <MenuItem value={div} key={index}>{div}</MenuItem>
                            ))}
                        </TextField>
                    </Stack>

                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='en'>
                        <DatePicker
                            sx={{
                                width: '20%'
                            }}
                            format="DD-MMM-YYYY"
                            value={formik.values.dob}
                            onChange={(value) => formik.setFieldValue('dob', value)}
                            label='Date of Birth'
                        />
                    </LocalizationProvider>
                    <Divider orientation="horizontal" flexItem></Divider>
                    <Typography fontSize={'normal'}> Subjects</Typography>

                    <TextField
                        name="branchelective1"
                        label='Branch Elective 1'
                    ></TextField>


                    <input type={'file'} onChange={(event: any) => { }}></input>

                    {isCaptureEnable || (<Button onClick={() => setCaptureEnable(true)}>Take Picture</Button>)}

                    {isCaptureEnable ? <>
                        <Webcam
                            audio={false}
                            width={540}
                            height={360}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                        />
                        <Button onClick={capture}>capture</Button>
                        <Button onClick={() => { setCaptureEnable(false) }}>Cancel</Button>
                    </>
                        : <></>
                    }
                    <div>
                        <img src={url} alt="" />
                        <Button onClick={() => {
                            setUrl('');
                        }}>Delete</Button>
                    </div>
                    <Button variant='outlined' type="submit"> Submit</Button>

                </Stack>

            </form>

        </FormikProvider>
    )
}

export default AddStudent;