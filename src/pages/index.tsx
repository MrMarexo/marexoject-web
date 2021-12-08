import * as React from "react";
import { Heading, Stack, Link, Text } from "@chakra-ui/react";
import { motion, useMotionValue, useTransform, Variants } from "framer-motion";
import Navbar from "../components/Navbar";
import IconLink from "../components/IconLink";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

const svgVariants: Variants = {
  hover: {
    scale: 1.3,
    rotate: 20,
    // stroke: "red",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};
const personHover: Variants = {
  hover: {
    scale: 1.3,
    // stroke: "red",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// const pathVariants: Variants = {
//   hidden: { opacity: 0, pathLength: 0 },
//   visible: {
//     opacity: 1,
//     pathLength: 1,
//     transition: { duration: 2, ease: "easeInOut" },
//   },
// };

const tickVariants = {
  pressed: (isChecked: boolean) => ({ pathLength: isChecked ? 0.85 : 0.2 }),
  checked: { pathLength: 1 },
  unchecked: { pathLength: 0 },
};

const boxVariants = {
  hover: { scale: 1.05, strokeWidth: 60 },
  pressed: { scale: 0.95, strokeWidth: 35 },
  checked: { stroke: "#FF008C" },
  unchecked: { stroke: "#ddd", strokeWidth: 50 },
};

const Index: React.FC = () => {
  const [hovver, setHovver] = React.useState(false);
  return (
    <>
      <Navbar />
      <Stack h="1000px" justify="center" align="center">
        <Heading>marexoject</Heading>
        <Link href="/register">Register</Link>
        <IconLink
          svgPaths={[
            <motion.path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />,
          ]}
          text="Register"
          hoverStyle={{
            hover: {
              scale: 1.3,
              rotate: 20,
              transition: { duration: 0.3, ease: "easeOut" },
            },
          }}
          link="/register"
        />
        <IconLink
          svgPaths={[
            <motion.path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />,
          ]}
          text="Login"
          hoverStyle={{
            hover: {
              scale: 1.3,
              transition: { duration: 0.3, ease: "easeOut" },
            },
          }}
          link="/login"
        />
      </Stack>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Index);
