"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { checkAuth } from "@/lib/actions/thirdweb";
import { getBalanceHandler } from "@/lib/thirdweb/utils";
interface AuthState {
    isSignedIn: boolean;
    userId: string;
    isLoaded: boolean;
    balance: number;
}

interface AuthContextType extends AuthState {
    updateAuthState: (state: Partial<AuthState>) => void;
}

const AuthContext = createContext<AuthContextType>({
    isSignedIn: false,
    userId: "",
    isLoaded: false,
    balance: 0,
    updateAuthState: () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [authState, setAuthState] = useState<AuthState>({
        isSignedIn: false,
        userId: "",
        isLoaded: false,
        balance: 0,
    });

    const updateAuthState = (newState: Partial<AuthState>) => {
        setAuthState((prev) => ({ ...prev, ...newState }));
    };

    useEffect(() => {
        async function checkAuthStatus() {
            try {
                const response = await checkAuth()
                if (!response) {
                    setAuthState({ 
                        isSignedIn: false, 
                        userId: "", 
                        isLoaded: false, 
                        balance: 0 });
                } else {
                    const { isSignedIn, userId } = response
                    const balance = await getBalanceHandler(userId)
                    setAuthState({ 
                        isSignedIn: isSignedIn, 
                        userId: userId, 
                        isLoaded: true, 
                        balance: balance });
                }
            } catch (error) {
                console.error("Error checking auth:", error);
                setAuthState({ 
                    isSignedIn: false, 
                    userId: "", 
                    isLoaded: false, 
                    balance: 0 });
            }
        }
        checkAuthStatus();
    }, [authState.isSignedIn]);

    return (
        <AuthContext.Provider value={{ ...authState, updateAuthState }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
