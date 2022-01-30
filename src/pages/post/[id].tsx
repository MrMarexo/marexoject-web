import * as React from "react";
import { Box, Heading, Text, Link, IconButton } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useRouter } from "next/router";
import {
  useMeQuery,
  usePostQuery,
  usePostsQuery,
  useRemovePostMutation,
} from "../../generated/graphql";
import NextLink from "next/link";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

const Post: React.FC = ({}) => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [{ data: meData }] = useMeQuery();

  const [{}, removePost] = useRemovePostMutation();
  const [{ data, error, fetching }] = usePostQuery({
    pause: intId == -1,
    variables: {
      id: intId,
    },
  });
  if (error) console.error("ERROR: ", error);
  if (!data || !data?.post)
    return (
      <Box>
        <Text>Could not find your post</Text>
      </Box>
    );
  if (fetching)
    return (
      <Box>
        <Text>Loading...</Text>
      </Box>
    );
  return (
    <Box>
      <NextLink href="/">
        <Link>{"< Home"}</Link>
      </NextLink>
      <Heading>{data.post.title}</Heading>
      <Text>{data.post.text}</Text>
      {data.post.creator.id === meData?.me?.id && (
        <Box>
          <IconButton
            icon={<DeleteIcon boxSize="15px" />}
            aria-label="delete"
            //@ts-ignore
            onClick={() => removePost({ removePostId: data.post.id })}
          />
          <NextLink href="/post/edit/[id]" as={`/post/edit/${data.post.id}`}>
            <IconButton icon={<EditIcon boxSize="15px" />} aria-label="edit" />
          </NextLink>
        </Box>
      )}
    </Box>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
