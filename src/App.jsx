import React from 'react'
import ExpenseList from "./ExpenseList.jsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import SalesPaymentTracking from "./SalesPaymentTracking.jsx";


function App() {
    const queryClient = new QueryClient();

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <ExpenseList/>
                <SalesPaymentTracking/>
            </QueryClientProvider>
        </>)
}

export default App
