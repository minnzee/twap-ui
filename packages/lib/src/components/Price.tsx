import { IconButton, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import NumericInput from "../base-components/NumericInput";
import TokenLogo from "../base-components/TokenLogo";
import TokenName from "../base-components/TokenName";
import { TbArrowsRightLeft } from "react-icons/tb";
import { store } from "../store/store";

function Price({ placeholder = "0.00" }: { placeholder?: string }) {
  const { uiPrice, toggleInverted, onChange, leftTokenInfo, rightTokenInfo } = store.useLimitPrice();

  return (
    <StyledContainer className="twap-price">
      <StyledLeft>
        <Typography>1</Typography>
        <TokenName name={leftTokenInfo?.symbol} />
        <TokenLogo logo={leftTokenInfo?.logoUrl} />
        <Typography>=</Typography>
      </StyledLeft>
      <StyledNumeric>
        <NumericInput placeholder={placeholder} onChange={onChange} value={uiPrice?.toLocaleString()} />
      </StyledNumeric>
      <StyledRight>
        <TokenName name={rightTokenInfo?.symbol} />
        <TokenLogo logo={rightTokenInfo?.logoUrl} />
        <IconButton onClick={toggleInverted}>
          <TbArrowsRightLeft style={{ width: 20, height: 20 }} className="twap-price-icon" />
        </IconButton>
      </StyledRight>
    </StyledContainer>
  );
}

export default Price;

const StyledLeft = styled(Box)({
  display: "flex",
  gap: 10,
  alignItems: "center",
});

const StyledRight = styled(Box)({
  display: "flex",
  gap: 10,
  alignItems: "center",
});

const StyledContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  width: "100%",
  "& .twap-input": {
    fontSize: 16,
    textAlign: "center",
    width: "100%",
  },
});

const StyledNumeric = styled(Box)({
  flex: 1,
});
