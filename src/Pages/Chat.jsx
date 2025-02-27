import React, { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import chatplaceholder from '../assets/chatplaceholder.png'
import { Avatar, Box, Flex, IconButton, Image, Input, InputGroup, InputRightElement, Spinner, Text } from '@chakra-ui/react'
import { Context } from '../Context'
import ChatBody from '../Components/ChatBody'
import { IoSend } from 'react-icons/io5'
import { useParams, useSearchParams } from 'react-router-dom'

const types = {
    default: 'default',
    loading: 'spinner',
    chat: 'chat',
}

const Chat = () => {

    const { chat } = useParams();
    const user = useMemo(() => parseInt(localStorage.getItem('user')), [])

    const [displayType, setDisplayType] = useState(types?.chat)
    const [messages, setMessages] = useState([])

    const groupMessagesByDate = useCallback((messages) => {
        const grouped = messages.reduce((acc, msg) => {
            const date = new Date(msg.timestamp).toISOString().split("T")[0]; // Extract YYYY-MM-DD

            let group = acc.find(item => item.time === date);
            if (!group) {
                group = { time: date, messages: [] };
                acc.push(group);
            }
            group.messages.push(msg);

            return acc;
        }, []);

        return grouped;
    }, []);

    const [userDetails, setUserDetails] = useState(null)
    const getMessages = useCallback(async (sender_id, receiver_id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/chats/getMessages?sender_id=${sender_id}&receiver_id=${receiver_id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem('token')
                }
            })
            const json = await response.json();
            if (json.success) {
                setMessages(json.messages)
            }

        } catch (error) {
            console.log(error);
            showAlert("Internal error", 'error')
        }
    }, []);

    const getUserDetails = useCallback(async (user_id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/getUserById?user_id=${user_id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem('token')
                }
            })
            const json = await response.json();
            if (json.success) {
                setUserDetails(json.data)
            }

        } catch (error) {
            console.log(error);
            showAlert("Internal error", 'error')
        }
    }, []);


    const { socket, formatDate, setUsers, users, getUsers } = useContext(Context)

    const sendRef = useRef();

    const [message, setMessage] = useState('')

    const handleSendMessage = useCallback(() => {
        try {
            if (message === '' || !message) {
                return;
            }
            setMessages((prev) => [...prev, { sender_id: parseInt(user), receiver_id: parseInt(chat), message, timestamp: new Date() }])
            // ({ ...prev, last_message: message, last_message_time: new Date() })
            setMessage('')
            socket.emit('send:message', ({ sender_id: parseInt(user), receiver_id: parseInt(chat), message, timestamp: new Date() }))
        } catch (error) {

        }
    }, [socket, message, user, chat])

    const chatContainerRef = useRef(null);

    useEffect(() => {
        // Scroll to the bottom whenever messages change
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const renderContent = () => {
        switch (displayType) {
            case types?.default:
                return (
                    <Flex align="center" justify="center" w="100%" h="100%">
                        <Flex flexDir="column" align="center">
                            <Image src={chatplaceholder} h="auto" w="5rem" loading="lazy" />
                            <Text>Start Chat Now</Text>
                        </Flex>
                    </Flex>
                )
            case types?.loading:
                return (
                    <Flex align="center" justify="center" h="100%">
                        <Spinner size="xl" />
                    </Flex>
                )
            case types?.chat:
                return (
                    <Flex flexDir='column' height='100%'>
                        <Flex w='100%' alignItems='center' gap={2} py={3} px={4} bgColor='#fff' borderBottom='1px solid #D9DCE0' h='max-content'>
                            <Avatar size='sm' name={userDetails?.name} />
                            <Text>{userDetails?.name}</Text>
                        </Flex>
                        <Box px={5} flex='1' overflowY='auto' my={1} ref={chatContainerRef}>
                            <ChatBody messages={groupMessagesByDate(messages)} user={user} formatDate={formatDate} />
                        </Box>
                        <Flex px={5} mb={4} h='max-content'>
                            <InputGroup size='md'>
                                <Input
                                    pr='2.5rem'
                                    bgColor='#FFFFFF'
                                    border='none'
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            sendRef.current.click();
                                        }
                                    }}

                                    value={message}

                                    onChange={(e) => setMessage(e.target.value)}
                                    type='text'
                                    placeholder='Message'
                                />
                                <InputRightElement width='2.5rem'>
                                    <IconButton icon={<IoSend color='#8BABD8' />} ref={sendRef} onClick={handleSendMessage} bg='transparent' size='sm' />
                                </InputRightElement>
                            </InputGroup>
                        </Flex>
                    </Flex>
                )
            default:
                return null
        }
    }

    const handleRecieveMsg = useCallback((data) => {
        
        
        if (parseInt(data?.receiver_id) === parseInt(user)) {
            setMessages((prev) => [...prev, { ...data, timestamp: new Date() }])
        }
        getUsers(user)
    }, [user])

    useEffect(() => {
        if (!chat) {
            setDisplayType('default')
        }
        if (chat) {
            setDisplayType('chat')
        }
        socket.on('receive:message', handleRecieveMsg)

        return () => {
            socket.off('receive:message', handleRecieveMsg)
        }
    }, [socket, handleRecieveMsg, chat])

    useEffect(() => {
        getMessages(chat, user)
        getUserDetails(chat)
        handleSeenMessages(chat, user)

    }, [user, chat])

    const handleSeenMessages = useCallback(async (sender_id, receiver_id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/chats/seenMessage`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem('token')
                },
                body: JSON.stringify({ sender_id, receiver_id })
            })

        } catch (error) {
            console.log(error);
            showAlert("Internal error", 'error')
        }
    }, []);



    return <Box w="100%" h="100%" key={chat}>{renderContent()}</Box>
}

export default memo(Chat)
