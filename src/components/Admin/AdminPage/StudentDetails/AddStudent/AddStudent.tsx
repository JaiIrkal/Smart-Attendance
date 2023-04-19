import { Flex, Button, FormControl, FormLabel, Input, FormErrorMessage, Select } from "@chakra-ui/react";
import { Box, TextField } from "@mui/material";
import { Formik, Field, Form, useFormik } from "formik";
import * as yup from 'yup';






const AddStudent: React.FC = () => {

    function validateName({ value }: { value: string }) {
        let error
        if (!value) {
            error = 'Name is required'
        } else if (value.toLowerCase() !== 'naruto') {
            error = "Jeez! You're not a fan 😱"
        }
        return error
    }

    return (
        <Flex sx={{ width: 900, height: 1000 }}>
            <Formik
                initialValues={{ name: '' }}
                onSubmit={(values, actions) => {
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2))
                        actions.setSubmitting(false)
                    }, 1000)
                }}
            >
                {(props) => (
                    <Form>
                        <Field name='name' validate={validateName}>
                            {({ field, form }: { field: any, form: any }) => (
                                <FormControl isInvalid={form.errors.name && form.touched.name}>
                                    <FormLabel>First name</FormLabel>
                                    <Input {...field} placeholder='name' />
                                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <Field name='name' validate={validateName}>
                            {({ field, form }: { field: any, form: any }) => (
                                <FormControl isInvalid={form.errors.name && form.touched.name}>
                                    <FormLabel>First name</FormLabel>
                                    <Input {...field} placeholder='name' />
                                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <Button
                            mt={4}
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