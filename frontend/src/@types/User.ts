export interface User{
    data?:{
        email: string,
        id:string,
        username: string,
    },
    is_authenticated: boolean

}