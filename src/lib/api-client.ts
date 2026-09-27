import axios, { AxiosError } from "axios";
import {
  AuthResponse,
  DocumentResponse,
  ResearchListResponse,
  ResearchReportResponse,
  ResearchResponse,
  SourceResponse,
  User,
} from "@/types/research";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = "Bearer " + token;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: string | Array<{ msg: string }> }>) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("auth:unauthorized"));
      }
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail.length > 0) {
      return detail.map((d) => d.msg).join(", ");
    }
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers["retry-after"];
      return "Rate limit exceeded. Please wait " + (retryAfter ? retryAfter + "s" : "a moment") + " before trying again.";
    }
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred.";
}

export const authApi = {
  async register(data: { email: string; password: string; name?: string }): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>("/auth/register", data);
    return res.data;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>("/auth/login", data);
    return res.data;
  },

  async getMe(): Promise<User> {
    const res = await apiClient.get<User>("/auth/me");
    return res.data;
  },
};

export const researchApi = {
  async createResearch(query: string): Promise<ResearchResponse> {
    const res = await apiClient.post<ResearchResponse>("/research/", { query });
    return res.data;
  },

  async getResearchById(id: number): Promise<ResearchResponse> {
    const res = await apiClient.get<ResearchResponse>("/research/" + id);
    return res.data;
  },

  async getResearchList(page = 1, limit = 50): Promise<ResearchListResponse> {
    const res = await apiClient.get<ResearchListResponse>("/research/", {
      params: { page, limit },
    });
    return res.data;
  },

  async getResearchReport(id: number): Promise<ResearchReportResponse> {
    const res = await apiClient.get<ResearchReportResponse>("/research/" + id + "/report");
    return res.data;
  },

  async getResearchSources(id: number): Promise<SourceResponse[]> {
    const res = await apiClient.get<SourceResponse[]>("/research/" + id + "/sources");
    return res.data;
  },

  async deleteResearch(id: number): Promise<{ message: string }> {
    const res = await apiClient.delete<{ message: string }>("/research/" + id);
    return res.data;
  },
};

export const documentApi = {
  async uploadDocument(file: File): Promise<DocumentResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiClient.post<DocumentResponse>("/documents/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },
};
