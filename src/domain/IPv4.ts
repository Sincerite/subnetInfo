
export default class IPv4 {


    private static _defaultMaskSize: number = 24;

    _octets:Array<number> = [0, 0, 0, 0];

    _value: number;

    public mask: IPv4;
    _maskSize:number;
    public addressClass: string;
    public subnet: IPv4;
    public wildcardMask: IPv4;
    public broadcast: IPv4;
    public firstHostAddress: IPv4;
    public lastHostAddress: IPv4;

    public maxHostAmmount: number;
    public belongsToPublicPool: boolean;
    public isHost: boolean;

    constructor(octets: Array<number>) {
        this._octets = octets;
    }

    _initiateProperties() {
        this._value = IPv4.addressValueFromOctets(this._octets);
        this.mask = new IPv4(this.calculateMaskValue(this._maskSize));
        this.addressClass = this._calculateClassType();
        this.subnet = this.calculateSubnetAddress(this._octets, this.mask);
        this.wildcardMask = this.calculateWildcardMask(this.mask);
        this.broadcast = this.calculateBroadcastAddress(this._octets, this.wildcardMask);
        this.firstHostAddress = this.calculateFirstHostAddress(this.subnet);
        this.lastHostAddress = this.calculateLastHostAddress(this.broadcast);
        this.maxHostAmmount = this.calculateMaxHostAmmount();
        this.isHost = this.determineIsHost();
    }

    static convertNumberToUInt32(number: number): number {
        return number >>> 0;
    }

    public parse(address: string): IPv4 {
        if (address.includes("/")) {
            const split:Array<string> = address.split("/");
            address = split[0];
            this._maskSize = parseInt(split[1]);
        } else {
            this._maskSize = IPv4._defaultMaskSize;
        }

        let octets = address.split(".");
        let i = 0;
        for (let octet of octets) {
            this._octets[i++] = parseInt(octet);
        }

        this._initiateProperties();
        return this;
    }

    static printAsBinString(number: number) {
        var sign = (number < 0 ? "-" : "");
        var result = Math.abs(number).toString(2);
        while(result.length < 32) {
            result = "0" + result;
        }
        return sign + result;
    }

    static printBinStringAsNumber(string: string) {
        return parseInt(string, 2);
    }

    public printOctets() {
        return this._octets[0] + "." + this._octets[1] + "." + this._octets[2] + "." + this._octets[3];
    }

    _calculateClassType() {
        const firstOctet: number = this._octets[0];
        if (firstOctet < 128) return "A";
        if (firstOctet < 192) return "B";
        if (firstOctet < 224) return "C";
        if (firstOctet < 240) return "D";
        return "E";
    }

    public determineIsHost() {
        return this.toAddressValue() != this.broadcast.toAddressValue() && this.toAddressValue() != this.subnet.toAddressValue();
    }

    public determineIsInPublicPool() {
        if (this._octets[0] == 10) return false;
        if (this._octets[0] == 172 && this._octets[1] >= 16 && this._octets[1] <= 31) return false;
        if (this._octets[0] == 192 && this._octets[1] == 168) return false;
        return true;
    }

    // JavaScript Int32 issue
    public static octetsFromAddressValue(value: number) {
        const base = "00000000000000000000000000000000"; // 32
        let polyfill = value.toString(2);
        polyfill = base.substring(0, 32 - polyfill.length) + polyfill;

        const octets = [parseInt(polyfill.substring(0, 8), 2),
            (value & 16711680) / 65536,
            (value & 65280) / 256,
            (value & 255)];

        return octets;
    }

    public toAddressValue() {
        return IPv4.addressValueFromOctets(this._octets);
    }

    // JavaScript Int32 issue
    public static addressValueFromOctets(octets: Array<number>) {
        let value: number = 0;
        value += octets[0] * 16777216;
        value += octets[1] * 65536;
        value += octets[2] * 256;
        value += octets[3];
        return value;
    }

    public calculateMaskValue(maskSize: number): any {
        const base = "11111111111111111111111111111111"; // 32
        let mask = parseInt(base.substring(0, maskSize), 2); // base >> maskSize
        mask *= Math.pow(2, 32 - maskSize); // JavaScript style
        return IPv4.octetsFromAddressValue(mask);
    }

    public calculateSubnetAddress(address: Array<number>, mask: IPv4): IPv4 {
        let subnet = new IPv4([0, 0, 0, 0]);
        for (let i = 0; i < 4; i++) {
            subnet._octets[i] = address[i] & mask._octets[i];
        }
        return subnet;
    }

    public calculateWildcardMask(mask: IPv4): IPv4 {
        let wildcard = new IPv4([0, 0, 0, 0]);
        for (let i = 0; i < 4; i++) {
            wildcard._octets[i] = 255 - mask._octets[i];
        }
        return wildcard;
    }

    public calculateBroadcastAddress(address: Array<number>, wildcardMask: IPv4): IPv4 {
        let broadcast = new IPv4([0, 0, 0, 0]);
        for (let i = 0; i < 4; i++) {
            broadcast._octets[i] = address[i] | wildcardMask._octets[i];
        }
        return broadcast;
    }

    public calculateFirstHostAddress(subnet: IPv4): IPv4 {
        const subnetVal = IPv4.addressValueFromOctets(subnet._octets);
        const firstHost = IPv4.octetsFromAddressValue(subnetVal + 1);
        return new IPv4(firstHost);
    }

    public calculateLastHostAddress(broadcast:IPv4): IPv4 {
        const broadcastVal = IPv4.addressValueFromOctets(broadcast._octets);
        const lastHost = IPv4.octetsFromAddressValue(broadcastVal - 1);
        return new IPv4(lastHost);
    }

    public calculateMaxHostAmmount(): any {
        const bits = 32 - this._maskSize;
        return Math.pow(2, bits) - 2;
    }

}