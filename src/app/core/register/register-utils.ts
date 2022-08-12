import { ElementRef } from "@angular/core";
import { RegisterComponent } from "./register.component";

export function checkRegisterRequest( component: RegisterComponent, field: HTMLInputElement ): boolean {    

    const value = field.value;
    const name = field.name;

    // Reset errors for specific input field
    resetErrorFor(name, component);

    switch( name ) {
        case "name":            
            if ( value === "" || value.trim() === "" )
            {
                component.errorName = $localize `Ime ne moze biti prazno`;
                component.isErrorName = true;
                component.addUpError();
                return false;
            } else if ( value.length < 3 ) {
                component.isErrorName = true;
                component.errorName = $localize `Ime mora imati barem 3 slova`;
                component.addUpError();
                return false;
            };
            break;

        case "surname":            
            if ( value === "" || value.trim() === "" )
            {
                component.errorSurname = $localize `Prezime ne moze biti prazno`;
                component.isErrorSurname = true;
                component.addUpError();
                return false;
            } else if ( value.length < 5 ) {
                component.isErrorSurname = true;
                component.errorSurname = $localize `Prezime mora imati barem 5 slova`;
                component.addUpError();
                return false;
            };
            break;

        case "contact": 
            const regexp = /^\+[1-9][0-9]{11}$/g;
            if ( value === "" || value.trim() === "" )
            {
                component.errorContact = $localize `Kontakt telefon ne moze biti prazan`;
                component.isErrorContact = true;
                component.addUpError();
                return false;
            } else if ( !regexp.test(value) ) {
                component.isErrorContact = true;
                component.errorContact = $localize `Broj mora biti u formatu +381*********`;
                component.addUpError();
                return false;
            };
            break;

        case "address":            
            if ( value === "" || value.trim() === "" )
            {
                component.errorAddress = $localize `Adresa ne sme biti prazna`;
                component.isErrorAddress = true;
                component.addUpError();
                return false;
            };
            break;

        case "email":  
            const emailRegexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;          
            if ( value === "" || value.trim() === "" )
            {
                component.errorEmail = $localize `E-mail ne sme biti prazan`;
                component.isErrorEmail = true;
                component.addUpError();
                return false;
            } else if ( !emailRegexp.test(value) ) {
                component.errorEmail = $localize `E-mail nije napisan u dobrom formatu`;
                component.isErrorEmail = true;
                component.addUpError();
                return false;
            }
            break;

        case "username":            
            if ( value === "" || value.trim() === "" )
            {
                component.errorUsername = $localize `Korisnicko ime ne može biti prazno`;
                component.isErrorUsername = true;
                component.isOkUsername = false;
                component.isTakenUsername = false;
                component.addUpError();
                return false;
            } else if ( value.length < 5 ) {
                component.errorUsername = $localize `Korisničko ime mora imati barem 5 karaktera`;
                component.isErrorUsername = true;
                component.isOkUsername = false;
                component.isTakenUsername = false;
                component.addUpError();
                return false;
            }
            break;

        case "password":   
            const regexpCapitalLetter = /^.*[A-Z].*$/g;         
            const regexpNumber = /^.*[0-9].*$/g;
            const regexpSpecialChar = /^.*\W.*$/g;
            if ( value === "" || value.trim() === "" )
            {
                component.errorPassword = $localize `Lozinka ne može biti prazna`;
                component.isErrorPassword = true;
                component.addUpError();
                return false;
            } else if ( value.length < 5 ) {
                component.errorPassword = $localize `Lozinka mora imati barem 5 karaktera`;
                component.isErrorPassword = true;
                component.addUpError();
                return false;
            } else {
                component.errorPassword = null;

                if ( !regexpCapitalLetter.test(value) ) {
                    component.errorPasswordCapitalLetter = true;
                    component.isErrorPassword = true;
                }

                if ( !regexpNumber.test(value) ) {
                    component.errorPasswordNumber = true;
                    component.isErrorPassword = true;
                }

                if ( !regexpSpecialChar.test(value) ) {
                    component.errorPasswordSpecialChar = true;
                    component.isErrorPassword = true;
                }
            }
            break; 
            
        case "passwordConfirm": 
            // Check if password input is empty, so there should not be any error
            if ( component.inputPassword.nativeElement.value.trim() === "" )           
                return true;

            if ( value !== component.inputPassword.nativeElement.value )
            {
                component.errorPasswordConfirm = $localize `Lozinke se ne podudaraju`;
                component.isErrorPasswordConfirm = true;
                component.addUpError();
                return false;
            }
            break;
    }
    
    return true;
}

export function resetErrors( component: RegisterComponent ): void {
    component.isErrorName = false;
    component.isErrorSurname = false;
    component.isErrorContact = false;
    component.isErrorAddress = false;
    component.isErrorEmail = false;
    component.isErrorPassword = false;
    component.isErrorPasswordConfirm = false;
    component.isErrorUsername = false;

    component.clearAllErrors();
}

export function resetErrorFor( name: string, component: RegisterComponent ): void {
    switch( name ) {
        case "name":
            if ( component.isErrorName ) 
                component.removeDownError();
            component.isErrorName = false;            
            break;
            
        case "surname":
            if ( component.isErrorSurname ) 
                component.removeDownError();
            component.isErrorSurname = false;            
            break;

        case "contact":
            if ( component.isErrorContact ) 
                component.removeDownError();
            component.isErrorContact = false;            
            break;

        case "address":
            if ( component.isErrorAddress ) 
                component.removeDownError();
            component.isErrorAddress = false;            
            break;

        case "email":
            if ( component.isErrorEmail ) 
                component.removeDownError();
            component.isErrorEmail = false;            
            break;

        case "username":
            if ( component.isErrorUsername ) 
                component.removeDownError();
            component.isErrorUsername = false;               
            break;

        case "password":
            if ( component.isErrorPassword ) 
                component.removeDownError();
            component.isErrorPassword = false;   
            component.errorPasswordCapitalLetter = false;
            component.errorPasswordNumber = false;
            component.errorPasswordSpecialChar = false;     
            break;  
            
        case "passwordConfirm":
            if ( component.isErrorPasswordConfirm ) 
                component.removeDownError();
            component.isErrorPasswordConfirm = false;
            break;
    }
}