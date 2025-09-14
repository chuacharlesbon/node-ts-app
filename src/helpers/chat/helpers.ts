import { DEV_MODE } from "../../config/config";

export function createThreadKey(email1: string, email2: string) {
    return [email1.toLowerCase(), email2.toLowerCase()].sort().join("-");
}

export function print(msg: string) {
    if(DEV_MODE){
        console.log(msg);
    }
}