"use client"

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { User } from "../types/Users";

interface AuthContextType{
    user: User | null;
    loading: boolean;
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children} : {children: ReactNode}){
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      refreshUser();   
    }, [])

    const refreshUser = async () => {
        try{
            const response = await fetch("/api/auth/me");
            if(!response.ok){
                setUser(null);
                return;
            }

            const data = await response.json();

            if (data && data.email){
                setUser(data);
            } else{
                setUser(null);
            }

        }catch(error){
            console.error("Error fetching user: ", error);
            setUser(null);
        } finally{
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, refreshUser}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(){
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider!");
    return context;
}