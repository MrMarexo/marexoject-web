import * as React from "react";
import { Box, Stack, BoxProps } from "@chakra-ui/react";

interface IWrapperProps {
  color?: BoxProps["backgroundColor"];
  size?: "small" | "large";
}

const Wrapper: React.FC<IWrapperProps> = ({
  children,
  color = "white",
  size = "small",
}) => {
  return (
    <Stack direction="row" justify="center" backgroundColor={color}>
      <Box w={size === "small" ? "870px" : "1000px"} px="16px">
        {children}
      </Box>
    </Stack>
  );
};

export default Wrapper;
