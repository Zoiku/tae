import AxiosInstance from "./AxiosInstance";

const reduce = (array) => {
  const count = {};
  for (const element of array) {
    if (count[element]) {
      count[element] += 1;
    } else {
      count[element] = 1;
    }
  }
  return count;
};

const monthReduce = (array) => {
  const count = {
    January: 0,
    February: 0,
    March: 0,
    April: 0,
    May: 0,
    June: 0,
    July: 0,
    August: 0,
    September: 0,
    October: 0,
    November: 0,
    December: 0
  };
  for (const element of array) {
    if (count[element]) {
      count[element] += 1;
    } else {
      count[element] = 1;
    }
  }

  return count;
};

export default class AdminService {
  async getRequests(signal) {
    let errors = [];
    let data = null;
    const url = "/buyer/quotation/requests";

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

  async getRequestsSalesData(signal) {
    let errors = [];
    let data = null;
    const url = "/buyer/quotation/requests";

    try {
      data = await AxiosInstance().get(url, { signal });
      const allMonths = data.data.data.map((request) =>
        new Date(request.createdOn).toLocaleDateString("default", {
          month: "long"
        })
      );
      data = monthReduce(allMonths);
    } catch (error) {
      errors.push(error);
    }

    return {
      errors,
      data
    };
  }

  async getRequestsCategories(signal) {
    let errors = [];
    let data = null;
    const url = "/buyer/quotation/requests";

    try {
      data = await AxiosInstance().get(url, { signal });
      const allCategories = data.data.data.map(
        (request) => request.quotationProducts[0].product.name
      );
      data = reduce(allCategories);
    } catch (error) {
      errors.push(error);
    }

    return {
      errors,
      data
    };
  }

  async getPendingOrders(signal) {
    let errors = [];
    let data = null;
    const url = "/orders/AWAITING";

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

  async getDeliveredOrders(signal) {
    let errors = [];
    let data = null;
    const url = "/orders/DELIVERED";

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

  async getUnactivatedUsers(signal) {
    let errors = [];
    let data = null;
    const url = "/users/false";

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
    const url = "/orders";

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

  async getBuyers(signal) {
    let errors = [];
    let data = null;
    const url = `/buyers`;

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

  async getMerchants(signal) {
    let errors = [];
    let data = null;
    const url = "/merchants";

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
