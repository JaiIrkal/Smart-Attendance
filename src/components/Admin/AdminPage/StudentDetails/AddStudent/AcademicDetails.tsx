import { List, ListItem, MenuItem, Typography } from "@mui/material"
import Stack from "@mui/material/Stack/Stack"
import TextField from "@mui/material/TextField/TextField"
import { FieldArray, useField } from "formik"

import { useContext, useEffect, useState } from "react"
import AdminContext, { semList, TypeSemData } from "../../../../../context/AdminContext"
import api from '../../../../../api/axiosConfig'
import InputField from "../../../../MultiStepForm/InputField"

export const AcademicDetails = (snapshot: {}) => {

    const { branchList } = useContext(AdminContext)
    const [divList, setDivList] = useState<string[] | undefined>([])
    const [semData, setSemData] = useState<TypeSemData | null>(null)

    const [branchField, branchMeta, branchHelper] = useField('branch')
    const [semesterField, semesterMeta, semesterHelper] = useField('semester')

    const [divField, divMeta, divHelpers] = useField('division')

    const [branchelectiveField, branchElectiveMeta, branchElectiveHelper] = useField('branchelectives');
    const [openelectiveField, openelectiveMeta, openElectiveHelper] = useField('openelectives');
    const [coresubjectField, coresubjectMeta, coresubjectHelper] = useField('coresubjects');

    useEffect(() => {
        const getSemesterData = async () => {
            await api.get(`/admin/semdata/${branchField.value}/${semesterField.value}`)
                .then((response) => {
                    console.log(response.data);
                    setSemData(response.data);
                }).catch((error) => {
                    console.error(error);
                })

        }
        if (branchField.value !== '' && semesterField.value !== '') {
            getSemesterData()
        }
        return () => {
            console.log(semData)
        }
    }, [branchField.value, semesterField.value])

    useEffect(() => {
        setDivList(semData?.divlist);

        let coresubjects = semData?.coresubjects.flatMap((value) => value.code);

        coresubjectHelper.setValue(coresubjects);

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
                        value={branchelectiveField.value[i]}
                        onChange={branchelectiveField.onChange}
                        sx={{
                            width: '250px'
                        }}
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
                        value={openelectiveField.value[i]}
                        onChange={openelectiveField.onChange}
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

        <Stack direction='column' gap='10px' mt={'20px'}>

            <InputField
                label='Academic Year in which admission Taken'
                name="academicyear"
            />

            <TextField
                required
                select
                label="Branch"
                name="branch"
                value={branchField.value}
                onChange={(event) => {
                    semesterHelper.setTouched(false);
                    semesterHelper.setValue(null);
                    setSemData(null);
                    branchHelper.setValue(event.target.value, false);
                }}
                error={branchMeta.touched && Boolean(branchMeta.error)}
                helperText={branchMeta.touched && branchMeta.error}
            >
                {branchList.map((value, index) => (<MenuItem value={value} key={index}>{value}</MenuItem>))}
            </TextField>

            <TextField
                required
                select
                label="Semester"
                name="semester"
                value={semesterField.value}
                onChange={(event) => {
                    coresubjectHelper.setTouched(false);
                    coresubjectHelper.setValue([], false);
                    branchElectiveHelper.setTouched(false);
                    branchElectiveHelper.setValue([], false);
                    openElectiveHelper.setTouched(false);
                    openElectiveHelper.setValue([], false);
                    semesterHelper.setValue(event.target.value)
                }}
                error={semesterMeta.touched && Boolean(semesterMeta.error)}
                helperText={semesterMeta.touched && semesterMeta.error}
            >
                {
                    semList(1, 8)
                }
            </TextField>
            <TextField
                required
                label='Division'
                name='division'
                value={divField.value}
                onChange={divField.onChange}
                error={divMeta.touched && Boolean(divMeta.error)}
                helperText={divMeta.touched && divMeta.error}
            ></TextField>
            {semData &&
                <Stack direction={'row'} gap='20px'>
                    <Stack direction={'column'}>
                        <Typography>Core Subjects</Typography>
                        <List>
                            {
                                semData?.coresubjects.map(
                                    (subject, index) => {
                                        return (
                                            <ListItem key={index}> {subject.code}-{subject.name}</ListItem>
                                        )
                                    }
                                )
                            }
                        </List>
                    </Stack>
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
            }
        </Stack>
    )

}