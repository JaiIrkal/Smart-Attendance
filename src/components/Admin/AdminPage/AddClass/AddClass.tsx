import { Button, TextField, Stack, MenuItem, Divider, Typography, List, ListItem, Paper, Table, TableHead, TableCell, TableRow, TableBody, Box, Stepper, Step, StepLabel } from "@mui/material";
import { useFormik, FormikProvider, FormikHelpers, FormikValues } from "formik";
import * as yup from "yup"
import { useState, useContext, useEffect } from "react"
import { semList, TypeSemData } from "../../../../context/AdminContext";
import AdminContext from "../../../../context/AdminContext";
import api from "../../../../api/axiosConfig";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import styles from './AddClass.module.css'
import { GridKeyboardArrowRight } from "@mui/x-data-grid";
import { FormikStep, FormikStepper } from "../../../MultiStepForm/FormikStepper/FormikStepper";
import AssignTeachers from "./AssignTeachers";

const validationSchema = yup.object({

})


const AddClass: React.FC = () => {

    // useEffect(() => {
    //     const getSemesterData = async () => {
    //         await api.get(`/admin/semdata/${formik.values.branch}/${formik.values.semester}`)
    //             .then((response) => {
    //                 setSemData(response.data);
    //             }).catch((error) => {
    //                 console.error(error);
    //             })
    //     }
    //     if (formik.values.branch !== '' && formik.values.semester !== '') {
    //         getSemesterData()
    //     }
    //     return () => {

    //     }
    // }, [formik.values.branch, formik.values.semester])

    // useEffect(() => {
    //     let subjects: string[] = [];
    //     const getsubjects = () => {
    //         if (semData !== null) {
    //             semData.coresubjects.forEach((value) => {
    //                 subjects.push(value.code);
    //                 setSubjectIndex(map => new Map(map?.set(value.code, value.short)))

    //             });
    //             semData.branchelectives.forEach((value) => {
    //                 subjects.push(value.code);
    //                 setSubjectIndex(map => new Map(map?.set(value.code, value.short)))
    //             });
    //         }
    //     }
    //     setDivList(semData?.divlist)
    //     getsubjects()
    //     setSubjectList(subjects);
    // }, [semData])

    // useEffect(() => {
    //     formik.setFieldValue('subjects', subjectList);
    // }, [subjectList])

    return (

        <FormikStepper initialValues={{
            branch: '',
            semester: '',
            division: '',
            subjects: [],
            timetable: {
                Day_1: { P_1: '', P_2: '', P_3: '', P_4: '', P_5: '', P_6: '', P_7: '' },
                Day_2: { P_1: '', P_2: '', P_3: '', P_4: '', P_5: '', P_6: '', P_7: '' },
                Day_3: { P_1: '', P_2: '', P_3: '', P_4: '', P_5: '', P_6: '', P_7: '' },
                Day_4: { P_1: '', P_2: '', P_3: '', P_4: '', P_5: '', P_6: '', P_7: '' },
                Day_5: { P_1: '', P_2: '', P_3: '', P_4: '', P_5: '', P_6: '', P_7: '' },
                Day_6: { P_1: '', P_2: '', P_3: '', P_4: '', P_5: '', P_6: '', P_7: '' }
            },
        }
        }
            onSubmit={(values) => {
                console.log(values);
            }}
        >
            <FormikStep
                label="Assign Teachers"
            >


                <AssignTeachers />
            </FormikStep>

        </FormikStepper >

    )

}
export default AddClass;