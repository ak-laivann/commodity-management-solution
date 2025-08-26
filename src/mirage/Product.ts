import { type Product, Product_Creation_Status } from "@/components/props";
import { faker } from "@faker-js/faker";
import { Response, type Registry } from "miragejs";
import type { RouteHandler } from "miragejs/server";
import type { ModelRegistry } from "./MirageModels";

// this can be used for dashboard as well.
// having each them separate for each product might be scalable. but since this is only an assignment,
// going in without the crud but rather only the R - the R!!
export interface TimeSeries_Product {
  productId: string;
  metric: string;
  data: { date: string; value: number }[];
}

export const getProductTimeSeries = (
  productId: string,
  metric: string
): any => {
  const data: { date: string; value: number }[] = [];

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 18);
  const endDate = new Date();

  const iterate = faker.number.int({ min: 5, max: 20 });
  for (let i = 0; i < iterate; i++) {
    const randomDate = faker.date.between({ from: startDate, to: endDate });
    const value = (() => {
      switch (metric) {
        case "SALES":
          return faker.number.int({ min: 1, max: 100 });
        case "REVENUE":
          return faker.number.int({ min: 50, max: 5000 });
        case "VIEWS":
          return faker.number.int({ min: 10, max: 1000 });
        default:
          return 0;
      }
    })();

    data.push({
      date: randomDate.toISOString().split("T")[0],
      value,
    });
  }

  data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return {
    productId,
    metric,
    data,
  };
};

export const getProduct = (
  managerId?: string,
  storeOwnerIds?: string[],
  id?: string,
  status?: Product_Creation_Status
): Product => {
  return {
    id: id ?? faker.database.mongodbObjectId(),
    managerId: managerId ?? faker.database.mongodbObjectId(),
    storeOwnerIds: storeOwnerIds ?? [
      faker.database.mongodbObjectId(),
      faker.database.mongodbObjectId(),
      faker.database.mongodbObjectId(),
    ],
    status: status!,
    productName: faker.commerce.productName(),
    productCategory: faker.commerce.department(),
    productDescription: faker.commerce.productDescription(),
    tags: [faker.commerce.productAdjective(), faker.commerce.productMaterial()],
    pricing: {
      price: parseFloat(faker.commerce.price()),
      discount: parseFloat(faker.commerce.price({ min: 1, max: 20 })),
      discounCategory: faker.commerce.productAdjective(),
    },
    file: {
      thumbnailfile: [
        {
          name: "sample.png",
          uid: "1234",
          status: "done",
          url: faker.image.url(),
        },
      ],
      previewimage: [
        {
          name: "sample.png",
          uid: "1234",
          status: "done",
          url: faker.image.url(),
        },
      ],
    },
  };
};
export const mockGetProducts: RouteHandler<
  Registry<typeof ModelRegistry, any>
> = (schema, request) => {
  const page = Number(request.queryParams.page) || 1;
  const limit = Number(request.queryParams.limit) || 10;
  const searchTerm = (
    (request.queryParams.search as string) || ""
  ).toLowerCase();

  const sortField = request.queryParams.sortField as
    | "views"
    | "pricing"
    | "revenue"
    | undefined;
  const sortOrder = (request.queryParams.sortOrder as "asc" | "desc") || "asc";

  const products = schema.all("product").models;
  const timeseries = schema.all("timeseriesproduct").models.map((m) => m.attrs);

  const timeseriesMap: Record<string, { views: number; revenue: number }> = {};
  timeseries.forEach((ts) => {
    // @ts-ignore
    const { productId, metric, data } = ts;
    if (!timeseriesMap[productId]) {
      timeseriesMap[productId] = { views: 0, revenue: 0 };
    }
    if (metric === "VIEWS") {
      timeseriesMap[productId].views = data.reduce(
        (acc: number, d: any) => acc + d.value,
        0
      );
    } else if (metric === "REVENUE") {
      timeseriesMap[productId].revenue = data.reduce(
        (acc: number, d: any) => acc + d.value,
        0
      );
    }
  });

  const filteredProducts = products.filter((p) => {
    const attrs = p.attrs as Product;
    const inName = attrs.productName.toLowerCase().includes(searchTerm);
    const inDescription = attrs.productDescription
      .toLowerCase()
      .includes(searchTerm);
    const inTags = attrs.tags.some((tag) =>
      tag.toLowerCase().includes(searchTerm)
    );
    return searchTerm === "" || inName || inDescription || inTags;
  });

  const productsSegregatedWithStatus: { [key: string]: any } = {
    [Product_Creation_Status.DRAFT]: [],
    [Product_Creation_Status.PUBLISHED]: [],
  };

  filteredProducts.forEach((p) => {
    const attrs = p.attrs as Product;
    const metrics = timeseriesMap[p.id!] || { views: 0, revenue: 0 };
    const productWithMetrics = { ...attrs, ...metrics };

    productsSegregatedWithStatus[attrs.status].push(productWithMetrics);
  });

  if (sortField) {
    Object.keys(productsSegregatedWithStatus).forEach((status) => {
      productsSegregatedWithStatus[status].sort((a: any, b: any) => {
        let aValue =
          sortField === "views"
            ? a.views
            : sortField === "pricing"
            ? a.pricing.price
            : a.revenue;
        let bValue =
          sortField === "views"
            ? b.views
            : sortField === "pricing"
            ? b.pricing.price
            : b.revenue;

        if (sortOrder === "asc") return aValue - bValue;
        return bValue - aValue;
      });
    });
  }

  const from = (page - 1) * limit;
  const to = page * limit;

  return {
    [Product_Creation_Status.DRAFT]: productsSegregatedWithStatus[
      Product_Creation_Status.DRAFT
    ].slice(from, to),
    [Product_Creation_Status.PUBLISHED]: productsSegregatedWithStatus[
      Product_Creation_Status.PUBLISHED
    ].slice(from, to),
    total: {
      [Product_Creation_Status.DRAFT]:
        productsSegregatedWithStatus[Product_Creation_Status.DRAFT].length,
      [Product_Creation_Status.PUBLISHED]:
        productsSegregatedWithStatus[Product_Creation_Status.PUBLISHED].length,
    },
  };
};

