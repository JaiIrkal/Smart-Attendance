import { Box, Typography as Text } from "@mui/material"
import { useContext } from "react"
import StudentContext from "../../../../context/StudentProvider"



export const StudentDetails: React.FC = (Student) => {

    const { studentData } = useContext(StudentContext)

    return (
        <Box flex={"auto"} flexDirection='column' mt="30px" border="2px solid" padding={['8px', '8px']} borderColor="black" rowGap={'5px'}>
            <Text>Name: {studentData?.Name}</Text>
            <Text>USN: {studentData?.USN}</Text>
            <Text>Date of Birth: {studentData?.DOB}</Text>
            <Text>Branch: {studentData?.Branch}</Text>
            <Text>Semester: {studentData?.Semester}</Text>
            <Text>Division: {studentData?.Division}</Text>
            <Text>Email: {studentData?.Email}</Text>
            <Text>Mobile: {studentData?.Mobile}</Text>

        </Box>
    )
}