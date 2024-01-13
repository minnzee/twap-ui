import { AccountBalanceWalletRounded } from "@mui/icons-material";
import { styled } from "@mui/system";
import React, { ReactNode } from "react";
import { useTwapContext } from "../../context";
import { useFormatNumber, useCustomActions } from "../../hooks";
import SmallLabel from "./SmallLabel";
// import Tooltip from "./Tooltip";

interface Props {
  isLoading: boolean;
  value?: string;
  className?: string;
  label?: string;
  suffix?: string;
  hideLabel?: boolean;
  emptyUi?: ReactNode;
  decimalScale?: number;
  symbol: string;
  isSrc?: boolean;
}

function Balance({ isLoading, value, className = "", suffix, emptyUi, decimalScale, isSrc }: Props) {
  const { uiPreferences } = useTwapContext();

  const _emptyUi = emptyUi || uiPreferences.balanceEmptyUI;

  const args = { value: value, suffix: suffix ? ` ${suffix}` : undefined };

  const formattedValue = useFormatNumber({ ...args, decimalScale });
  // const formattedValueTooltip = useFormatNumber({ ...args, decimalScale: 18 });

  if (value == null) {
    return null;
  }
  const onPercentClick = useCustomActions().onPercentClick;
  return (
    // <Tooltip text={formattedValueTooltip} placement="bottom">
    <StyledLabel onClick={() => isSrc && onPercentClick(1)} loading={isLoading} className={`twap-balance ${isSrc ? 'pointer' : ''} ${className}`}>
      <AccountBalanceWalletRounded sx={{
        fontSize: '15px',
        // color: themeOptions.info,
      }} /> {" "}
      {!value && _emptyUi ? _emptyUi : <>{formattedValue}</>}
    </StyledLabel>
    // </Tooltip>
  );
}

export default Balance;

const StyledLabel = styled(SmallLabel)({
  overflow: "hidden",
  minWidth: 0,
  "p": {
    display: "flex",
    alignItems: "center"
  },
  "svg": {
    marginRight: "0.5rem"
  }
});
