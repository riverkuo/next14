import { getMockRes, isLocal } from '@/app/utils/mock-data-utils';
import { generateParams } from '@/app/utils/service';
import { BaseResponse, fetcher } from '@/libs/fetcher/fetcher';
import { MutateFunction, QueryFunction } from '@tanstack/react-query';
import { QueryKey } from './key';
import {
  mockAddFoodItemsResponse,
  mockDeleteFoodItemsResponse,
  mockFoodItemsResponse,
  mockPatchFoodItemsResponse,
} from './mock-data';
import {
  DeleteFoodItemRequest,
  GetFoodItemRequest,
  GetFoodItemResponse,
  PostFoodItemRequest,
  PatchFoodItemRequest,
} from './types';

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

export const addFood: MutateFunction<BaseResponse | null, Error, PostFoodItemRequest> = async (body) => {
  const endpoint = `/food`;
  const response = isLocal
    ? await getMockRes(endpoint, mockAddFoodItemsResponse)
    : await fetcher(endpoint, {
        mode: 'post',
        body,
      });

  return response.data;
};

export const deleteFood: MutateFunction<BaseResponse | null, Error, DeleteFoodItemRequest> = async (body) => {
  const endpoint = `/food`;
  const response = isLocal
    ? await getMockRes(endpoint, mockDeleteFoodItemsResponse)
    : await fetcher(endpoint, {
        mode: 'delete',
        params: generateParams(body),
      });

  return response.data;
};

export const editFood: MutateFunction<BaseResponse | null, Error, PatchFoodItemRequest> = async ({ params, body }) => {
  const endpoint = `/food`;
  const response = isLocal
    ? await getMockRes(endpoint, mockPatchFoodItemsResponse)
    : await fetcher(endpoint, {
        mode: 'patch',
        body,
        params: generateParams(params),
      });

  return response.data;
};
