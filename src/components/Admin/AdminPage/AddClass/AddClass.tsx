import { TextField, Stack, MenuItem, Box } from "@mui/material";
import * as yup from "yup"
import { useState, useContext, useEffect } from "react"
import { semList } from "../../../../context/AdminContext";
import AdminContext from "../../../../context/AdminContext";
import api from "../../../../api/axiosConfig";
import { FormikStep, FormikStepper } from "../../../MultiStepForm/FormikStepper/FormikStepper";
import AssignTeachers from "./AssignTeachers";
import CreateTimetable from "./CreateTimetable";

const timtablevalidationSchema = yup.object({

})

const AddClass: React.FC = () => {

    const [branch, setBranch] = useState<string>('');
    const [semester, setSemester] = useState<string>('');
    const [division, setDivision] = useState<string>('');
    const [divList, setDivList] = useState<string[] | null>();
    const [initialValues, setInitialValues] = useState({});
    const { semData, setSubjectIndex, setSubjectList, branchList, setSemData } = useContext(AdminContext)

    useEffect(() => {
        const getSemesterData = async () => {
            await api.get(`/admin/semdata/${branch}/${semester}`)
                .then((response) => {
                    setSemData(response.data);
                }).catch((error) => {
                    console.error(error);
                })
        }
        if (branch !== '' && semester !== '') {
            getSemesterData();

        }
        return () => {

        }
    }, [branch, semester, setSemData])


    useEffect(() => {
        let subjects: string[] = [];
        let coresubjects: { code: string, teacherid: { id: string, name: string } }[] = [];
        let branchelectives: { code: string, teacherid: { id: string, name: string } }[] = [];
        setDivList(semData?.divlist);
        const getsubjects = () => {
            if (semData !== null) {
                semData.coresubjects.forEach((value) => {
                    subjects.push(value.code);
                    coresubjects.push({
                        code: value.code,
                        teacherid: { id: '', name: '' }
                    })
                    setSubjectIndex(map => new Map(map?.set(value.code, value.short)))
                });
                semData.branchelectives.forEach((value) => {
                    subjects.push(value.code);
                    branchelectives.push({
                        code: value.code,
                        teacherid: { id: '', name: '' }
                    })
                    setSubjectIndex(map => new Map(map?.set(value.code, value.short)))
                });
            }
        }
        setInitialValues({
            coresubjects: coresubjects,
            branchelectives: branchelectives,
            timetable: {
                Day_1: { P_1: '', P_2: '', P_3: '', P_4: '', P_5: '', P_6: '', P_7: '' },
                Day_2: { P_1: '', P_2: '', P_3: '', P_4: '', P_5: '', P_6: '', P_7: '' },
                Day_3: { P_1: '', P_2: '', P_3: '', P_4: '', P_5: '', P_6: '', P_7: '' },
                Day_4: { P_1: '', P_2: '', P_3: '', P_4: '', P_5: '', P_6: '', P_7: '' },
                Day_5: { P_1: '', P_2: '', P_3: '', P_4: '', P_5: '', P_6: '', P_7: '' },
                Day_6: { P_1: '', P_2: '', P_3: '', P_4: '', P_5: '', P_6: '', P_7: '' }
            },
        })
        getsubjects()
        setSubjectList(subjects);
    }, [semData, setSubjectIndex, setSubjectList])

    return (
        <>
            <Stack direction={'row'} gap='15px'>
                <TextField
                    required
                    sx={{
                        width: '200px'
                    }}
                    label="Branch"
                    select
                    value={branch}
                    onChange={(e) => {
                        setSemester('')
                        setBranch(e.target.value)
                    }}
                >
                    {branchList.map((value, index) => (<MenuItem value={value} key={index}>{value}</MenuItem>))}
                </TextField>
                <TextField
                    disabled={branch === ''}
                    required
                    sx={{
                        width: '200px'
                    }}
                    label="Semester"
                    select
                    value={semester}
                    onChange={(e) => {
                        setDivision('');
                        setSemester(e.target.value)
                    }}
                >
                    {

                        semList(3, 8)
                    }
                </TextField>
                <TextField
                    disabled={semester === ''}
                    required
                    sx={{
                        width: '200px'
                    }}
                    label="Division"
                    select
                    value={division}
                    onChange={(e) => {
                        setDivision(e.target.value)
                    }}
                >
                    {
                        divList?.map((value, index) => (<MenuItem value={value} key={index}>{value}</MenuItem>))
                    }
                </TextField>
            </Stack>
            {branch !== '' && semester !== '' && division !== '' ?
                <Box mt={'10px'} sx={{
                    border: '1px solid black',
                    padding: '10px'

                }}>
                    <FormikStepper initialValues={initialValues}
                        onSubmit={async (values) => {
                            values["branch"] = branch;
                            values["semester"] = semester;
                            values["division"] = division;
                            console.log(values);
                            await api.put('/admin/classdata', values).then((response) => {
                            }).catch(
                                (error) => {
                                    console.error(error);
                                }
                            )
                        }}
                    >

                        <FormikStep
                            label="Assign Teachers"
                        >
                            <AssignTeachers branch={branch} semester={semester} division={division} />
                        </FormikStep>
                        <FormikStep
                            label='Create TimeTable'
                            validationSchema={timtablevalidationSchema}
                        >
                            <CreateTimetable />
                        </FormikStep>
                    </FormikStepper >
                </Box>
                :
                null
            }
        </>
    )
}
export default AddClass;