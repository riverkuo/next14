'use client';
import { useIsFetching, useIsMutating, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CSSProperties, useRef, useState } from 'react';
import './page.module.css';
import { addFood, deleteFood, editFood, getFood } from '../service/food';
import { MutationKey, QueryKey } from '../service/food/key';
import { FoodItem, GetFoodItemRequest, GetFoodItemResponse } from '../service/food/types';

const containerStyle: CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' };

export default function Home() {
  const queryClient = useQueryClient();

  const isFetching = useIsFetching() > 0;
  const isMutating = useIsMutating() > 0;
  const disabled = isFetching || isMutating;

  const searchIdRef = useRef<HTMLInputElement>(null);
  const searchNameRef = useRef<HTMLInputElement>(null);
  const addFoodRef = useRef<HTMLInputElement>(null);

  const getFoodRequest: GetFoodItemRequest = {
    id: searchIdRef.current?.value ? { value: searchIdRef.current.value, type: 'eq' } : undefined,
    name: searchNameRef.current?.value ? { value: searchNameRef.current.value, type: 'eq' } : undefined,
    order: {
      type: 'asc',
      value: 'created_at',
    },
  };

  const { data: foodListData, isFetching: isFoodListFetching } = useQuery({
    queryKey: [QueryKey.FOOD, getFoodRequest],
    queryFn: getFood,
  });

  const addFoodMutation = useMutation({
    mutationKey: [MutationKey.ADD_FOOD],
    mutationFn: addFood,
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: [QueryKey.FOOD] });
    },
  });

  function onAddFood() {
    if (addFoodRef.current?.value) {
      addFoodMutation.mutate({ name: addFoodRef.current.value });
    }
  }

  async function onSearchFood() {
    await queryClient.invalidateQueries({ queryKey: [QueryKey.FOOD] });
  }

  return (
    <div style={containerStyle}>
      {/* Add */}
      <div>
        <input id="add_food" placeholder="add.." ref={addFoodRef} disabled={disabled} />
        <button onClick={onAddFood} disabled={disabled}>
          Add
        </button>
      </div>

      {/* Search field */}
      <div>
        <input id="search_id" placeholder="id.." ref={searchIdRef} />
        <input id="search_name" placeholder="name.." ref={searchNameRef} disabled={disabled} />
        <button onClick={onSearchFood} disabled={disabled}>
          Search
        </button>
      </div>

      {/* DataTable */}
      {isFoodListFetching ? <div>loading...</div> : <DataTable foodListData={foodListData} />}
    </div>
  );
}

function DataTable({ foodListData }: { foodListData: GetFoodItemResponse | null | undefined }) {
  return foodListData ? (
    <table>
      <tbody>
        <TableHeads />
        {foodListData.map((food) => (
          <TableRow food={food} key={food.id} />
        ))}
      </tbody>
    </table>
  ) : (
    <>無資料</>
  );
}

function TableHeads() {
  return (
    <tr>
      <th>id</th>
      <th>name</th>
      <th>created_at</th>
      <th>action</th>
    </tr>
  );
}

function TableRow({ food }: { food: FoodItem }) {
  const queryClient = useQueryClient();

  const editFoodRef = useRef<HTMLInputElement>(null);
  const [editMode, toggleEditMode] = useState(false);

  const isFetching = useIsFetching() > 0;
  const isMutating = useIsMutating() > 0;
  const disabled = isFetching || isMutating;

  const deleteFoodMutation = useMutation({
    mutationKey: [MutationKey.DELETE_FOOD],
    mutationFn: deleteFood,
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: [QueryKey.FOOD] });
    },
  });

  const editFoodMutation = useMutation({
    mutationKey: [MutationKey.EDIT_FOOD],
    mutationFn: editFood,
    onSuccess: async (result) => {
      toggleEditMode(false);
      await queryClient.invalidateQueries({ queryKey: [QueryKey.FOOD] });
    },
  });

  function onDeleteFood() {
    deleteFoodMutation.mutate({ id: { value: food.id, type: 'eq' } });
  }

  function onEdit() {
    if (editMode) {
      if (editFoodRef.current?.value) {
        editFoodMutation.mutate({
          params: { id: { value: food.id, type: 'eq' } },
          body: { name: editFoodRef.current.value },
        });
      }
    } else {
      toggleEditMode(true);
    }
  }

  return (
    <tr key={food.id}>
      <td>{food.id}</td>
      <td>
        <input id={food.id} ref={editFoodRef} defaultValue={food.name} disabled={disabled || !editMode} />
      </td>
      <td>{food.created_at}</td>
      <td>
        <button disabled={disabled} onClick={onEdit}>
          {editMode ? 'submit' : 'edit'}
        </button>
        <button disabled={disabled && editMode} onClick={onDeleteFood}>
          delete
        </button>
      </td>
    </tr>
  );
}
