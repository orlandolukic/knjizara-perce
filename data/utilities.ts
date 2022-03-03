
export class Utilities {
    public static printDate(d: Date): string {
        let s: string = "";
        let date: Date = new Date(d);
        if ( date.getDate() < 10 )
        s += "0";
        s += date.getDate() + ".";
        if ( date.getMonth() + 1 < 10 ) 
        s += "0";
        s += (date.getMonth() + 1) + "." + date.getFullYear() + ".";
        return s;
    }

    public static getMainPrice(price: number): string {
        let s: string = "";
        let p: number;    

        p = Math.floor(price);
        s += p.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&.');
        s = s.replace(/\.\d{2}$/g, '');

        return s;
    }

    public static getPennies(price: number): string {
        let p: number = Math.floor(price);
        let p1: number = (price - p) * 100;
        p1 = Math.floor(p1);
        let s: string;
        if ( p1 < 10 ) {
            s = "0" + p1;      
        } else {
            s = String(p1);
        } 
        return s;
    }
    
}