import * as React from "react";
import { Box } from "@chakra-ui/react";
import Navbar from "./Navbar";
import Wrapper from "./Wrapper";

const Layout: React.FC = ({ children }) => {
  return (
    <Box>
      <Navbar />
      <Wrapper size="large">{children}</Wrapper>
    </Box>
  );
};

export default Layout;
