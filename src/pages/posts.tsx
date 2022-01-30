import * as React from "react";
import {
  Heading,
  Stack,
  Link,
  Text,
  Box,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import {
  useMeQuery,
  usePostsQuery,
  useVoteMutation,
  useRemovePostMutation,
} from "../generated/graphql";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  DeleteIcon,
  EditIcon,
} from "@chakra-ui/icons";
import NextLink from "next/link";
import Layout from "../components/Layout";

const Posts: React.FC = () => {
  const [cursor, setCursor] = React.useState<string | null>(null);
  const [{ data: meData }] = useMeQuery();

  const [{}, removePost] = useRemovePostMutation();
  const [{}, vote] = useVoteMutation();
  const [{ data, fetching, error }] = usePostsQuery({
    variables: {
      limit: 10,
      cursor: cursor,
    },
  });

  if (error) {
    console.error("ERROR", error);
    return <Text>{error.message}</Text>;
  }
  return (
    <Layout>
      <Stack justify="center" align="center">
        <Heading>Posts</Heading>
      </Stack>
      <Box>
        {fetching ? (
          <Text>Loading...</Text>
        ) : data?.posts && data.posts.posts.length > 0 ? (
          <Stack
            pt="40px"
            pb="20px"
            spacing="20px"
            overflowY="scroll"
            w="500px"
          >
            {data.posts.posts.map((p, i) =>
              !p ? null : (
                <Stack
                  key={i}
                  px="10px"
                  py="12px"
                  borderWidth="1px"
                  direction="row"
                  spacing="10px"
                >
                  <Stack align="center">
                    <IconButton
                      colorScheme={p.voteStatus === 1 ? "green" : undefined}
                      icon={<ChevronUpIcon boxSize="20px" />}
                      aria-label="upvote"
                      onClick={() => vote({ value: 1, postId: p.id })}
                    />
                    <Text>{p.points}</Text>
                    <IconButton
                      colorScheme={p.voteStatus === -1 ? "red" : undefined}
                      icon={<ChevronDownIcon boxSize="20px" />}
                      aria-label="downvote"
                      onClick={() => vote({ value: -1, postId: p.id })}
                    />
                  </Stack>
                  <Stack w="100%" justify="space-between" spacing="0px">
                    <Box>
                      <Stack direction="row" justify="space-between">
                        <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                          <Link fontWeight="bold" fontSize="20px">
                            {p.title}
                          </Link>
                        </NextLink>
                        <Text>{p.creator.username}</Text>
                      </Stack>
                      <Text>{p.textSnippet + "..."}</Text>
                    </Box>
                    {p.creator.id === meData?.me?.id && (
                      <Stack direction="row" justify="flex-end">
                        <IconButton
                          boxSize="30px"
                          icon={<DeleteIcon boxSize="15px" />}
                          aria-label="delete"
                          onClick={() => removePost({ removePostId: p.id })}
                        />
                        <NextLink
                          href="/post/edit/[id]"
                          as={`/post/edit/${p.id}`}
                        >
                          <IconButton
                            boxSize="30px"
                            icon={<EditIcon boxSize="15px" />}
                            aria-label="edit"
                          />
                        </NextLink>
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              )
            )}
            {data.posts.hasMore && (
              <Button
                onClick={() =>
                  setCursor(
                    data.posts.posts[data.posts.posts.length - 1].createdAt
                  )
                }
              >
                more posts
              </Button>
            )}
          </Stack>
        ) : (
          <Text>no posts</Text>
        )}
      </Box>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Posts);
