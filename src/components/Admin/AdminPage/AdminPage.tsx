import React from "react";
import { Flex, Text, Button } from "@chakra-ui/react";
import Navbar from "../../NavBar/NavBar";
import { Link, NavLink } from "react-router-dom";
import { ManageTimeTable } from "./TimeTableManagement/ManageTimeTable";
import { render } from "@testing-library/react";

const AdminPage: React.FC = () => {

    return (



        <>
            <Navbar />
            <Flex>
                <NavLink to={'/admin/addteacher'}> Add a Teacher </NavLink>
            </Flex>
            <Flex>
                View Teachers
            </Flex>
            <Flex>
                Add a Student
            </Flex>
            <Flex>
                List Students
            </Flex>
            <Flex>
                <Text><NavLink to={"/admin/managetimetable"}>Manage Time Table</NavLink> </Text>
            </Flex>
            <Flex>
                View Class Details
            </Flex>

        </>

    );

}


export default AdminPage;