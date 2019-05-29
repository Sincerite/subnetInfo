import IPv4 from "../domain/IPv4";
import {observable} from "mobx";


export class UiStore {

    @observable
    public currentIPAddress: IPv4;







    public initiateNewAddress(address: string): IPv4 {
        this.currentIPAddress = IPv4.parse(address);
        console.log(this.currentIPAddress); // Temp
        return this.currentIPAddress;
    }

}



const uiStore = new UiStore;
export default uiStore;
