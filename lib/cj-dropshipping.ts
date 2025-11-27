export interface CJProduct {
    pid: string;
    productName: string;
    productNameEn: string;
    productSku: string;
    productImage: string;
    productWeight: string;
    productType: string;
    sellPrice: string;
    categoryName: string;
    entryNameEn: string;
}

export interface CJProductDetail extends CJProduct {
    description: string;
    variants: {
        vid: string;
        variantName: string;
        variantSku: string;
        variantImage: string;
        variantPrice: string;
        variantStandard: string;
    }[];
    productImages: string[];
}

export class CJDropshippingClient {
    private accessToken: string;
    private baseUrl = "https://developers.cjdropshipping.com/api2.0/v1";

    constructor(accessToken?: string) {
        this.accessToken = accessToken || process.env.CJ_ACCESS_TOKEN || "";
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        if (!this.accessToken) {
            throw new Error("CJ Access Token is missing. Please set CJ_ACCESS_TOKEN in environment variables.");
        }

        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            "CJ-Access-Token": this.accessToken,
            "Content-Type": "application/json",
            ...options.headers,
        };

        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`CJ API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();

        if (data.result === false) {
            throw new Error(`CJ API Error: ${data.message || "Unknown error"}`);
        }

        return data.data;
    }

    async searchProducts(keyword: string, page: number = 1, pageSize: number = 20): Promise<{ list: CJProduct[]; total: number }> {
        // Note: CJ API endpoints might vary, this is based on standard structure
        // Endpoint: /product/list
        return this.request<{ list: CJProduct[]; total: number }>(
            `/product/list?pageNum=${page}&pageSize=${pageSize}&productName=${encodeURIComponent(keyword)}`
        );
    }

    async getProductDetails(pid: string): Promise<CJProductDetail> {
        // Endpoint: /product/query
        return this.request<CJProductDetail>(`/product/query?pid=${pid}`);
    }
}
