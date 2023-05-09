import { Flex, Button, FormControl, FormLabel, Input, FormErrorMessage, Select } from "@chakra-ui/react";
import { Box, TextField } from "@mui/material";
import { Formik, Field, Form, useFormik } from "formik";
import * as yup from 'yup';
import api from '../../../../../api/axiosConfig'






const AddStudent: React.FC = () => {

    // function validateName({ value }: { value: string }) {
    //     let error
    //     if (!value) {
    //         error = 'Name is required'
    //     } else if (value.toLowerCase() !== 'naruto') {
    //         error = "Jeez! You're not a fan 😱"
    //     }
    //     return error
    // }

    return (
        <Flex sx={{ width: 900, height: 1000 }}>
            <Formik
                initialValues={{
                    name: '',
                    usn: '',
                    password: ''
                }}
                onSubmit={(values, actions) => {

                    api.post('/')

                }}
            >
                {(props) => (
                    <Form>
                        <Field name='usn'>
                            {({ field, form }: { field: any, form: any }) => (
                                <FormControl >
                                    <FormLabel>USN</FormLabel>
                                    <Input {...field} placeholder='usn' />
                                    <FormErrorMessage>{form.errors.usn}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <Field name='name'>
                            {({ field, form }: { field: any, form: any }) => (
                                <FormControl isInvalid={form.errors.name && form.touched.name}>
                                    <FormLabel>First name</FormLabel>
                                    <Input {...field} placeholder='name' />
                                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <Field name='password'>
                            {({ field, form }: { field: any, form: any }) => (
                                <FormControl>
                                    <FormLabel>Password</FormLabel>
                                    <Input {...field} placeholder='password' />
                                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>

                        <Button
                            mt={4}
                            bg='blue'
                            colorScheme='teal'
                            isLoading={props.isSubmitting}
                            type='submit'
                        >
                            Submit
                        </Button>
                    </Form>
                )}
            </Formik>
        </Flex>
    )
}

export default AddStudent;