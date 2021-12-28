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
import { motion, useMotionValue, useTransform, Variants } from "framer-motion";
import Navbar from "../components/Navbar";
import IconLink from "../components/IconLink";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery, useVoteMutation } from "../generated/graphql";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";

const Index: React.FC = () => {
  const [cursor, setCursor] = React.useState<string | null>(null);
  const [{}, vote] = useVoteMutation();
  const [{ data, fetching }] = usePostsQuery({
    variables: {
      limit: 10,
      cursor: cursor,
    },
  });
  // React.useEffect(() => {
  //   console.log("FETCHING", fetching);
  //   console.log("DATA", data);
  // }, [fetching]);
  return (
    <>
      <Navbar />
      <Stack h="1000px" justify="center" align="center">
        <Heading>marexoject</Heading>
        {fetching ? (
          <Text>Loading...</Text>
        ) : data?.posts && data.posts.posts.length > 0 ? (
          <Stack pt="40px" pb="20px" spacing="20px">
            {data.posts.posts.map((p, i) => (
              <Stack
                key={i}
                px="10px"
                py="12px"
                w="400px"
                borderWidth="1px"
                direction="row"
                spacing="10px"
              >
                <Stack align="center">
                  <IconButton
                    icon={<ChevronUpIcon boxSize="20px" />}
                    aria-label="upvote"
                    onClick={() => vote({ value: 1, postId: p.id })}
                  />
                  <Text>{p.points}</Text>
                  <IconButton
                    icon={<ChevronDownIcon boxSize="20px" />}
                    aria-label="downvote"
                    onClick={() => vote({ value: -1, postId: p.id })}
                  />
                </Stack>
                <Box w="100%">
                  <Stack direction="row" justify="space-between">
                    <Heading fontSize="23px">{p.title}</Heading>
                    <Text>{p.creator.username}</Text>
                  </Stack>
                  <Text>{p.textSnippet + "..."}</Text>
                </Box>
              </Stack>
            ))}
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
      </Stack>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Index);
