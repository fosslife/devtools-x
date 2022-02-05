import { Box, useStyleConfig } from "@chakra-ui/react";
import { Link } from "react-router-dom";

// FIXME: idk what type will be
export function Card(props: any) {
  const { variant, children, linkto, ...rest } = props;

  const styles = useStyleConfig("Card", { variant });

  // Pass the computed styles into the `__css` prop
  //   TODO: do this better
  if (linkto) {
    return (
      <Link to={linkto}>
        <Box __css={styles} {...rest}>
          {children}
        </Box>
      </Link>
    );
  }
  return (
    <Box __css={styles} {...rest}>
      {children}
    </Box>
  );
}