export const mockGetProduct: RouteHandler<
  Registry<typeof ModelRegistry, any>
> = (schema, request) => {
  const productId = request.params.id;
  const data = schema.find("product", productId);
  return data?.attrs as any;
};

export const mockPostProduct: RouteHandler<
  Registry<typeof ModelRegistry, any>
> = (schema, request) => {
  const attrs = JSON.parse(request.requestBody);
  const newProduct = schema.create("product", attrs);
  return newProduct.attrs;
};

export const mockPutProduct: RouteHandler<
  Registry<typeof ModelRegistry, any>
> = (schema, request) => {
  const id = request.params.id;
  const attrs = JSON.parse(request.requestBody);
  const product = schema.find("product", id);
  if (product) {
    product.update(attrs);
    return product.attrs;
  } else {
    return new Response(404, {}, { error: "Product not found" });
  }
};

export const mockDeleteProduct: RouteHandler<
  Registry<typeof ModelRegistry, any>
> = (schema, request) => {
  const id = request.params.id;
  const product = schema.find("product", id);

  if (product) {
    product.destroy();
    return new Response(200, {}, { message: "Product deleted successfully" });
  } else {
    return new Response(404, {}, { error: "Product not found" });
  }
};

export const mockGetProductTimeSeries: RouteHandler<
  Registry<typeof ModelRegistry, any>
> = (schema, request) => {
  const timeseries = schema.all("timeseriesproduct").models.map((m) => m.attrs);

  const queryParams = new URLSearchParams(request.queryParams as any);
  const startParam = queryParams.get("start");
  const endParam = queryParams.get("end");

  const now = new Date();
  let startDate: Date;
  let endDate: Date;

  if (startParam && endParam) {
    startDate = new Date(startParam);
    endDate = new Date(endParam);
  } else if (startParam) {
    startDate = new Date(startParam);
    endDate = now;
  } else {
    endDate = now;
    startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
  }

  let totalSales = 0;
  let totalRevenue = 0;
  let totalViews = 0;

  const filteredTimeseries = timeseries.map((ts: any) => {
    const filteredData = ts.data.filter((d: any) => {
      const date = new Date(d.date);
      return date >= startDate && date <= endDate;
    });

    const hasStart = filteredData.some(
      (d: any) => new Date(d.date).getTime() === startDate.getTime()
    );

    if (!hasStart) {
      filteredData.unshift({ date: startDate.toISOString(), value: 0 });
    }

    filteredData.forEach((d: any) => {
      const date = new Date(d.date);
      if (date > startDate && date < endDate) {
        if (ts.metric === "SALES") totalSales += d.value;
        if (ts.metric === "REVENUE") totalRevenue += d.value;
        if (ts.metric === "VIEWS") totalViews += d.value;
      }
    });

    return {
      ...ts,
      data: filteredData,
    };
  });

  return {
    totalSales,
    totalRevenue,
    totalViews,
    timeseries: filteredTimeseries,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
};
