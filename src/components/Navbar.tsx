import * as React from "react";
import { Box, Stack, Link } from "@chakra-ui/react";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import IconLink from "./IconLink";
import { motion } from "framer-motion";
import { isServer } from "../utils/isServer";

interface INavbarProps {}

const Navbar: React.FC<INavbarProps> = ({}) => {
  const [{}, logout] = useLogoutMutation();
  const [{ fetching, data }] = useMeQuery({ pause: isServer() });
  let body = null;
  if (fetching) {
    body = <Box w="100%"></Box>;
  } else if (!data?.me) {
    body = (
      <Stack direction="row" justify="flex-end">
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
      </Stack>
    );
  } else {
    body = (
      <Stack direction="row" justify="flex-end">
        <Link
          onClick={async () => {
            await logout();
          }}
        >
          Logout
        </Link>
        <Box>{data.me.username}</Box>;
      </Stack>
    );
  }
  return (
    <Box py="10px" px="20px">
      {body}
    </Box>
  );
};

export default Navbar;
