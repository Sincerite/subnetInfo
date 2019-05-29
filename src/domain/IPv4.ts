export default class IPv4 {
    constructor(value: number) {
        this._value = value;
    }

    private static _defaultMaskSize: number = 24;

    private _octets:Array<number> = [0, 0, 0, 0];

    private _value: number;

    public mask: IPv4;
    private _maskSize:number;
    public addressClass: IPv4;
    public subnet: IPv4;
    public broadcast: IPv4;
    public firstHostAddress: IPv4;
    public lastHostAddress: IPv4;


    // ToDo: Move to store


    public maxHostAmmount: number;
    public belongsToPublicPool: boolean;

    private _initiateProperties() {
        this.mask = new IPv4(this.calculateMaskNumber(this._maskSize));
        this.addressClass = this._calculateClassType();
        this.subnet = IPv4.calculateSubnetAddress(_value, mask);
    }

    public static parse(address: string): IPv4 {
        let ip:IPv4 = new IPv4();

        if (address.includes("/")) {
            const split:Array<string> = address.split("/");
            address = split[0];
            ip._maskSize = parseInt(split[1]);
        } else {
            ip._maskSize = IPv4._defaultMaskSize;
        }

        let octets = address.split(".");
        let i = 0;
        for (let octet in octets) {
            ip._octets[i++] = parseInt(octet);
        }
        return ip;
    }

    private _calculateClassType() {
        const firstOctet: number = this._octets[0];
        if (firstOctet < 128) return "A";
        if (firstOctet < 192) return "B";
        if (firstOctet < 224) return "C";
        if (firstOctet < 240) return "D";
        return "E";
    }

    private _determineIsInPublicPool() {
        if (this._octets[0] == 10) return false;
        if (this._octets[0] == 172 && this._octets[1] >= 16 && this._octets[1] <= 31) return false;
        if (this._octets[0] == 192 && this._octets[1] == 168) return false;
        return true;
    }


    public static octetsFromAddressValue(value: number) {
        let octets: Array<number> = new Array<number>(4);
        for (let i = 0; i < 4; i++) {
            octets[i] = value >> ((3 - i) * 8);
        }
        return octets;
    }

    public static addressValueFromOctets(octets: Array<number>) {
        let value: number = 0;
        for (let i = 0; i < 4; i++) {
            let oct = octets[i] << ((3 - i) * 8);
            value += oct;
        }
        return value;
    }

    public static calculateMaskNumber(maskSize: number) {
        return 192 << 32 - maskSize;
    }

    public static calculateSubnetAddress(address, mask) {
        return mask & address;
    }

    public static calculateFirstHostAddress(subnetAddress) {
        return subnetAddress + 1;
    }

    public static calculateBroadcastAddress(address, mask) {
        return ~mask | address;
    }

    public static calculateLastHostAddress(broadcastAddress) {
        return broadcastAddress - 1;
    }

    public static calculateMaxHostAmmount(mask) {
        let am = (~mask) - 1;
        return am >= 0 ? am : 0;
    }

}