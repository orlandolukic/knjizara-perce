
export class BreakpointManager {

    public static XS: number = 0;
    public static SM: number = 1;
    public static MD: number = 2;
    public static LG: number = 3;
    public static XL: number = 4;
    public static XXL: number = 5;    

    public static getDeviceSize(width: number = 0): string {
        if ( width == 0 )
            width = document.body.offsetWidth;
        if ( width < 576 )
            return "xs";
        else if ( width < 768 )
            return "sm";
        else if ( width < 992 )
            return "md";
        else if ( width < 1200 )
            return "lg";
        else if ( width < 1400 )
            return "xl";
        return "xxl";
    }

    public static getDeviceSizeAsNumber(): number {
        let width: number = document.body.offsetWidth;
        if ( width < 576 )
            return BreakpointManager.XS;
        else if ( width < 768 )
            return BreakpointManager.SM;
        else if ( width < 992 )
            return BreakpointManager.MD;
        else if ( width < 1200 )
            return BreakpointManager.LG;
        else if ( width < 1400 )
            return BreakpointManager.XL;
        return BreakpointManager.XXL;
    }

}