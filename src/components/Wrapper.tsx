import * as React from "react";
import { Box } from "@chakra-ui/react";

interface IWrapperProps {
  variant?: "small" | "regular";
}

const Wrapper: React.FC<IWrapperProps> = ({
  children,
  variant = "regular",
}) => {
  return (
    <Box
      mt="20px"
      mx="auto"
      maxW={variant === "regular" ? "800px" : "400px "}
      w="100%"
    >
      {children}
    </Box>
  );
};

export default Wrapper;
