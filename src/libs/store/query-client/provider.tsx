'use client';
import {
  Mutation,
  MutationCache,
  Query,
  QueryCache,
  QueryClient,
  QueryClientProvider as ReactQueryClientProvider,
} from '@tanstack/react-query';
import { ReactNode } from 'react';
interface ErrorHandlerParamTypes {
  error: Error;
  query?: Query<unknown, unknown, unknown>;
  mutation?: Mutation<unknown, unknown, unknown>;
  variables?: unknown;
}

export const QueryClientProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // default: true
        retry: false,
      },
    },
    queryCache: new QueryCache({
      onError: (e: Error, query) => queryErrorHandler(e as Error, query),
    }),
    mutationCache: new MutationCache({
      onError: (e: Error, variables, context, query) => mutationErrorHandler(e as Error, variables, context, query),
    }),
  });

  async function queryErrorHandler(error: Error, query: Query<unknown, unknown, unknown>) {
    await errorHandler({ error, query });
  }

  async function mutationErrorHandler(
    error: Error,
    variables: unknown,
    _context: unknown,
    mutation: Mutation<unknown, unknown, unknown>
  ) {
    await errorHandler({ error, query: undefined, mutation, variables });
  }

  async function errorHandler({ error, query, mutation, variables }: ErrorHandlerParamTypes) {}

  return <ReactQueryClientProvider client={queryClient}>{children}</ReactQueryClientProvider>;
};
