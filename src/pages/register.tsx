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
import { useMutation } from "urql";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/dist/client/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface IRegisterProps {}

const Register: React.FC<IRegisterProps> = ({}) => {
  const [{}, register] = useRegisterMutation();
  const { push } = useRouter();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register(values);
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
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
                Register
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
