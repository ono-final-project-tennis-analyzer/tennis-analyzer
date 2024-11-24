import {
    TextInput,
    PasswordInput,
    Text,
    Paper,
    Group,
    Button,
    Checkbox,
    Anchor,
    Stack,
} from "@mantine/core";
import {useToggle, upperFirst} from "@mantine/hooks";
import {useForm} from "@mantine/form";
import {useNavigate} from "react-router-dom";
import {useLoginMutation, useMeQuery, useRegisterMutation} from "../../services/accounts.service.ts";
import {useEffect} from "react";

export default function Login() {
    const navigate = useNavigate();
    const {data: user, isLoading} = useMeQuery();

    useEffect(() => {
        if (user) navigate("/");
    }, [user]);

    const [type, toggle] = useToggle(["login", "register"]);
    const onSuccess = () => {
        navigate("/");
    };
    const loginMutation = useLoginMutation(onSuccess);
    const registerMutation = useRegisterMutation(onSuccess);
    const form = useForm({
        initialValues: {
            email: "",
            username: "",
            password: "",
            terms: true,
        },

        validate: {
            email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
            password: (val) =>
                val.length <= 2
                    ? "Password should include at least 3 characters"
                    : null,
            username: (val) =>
                val.length <= 2 && type === "register"
                    ? "Username should include at least 3 characters"
                    : null,
            terms: (val) => ((!val && type == "register")?  "Please accept terms and conditions":null),
        },
    });
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const validationErrors = form.validate();
        if (Object.keys(validationErrors.errors).length > 0) {
            console.error(validationErrors);
            return;
        }
        if (type === "login") {
            try {
                const {email, password} = form.values;
                loginMutation.mutate({email, password});
            } catch (error) {
                console.error("Login failed:", error);
            }
        } else {
            try {
                const {email, username, password} = form.values;
                registerMutation.mutate({email, username, password});
            } catch (error) {
                console.error("Register failed:", error);
            }
        }
    };

    if (isLoading) return <div>Loading...</div>

    return (
        <div style={{display: "grid", gridTemplateColumns: "600px auto", width: "100%"}}>
            <Paper radius="md" p="xl" withBorder>
                <Text size="lg" fw={500}>
                    Welcome to Tennis App, {type} with your account
                </Text>
                <form onSubmit={handleSubmit}>
                    <Stack>
                      <TextInput
                            required
                            label="Email"
                            placeholder="Your Email"
                            value={form.values.email}
                            onChange={(event) =>
                                form.setFieldValue("email", event.currentTarget.value)
                            }
                            error={form.errors.email}
                            radius="md"
                        />

                        {type === "register" && (
                            <TextInput
                                required
                                label="Username"
                                placeholder="Enter username here"
                                value={form.values.username}
                                onChange={(event) =>
                                    form.setFieldValue("username", event.currentTarget.value)
                                }
                                error={form.errors.username && "Invalid username"}
                                radius="md"
                            />
                        )}
                        <PasswordInput
                            required
                            label="Password"
                            placeholder="Your password"
                            value={form.values.password}
                            onChange={(event) =>
                                form.setFieldValue("password", event.currentTarget.value)
                            }
                            error={
                                form.errors.password &&
                                "Password should include at least 3 characters"
                            }
                            radius="md"
                        />

                        {type === "register" && (
                            <Checkbox
                                required
                                label="I accept terms and conditions"
                                checked={form.values.terms}
                                onChange={(event) =>
                                    form.setFieldValue("terms", event.currentTarget.checked)
                                }
                            />
                        )}
                    </Stack>
                    <Group justify="space-between" mt="xl">
                        <Anchor
                            component="button"
                            type="button"
                            c="dimmed"
                            onClick={() => {
                                toggle();
                                form.reset();
                            }}
                            size="xs"
                        >
                            {type === "register"
                                ? "Already have an account? Login"
                                : "Don't have an account? Register"}
                        </Anchor>
                        <Button type="submit" radius="xl">
                            {upperFirst(type)}
                        </Button>
                    </Group>
                </form>
            </Paper>
            <img src="/left.webp"/>
        </div>
    );
}
