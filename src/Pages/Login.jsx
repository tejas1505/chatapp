
import { useForm } from "react-hook-form";
import { Flex, Box, Image, FormControl, FormErrorMessage, Input, Button, Text } from "@chakra-ui/react";
import logo from '../assets/image 66.png'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ showAlert }) {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const {
        register: loginRegister,
        handleSubmit: loginSubmit,
        formState: { errors: loginErrors },
    } = useForm();

    const onSubmitLogin = useCallback(async (data) => {
        try {
            setLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            const json = await response.json();
            if (json.success) {
                setLoading(false)
                showAlert(json.success, 'success')
                localStorage.setItem('user', json?.user?.id)
                localStorage.setItem('token', json?.token)
                navigate('/')
            } else {
                setLoading(false)
                showAlert(json.error, 'error')
            }

        } catch (error) {
            console.log(error);
            setLoading(false)
            showAlert("Internal error", 'error')
        }
    }, []);

    const [index, setIndex] = useState(0)

    return (
        <Flex alignItems="center" justifyContent="center" w="100%" h="100vh" bgColor="#8BABD8">
            <Box bgColor="#fff" px={5} py={7} borderRadius="8px" w="350px">
                <Image src={logo} height="auto" w="6rem" mx="auto" />
                <Tabs index={index}>
                    <TabList display='none'>
                        <Tab>Login</Tab>
                        <Tab>Signup</Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            <Text textAlign='center' fontWeight='bold'>Login</Text>
                            <Box as="form" mt={6} onSubmit={loginSubmit(onSubmitLogin)}>
                                <FormControl mt={3} isInvalid={loginErrors.email}>
                                    <Input
                                        type="email"
                                        placeholder="Email"
                                        borderRadius="6px"
                                        border="1px solid #6E80A4"
                                        fontSize="14px"
                                        {...loginRegister("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                                message: "Invalid email format",
                                            },
                                        })}
                                    />
                                    <FormErrorMessage fontSize="12px" mt="2px">
                                        {loginErrors.email && loginErrors.email.message}
                                    </FormErrorMessage>
                                </FormControl>

                                <FormControl mt={3} isInvalid={loginErrors.password}>
                                    <Input
                                        type="password"
                                        placeholder="Password"
                                        borderRadius="6px"
                                        border="1px solid #6E80A4"
                                        fontSize="14px"
                                        {...loginRegister("password", {
                                            required: "Password is required",
                                        })}
                                    />
                                    <FormErrorMessage fontSize="12px" mt="2px">
                                        {loginErrors.password && loginErrors.password.message}
                                    </FormErrorMessage>
                                </FormControl>

                                {/* Submit Button */}
                                <Button
                                    w="100%"
                                    type="submit"
                                    mt={4}
                                    size="md"
                                    bgColor="#6E80A4"
                                    _hover={{ bgColor: "#4f5c76" }}
                                    color="white"
                                    fontSize="14px"
                                    fontWeight="400"
                                    isLoading={loading}
                                >
                                    Sign Up
                                </Button>
                                <Text my={2} fontSize='13px'>Don't have an account? <Text as='span' cursor='pointer' textDecor={'underline'} color='#8BABD8' onClick={() => setIndex(1)}>Sign Up</Text></Text>
                            </Box>
                        </TabPanel>
                        <TabPanel>
                            <Text textAlign='center' fontWeight='bold'>Sign Up</Text>
                            <Box as="form" mt={6} onSubmit={handleSubmit()}>
                                {/* Name Field */}
                                <FormControl isInvalid={errors.name}>
                                    <Input
                                        type="text"
                                        placeholder="Name"
                                        borderRadius="6px"
                                        border="1px solid #6E80A4"
                                        fontSize="14px"
                                        {...register("name", { required: "Name is required" })}
                                    />
                                    <FormErrorMessage fontSize="12px" mt="2px">
                                        {errors.name && errors.name.message}
                                    </FormErrorMessage>
                                </FormControl>

                                {/* Email Field */}
                                <FormControl mt={3} isInvalid={errors.email}>
                                    <Input
                                        type="email"
                                        placeholder="Email"
                                        borderRadius="6px"
                                        border="1px solid #6E80A4"
                                        fontSize="14px"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                                message: "Invalid email format",
                                            },
                                        })}
                                    />
                                    <FormErrorMessage fontSize="12px" mt="2px">
                                        {errors.email && errors.email.message}
                                    </FormErrorMessage>
                                </FormControl>

                                {/* Password Field */}
                                <FormControl mt={3} isInvalid={errors.password}>
                                    <Input
                                        type="password"
                                        placeholder="Password"
                                        borderRadius="6px"
                                        border="1px solid #6E80A4"
                                        fontSize="14px"
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: { value: 6, message: "Password must be at least 6 characters" },
                                        })}
                                    />
                                    <FormErrorMessage fontSize="12px" mt="2px">
                                        {errors.password && errors.password.message}
                                    </FormErrorMessage>
                                </FormControl>

                                {/* Submit Button */}
                                <Button
                                    w="100%"
                                    type="submit"
                                    mt={4}
                                    size="md"
                                    bgColor="#6E80A4"
                                    _hover={{ bgColor: "#4f5c76" }}
                                    color="white"
                                    fontSize="14px"
                                    fontWeight="400"
                                >
                                    Sign Up
                                </Button>
                                <Text my={2} fontSize='13px'>Already have an account? <Text as='span' cursor='pointer' textDecor={'underline'} color='#8BABD8' onClick={() => setIndex(0)}>Login</Text></Text>
                            </Box>
                        </TabPanel>
                    </TabPanels>
                </Tabs>

            </Box>
        </Flex>
    );
}
