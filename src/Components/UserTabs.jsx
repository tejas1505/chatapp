import { Avatar, AvatarBadge, Badge, Box, Flex, HStack, Text } from '@chakra-ui/react'
import React from 'react'
import { useParams } from 'react-router-dom'

const UserTabs = ({ element, handleTabClick, formatDate }) => {

    const { chat } = useParams();
    return (
        <HStack
            p={3}
            gap={3}
            // bg={index === 1 ? "gray.200" : "transparent"}
            transition='0.25s'
            onClick={() => handleTabClick(element?.id)}
            as={'button'}
            cursor="pointer"
            _hover={{ bg: "gray.100" }}
            w='100%'
            bgColor={parseInt(element?.id) === parseInt(chat) ? 'gray.100' : "transparent"}

        >
            <Avatar size="sm" name={element?.name} >
                {element?.is_online === 1 && <AvatarBadge boxSize='1.25em' bg='green.500' />}
            </Avatar>
            <Box w='100%'>
                <Flex justifyContent='space-between' alignItems='center' w>
                    <Text fontWeight="600" fontSize='14px'>{element?.name}</Text>
                    <Text fontSize="12px" color="gray.500">{formatDate(element?.last_message_time)}</Text>
                </Flex>
                <Flex justifyContent='space-between' alignItems='center'>
                    <Text fontSize="12px" color="gray.500">{element?.last_message?.length > 10 ? element?.last_message?.substring(0, 10) + "..." : element?.last_message}</Text>
                    {parseInt(element?.id) !== parseInt(chat) && (element?.message_count > 0 && <Box>
                        <Badge borderRadius='100px' bgColor='#3758F9' color='white' fontWeight='300' fontSize='10px'>{element?.message_count}</Badge>
                    </Box>)}
                </Flex>
            </Box>
        </HStack>
    )
}

export default UserTabs