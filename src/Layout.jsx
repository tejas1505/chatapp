import { Box, Flex, Spinner } from '@chakra-ui/react'
import React, { memo, Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

const Layout = ({showAlert}) => {
    return (
        <Flex zIndex='-1' h={'100vh'} bgColor='#8BABD8' p={8} >

            <Suspense fallback={
                <Flex w='100%' justifyContent='center' alignItems='center'>
                    <Spinner size='lg' />
                </Flex>
            }>
                <Flex overflow='auto' bgColor='#F6F6F6' w='100%'>
                    <Box  w={{xl:'25%', lg:'30%'}}>
                        <Sidebar showAlert={showAlert} />
                    </Box>
                    <Suspense fallback={
                        <Flex w='100%' justifyContent='center' alignItems='center'>
                            <Spinner size='lg' />
                        </Flex>
                    }>
                        <Box w='75%'>
                            <Outlet />
                        </Box>
                    </Suspense>
                </Flex>
            </Suspense>
        </Flex>
    )
}

export default memo(Layout)