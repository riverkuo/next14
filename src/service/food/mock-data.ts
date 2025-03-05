import { BaseResponse, BaseResponseStatus } from '@/libs/fetcher/fetcher';
import { GetFoodItemResponse } from './types';

export const mockFoodItemsResponse: BaseResponse<GetFoodItemResponse> = {
  data: [
    {
      id: '1',
      name: '炸雞',
      created_at: '2025-03-03T08:08:53.486399+00:00',
    },
    {
      id: '2',
      name: '薯條',
      created_at: '2025-03-03T08:08:53.486399+00:00',
    },
  ],
  code: 200,
  error: false,
  status: BaseResponseStatus.SUCCESS,
};

export const mockAddFoodItemsResponse: BaseResponse<null> = {
  data: null,
  code: '',
  error: false,
  status: BaseResponseStatus.SUCCESS,
};

export const mockDeleteFoodItemsResponse: BaseResponse<null> = {
  data: null,
  code: '',
  error: false,
  status: BaseResponseStatus.SUCCESS,
};

export const mockPatchFoodItemsResponse: BaseResponse<null> = {
  data: null,
  code: '',
  error: false,
  status: BaseResponseStatus.SUCCESS,
};
