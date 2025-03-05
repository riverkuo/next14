import { BaseResponse } from '@/libs/fetcher/fetcher';

const env = process.env.NODE_ENV;

export const isLocal = false;
// export const isLocal = env === 'development';

export const delay = (time = 1) => {
  return new Promise((res) => {
    setTimeout(res, time * 1000);
  });
};

/**
 *
 * @param mockData
 * @param time second, default = 1
 * @returns
 */
export const getMockRes = async <T>(url: string, mockData: BaseResponse<T>, time = 1): Promise<BaseResponse<T>> => {
  await delay(time);
  return new Promise((res) => {
    console.log(`\x1b[1;36m[mock endpoint]:\x1b[1;36m`, url);
    console.log(`\x1b[1;91m[mock response]:\x1b[1;91m`, mockData.data);
    res(mockData);
  });
};
