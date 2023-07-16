import {makeAutoObservable} from 'mobx';

class BarcodeStore {
  isLoading = false;
  barCodeData='';
  barCodeDetail = {};
  constructor() {
    makeAutoObservable(this);
  }
  setLoading(data) {
    this.isLoading = data;
  }
  setBarCodeData(data){
    this.barCodeData = data; 
  }
  setBarCodeDetail(data){
    this.barCodeDetail = data; 
  }
}
const barcodeStore = new BarcodeStore();
export default barcodeStore;
