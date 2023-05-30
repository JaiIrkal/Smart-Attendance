import { Button, Divider, FormHelperText, Stack, TextField, Typography } from "@mui/material";
import { FormikValues, FormikHelpers, useFormikContext, useField, ErrorMessage } from "formik";
import { url } from "inspector";
import { useState, useRef, useCallback, useEffect } from "react";
import { FormikStep } from "../../../../MultiStepForm/FormikStepper/FormikStepper";
import InputField from "../../../../MultiStepForm/InputField";
import Webcam from 'react-webcam'
const videoConstraints = {
    width: 720,
    height: 360,
    facingMode: "user"
};



const PhotoUpload = () => {
    const [isCaptureEnable, setCaptureEnable] = useState<boolean>(false);
    const [url, setUrl] = useState<string>('');
    const webcamRef = useRef<Webcam>(null);

    const [photoField, photoMeta, photoHelpers] = useField("photo");

    const capture = useCallback(
        () => {
            const imageSrc = webcamRef.current?.getScreenshot();
            photoHelpers.setValue(imageSrc);
            setUrl(imageSrc ?? '');
            setCaptureEnable(false);

        },
        [webcamRef]
    );

    const handleImageChange = async (e: any) => {
        const file = e.target.files[0]
        await fileToBase64(file).then((base) => {
            setUrl(base as string)
            photoHelpers.setValue(base as string, false);

        });
    }

    const fileToBase64 = (file: File) => {
        return new Promise(resolve => {
            var reader = new FileReader();
            reader.onload = function (event) {
                resolve(event.target?.result);
            };
            reader.readAsDataURL(file);
        });
    };
    return (
        <Stack>
            {photoMeta.touched && <FormHelperText error={Boolean(photoMeta.error)}>{photoMeta.error}</FormHelperText>}
            {
                url === '' ?
                    <Stack direction='row' gap='15px'>
                        <TextField
                            type='file'
                            onChange={(event) => {
                                handleImageChange(event)
                            }}

                        ></TextField>
                        <Typography sx={{
                            alignSelf: 'center',

                        }}> OR</Typography>
                        {isCaptureEnable || (
                            <Button
                                variant="outlined"
                                onClick={() => setCaptureEnable(true)}>
                                Take Picture</Button>)}

                        {isCaptureEnable ? <Stack direction={'row'}>
                            <Webcam
                                audio={false}
                                width={540}
                                height={360}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                videoConstraints={videoConstraints}
                            />
                            <Button onClick={capture}>capture</Button>
                            <Button onClick={() => { setCaptureEnable(false) }}>Cancel</Button>
                        </Stack>
                            : null
                        }
                    </Stack>
                    :
                    <Stack
                        gap={'10px'}
                        direction={'row'}
                        alignItems={'center'}
                        sx={{

                        }}>
                        <img src={url} alt="" width={100} height={100} />
                        <Button
                            sx={{
                                height: '40px',

                            }}
                            variant='contained'
                            color='error'
                            onClick={() => {
                                setUrl('');
                                photoHelpers.setValue('');
                            }}>Delete
                        </Button>
                    </Stack>
            }
        </Stack>
    )
}

export default PhotoUpload;