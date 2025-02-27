import { Avatar, Badge, Box, Flex, HStack, IconButton, Image, Input, InputGroup, InputLeftElement, InputRightElement, List, ListItem, Tag, Text, VStack } from '@chakra-ui/react'
import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import logo from './assets/image 66.png'
import UserTabs from './Components/UserTabs'
import { Context } from './Context'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { RxCross1 } from 'react-icons/rx'
import { IoIosLogOut } from 'react-icons/io'

const Sidebar = ({ showAlert }) => {

    const navigate = useNavigate();
    const user = useMemo(() => localStorage.getItem('user'), [])


    const { socket, formatDate, getUsers, users, getSearchUsers, setUsers } = useContext(Context)

    const handleUserDisconnect = useCallback(({ user_id }) => {
        setUsers((prev) => {
            return prev.map((elem) =>
                parseInt(elem?.id) === parseInt(user_id)
                    ? { ...elem, is_online: 0 }
                    : elem
            );
        });
    }, [])

    const handleUserOnline = useCallback(({ user_id }) => {
        setUsers((prev) => {
            return prev.map((elem) =>
                parseInt(elem?.id) === parseInt(user_id)
                    ? { ...elem, is_online: 1 }
                    : elem
            );
        });
    }, [])

    const handleBeforeUnload = useCallback(() => {
        socket.emit("user:disconnect", { user_id: user });
    }, [user]);

    useEffect(() => {
        socket.emit('user:online', user)
        socket.on('user:disconnect', handleUserDisconnect)
        socket.on('update:online:status', handleUserOnline)
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            socket.off('user:disconnect', handleUserDisconnect)
            socket.off('update:online:status', handleUserOnline)
            socket.emit('user:disconnect', { user_id: user })
            window.removeEventListener("beforeunload", handleBeforeUnload);
        }
    }, [socket, handleUserDisconnect, handleBeforeUnload, handleUserOnline])

    const usersArr = [
        { name: "Jessica Drew", id: 1 },
        { name: "David Moore", id: 2 },
        { name: "Greg James", id: 3 },
        { name: "Emily Dorson", id: 4 },
        { name: "Office Chat", id: 5 },
        { name: "Office Chat", id: 6 },
        { name: "Office Chat", id: 7 },
        { name: "Office Chat", id: 8 },
        { name: "Little Sister", id: 9 }
    ]

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

    const handleTabClick = useCallback((id) => {
        handleSeenMessages(id, user)
        getUsers(user)
        navigate(`/${id}`)
    }, [user])

    useEffect(() => {
        if (!user || !localStorage.getItem('token')) {
            navigate('/login')
        }
        getUsers(user)

    }, [user])

    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const handleSearch = useCallback(async (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (term) {
            const users = await getSearchUsers(user, term)
            console.log(users);
            
            // const results = users.filter((user) =>
            //     user?.name?.toLowerCase().includes(term.toLowerCase())
            // );
            setFilteredUsers(users);
            setShowResults(true);
        } else {
            setShowResults(false);
        }
    }, [user]);

    const handleSelectUser = useCallback((user) => {
        // setSearchTerm(user);
        console.log("user selected", user);

        setUsers(prev => [...prev, user])
        setShowResults(false);
    }, []);


    return (
        <Box bg="white" borderRight="1px solid #ddd" minH='100%' maxH='100%' overflowY='auto'>
            <Box p={4}>
                <HStack mb={4} spacing={2} justifyContent='space-between'>
                    <Image src={logo} height='auto' w='6rem' />
                    <IconButton icon={<IoIosLogOut />} size='sm' onClick={()=>{
                        localStorage.clear();
                        navigate('/login')
                    }}/>
                </HStack>
                <Box position='relative'>
                    <InputGroup>
                        <InputLeftElement pointerEvents='none'>
                            <CiSearch color="gray.500" fontSize={'20px'} />
                        </InputLeftElement>
                        <Input type='text' placeholder='Search' fontSize='14px' border='none' bgColor='#F5F5F5' borderRadius='22px' onFocus={() => searchTerm && setShowResults(true)} onChange={handleSearch} value={searchTerm} />
                        <InputRightElement >
                            <IconButton size='xs' icon={<RxCross1 color="gray.500" fontSize={'12px'} />} onClick={(e) => { e.stopPropagation(); setSearchTerm(''); setShowResults(false); }} />
                        </InputRightElement>
                    </InputGroup>
                    {showResults && (filteredUsers?.length > 0 ? (
                        <Box
                            position="absolute"
                            zIndex="10"
                            width="100%"
                            bg="white"
                            border="1px solid"
                            borderColor="gray.200"
                            borderRadius="md"
                            boxShadow="md"
                            mt={1}
                        >
                            <List spacing={1}>
                                {filteredUsers?.map((user, index) => (
                                    <ListItem
                                        key={index}
                                        p={2}
                                        cursor="pointer"
                                        _hover={{ bg: "gray.100" }}
                                        onClick={() => handleSelectUser(user)}
                                        w='100%'
                                    >
                                        <UserTabs element={user} key={index} handleTabClick={handleTabClick} formatDate={formatDate} />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    ) : <Box
                        position="absolute"
                        zIndex="10"
                        width="100%"
                        bg="white"
                        p={2}
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                        boxShadow="md"
                        mt={1}
                    ><Text fontSize='14px'>No users</Text></Box>)}
                </Box>
            </Box>
            <VStack align="stretch" overflow={'auto'} h='max-content' gap='0'>
                {users?.map((element, index) => (
                    <UserTabs element={element} key={index} handleTabClick={handleTabClick} formatDate={formatDate} />
                ))}
            </VStack>
        </Box>
    )
}

export default memo(Sidebar)