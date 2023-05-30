import { FormikStep } from "../../../../MultiStepForm/FormikStepper/FormikStepper"
import InputField, { MobileField } from "../../../../MultiStepForm/InputField"
import * as Yup from 'yup';
import { FormHelperText, Stack } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useField } from "formik";
import { Metadata } from "libphonenumber-js";



export const BasicDetailsForm = () => {

    const [datefield, datemeta, datehelpers] = useField('dob')

    return (
        <Stack direction={'column'} gap='20px' >
            <InputField
                label="USN"
                name="usn"
                sx={{
                    width: '180px',
                }}
            />
            <Stack direction={'row'} gap='15px'>
                <InputField
                    label="First Name"
                    name="firstname"

                />
                <InputField
                    label="Middle Name"
                    name="middlename"
                />
                <InputField
                    label="Last Name"
                    name="lastname"
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
                    value={datemeta.value}
                    onChange={(value) => datehelpers.setValue(value)}
                    label='Date of Birth'
                    onError={() => { }}
                />
                {datemeta.touched && Boolean(datemeta.error) ? <FormHelperText error>{datemeta.error}</FormHelperText> : null}
            </LocalizationProvider>
            <Stack direction={'row'} gap='15px'>
                <MobileField
                    label="Mobile No."
                    name="mobile"
                    defaultCountry='IN'
                />
                <InputField
                    label="Email"
                    name="email"
                    type="email"
                    sx={{
                        width: '340px'
                    }}
                />
            </Stack>
            <Stack direction={'row'} gap='15px'>
                <MobileField
                    label="Parent's Mobile No."
                    name="parentsmobile"
                    defaultCountry="IN"
                />

                <InputField
                    name='parentsemail'
                    label="Parent's Email"
                    type="email"
                    sx={{
                        width: '340px'
                    }}
                />
            </Stack>
        </Stack>
    )
}