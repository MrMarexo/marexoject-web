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
import { valueScaleCorrection } from "framer-motion/types/render/dom/projection/scale-correction";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";

interface IRegisterProps {}

const Register: React.FC<IRegisterProps> = ({}) => {
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values) => console.log("Values: ", values)}
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

export default Register;
