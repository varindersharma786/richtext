import { createAdminClient } from "@/utils/supabase/admin";

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
    private accessToken = "";
    private baseUrl = "https://developers.cjdropshipping.com/api2.0/v1";
    private supabase = createAdminClient();

    constructor(private apiKey: string) { }

    private async initToken() {
        if (this.accessToken) return;

        // Try to get from DB
        const { data: settings } = await this.supabase
            .from('store_settings')
            .select('id, cj_access_token, cj_access_token_expiry, cj_refresh_token, cj_refresh_token_expiry')
            .limit(1)
            .single();

        if (settings) {
            const now = new Date();
            const tokenExpiry = settings.cj_access_token_expiry ? new Date(settings.cj_access_token_expiry) : null;

            // If token is valid (with 5 min buffer)
            if (settings.cj_access_token && tokenExpiry && tokenExpiry.getTime() > now.getTime() + 5 * 60 * 1000) {
                this.accessToken = settings.cj_access_token;
                return;
            }

            // Try refresh
            const refreshExpiry = settings.cj_refresh_token_expiry ? new Date(settings.cj_refresh_token_expiry) : null;
            if (settings.cj_refresh_token && refreshExpiry && refreshExpiry.getTime() > now.getTime()) {
                try {
                    await this.refreshToken(settings.cj_refresh_token, settings.id);
                    return;
                } catch (error) {
                    console.error("Failed to refresh CJ token:", error);
                    // Fall through to get new token
                }
            }
        }

        // Get new token
        await this.getNewAccessToken(settings?.id);
    }

    private async getNewAccessToken(settingsId?: string) {
        const res = await fetch(`${this.baseUrl}/authentication/getAccessToken`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                apiKey: this.apiKey,
            }),
        });

        const data = await res.json();

        if (!res.ok || data.result === false) {
            throw new Error("CJ Auth Error: " + data.message);
        }

        this.accessToken = data.data.accessToken;
        await this.saveTokens(data.data, settingsId);
    }

    private async refreshToken(refreshToken: string, settingsId: string) {
        const res = await fetch(`${this.baseUrl}/authentication/refreshAccessToken`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                refreshToken: refreshToken,
            }),
        });

        const data = await res.json();

        if (!res.ok || data.result === false) {
            throw new Error("CJ Refresh Error: " + data.message);
        }

        this.accessToken = data.data.accessToken;
        await this.saveTokens(data.data, settingsId);
    }

    private async saveTokens(data: any, settingsId?: string) {
        if (!settingsId) {
            const { data: settings } = await this.supabase
                .from('store_settings')
                .select('id')
                .limit(1)
                .single();
            settingsId = settings?.id;
        }

        if (settingsId) {
            await this.supabase.from('store_settings').update({
                cj_access_token: data.accessToken,
                cj_access_token_expiry: data.accessTokenExpiryDate,
                cj_refresh_token: data.refreshToken,
                cj_refresh_token_expiry: data.refreshTokenExpiryDate
            }).eq('id', settingsId);
        }
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        await this.initToken(); // ensure token ready

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                "CJ-Access-Token": this.accessToken,
                ...(options.headers || {}),
            },
        });

        const data = await response.json();

        if (!response.ok || data.result === false) {
            throw new Error("CJ API Error: " + data.message);
        }

        return data.data;
    }

    async searchProducts(keyword: string, page = 1, pageSize = 20) {
        return this.request<{ list: CJProduct[]; total: number }>(
            `/product/list?pageNum=${page}&pageSize=${pageSize}&productName=${encodeURIComponent(keyword)}`
        );
    }

    async getProductDetails(pid: string): Promise<CJProductDetail> {
        return this.request<CJProductDetail>(`/product/query?pid=${pid}`);
    }
}
