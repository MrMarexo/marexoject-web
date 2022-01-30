import {
  Heading,
  Stack,
  Text,
  Select,
  Button,
  Box,
  Input,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import * as React from "react";
import Layout from "../components/Layout";
import Suggest from "../components/Suggest";
import {
  TasksQuery,
  useTasksQuery,
  useSuggestTasksQuery,
} from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const createChoicePool = (choices: TasksQuery["tasks"]) => {
  const pool = choices.map((c) => ({ ...c, used: -1 }));
  pool.unshift({ id: 0, name: "No task", used: -1 });
  return pool;
};

interface IPoolChoice {
  id: number;
  name: string;
  used: number;
}

const Index: React.FC = () => {
  const [{ data, fetching }] = useTasksQuery();

  const [numberOfSelects, setNumberOfSelects] = React.useState(5);
  const [selectState, setSelectState] = React.useState<
    Record<number, string | undefined>
  >({});

  const [choices, setChoices] = React.useState([{} as IPoolChoice]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (data?.tasks) {
      setChoices(createChoicePool(data.tasks));
      setLoading(false);
    }
  }, [fetching]);

  React.useEffect(() => {
    const obj: typeof selectState = {};
    [...Array(numberOfSelects)].forEach((n, i) => {
      if (!obj[i]) obj[i] = undefined;
    });

    setSelectState(obj);
  }, [numberOfSelects]);

  return (
    <Layout>
      <Stack justify="center" align="center" mt="100px">
        <Heading>Welcome</Heading>
        <Text textAlign="center">
          Choose at least five activities you'd like to do daily.
        </Text>
        {loading ? (
          <Text>Fetching the data for you</Text>
        ) : (
          [...Array(numberOfSelects)].map((_, i) => (
            <Select
              key={i}
              onChange={(e) => {
                const value = e.target.value;
                setSelectState((s) => ({ ...s, [i]: value }));
                setChoices((choices) => {
                  const prevIndex = choices.findIndex((c) => c.used === i);
                  if (prevIndex !== -1 && choices[prevIndex].id !== 0)
                    choices[prevIndex].used = -1;
                  const newIndex = choices.findIndex((c) => c.name === value);
                  if (choices[newIndex].id !== 0) choices[newIndex].used = i;
                  return choices;
                });
              }}
            >
              {choices.map((c, ind) => {
                if (c.used === i || c.used === -1) {
                  return (
                    <option key={ind} value={ind === 0 ? undefined : c.name}>
                      {c.name}
                    </option>
                  );
                }
              })}
            </Select>
          ))
        )}
        <Stack direction="row">
          <Button
            disabled={numberOfSelects === 10}
            onClick={() => setNumberOfSelects((s) => s + 1)}
            w="200px"
          >
            Add
          </Button>
          <Button
            disabled={numberOfSelects === 5}
            onClick={() => setNumberOfSelects((s) => s - 1)}
          >
            -
          </Button>
        </Stack>
        <Suggest />

        <Box pt="50px">
          <Button w="300px" h="50px" fontSize="25px">
            Submit
          </Button>
        </Box>
      </Stack>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Index);
