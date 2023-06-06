import { Stepper, Step, StepLabel, Grid, Button, CircularProgress, Box, Divider } from "@mui/material";
import { FormikValues, FormikConfig, Formik, Form, FormikHelpers } from "formik"
import React, { useState } from "react"

export interface FormikStepProps
    extends FormikConfig<FormikValues> {
    label: string;
}

export function FormikStep({ label = '', children }: any) {
    return <>
        {children}
    </>;
}

export interface FormikStepperProps extends FormikConfig<FormikValues> {
    children: React.ReactNode;
}

export function FormikStepper({ children, ...props }: FormikStepperProps) {
    const childrenArray = React.Children.toArray(children) as React.ReactElement<FormikStepProps>[];
    const [step, setStep] = useState(0);
    const totalSteps = childrenArray.length;
    const currentChild = childrenArray[step];
    const [completed, setCompleted] = useState(false);
    const [snapshot, setSnapshot] = useState(props.initialValues);


    function isLastStep() {
        return step === childrenArray.length - 1;
    }
    const next = (values: FormikValues) => {
        setSnapshot(values);
        setStep(Math.min(step + 1, totalSteps - 1));
    };

    const previous = (values: FormikValues) => {
        setSnapshot(values);
        setStep(Math.max(step - 1, 0));
    };
    const handleSubmit = async (values: FormikValues, bag: FormikHelpers<FormikValues>) => {
        if (currentChild.props.onSubmit) {
            await currentChild.props.onSubmit(values, bag);
        }
        if (isLastStep()) {
            return props.onSubmit(values, bag);
        } else {
            bag.setTouched({});
            next(values);
        }
    };

    return (
        <Formik
            {...props}
            initialValues={snapshot}
            validationSchema={currentChild.props.validationSchema}
            onSubmit={handleSubmit}
        >
            {(formik) => (
                <Form autoComplete="off">
                    <Stepper
                        alternativeLabel
                        activeStep={step}>
                        {childrenArray.map((child, index) => (
                            <Step
                                key={child.props.label}
                                completed={step > index || completed}
                            >
                                <StepLabel>{child.props.label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    <Divider orientation="horizontal" sx={{
                        mt: '15px'
                    }}></Divider>
                    <Box mt={'20px'} mb='20px'>

                        {currentChild}
                    </Box>
                    <Grid container spacing={2}>
                        {step > 0 ? (
                            <Grid item>
                                <Button
                                    disabled={formik.isSubmitting}
                                    variant="contained"
                                    color="primary"
                                    onClick={() => previous(formik.values)}
                                >
                                    Back
                                </Button>
                            </Grid>
                        ) : null}
                        <Grid item>
                            <Button
                                startIcon={
                                    formik.isSubmitting ? <CircularProgress size="1rem" /> : null
                                }
                                disabled={formik.isSubmitting}
                                variant="contained"
                                color="primary"
                                type="submit"
                            >
                                {formik.isSubmitting ? "Submitting" : isLastStep() ? "Submit" : "Next"}
                            </Button>
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
}