import { Box, Center, Flex, Text } from '@chakra-ui/react'
import React from 'react'

const ChatBody = ({ messages, user, formatDate }) => {
    
    return (
        <Box w="100%" py={2}>
            {messages.map((msg) => (
                <Box>
                    <Text textAlign='center' mx='auto' fontSize='12px' py={1} px={2} borderRadius={'12px'} color='#838A95' bgColor={'#fff'} w='max-content'>{formatDate(msg?.time)}</Text>
                    {msg?.messages[0] ? msg?.messages?.map((element, key) => <Flex
                        key={key}
                        justify={parseInt(element?.sender_id) === parseInt(user) ? 'flex-end' : 'flex-start'}
                        mb={2}
                    >
                        <Box
                            bg={element.sender_id === user ? '#DEE9FF' : '#FFF'}
                            color='#011627'
                            px={2}
                            py={1}
                            borderRadius="md"
                            minW='100px'
                            maxW='325px'
                        >
                            <Text fontSize='14px' textAlign='left'>{element.message}</Text>
                            <Text fontSize='10px' textAlign='right'>{formatDate(element.timestamp, false, false, true)}</Text>
                        </Box>
                    </Flex>):<Text fontSize='14px'>No messages</Text>}
                </Box>
            ))}
        </Box>
    )
}

export default ChatBody