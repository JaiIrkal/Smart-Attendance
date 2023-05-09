import { Flex, Button, FormControl, FormLabel, Input, FormErrorMessage, Select } from "@chakra-ui/react";

import { Formik, Field, Form, useFormik } from "formik";

import api from '../../../../api/axiosConfig'


export const AddClass: React.FC = () => {

    const DeptList = ['CSE', 'ISE', 'MECH', 'CHEM','CIVIL','ECE','EEE']
    const SemList = ['1', '2', '3', '4','5','6','7','8']
    const DivList = ['A','B']



    return (
        <Flex sx={{ width: 900, height: 1000 }}>
            <Formik
                initialValues={{
                    name: '',
                    id: '',
                    password: ''
                }}
                onSubmit={(values, actions) => {

                    api.post('/')

                }}
            >
                {(props) => (
                    <Form>
                        <Field name='department'>
                            {({ field, form }: { field: any, form: any }) => (
                                <FormControl>
                                    <FormLabel>Department</FormLabel>
                                    <Select>
                                        {DeptList.map((dept)=>(<option value={dept}>{dept}</option>))}
                                        </Select>
                                    <FormErrorMessage>{form.errors.department}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <Field name='semester'>
                            {({ field, form }: { field: any, form: any }) => (
                                <FormControl>
                                    <FormLabel>Semester</FormLabel>
                                    <Select>
                                        {SemList.map((sem)=>(<option value={sem}>{sem}</option>))}
                                        </Select>
                                    <FormErrorMessage>{form.errors.semester}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <Field name='division'>
                            {({ field, form }: { field: any, form: any }) => (
                                <FormControl>
                                    <FormLabel>Division</FormLabel>
                                    <Select>
                                        {DivList.map((div)=>(<option value={div}>{div}</option>))}
                                        </Select>
                                    <FormErrorMessage>{form.errors.semester}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <Field name='id'>
                            {({ field, form }: { field: any, form: any }) => (
                                <FormControl >
                                    <FormLabel>TeacherId</FormLabel>
                                    <Input {...field} placeholder='id' />
                                    <FormErrorMessage>{form.errors.id}</FormErrorMessage>
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

export default AddClass;