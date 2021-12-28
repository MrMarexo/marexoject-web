import * as React from "react";
import { Box, Stack, BoxProps } from "@chakra-ui/react";

interface IWrapperProps {
  color?: BoxProps["backgroundColor"];
}

const Wrapper: React.FC<IWrapperProps> = ({ children, color = "white" }) => {
  return (
    <Stack direction="row" justify="center" backgroundColor={color}>
      <Box w="870px" px="16px">
        {children}
      </Box>
    </Stack>
  );
};

export default Wrapper;
