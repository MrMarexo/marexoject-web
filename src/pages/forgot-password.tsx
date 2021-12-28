import * as React from "react";
import { Box, Button, Link, Stack, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { Formik, Form } from "formik";
import InputField from "../components/InputField";
import Navbar from "../components/Navbar";
import Wrapper from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import NextLink from "next/link";

const Forgot: React.FC = ({}) => {
  const [{}, forgotPassword] = useForgotPasswordMutation();
  const [complete, setComplete] = React.useState(false);

  return (
    <>
      <Navbar />
      <Wrapper>
        <Formik
          initialValues={{ email: "" }}
          onSubmit={async ({ email }) => {
            await forgotPassword({ email });
            setComplete(true);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Stack spacing="10px" mt="100px">
                <InputField
                  name="email"
                  label="Email"
                  placeholder="email"
                  type="email"
                />
                <Button
                  backgroundColor="gray"
                  type="submit"
                  isLoading={isSubmitting}
                >
                  Send
                </Button>
                {complete && (
                  <Box>
                    <Text>
                      Check your email. Link to change your password has been
                      sent there.
                    </Text>
                    <NextLink href="/">
                      <Link>Back to home</Link>
                    </NextLink>
                  </Box>
                )}
              </Stack>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Forgot);
