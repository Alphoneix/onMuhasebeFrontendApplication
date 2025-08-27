import React from 'react'
import ExpenseList from "./ExpenseList.jsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";


function App() {
    const queryClient = new QueryClient();

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <ExpenseList/>

            </QueryClientProvider>
        </>)
}

export default App
