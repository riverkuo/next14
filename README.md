
## Getting Started

First, run the development server:

```bash
npm run dev
```


</br>
</br>

## Mock Data Guide


### Tech List
- react-query
- axios

### Guide
1. Add `.env` file, content should be same as testing environment, usually `sit`.
2. In `utils/mock-data-utils.ts`, add `isLocal` `delay` `getMockRes`.
    ```Typescript
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

3. Add corresponded api mock-data in `service/food/mock-data.ts` 

4. In `service/food/index.tsx`, implement `isLocal` flag and `mock-data`. Now you can simply switch `isLocal` flag to get mock-data and fetch real apis!!

    ```Typescript
    import { getMockRes, isLocal } from '@/app/utils/mock-data-utils';

    /** Original Method */
    // export const getFood: QueryFunction<GetFoodItemResponse | null, [QueryKey.FOOD, GetFoodItemRequest]> = async ({
    //   queryKey,
    // }) => {
    //   const [, params] = queryKey;
    //   const endpoint = `/food`;
    //   const response = await fetcher(endpoint, {
    //     mode: 'get',
    //     params: generateParams(params),
    //   });

    //   return response.data;
    // };

    /** New Method: add isLocal flag and mock-data */
    export const getFood: QueryFunction<GetFoodItemResponse | null, [QueryKey.FOOD, GetFoodItemRequest]> = async ({
    queryKey,
    }) => {
    const [, params] = queryKey;
    const endpoint = `/food`;
    const response = isLocal
        ? await getMockRes(endpoint, mockFoodItemsResponse)
        : await fetcher(endpoint, {
            mode: 'get',
            params: generateParams(params),
        });

    return response.data;
    };