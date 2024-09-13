import {Navigate} from "react-router-dom";
import {useMeQuery} from "../../services/accounts.service.ts";
import React from "react";

export const PrivateRoute: React.FC<React.PropsWithChildren> = ({children}) => {
    const {isLoading, isError} = useMeQuery();

    if (isLoading) return <div>Loading...</div>
    if (isError) return <Navigate to="/login"/>;

    return children;
};
