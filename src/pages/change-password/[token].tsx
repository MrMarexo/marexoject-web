import * as React from "react";
import { Button, Stack, Text } from "@chakra-ui/react";
import { useChangePasswordMutation } from "../../generated/graphql";
import { Formik, Form } from "formik";
import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import { toErrorMap } from "../../utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import Navbar from "../../components/Navbar";

const ChangePassword: React.FC = () => {
  const [{}, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = React.useState("");
  const { push, query } = useRouter();
  console.log("TOKEN", query);
  return (
    <>
      <Navbar />
      <Wrapper>
        <Formik
          initialValues={{ newPassword: "" }}
          onSubmit={async ({ newPassword }, { setErrors }) => {
            const response = await changePassword({
              newPassword,
              token: typeof query.token === "string" ? query.token : "",
            });
            if (response.data?.changePassword.errors) {
              const errorMap = toErrorMap(response.data.changePassword.errors);
              if ("token" in errorMap) {
                setTokenError(errorMap.token);
              }
              setErrors(errorMap);
            } else if (response.data?.changePassword.user) {
              push("/");
            }
          }}
        >
          {({ isSubmitting, values }) => (
            <Form>
              <Stack spacing="10px" mt="100px">
                <InputField
                  name="newPassword"
                  label="New password"
                  placeholder="password"
                  type="password"
                />
                <Button
                  backgroundColor="gray"
                  type="submit"
                  isLoading={isSubmitting}
                >
                  Change password
                </Button>
                {tokenError && <Text color="red">{tokenError}</Text>}
              </Stack>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
