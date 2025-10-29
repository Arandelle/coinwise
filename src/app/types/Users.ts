export interface User {
    _id?: string,
    email: string,
    username: string,
    full_name: string,
    created_at: string,
    is_active: boolean
}

export interface UserCreate {
    email: string,
    username: string,
    password: string,
    confirmPassword: string
}

export interface UserLogin{
    email: string,
    password: string
}