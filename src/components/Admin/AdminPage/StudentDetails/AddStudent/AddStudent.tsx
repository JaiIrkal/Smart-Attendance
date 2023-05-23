import { Divider, MenuItem, Stack, TextField, Typography, Button, Box, List, ListItem } from "@mui/material";
import { FieldArray, FormikProvider, useFormik } from "formik";
import * as yup from "yup"
import { useContext, useState, useCallback, useRef, useEffect } from "react";
import AdminContext from "../../../../../context/AdminContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Webcam from 'react-webcam'
import { TypeSemData, semList } from "../../../../../context/AdminContext";
import { MuiTelInput } from "mui-tel-input"

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
    const { branchList } = useContext(AdminContext)
    const [url, setUrl] = useState<string>('');
    const webcamRef = useRef<Webcam>(null);
    const [divList, setDivList] = useState<string[] | undefined>([])
    const [semData, setSemData] = useState<TypeSemData | null>(null)

    const capture = useCallback(
        () => {
            const imageSrc = webcamRef.current?.getScreenshot();
            setUrl(imageSrc ?? '');
            formik.setFieldValue('photo', url);
            setCaptureEnable(false);
        },
        [webcamRef]
    );


    const formik = useFormik({
        initialValues: {
            usn: '',
            firstname: '',
            middlename: '',
            lastname: '',
            dob: null,
            branch: '',
            semester: '',
            division: '',
            photo: '',
            email: '',
            mobile: '',
            parentemail: '',
            parentmobile: '',
            branchelectives: [
            ],
            openelectives: [],
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            console.log(values);
            // api.post('/admin/addstudent', values)
        }
    })

    const handleImageChange = async (e: any) => {
        const file = e.target.files[0]
        await fileToBase64(file).then((base) => {
            setUrl(base as string)
            formik.setFieldValue('photo', base as string);
        });

    }

    const fileToBase64 = (file: File) => {
        return new Promise(resolve => {
            var reader = new FileReader();
            reader.onload = function (event) {
                resolve(event.target?.result);
            };
            reader.readAsDataURL(file);
        });
    };

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

    const generateBranchElectiveFields = () => {
        if (semData?.noofbranchelectives) {
            const BranchElectiveFields = []
            for (let i = 0; i < semData?.noofbranchelectives; i++) {
                BranchElectiveFields.push(
                    <TextField
                        select
                        name={`branchelectives[${i}]`}
                        label={`Branch Elective ${i + 1}`}
                        value={formik.values.branchelectives[i]}
                        onChange={formik.handleChange}
                    >
                        {semData.branchelectives.map((branchelective, index) => (
                            <MenuItem key={index} value={branchelective.code}>{branchelective.name}</MenuItem>
                        ))}
                    </TextField>
                )
            }
            return BranchElectiveFields;
        }
    }
    const generateOpenElectiveFields = () => {
        if (semData?.noofopenelectives) {
            const OpenElectiveFields = []
            for (let i = 0; i < semData?.noofopenelectives; i++) {
                OpenElectiveFields.push(
                    <TextField
                        select
                        name={`openelectives[${i}]`}
                        label={`Open Elective ${i + 1}`}
                        value={formik.values.openelectives[i]}
                        onChange={formik.handleChange}
                    >
                        {semData.openelectives.map((openelective, index) => (
                            <MenuItem key={index} value={openelective.code}>{openelective.name}</MenuItem>
                        ))}
                    </TextField>
                )
            }
            return OpenElectiveFields;
        }
    }


    return (
        <Box
            sx={{
                height: '1000px',
                width: '1200px'
            }}
        >
            <FormikProvider value={formik} >
                <form onSubmit={formik.handleSubmit} encType='multipart/form-data'>
                    <Stack direction={'column'} gap='15px' rowGap='15px'
                        sx={{
                            height: '1000px'
                        }}>
                        <TextField
                            sx={{
                                boxShadow: "10px 10px 12px 2px #B8E7E1"
                            }}
                            name="usn"
                            label="USN"
                            value={formik.values.usn}
                            onChange={formik.handleChange}
                        />
                        <Divider orientation="horizontal" flexItem></Divider>
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
                                value={formik.values.middlename}
                                onChange={formik.handleChange}
                            />
                            <TextField
                                name="lastname"
                                label='Last Name'
                                value={formik.values.lastname}
                                onChange={formik.handleChange}
                            />
                        </Stack>
                        <LocalizationProvider dateAdapter={AdapterDayjs} dateFormats={{
                            fullDate: "DD-MMM-YYYY"
                        }}>
                            <DatePicker
                                sx={{
                                    width: '25%'
                                }}
                                disableFuture

                                format="DD-MM-YYYY"
                                value={formik.values.dob}
                                onChange={(value: any) => {
                                    formik.setFieldValue('dob', value);
                                }}
                                label='Date of Birth'

                            />
                        </LocalizationProvider>
                        <Stack direction='row' gap='10px'>
                            <MuiTelInput
                                name='mobile'
                                label="Mobile No."
                                value={formik.values.mobile}
                                onChange={(value) => formik.setFieldValue('mobile', value.toString)}
                                defaultCountry='IN'
                            />
                            <TextField
                                sx={{
                                    width: 0.5
                                }}
                                name='email'
                                label='Email'
                                value={formik.values.email}
                                onChange={formik.handleChange}
                            />
                        </Stack>
                        <Divider orientation="horizontal" textAlign="left" flexItem><Typography>Parent's Contact Info:</Typography> </Divider>

                        <Stack direction='row' gap='10px' >
                            <MuiTelInput
                                sx={{
                                    width: 0.5
                                }}
                                name='parentmobile'
                                label="Parent's Mobile No."
                                defaultCountry="IN"
                                value={formik.values.parentmobile}
                                onChange={(value) => formik.setFieldValue('parentmobile', value)}
                            />
                            <TextField
                                sx={{
                                    width: 0.5
                                }}
                                name='parentemail'
                                type='email'
                                label="Parent's Email"
                                value={formik.values.parentemail}
                                onChange={formik.handleChange}
                            />
                        </Stack>
                        <Divider orientation="horizontal" flexItem></Divider>
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
                                onChange={(e) => {
                                    formik.handleChange(e);
                                }}
                            >
                                {
                                    semList(8)
                                }
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
                                {divList ?
                                    divList.map((div, index) => (
                                        <MenuItem value={div} key={index}>{div}</MenuItem>
                                    )) :
                                    <MenuItem ><em>Loading..</em></MenuItem>}
                            </TextField>
                        </Stack>
                        <Divider orientation="horizontal" flexItem textAlign="left">
                            <Typography fontSize={'normal'}> Subjects
                            </Typography>
                        </Divider>

                        <Stack direction={'row'}>
                            <List>
                                {semData?.coresubjects.map(
                                    (subject, index) => (<ListItem key={index}>
                                        {subject.code} -{subject.name}
                                    </ListItem>))}
                            </List>

                            <FieldArray name="branchelectives"
                                render={(arrayHelpers) => (
                                    <Stack direction={'column'} gap='10px'>
                                        {generateBranchElectiveFields()}
                                    </Stack>
                                )}
                            />
                            <FieldArray name="openelectives"
                                render={(arrayHelpers) => (
                                    <Stack direction='column' gap='10px'>
                                        {generateOpenElectiveFields()}
                                    </Stack>
                                )}

                            />


                        </Stack>


                        <Divider orientation="horizontal" flexItem textAlign="left">
                            <Typography fontSize={'normal'}> Photo
                            </Typography>
                        </Divider>
                        {
                            url === '' ?
                                <Stack direction='row' gap='15px'>
                                    <TextField
                                        type='file'
                                        onChange={(event) => {
                                            handleImageChange(event)
                                        }}

                                    ></TextField>
                                    <Typography sx={{
                                        alignSelf: 'center',

                                    }}> OR</Typography>
                                    {isCaptureEnable || (
                                        <Button
                                            variant="outlined"
                                            onClick={() => setCaptureEnable(true)}>
                                            Take Picture</Button>)}

                                    {isCaptureEnable ? <Stack direction={'row'}>
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
                                    </Stack>
                                        : null
                                    }
                                </Stack>
                                :
                                <Stack
                                    gap={'10px'}
                                    direction={'row'}
                                    alignItems={'center'}
                                    sx={{

                                    }}>
                                    <img src={url} alt="" width={100} height={100} />
                                    <Button
                                        sx={{
                                            height: '40px',

                                        }}
                                        variant='contained'
                                        color='error'
                                        onClick={() => {
                                            setUrl('');
                                        }}>Delete
                                    </Button>
                                </Stack>
                        }
                        <Button variant='contained' type="submit"> Submit</Button>
                    </Stack>
                </form>
            </FormikProvider>
        </Box >
    )
}

export default AddStudent;