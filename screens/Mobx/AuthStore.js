import {makeObservable, action, observable} from 'mobx';

class AuthStore {
  isLoading = true;
  isLoggedIn = false;
  isAdmin = false;
  isSales = false;
  isService = false;
  user = '';
  masterId = '';
  companyId = '';
  divisionId = '';
  adminId = '';
  salesId = '';
  host = '';

  constructor() {
    makeObservable(this, {
      host: observable,
      isLoading: observable,
      isLoggedIn: observable,
      isAdmin: observable,
      isSales: observable,
      user: observable,
      masterId: observable,
      companyId: observable,
      divisionId: observable,
      salesId: observable,
      adminId: observable,
      setLoading: action,
      setIsAdmin: action,
      setIsLoggedIn: action,
      setIsSales: action,
      setIsService: action,
      setUser: action,
      setMasterId: action,
      setCompanyId: action,
      setDivisionId: action,
      setAdmin: action,
      setSales: action,
      setHost: action
    });
  }
  setHost(payload){
    this.host = payload;
  }
  setLoading(payload) {
    this.isLoading = payload;
  }
  setIsLoggedIn(payload) {
    this.isLoggedIn = payload;
  }
  setIsAdmin(payload) {
    this.isAdmin = payload;
  }
  setIsSales(payload) {
    this.isSales = payload;
  }
  setIsService(payload) {
    this.isService = payload;
  }
  setUser(payload) {
    this.user = payload;
  }
  setMasterId(payload) {
    this.masterId = payload;
  }
  setCompanyId(payload) {
    this.companyId = payload;
  }
  setDivisionId(payload) {
    this.divisionId = payload;
  }
  setAdmin(payload) {
    this.adminId = payload;
  }
  setSales(payload) {
    this.salesId = payload;
  }
}

export default new AuthStore();
