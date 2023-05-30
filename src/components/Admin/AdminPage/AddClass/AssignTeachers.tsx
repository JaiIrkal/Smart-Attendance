
import { MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { useField } from 'formik'
import { useContext, useEffect } from 'react';
import AdminContext, { semList } from '../../../../context/AdminContext';

import { axiosPrivate as api } from '../../../../api/axiosConfig'

export default function AssignTeachers() {
    const [branchField, branchMeta, branchHelpers] = useField('branch');
    const [semesterField, semesterMeta, semesterHelpers] = useField('semester');

    const { branchList, semData, setSemData } = useContext(AdminContext);

    useEffect(() => {
        const getSemesterData = async () => {
            await api.get(`/admin/semdata/${branchField.value}/${semesterField.value}`)
                .then((response) => {
                    setSemData(response.data);
                }).catch((error) => {
                    console.error(error);
                })
        }
        if (branchField.value !== '' && semesterField.value !== '') {
            getSemesterData()
        }
        return () => {

        }
    }, [branchField.value, semesterField.value])

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

    return (
        <Stack direction={'column'} gap='25px'>

            <TextField
                select
                label='Select Branch'
                name='branch'
                value={branchField.value}
                onChange={(event) => {


                    branchHelpers.setValue(event.target.value);
                }}
                error={branchMeta.touched && Boolean(branchMeta.error)}
                helperText={branchMeta.touched && branchMeta.error}
            >
                {branchList.map((branch, index) => (<MenuItem key={index} value={branch}>{branch}</MenuItem>))}
            </TextField>
            <TextField
                sx={{
                    width: '25%',
                    minWidth: '120px'
                }}
                disabled={Boolean(branchField.value === '')}
                select
                name='semester'
                label='Semester'
                value={semesterField.value}
                onChange={semesterField.onChange}
                error={semesterMeta.touched && Boolean(semesterMeta.error)}
                helperText={semesterMeta.touched && semesterMeta.error}
            >
                {semList(8)}
            </TextField>

            <Typography>
                Already Existing Divisions

            </Typography>

        </Stack>
    )
}
