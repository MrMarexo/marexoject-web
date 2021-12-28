import * as React from "react";
import { Box, Button, Link, Stack } from "@chakra-ui/react";
import { Formik } from "formik";
import { Form } from "formik";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import Navbar from "../components/Navbar";
import NextLink from "next/link";
import router from "next/dist/client/router";

interface IRegisterProps {}

const Login: React.FC<IRegisterProps> = ({}) => {
  const [{}, login] = useLoginMutation();

  return (
    <>
      <Navbar />
      <Wrapper>
        <Formik
          initialValues={{ usernameOrEmail: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await login({
              usernameOrEmail: values.usernameOrEmail,
              password: values.password,
            });
            if (response.data?.login.errors) {
              setErrors(toErrorMap(response.data.login.errors));
            } else if (response.data?.login.user) {
              if (typeof router.query.next === "string") {
                router.push(router.query.next);
              } else {
                router.push("/");
              }
            }
          }}
        >
          {({ isSubmitting, values }) => (
            <Form>
              <Stack spacing="10px" mt="100px">
                <InputField
                  name="usernameOrEmail"
                  label="Username or e-mail"
                  placeholder="username or email"
                />
                <InputField
                  name="password"
                  label="Password"
                  placeholder="password"
                  type="password"
                />
                <Button
                  backgroundColor="gray"
                  type="submit"
                  isLoading={isSubmitting}
                >
                  Login
                </Button>
                <Box alignSelf="flex-end">
                  <NextLink href="/forgot-password">
                    <Link>forgot password</Link>
                  </NextLink>
                </Box>
              </Stack>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
