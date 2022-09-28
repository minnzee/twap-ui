import { Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import React from "react";
import { StyledSmallTitle, StyledShadowContainer, StyledColumnGap, StyledBorderWrapper, StyledSmallTextDetail } from "../styles";
import TWAPLib from "@orbs-network/twap-ui";

function TradeSize() {
  const { onTradeSizeChange } = TWAPLib.actions();

  const { srcTokenAddress, tradeSize, totalTrades } = TWAPLib.state();

  return (
    <StyledContainer gap={10}>
      <StyledTop>
        <StyledTitle>
          <TWAPLib.components.InfoIconTooltip text="some text">
            <StyledSmallTitle>Trade size</StyledSmallTitle>
          </TWAPLib.components.InfoIconTooltip>
        </StyledTitle>
        <StyledInput>
          <TWAPLib.components.AmountInput value={tradeSize} onChange={(values) => onTradeSizeChange(values.toString())} />
        </StyledInput>
        <TWAPLib.components.TokenDisplay address={srcTokenAddress} />
      </StyledTop>
      <StyledBottom>
        <StyledSmallTextDetail>Total trades: {totalTrades}</StyledSmallTextDetail>
      </StyledBottom>
    </StyledContainer>
  );
}

export default TradeSize;

const StyledTitle = styled(StyledShadowContainer)({
  justifyContent: "flex-start",
  paddingLeft: 14,
});

const StyledContainer = styled(StyledColumnGap)({});

const StyledTop = styled(StyledBorderWrapper)({
  paddingRight: 15,
});
const StyledInput = styled(Box)({
  flex: 1,
});

const StyledBottom = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
});

const StyledTotalTrades = styled(Typography)({});