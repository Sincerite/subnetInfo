import IPv4 from "../domain/IPv4";
import {observable} from "mobx";


export class UiStore {

    @observable
    public currentIPAddress: IPv4;







    public initiateNewAddress(address: string): IPv4 {
        this.currentIPAddress = new IPv4([0, 0, 0, 0]);
        this.currentIPAddress = this.currentIPAddress.parse(address);

        //console.clear();
        console.log("Octets", this.currentIPAddress._octets);
        console.log("Value", this.currentIPAddress._value);
        console.log("Mask", this.currentIPAddress.mask);
        console.log("Mask Size", this.currentIPAddress._maskSize);
        console.log("Address Class", this.currentIPAddress.addressClass);
        console.log("Subnet", this.currentIPAddress.subnet);
        console.log("Wildcard Mask", this.currentIPAddress.wildcardMask);
        console.log("Broadcast", this.currentIPAddress.broadcast);
        console.log("First Host Address", this.currentIPAddress.firstHostAddress);
        console.log("Last Host Address", this.currentIPAddress.lastHostAddress);


        return this.currentIPAddress;
    }

}



const uiStore = new UiStore;
export default uiStore;
