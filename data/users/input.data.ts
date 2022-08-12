import { Admin, Buyer, User } from "data/users/user";
import { sha256 } from "js-sha256";
import { UserBasicData } from "./user-basic-data";

export class UserDataManipulation {

    private static loggedInUser: User|null;
    private static users: User[];

    public static logInUser( user: any ): void {    
        
        if ( UserDataManipulation.loggedInUser )
            return;

        if ( user.type === User.BUYER )
            UserDataManipulation.loggedInUser = new Buyer(
                user.name,
                user.surname,
                user.telephoneNo,
                user.address,
                user.username,
                user.password,
                user.image
            );
        else 
            UserDataManipulation.loggedInUser = new Admin(
                user.name,
                user.surname,
                user.telephoneNo,
                user.address,
                user.username,
                user.password,
                user.image
            );
    }

    public static initData(): void {       

        if ( localStorage.getItem('initUsers') === "true" )
            return;       

        UserDataManipulation.users = new Array<User>();
        UserDataManipulation.users.push( new Buyer( "Petar", "Petrovic", "0603120456", "Bulevar Kralja Aleksandra 207c", "petar", "p123", "user1.png") );
        UserDataManipulation.users.push( new Buyer( "Djordje", "Ristic", "0645151205", "Bulevar Kralja Aleksandra 207c", "djordje", "d123", "user2.png") );
        UserDataManipulation.users.push( new Buyer( "Ivan", "Marković", "0623344555", "Bulevar Kralja Aleksandra 207c", "ivan", "i", "user5.png") );        
        UserDataManipulation.users.push( new Buyer( "Filip", "Ostojić", "0644025987", "Bulevar Kralja Aleksandra 207c", "filip", "f", "user6.png") );        
        UserDataManipulation.users.push( new Buyer( "Ivana", "Vasić", "0653074850", "Bulevar Kralja Aleksandra 207c", "ivana", "i", "user7.png") );        
        UserDataManipulation.users.push( new Admin( "Teodora", "Marjanovic", "0636352968", "Bulevar Kralja Aleksandra 207c", "teodora", "t123", "user4.png") );

        // Put all users inside local storage.        
        localStorage.setItem("users", JSON.stringify(UserDataManipulation.users));

        // Set indicator that all users have been successfully loaded.
        localStorage.setItem('initUsers', "true");
    }

    public static isUserPresent(username: string, password: string): boolean {
        let s: any = localStorage.getItem("users");
        let obj: Object[] = JSON.parse(s);  
        
        if ( obj === null )
            return false;
        
        for(let i=0; i<obj.length; i++) {
            let user: any = obj[i];                                   
            if ( user.username === username && user.password === password )
                return true;
        }
        return false;
    }

    public static getUserByUsername(username: string): any {
        let s: any = localStorage.getItem("users");
        let obj: Object[] = JSON.parse(s);
        for(let i=0; i<obj.length; i++) {
            let user: any = obj[i];
            if ( user.username === username )
                return obj[i];
        }
        return null;
    }

    public static getUserForDisplay(username: string): UserBasicData|null {
        let s: any = localStorage.getItem("users");
        let obj: Object[] = JSON.parse(s);
        for(let i=0; i<obj.length; i++) {
            let user: any = obj[i];
            if ( user.username === username ) {
                return {
                    name: user.name,
                    surname: user.surname,
                    image: user.image,
                    username: user.username
                };
            }            
        }
        return null;
    }

    public static getLoggedInUser(): any {   
        let x: any = sessionStorage.getItem('loggedInUser');
        x = JSON.parse(x);
        UserDataManipulation.logInUser(x);     
        return UserDataManipulation.loggedInUser;
    }

    public static logout(): void {
        UserDataManipulation.loggedInUser = null;
    }

    public static getAllBuyersExceptMe(): Buyer[] {        

        let myself: any = sessionStorage.getItem('loggedInUser');
        myself = JSON.parse(myself);

        let buyers: Buyer[] = new Array<Buyer>();
        let s: any = localStorage.getItem("users");
        let obj: Object[] = JSON.parse(s);
        for(let i=0; i<obj.length; i++) {
            let user: any = obj[i];
            if ( user.username === myself.username || user.type === User.ADMIN )
                continue;
            buyers.push(
                new Buyer(user.name,user.surname,user.telephoneNo, user.address, user.username, user.password, user.image)
            );
        }
        return buyers;
    }

    public static getBasicUserDataFrom(u: User): UserBasicData {
        return {
            image: u.getImage(),
            name: u.getName(),
            surname: u.getSurname(),
            username: u.getUsername()
        };
    }

    public static hasUsername(username: string): boolean {
        let s: any = localStorage.getItem("users");
        let obj: Object[] = JSON.parse(s);
        for(let i=0; i<obj.length; i++) {
            let user: any = obj[i];
            if ( user.username === username )
                return true;            
        }
        return false;
    }

    public static registerNewUser(
        name: string,
        surname: string,
        contact: string,
        address: string,
        username: string,
        password: string
    ): Promise<void> {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                const user: Buyer = new Buyer( name, surname, contact, address, username, password, "no-user.webp");
                let s: any = localStorage.getItem("users");
                let obj: Object[] = JSON.parse(s);  
                obj.push(user);

                // Save users into list
                localStorage.setItem("users", JSON.stringify(obj));

                // Log in this newly created user
                UserDataManipulation.logInUser(user);
                sessionStorage.setItem("loggedInUser", JSON.stringify(user));

                // Resolve this promise
                resolve();
            }, 600 + Math.random() * 1000);
        })
    }

}