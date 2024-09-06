import "@mantine/core/styles.css";
import {Button, MantineProvider, Modal} from "@mantine/core";
import {BrowserRouter, Outlet, Route, Routes} from "react-router-dom";
import Home from "./components/Pages/home.tsx";
import Login from "./components/Pages/login.tsx";
import {PrivateRoute} from "./components/utils/PrivateRoute.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import Layout from "./components/Layout/layout.component.tsx";

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
                            <Route path="videos" element={<div>videos <Outlet/></div>}>
                                <Route path="videoUpload"
                                       element={<Modal onClose={() => {
                                       }} opened={true}/>}/>
                            </Route>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </MantineProvider>
        </QueryClientProvider>
    );
}

export default App;
