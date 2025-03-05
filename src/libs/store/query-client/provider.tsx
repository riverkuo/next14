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

// let isRefreshing = false;

// let failedQueue: {
//   query?: Query<unknown, unknown, unknown>;
//   mutation?: Mutation<unknown, unknown, unknown>;
//   variables?: unknown;
// }[] = [];

// function processFailedQueue() {
//   failedQueue.forEach(({ query, mutation, variables }) => {
//     if (query) void query.fetch();
//     if (mutation) void mutation.execute(variables);
//   });
//   isRefreshing = false;
//   failedQueue = [];
// }

// function refreshTokenFailHandler() {
//   failedQueue = [];
//   isRefreshing = false;
// }

// async function handleInvalidAccessToken({
//   query,
//   mutation,
//   variables,
// }: {
//   query: ErrorHandlerParamTypes['query'];
//   mutation: ErrorHandlerParamTypes['mutation'];
//   variables: ErrorHandlerParamTypes['variables'];
// }) {
//   if (!isRefreshing) {
//     isRefreshing = true;
//     failedQueue.push({ query, mutation, variables });

//     //   if (refreshToken) {
//     //     try {
//     //       deleteToken(accessTokenKey);
//     //       deleteToken(refreshTokenKey);

//     //       const refreshResult = await GetNewAccessToken(refreshToken);
//     //       if (refreshResult.code === ErrorCode.SUCCESS) {
//     //         const { access_token, refresh_token } = refreshResult.data;
//     //         updateTokens({ access_token, refresh_token });
//     //         processFailedQueue();
//     //       } else {
//     //         refreshTokenFailHandler();
//     //       }
//     //     } catch (error) {
//     //       refreshTokenFailHandler();
//     //     }
//     //   }
//   } else {
//     failedQueue.push({ query, mutation, variables });
//   }
// }
