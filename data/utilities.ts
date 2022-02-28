
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
}