import { Box, Flex, Heading, Text } from "@chakra-ui/react";

const Welcome = () => {
  return (
    <Flex
      h="full"
      justify={"center"}
      flexDirection={"column"}
      alignItems={"center"}
    >
      <Heading>Welcome</Heading>
      <Text color={"tomato"} fontSize={"2xl"}>
        DevTools
      </Text>
      <Text>Click on any of the left card to get started</Text>
    </Flex>
  );
};

export default Welcome;
