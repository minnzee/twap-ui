import { Box, Fade, styled } from "@mui/material";
import { CSSProperties, ReactNode } from "react";
import { StyledOneLineText } from "../../styles";
import Loader from "./Loader";

function SmallLabel({ children, style, loading = false, className = "", onClick }: { children?: string | ReactNode; style?: CSSProperties; loading?: boolean; className?: string; onClick?: () => void }) {
  return (
    <StyledContainer onClick={onClick} style={style} className={`twap-small-label ${className}`}>
      {loading && (
        <Fade in={loading}>
          <StyledLoader className="twap-small-label-loader">
            <Loader width="100%" height="100%" />
          </StyledLoader>
        </Fade>
      )}

      {!loading && (
        <Fade in={!loading}>
          <StyledChildren>{children}</StyledChildren>
        </Fade>
      )}
    </StyledContainer>
  );
}

export default SmallLabel;

const StyledChildren = styled(StyledOneLineText)({
  fontSize: "inherit",
  fontFamily: "inherit",
});

const StyledLoader = styled(Box)({
  width: 50,
  height: 20,
});

const StyledContainer = styled(Box)({
  position: "relative",
  display: "flex",
  alignItems: "center",
});
