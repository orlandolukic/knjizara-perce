import { ElementRef } from "@angular/core";
import { RegisterComponent } from "./register.component";

export function checkRegisterRequest( component: RegisterComponent, field: HTMLInputElement ): void {    

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
            } else if ( value.length < 3 ) {
                component.isErrorName = true;
                component.errorName = $localize `Ime mora imati barem 3 slova`;
                component.addUpError();
            };
            break;

        case "surname":            
            if ( value === "" || value.trim() === "" )
            {
                component.errorSurname = $localize `Prezime ne moze biti prazno`;
                component.isErrorSurname = true;
                component.addUpError();
            } else if ( value.length < 5 ) {
                component.isErrorSurname = true;
                component.errorSurname = $localize `Prezime mora imati barem 5 slova`;
                component.addUpError();
            };
            break;

        case "contact": 
            const regexp = /^\+[1-9][0-9]{11}$/g;
            if ( value === "" || value.trim() === "" )
            {
                component.errorContact = $localize `Kontakt telefon ne moze biti prazan`;
                component.isErrorContact = true;
                component.addUpError();
            } else if ( !regexp.test(value) ) {
                component.isErrorContact = true;
                component.errorContact = $localize `Broj mora biti u formatu +381*********`;
                component.addUpError();
            };
            break;

        case "address":            
            if ( value === "" || value.trim() === "" )
            {
                component.errorAddress = $localize `Adresa ne sme biti prazna`;
                component.isErrorAddress = true;
                component.addUpError();
            };
            break;
    }  
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
    }
}