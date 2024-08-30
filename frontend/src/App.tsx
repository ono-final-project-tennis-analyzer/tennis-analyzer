import "@mantine/core/styles.css";
import {MantineProvider} from "@mantine/core";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./components/Pages/home.tsx";
import Login from "./components/Pages/login.tsx";
import {PrivateRoute} from "./components/utils/PrivateRoute.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

function App() {
    const queryClient = new QueryClient()
    return (
        <QueryClientProvider client={queryClient}>
            <MantineProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login/>}/>
                        <Route
                            path="/"
                            element={
                                <PrivateRoute>
                                    <Home/>
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </BrowserRouter>
            </MantineProvider>
        </QueryClientProvider>
    );
}

export default App;
