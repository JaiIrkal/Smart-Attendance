import { Box, List, ListItem, Typography } from "@mui/material"

export const TeacherDetails = ({ name, mobile, Email }: {
    name: string | undefined,
    mobile: string | undefined, Email: string | undefined
}) => {

    return (
        <Box flexGrow={'auto'} mt='50px'>
            <Typography fontSize={'2rem'}> Welcome, {name} </Typography>

            <Typography fontSize={'1rem'}>{mobile}</Typography>

            <Typography fontSize={'1rem'}>{Email}</Typography>

        </Box>
    )
}