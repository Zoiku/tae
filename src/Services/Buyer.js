import AxiosInstance from "./AxiosInstance";

export default class AdminService {
  async getRequests(signal) {
    let errors = [];
    let data = null;
    const url = "/buyer/requests/quotation";

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
    const url = "/orders/user/nonpaged";

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

  async postPendingQuote(payload) {
    let errors = [];
    let data = null;
    const url = "/buyer/quotation/requests/pending/";

    try {
      data = await AxiosInstance().post(url, payload);
    } catch (error) {
      errors.push(error);
    }

    return {
      errors,
      data
    };
  }

  async postQuote(payload) {
    let errors = [];
    let data = null;
    const url = "/buyer/quotation/request/";

    try {
      data = await AxiosInstance().post(url, payload);
    } catch (error) {
      errors.push(error);
    }

    return {
      errors,
      data
    };
  }

  async getOffers(id) {
    let errors = [];
    let data = null;
    const url = `/buyer/quotation/offers/request/${id}`;

    try {
      data = await AxiosInstance().get(url);
    } catch (error) {
      errors.push(error);
    }

    return {
      errors,
      data
    };
  }
}
