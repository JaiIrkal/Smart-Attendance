
import { Autocomplete, Box, Divider, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { Field, FieldProps } from 'formik'
import { useContext, useEffect, useState } from 'react';
import AdminContext from '../../../../context/AdminContext';

import { axiosPrivate as api } from '../../../../api/axiosConfig'

export type teachertype = {
    id: string
    name: string
}

export default function AssignTeachers({ branch, semester }: { branch: string, semester: string, division: string }) {
    const { semData } = useContext(AdminContext);
    const [teacherList, setTeacherList] = useState<teachertype[] | null>(null);
    useEffect(() => {
        const getTeacherListOfBranch = async () => {
            await api.get(`/admin/teacherlist/${branch}`)
                .then((response) => {
                    setTeacherList(response.data);
                }).catch((error) => {
                    console.error(error);
                })
        }
        getTeacherListOfBranch();
    }, [])

    return (
        <Stack direction={'column'} gap='25px'>
            <Stack direction={'column'} gap='15px'>
                <Box sx={{
                    padding: '5px'
                }}>
                    <Divider orientation='horizontal' textAlign='left'> Core Subjects</Divider>
                    <Stack direction={'column'} gap='10px'>
                        {
                            semData?.coresubjects.map((value, index) => {
                                return (
                                    <Stack direction={'row'} alignItems='center' gap={'10px'} >
                                        <Typography>{value.name}</Typography>
                                        <Field
                                            name={`coresubjects[${index}].teacherid`}
                                        >
                                            {({ field, form }: FieldProps) =>
                                            (
                                                <Autocomplete
                                                    sx={{
                                                        width: '250px'
                                                    }}
                                                    {...field}
                                                    onChange={(event, value) => { form.setFieldValue(`coresubjects[${index}].teacherid`, value) }}
                                                    disablePortal
                                                    options={teacherList ?? []}
                                                    getOptionLabel={(option) => option.name}
                                                    renderInput={(params) => <TextField
                                                        required
                                                        {...params}
                                                        label="Select Teacher" />}
                                                />
                                            )
                                            }
                                        </Field>
                                    </Stack>
                                )
                            })
                        }
                    </Stack>
                </Box>
                <Box gap={'10px'}>
                    <Divider orientation='horizontal' textAlign='left'>Branch Elective Subjects</Divider>
                    <Stack direction={'column'} gap='10px'>
                        {
                            semData?.branchelectives.map((value, index) => {
                                return (
                                    <Stack direction={'row'} alignItems='center' gap={'10px'} >
                                        <Typography>{value.name}</Typography>
                                        <Field
                                            name={`branchelectives[${index}].teacherid`}
                                        >
                                            {({ field, form }: FieldProps) =>
                                            (
                                                <Autocomplete
                                                    sx={{
                                                        width: '250px'
                                                    }}
                                                    {...field}
                                                    onChange={(event, value) => { form.setFieldValue(`branchelectives[${index}].teacherid`, value) }}
                                                    disablePortal
                                                    options={teacherList ?? []}
                                                    getOptionLabel={(option) => option.name}
                                                    renderInput={(params) => <TextField
                                                        {...params}
                                                        label="Select Teacher" />}
                                                />
                                            )
                                            }
                                        </Field>
                                    </Stack>
                                )
                            })
                        }
                    </Stack>
                </Box>
            </Stack>
        </Stack>
    )
}
