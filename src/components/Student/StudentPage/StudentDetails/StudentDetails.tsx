import { Box, Divider, Grid, Stack, Typography as Text } from "@mui/material"
import { useContext } from "react"
import StudentContext from "../../../../context/StudentProvider"



export const StudentDetails: React.FC = (Student) => {

    const { studentData } = useContext(StudentContext)

    return (
        <Stack direction={'row'} mb="25px">
            <Stack direction='row' sx={{
                marginTop: '10px',
                width: '0.4',
                justifyContent: 'center',
                alignContent: 'center',
                alignSelf: 'center',
            }}
            >
                <img style={{
                    boxShadow: '10px 10px 8px 10px #888888'
                }} src={studentData?.photo} alt='Student' width='200px' height='200px' ></img>
            </ Stack>
            <Stack direction={'column'} mt='10px' gap='4px'>
                <Text>Name: {studentData?.Name}</Text>
                <Text>USN: {studentData?.USN}</Text>
                <Text>Date of Birth: {studentData?.DOB}</Text>
                <Stack direction={'row'} gap='15px'>
                    <Text>Branch: {studentData?.Branch}</Text>
                    <Text>Semester: {studentData?.Semester}</Text>
                    <Text>Division: {studentData?.Division}</Text>
                </Stack>
                <Stack direction={'row'} gap='80px'>

                    <Stack direction={'column'} gap='10px'>
                        <Divider orientation="horizontal" textAlign="left"><Text>Contact Info.</Text></Divider>
                        <Text>Email: {studentData?.Email}</Text>
                        <Text>Mobile: {studentData?.Mobile}</Text>
                    </Stack>
                    <Stack direction={'column'} gap='10px'>
                        <Divider orientation="horizontal" textAlign="left">
                            <Text>Parent's Contact Info</Text>
                        </Divider>
                        <Text>Email: {studentData?.parentsemail}</Text>
                        <Text>Mobile: {studentData?.parentsmobile}</Text>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}