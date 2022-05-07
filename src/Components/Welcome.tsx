import { Flex, Heading, Icon, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AppContext } from "../Contexts/AppContextProvider";
import { data } from "../Layout/Navbar";
import { db } from "../utils";

const Welcome = () => {
  const nav = useNavigate();
  const { pinned } = useContext(AppContext);

  // for the first time read from db.data.
  let actualRows = pinned.length > 0 ? pinned : db.data.pinned;

  return (
    <Flex h="full" w="96%" justify={"start"} ml="10" flexDirection={"column"}>
      <Heading>Welcome</Heading>
      <Text color={"tomato"} fontSize={"2xl"}>
        DevTools
      </Text>
      {actualRows.length === 0 && (
        <Heading size={"sm"} mt="10">
          No pinned cards
        </Heading>
      )}
      <br />
      <Flex mt="4" gap="5" flexWrap={"wrap"}>
        {actualRows.map((pin: number) => {
          return (
            <Flex
              gap="4"
              flexDir={"column"}
              align="center"
              key={pin}
              bg="red.400"
              p="6"
              borderRadius={"md"}
              cursor="pointer"
              onClick={() => {
                const clickedCard = data.find((e) => e.id === pin);
                nav(clickedCard?.to || "/"); // TS FIX NOTHING ELSE
              }}
            >
              <Icon
                as={data.find((e) => e.id === pin)?.icon}
                w={9}
                h={9}
              ></Icon>
              <Text>{data.find((e) => e.id === pin)?.text}</Text>
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
};

export default Welcome;
