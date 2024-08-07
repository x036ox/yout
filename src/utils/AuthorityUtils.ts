export function checkIsUserAdmin(authorities:string[] | any):boolean{
    if(authorities){
        return authorities.includes("ROLE_ADMIN");
    }
    return false;
}

export function parseAuthorities(authorities:string | undefined){
    if(authorities){
        return authorities.split(",");
    } 
    return [];
}