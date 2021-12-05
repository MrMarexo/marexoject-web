import * as React from "react";
import { Box, Stack, Text } from "@chakra-ui/react";
import { motion, Variants } from "framer-motion";
import NextLink from "next/link";

interface IIconLinkProps {
  svgPaths: Array<React.ReactNode>;
  text: string;
  link: string;
  hoverStyle: Variants;
}

const IconLink: React.FC<IIconLinkProps> = ({
  svgPaths,
  text,
  link,
  hoverStyle,
}) => {
  const [hovver, setHovver] = React.useState(false);

  return (
    <NextLink href={link}>
      <Stack
        direction="row"
        onMouseEnter={() => setHovver(true)}
        onMouseLeave={() => setHovver(false)}
        cursor="pointer"
        spacing="0px"
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          width="24"
          variants={hoverStyle}
          initial="false"
          animate={hovver ? "hover" : "false"}
        >
          {svgPaths}
        </motion.svg>
        <Text
          textDecoration="none"
          _hover={{ textDecoration: "underline" }}
          transition="0.2"
        >
          {text}
        </Text>
      </Stack>
    </NextLink>
  );
};

export default IconLink;
