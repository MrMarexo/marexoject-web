import * as React from "react";
import {
  ComponentWithAs,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputProps,
  Textarea,
  TextareaProps,
} from "@chakra-ui/react";
import { FieldConfig, useField } from "formik";

type TInputField = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  textarea?: boolean;
};

const InputOrTextarea = Input;
const InputField: React.FC<TInputField> = ({
  textarea,
  label,
  size: _,
  ...props
}) => {
  const [field, { error }] = useField(props);
  let C = Input;
  //@ts-ignore
  if (textarea) C = Textarea;
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <C {...field} {...props} id={field.name} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};

export default InputField;
