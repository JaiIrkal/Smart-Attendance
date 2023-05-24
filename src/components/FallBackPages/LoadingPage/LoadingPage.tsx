import { CircularProgress, Box } from "@mui/material"
import { display } from "@mui/system"


export const LoadingPage = () => {
    return (
        <Box
            display={'flex'}
            sx={
                {
                    justifySelf: 'center',
                    alignItems: 'center',
                    justifyItems: 'center'
                }
            }>
            <CircularProgress />
        </Box>
    )
}