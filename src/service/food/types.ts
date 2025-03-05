import { SupabaseQueryRequest } from '@/utils/service';

export type FoodItem = {
  id: string;
  name: string;
  created_at: string;
};

// getFoodItem
export type GetFoodItemRequest = SupabaseQueryRequest<
  Partial<
    FoodItem & {
      order: string;
    }
  >
>;
export type GetFoodItemResponse = FoodItem[];

// postFoodItem
export type PostFoodItemRequest = {
  name: string;
};

// patchFoodItem
export type PatchFoodItemRequest = {
  params: SupabaseQueryRequest<{
    id: string;
  }>;
  body: {
    name: string;
  };
};

// deleteFoodItem
export type DeleteFoodItemRequest = SupabaseQueryRequest<{
  id: string;
}>;
