import { FormikValues, FormikHelpers } from "formik";
import { FormikStep, FormikStepper } from "../../../../MultiStepForm/FormikStepper/FormikStepper";
import { BasicDetailsForm } from "./BasicDetailsForm";
import PhotoUpload from "./PhotoUpload";
import * as Yup from 'yup';
import { AcademicDetails } from "./AcademicDetails";
import { axiosPrivate } from "../../../../../api/axiosConfig";
import { useRef } from "react";
import { error } from "console";

const initialValues = {
    usn: '',
    firstname: '',
    middlename: '',
    lastname: '',
    dob: null,
    mobile: '',
    email: '',
    parentsmobile: '',
    parentsemail: '',
    branch: '',
    semester: '',
    division: '',
    academicyear: '',
    photo: '',
    coresubjects: [],
    branchelectives: [
    ],
    openelectives: [],

}



const AddStudent = () => {
    return (
        <FormikStepper
            initialValues={initialValues}
            validateOnChange
            onSubmit={async (values, formikHelpers) => {
                console.log(values)
                await axiosPrivate.post('/admin/addstudent', values).then((response) => {
                    console.log(response.data)
                }).catch((error) => {
                    console.log(error)
                })
            }}>
            <FormikStep
                label="Personal Details"
                validationSchema={Yup.object({
                    usn: Yup.string().required("USN is Required"),
                    firstname: Yup.string().required("First Name is Required"),
                    middlename: Yup.string(),
                    lastname: Yup.string(),
                    dob: Yup.date().required("Date of Birth is Required"),
                    mobile: Yup.number().required('Mobile No. is Required'),
                    email: Yup.string().email().required('Email is Required'),
                    parentsmobile: Yup.number().required('Parent Mobile No. is required').notOneOf([Yup.ref('mobile'), null], 'Student Mobile and Parent Mobile cannot be same'),
                    parentsemail: Yup.string().email().required("parent email is required"),
                })}>
                <BasicDetailsForm />
            </FormikStep>
            <FormikStep
                label={"Academic Details"}
                validationSchema={Yup.object({
                    branch: Yup.string().required('Branch is Required'),
                    semester: Yup.number().required('Semester is required'),
                    academicyear: Yup.number().required("Academic Year is Required"),
                })}>
                <AcademicDetails />
            </FormikStep>
            <FormikStep
                label="Image Upload"
                validationSchema={Yup.object({
                    photo: Yup.string().required("Photo is Required"),
                })}
            >
                <PhotoUpload />
            </FormikStep>
        </FormikStepper>
    )

}

export default AddStudent;
