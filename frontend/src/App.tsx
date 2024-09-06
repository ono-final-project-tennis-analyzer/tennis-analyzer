import "@mantine/core/styles.css";
import {Button, MantineProvider} from "@mantine/core";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./components/Pages/home.tsx";
import Login from "./components/Pages/login.tsx";
import {PrivateRoute} from "./components/utils/PrivateRoute.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import Layout from "./components/Layout/layout.component.tsx";
import {Popover, Text} from '@mantine/core';

function App() {
    const queryClient = new QueryClient()
    return (
        <QueryClientProvider client={queryClient}>
            <MantineProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/" element={<PrivateRoute><Layout/></PrivateRoute>}>
                            <Route index element={<Home/>}/>
                            <Route path="videos" element={<div>videos</div>}>
                                <Route path="videoUplaod"
                                       element={<Popover width={200} position="bottom" withArrow shadow="md">
                                           <Popover.Target>
                                               <Button>Toggle popover</Button>
                                           </Popover.Target>
                                       </Popover>}/>
                            </Route>

                        </Route>
                    </Routes>
                </BrowserRouter>
            </MantineProvider>
        </QueryClientProvider>
    );
}

export default App;
