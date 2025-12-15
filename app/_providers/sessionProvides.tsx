'use client'

import { createContext } from "react";
import { Session } from "../_types/types";

export const SessionContext = createContext<Session | null>(null);

export default function SessionProvider({ children, value }: React.PropsWithChildren<{ value: Session | null }>) {
    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    )
}