import { ViewTimeTable } from "./VIewTImeTable"
import { useContext, useEffect, useState } from "react"
import { Box, InputLabel, MenuItem, Stack, TextField, } from "@mui/material"
import AdminContext from "../../../../context/AdminContext"
import { FormikProvider, useFormik } from "formik"
import api from '../../../../api/axiosConfig'





export const ManageTimeTable = () => {
    const { branchList, semList } = useContext(AdminContext);
    const [divListLoading, setDivListLoading] = useState(false);
    const [divisionSelectDisable, setDivisionSelectDisable] = useState(true);
    const [divList, setDivList] = useState<string[]>([])

    const formik = useFormik({
        initialValues: {
            branch: '',
            semester: '',
            division: ''
        },
        onSubmit(values, formikHelpers) {

            console.log(values);

        },
    })

    useEffect(() => {
        const getDivList = async () => {
            setDivListLoading(true);
            await api.get(`/admin/divlist/${formik.values.branch}/${formik.values.semester}`)
                .then((response) => {
                    console.log(response.data);
                    setDivList(response.data);
                }).catch((error) => {
                    console.error(error)
                }).finally(() => {
                    setDivisionSelectDisable(false);
                    setDivListLoading(false);
                })
        }
        if (formik.values.branch !== '' && formik.values.semester !== '') { getDivList(); }
    }, [formik.values.branch, formik.values.semester])

    return (
        <Box width='900px'>
            <FormikProvider value={formik}>
                <form>
                    <Stack direction={'row'} gap='15px' mb={'15px'}>

                        <TextField
                            sx={{
                                width: '0.33'
                            }}
                            select
                            name="branch"
                            label='Branch'
                            value={formik.values.branch}
                            onChange={formik.handleChange}
                        >
                            {branchList.map((branch, index) => (
                                <MenuItem
                                    value={branch}
                                    key={index}>
                                    {branch}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            sx={{
                                width: '0.33'
                            }}
                            select
                            name='semester'
                            label='Semester'
                            value={formik.values.semester}
                            onChange={formik.handleChange}
                        >
                            {
                                semList.map((sem, index) => (
                                    <MenuItem key={index} value={sem}>{sem}</MenuItem>
                                ))
                            }
                        </TextField>
                        <TextField
                            sx={{
                                width: '0.33'
                            }}
                            select
                            disabled={divisionSelectDisable}
                            name="division"
                            label='Division'
                            value={formik.values.division}
                            onChange={formik.handleChange}
                        >
                            {divListLoading ?
                                <MenuItem><em>Loading</em></MenuItem>
                                :
                                divList?.map((div, index) => (
                                    <MenuItem value={div} key={index}>
                                        {div}
                                    </MenuItem>
                                ))}
                        </TextField>
                    </Stack >
                </form>
            </FormikProvider>
            {(formik.values.branch !== '' && formik.values.semester !== '' && formik.values.division !== '') ?
                <ViewTimeTable
                    branch={formik.values.branch}
                    semester={formik.values.semester}
                    division={formik.values.division} />
                :
                null
            }
        </Box>
    )
}