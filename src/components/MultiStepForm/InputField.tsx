import { useField, FieldConfig } from "formik";
import { TextField, TextFieldProps } from "@mui/material";
import { MuiTelInput, MuiTelInputProps } from "mui-tel-input";



interface Props extends FieldConfig {
    label: string;
    children?: React.ReactNode;
    fullWidth?: boolean;
    sx?: {}
}

const InputField = ({ label, ...props }: Props) => {

    const [field, meta, helpers] = useField(props.name);
    return (
        <TextField
            fullWidth={props.fullWidth ?? false}
            label={label}
            {...field}
            {...props}
            sx={props.sx}
            error={meta.touched && Boolean(meta.error)}
            helperText={meta.touched && meta.error}
        />
    )
}


export interface MobileFieldProps extends MuiTelInputProps {
    label: string,
    name: string,
}

export const MobileField = ({ label, ...props }: MobileFieldProps) => {

    const [field, meta, helpers] = useField(props.name)

    return (
        <MuiTelInput
            label={label}
            {...field}
            {...props}
            onChange={(value) => { helpers.setValue(value) }}
            error={meta.touched && Boolean(meta.error)}
            helperText={meta.touched && meta.error}
        ></MuiTelInput>
    )

}

export default InputField;