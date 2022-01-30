import * as React from "react";
import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { useIsAuth } from "../../../hooks/useIsAuth";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import InputField from "../../../components/InputField";
import Navbar from "../../../components/Navbar";
import Wrapper from "../../../components/Wrapper";
import {
  usePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";

const EditPost: React.FC = ({}) => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [{}, update] = useUpdatePostMutation();
  const [{ data, error, fetching }] = usePostQuery({
    pause: intId == -1,
    variables: {
      id: intId,
    },
  });
  useIsAuth();
  if (error) console.error("ERROR: ", error);
  if (!data?.post)
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
    <>
      <Navbar />
      <Wrapper>
        <Formik
          initialValues={{ title: data.post.title, text: data.post.text }}
          onSubmit={async ({ text, title }, { setErrors }) => {
            const { error } = await update({
              title,
              text,
              updatePostId: intId,
            });
            if (!error) {
              router.push("/");
            }
            // push("/");
          }}
        >
          {({ isSubmitting, values }) => (
            <Form>
              <Stack spacing="10px" mt="100px">
                <InputField name="title" label="title" placeholder="title" />
                <InputField
                  textarea
                  name="text"
                  label="body"
                  placeholder="text..."
                />
                <Button
                  backgroundColor="gray"
                  type="submit"
                  isLoading={isSubmitting}
                >
                  Edit post
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(EditPost);
