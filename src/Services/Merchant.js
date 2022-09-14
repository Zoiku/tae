import AxiosInstance from "./AxiosInstance";

export default class MerchantService {
  async getRequests(signal) {
    let errors = [];
    let data = null;
    const url = "/buyer/quotation/merchants/requests/true";

    try {
      data = await AxiosInstance().get(url, { signal });
    } catch (error) {
      errors.push(error);
    }

    return {
      errors,
      data
    };
  }

  async getOrders(signal) {
    let errors = [];
    let data = null;
    const url = "/orders/merchant/nonpaged";

    try {
      data = await AxiosInstance().get(url, { signal });
    } catch (error) {
      errors.push(error);
    }

    return {
      errors,
      data
    };
  }

  async getQuotes(signal) {
    let errors = [];
    let data = null;
    const url = "/merchant/quotations";

    try {
      data = await AxiosInstance().get(url, { signal });
    } catch (error) {
      errors.push(error);
    }

    return {
      errors,
      data
    };
  }
}
