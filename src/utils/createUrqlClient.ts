import { dedupExchange, fetchExchange } from "@urql/core";
import { QueryInput, Cache, cacheExchange, Resolver } from "@urql/exchange-graphcache";
import { LogoutMutation, MeQuery, MeDocument, LoginMutation, RegisterMutation, VoteMutationVariables, RemovePostMutationVariables } from "../generated/graphql";
import {pipe, tap} from "wonka";
import { Exchange } from "@urql/core";
import router from "next/router";
import { stringifyVariables } from "urql";
import { gql } from '@urql/core';
import { isServer } from "./isServer";

const errorExchange: Exchange = ({forward}) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({error}) => {
      console.log("ERROR", error)
      if (error?.message.includes("not authenticated")) {
        router.replace("/login");
      }
    }
  )
  )
}

const invalidateAll = (cache: Cache) => {
  const allFields = cache.inspectFields("Query");
  const fieldInfos = allFields.filter(info => info.fieldName === "posts");
  fieldInfos.forEach(fi => {
    cache.invalidate("Query", "posts", fi.arguments);
  });
}


type MergeMode = 'before' | 'after';


interface PaginationParams {
  cursorArgument?: string;
  limitArgument?: string;
  mergeMode?: MergeMode;
}


const cursorPagination = (
  ):Resolver => {

  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter(info => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCache = cache.resolve(entityKey, fieldKey)
    info.partial = !isItInTheCache;
    const results: Array<string> = [];
    let hasMore = false;
    fieldInfos.forEach(fi => {
      const key = cache.resolve(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, "posts") as string[];
      hasMore = cache.resolve(key, "hasMore") as boolean;
      results.push(...data);
      
    })

    return {
      __typename: "PaginatedPosts",
      posts: results,
      hasMore: hasMore,
    } 
  };
};

const betterUpdateQuery = <Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) => {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
};

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie = "";
  if (isServer()) {
    console.log("IS SERVER");
    cookie = ctx?.req?.headers?.cookie;
  }
  return ({ 
  url: "http://localhost:4000/graphql",
    fetchOptions: { credentials: "include" as const, headers: cookie ? {
      cookie
    } : undefined },
    exchanges: [
      dedupExchange,
      cacheExchange({
        keys: {
          PaginatedPosts: () => null,
        },
        resolvers: {
          Query: {
            posts: cursorPagination(),
          }
        },
        updates: {
          Mutation: {
            removePost: (_result, args, cache, info) => {
              cache.invalidate({__typename: "Post", id: (args as RemovePostMutationVariables).removePostId});
            },
            vote: (_result, args, cache, info) => {
              const {postId, value} = args as VoteMutationVariables;
              const data = cache.readFragment(
                gql`
                  fragment _ on Post {
                    id
                    points
                    voteStatus
                  }
                `, {id: postId}
              )
              console.log("DATA", data);
              if (data) {
                if (data.voteStatus === value) return;
                const newPoints = data.points + (data.voteStatus ? 2 : 1) * value;
                cache.writeFragment(
                  gql`
                    fragment _ on Post {
                      points
                      voteStatus
                    }
                  `, {id: postId, points: newPoints, voteStatus: value}
                )
              }
            },
            createPost: (_result, args, cache, info) => {
              invalidateAll(cache);
            },
            logout: (_result, args, cache, info) => {
              betterUpdateQuery<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                () => ({ me: null })
              );
            },
            login: (_result, args, cache, info) => {
              betterUpdateQuery<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.login.errors) {
                    return query;
                  } else {
                    return {
                      me: result.login.user,
                    };
                  }
                }
              );
              invalidateAll(cache);
            },
            register: (_result, args, cache, info) => {
              betterUpdateQuery<RegisterMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.register.errors) {
                    return query;
                  } else {
                    return {
                      me: result.register.user,
                    };
                  }
                }
              );
            },
          },
        },
      }),
      errorExchange,
      fetchExchange,
      ssrExchange
    ],

});
}


