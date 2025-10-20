export interface User {
    email: string,
    username: string,
    full_name: string,
    created_at: string,
    is_active: boolean
}

export interface UserCreate {
    email: string,
    username: string,
    password: string
}

export interface UserLogin{
    email: string,
    password: string
}