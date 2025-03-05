import { AxiosRequestConfig } from 'axios';
import { getAxios } from './axios';

export enum BaseResponseStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  CANCEL = 'CANCEL',
}
export interface BaseResponse<T = any> {
  headers?: Partial<Record<string, string>>;
  data: T;
  code: number | string;
  message?: string;
  error: boolean;
  status: BaseResponseStatus;
}

type GetModeOptions = {
  mode: 'get';
  params?: AxiosRequestConfig['params'];
  body?: never;
  headers?: Record<string, string>;
};

type PostModeOptions = {
  mode: 'post';
  params?: never;
  body: unknown;
  headers?: Record<string, string>;
};

type PatchModeOptions = {
  mode: 'patch';
  params: AxiosRequestConfig['params'];
  body: unknown;
  headers?: Record<string, string>;
};

type DeleteModeOptions = {
  mode: 'delete';
  params?: AxiosRequestConfig['params'];
  body?: never;
  headers?: Record<string, string>;
};

export async function fetcher(
  url: string,
  options?: GetModeOptions | PostModeOptions | PatchModeOptions | DeleteModeOptions
): Promise<BaseResponse> {
  const axiosInstance = getAxios();
  const { mode, params, headers, body } = options ?? {};
  const baseFetcherConfig = {
    data: body,
    method: mode,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...(params ? { params } : {}),
  };
  try {
    const result = await axiosInstance(url, baseFetcherConfig);
    const { data: axiosData } = result;

    const { message } = axiosData;
    const baseResponseData: BaseResponse = {
      code: result.status,
      message,
      data: axiosData ?? null,
      error: false,
      status: BaseResponseStatus.SUCCESS,
    };

    console.log(`\x1b[36m[endpoint]:\x1b[36m`, url);
    console.log(`\x1b[33m[  body  ]:\x1b[33m`, body);
    console.log(`\x1b[33m[ params ]:\x1b[33m`, params);

    if (result.status >= 200 && result.status < 300) {
      console.log(`\x1b[91m[ result ]:\x1b[91m`, result.data);
      return baseResponseData;
    }

    baseResponseData.error = true;
    baseResponseData.status = BaseResponseStatus.ERROR;

    return baseResponseData;
  } catch (error) {
    throw new Error('Unknown error');
  }
}
