import * as React from "react";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Formik } from "formik";
import { Form } from "formik";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/dist/client/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface IRegisterProps {}

const Login: React.FC<IRegisterProps> = ({}) => {
  const [{}, login] = useLoginMutation();
  const { push } = useRouter();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Stack spacing="10px" mt="100px">
              <InputField
                name="username"
                label="Username"
                placeholder="username"
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
            </Stack>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
