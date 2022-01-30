import * as React from "react";
import { Box, Input, Stack, Text } from "@chakra-ui/react";
import { useSuggestTasksQuery } from "../generated/graphql";
import { CloseIcon } from "@chakra-ui/icons";

interface ISuggestProps {}

const Suggest: React.FC<ISuggestProps> = ({}) => {
  const [suggestInput, setSuggestInput] = React.useState<string | null>(null);
  const ref = React.useRef<HTMLInputElement>(null);
  const divRef = React.useRef<HTMLDivElement>(null);
  const [{ data: suggestData, fetching: fetchingSuggest }] =
    useSuggestTasksQuery({ variables: { word: suggestInput } });

  const [focus, setFocus] = React.useState(false);
  // React.useEffect(() => {
  //   console.log("FOCUS", focus);
  // }, [focus]);

  React.useEffect(() => {
    divRef.current &&
      divRef.current.addEventListener("click", (e) => {
        console.log("THIS WAS CLICKED", e.currentTarget);
      });
  }, []);

  // React.useEffect(() => {
  //   ref.current && console.log("VALUE", ref.current.value);
  // }, [ref.current?.value]);

  React.useEffect(() => {
    console.log("INPUT", suggestInput);
  }, [suggestInput]);

  return (
    <Box
      ref={divRef}
      position="relative"
      w="100%"
      onFocus={() => setFocus(true)}
      // onBlur={() => setFocus(false)}
    >
      <CloseIcon
        boxSize="13px"
        position="absolute"
        right="10px"
        top="14px"
        onClick={() => setSuggestInput(null)}
        zIndex="10"
        cursor="pointer"
      />
      <Input
        id="suggest"
        ref={ref}
        placeholder="Find a task"
        onInput={(e) => setSuggestInput(e.currentTarget.value)}
        value={suggestInput || ""}
      />
      {/* {focus && ( */}
      <Box
        top="48px"
        p="10px"
        zIndex="10"
        backgroundColor="white"
        position="absolute"
        align="center"
        w="100%"
        borderWidth="1px"
        borderRadius="6px"
      >
        {!suggestInput && (
          <Box borderBottomWidth="1px">
            <Text>start writing, we'll narrow it down</Text>
          </Box>
        )}
        <Stack maxH="300px" overflowY="scroll" spacing="0px">
          {suggestData && suggestData.suggestTasks.length > 0 ? (
            suggestData.suggestTasks.map((s) => (
              <Box
                w="100%"
                key={s.id}
                _hover={{ backgroundColor: "gray", color: "white" }}
                cursor="pointer"
                onClick={(e) => {
                  console.log("CLICK");
                  setSuggestInput(s.name);
                  setFocus(false);
                }}
              >
                <Text textAlign="start" pl="5px">
                  {s.name}
                </Text>
              </Box>
            ))
          ) : (
            <Text>Sorry, try something else</Text>
          )}
        </Stack>
      </Box>
      {/* )} */}
    </Box>
  );
};

export default Suggest;
