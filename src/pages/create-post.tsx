import { Button, Stack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import router from "next/router";
import * as React from "react";
import InputField from "../components/InputField";
import Navbar from "../components/Navbar";
import Wrapper from "../components/Wrapper";
import { useCreatePostMutation } from "../generated/graphql";
import { useIsAuth } from "../hooks/useIsAuth";
import { createUrqlClient } from "../utils/createUrqlClient";

const CreatePost: React.FC = ({}) => {
  const [{}, createPost] = useCreatePostMutation();
  useIsAuth();
  return (
    <>
      <Navbar />
      <Wrapper>
        <Formik
          initialValues={{ title: "", text: "" }}
          onSubmit={async (values, { setErrors }) => {
            const { error } = await createPost({ input: values });
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
                  Create post
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
