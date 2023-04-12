

import { Flex, Text } from '@chakra-ui/react';

import React from 'react';
import RightContent from './RightContent/RightContent';


const Navbar: React.FC = () => {



    return (
        <Flex bg="#C7E9B0" height='44px' padding="6px 12px" marginTop={'50px'}>
            < Flex align="center" width={'100%'} >
                <Text ml={'10'} _hover={{ cursor: 'pointer', color: '#009FBD' }}>Home</Text>
                <Text ml={'10'} _hover={{ cursor: 'pointer', color: '#009FBD' }}>About Us</Text>
            </ Flex>

            <RightContent />


        </Flex >
    );
};
export default Navbar;