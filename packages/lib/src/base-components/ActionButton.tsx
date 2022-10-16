import { Box, styled } from "@mui/system";
import React, { CSSProperties, ReactNode, useContext } from "react";

function ActionButton({ children, style = {}, disabled = false, onClick }: { children: ReactNode; style?: CSSProperties; disabled?: boolean; onClick: () => void }) {
  return (
    <StyledContainer onClick={onClick} className="twap-action-button" style={style} disabled={disabled}>
      <StyledChildren>{children}</StyledChildren>
    </StyledContainer>
  );
}

export default ActionButton;

const StyledContainer = styled("button")(({ disabled }: { disabled: boolean }) => ({
  height: "100%",
  width: "100%",
  border: "unset",
  background: disabled ? "transparent" : "linear-gradient(114.98deg, #5D81ED 1.42%, #DB95FF 54.67%, #FF8497 105.73%)",
  boxShadow: "0px 26px 60px rgba(141, 155, 170, 0.05)",
  borderRadius: 10,
  color: disabled ? "#ADB4C0" : "white",
  fontWeight: 600,
  cursor: disabled ? "unset" : "pointer",
  fontSize: 16,
  opacity: disabled ? 0.6 : 1,
  transition: "0.2s all",
}));

const StyledChildren = styled(Box)({});