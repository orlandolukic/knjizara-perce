import { sha256 } from "js-sha256";
import { UserBasicData } from "./user-basic-data";

export abstract class User {

    public static BUYER: string = "B";
    public static ADMIN: string = "A";

    public static theSameUser(u1: User, u2: User): boolean {
        return u1.username === u2.username && u2.password === u2.password;
    }

    constructor(
        protected type: string,
        protected name: string,
        protected surname: string,
        protected telephoneNo: string,
        protected address: string,
        protected email: string,
        protected username: string,
        protected password: string,
        protected image: string
    ) {

    }

    public abstract isBuyer(): boolean;
    public abstract isAdmin(): boolean;

    public getName(): string { return this.name; }
    public getSurname(): string { return this.surname; }
    public getFullName(): string { return this.name + " " + this.surname; }
    public getTelephoneNo(): string { return this.telephoneNo; }
    public getAddress(): string { return this.address; }
    public getEmail(): string { return this.email; }
    public getUsername(): string { return this.username; }
    public getPassword(): string { return this.password; }  
    public getImage(): string { return this.image; }  

}

export class Buyer extends User {
    constructor(        
        name: string,
        surname: string,
        telephoneNo: string,
        address: string,
        email: string,
        username: string,
        password: string,
        image: string
    ) {
        super("B", name, surname, telephoneNo, address, email, username, sha256(password), image);
    }

    public isBuyer(): boolean { return true; }
    public isAdmin(): boolean { return false; }
}

export class Admin extends User {
    constructor(        
        name: string,
        surname: string,
        telephoneNo: string,
        address: string,
        email: string,
        username: string,
        password: string,
        image: string
    ) {
        super("A", name, surname, telephoneNo, address, email, username, sha256(password), image);
    }
    public isBuyer(): boolean { return false; }
    public isAdmin(): boolean { return true; }
}