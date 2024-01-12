import { Box, styled } from "@mui/system";
import { TokenData } from "@orbs-network/twap";
import { Loader, Tooltip } from ".";
import { useFormatNumber } from "../../hooks";
import { StyledRowFlex, StyledText } from "../../styles";
import Icon from "./Icon";
import IconButton from "./IconButton";
import TokenLogo from "./TokenLogo";
import TokenName from "./TokenName";
import { HiSwitchHorizontal } from "@react-icons/all-files/hi/HiSwitchHorizontal";

export interface Props {
  leftToken?: TokenData;
  rightToken?: TokenData;
  price?: string;
  className?: string;
  toggleInverted: () => void;
  loading?: boolean;
}

function TokenPriceCompare({ leftToken, rightToken, price, className, toggleInverted, loading }: Props) {
  const _toggleInverted = (e: any) => {
    e.stopPropagation();
    toggleInverted();
  };

  if (loading) {
    return (
      <StyledContainer>
        <Loader width={120} height={30} />
      </StyledContainer>
    );
  }

  if (!leftToken || !rightToken) {
    return (
      <StyledContainer>
        <StyledText>-</StyledText>
      </StyledContainer>
    );
  }
  return (
    <StyledContainer className={`twap-price-compare ${className}`} onClick={_toggleInverted}>
      <LeftToken token={leftToken} />
      <IconButton onClick={()=>{}}>{<Icon icon={<HiSwitchHorizontal />} />}</IconButton>
      <span style={{display: 'none'}}>=</span>
      <RightToken price={price} token={rightToken} />
    </StyledContainer>
  );
}

const LeftToken = ({ token }: { token?: TokenData }) => {
  return (
    <StyledRowFlex style={{ width: "auto", gap: 5 }} className="left-token">
      <TokenLogo logo={token?.logoUrl} />
      <StyledText className="value">1</StyledText>
      <TokenName name={token?.symbol} />
    </StyledRowFlex>
  );
};

const RightToken = ({ token, price }: { token?: TokenData; price?: string }) => {
  const formattedValue = useFormatNumber({ value: price });
  const formattedValueTooltip = useFormatNumber({ value: price, decimalScale: 18 });
  return (
    <StyledRowFlex style={{ width: "auto", gap: 5 }} className="right-token">
      <TokenLogo logo={token?.logoUrl} />
      <Tooltip text={`${formattedValueTooltip} ${token?.symbol}`}>
        <span className="value"> {`${formattedValue} `}</span>
        <span className="symbol"> {token?.symbol}</span>
      </Tooltip>
    </StyledRowFlex>
  );
};
export default TokenPriceCompare;

TokenPriceCompare.LeftToken = LeftToken;
TokenPriceCompare.RightToken = RightToken;

const StyledContainer = styled(Box)({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "flex",
  justifyContent: "space-between",
  gap: 3,
  alignItems: "center",
  "& * ": {
    fontSize: 14,
  },
  svg: {
    fontSize: "20px",
  },
  "& .twap-token-logo": {
    width: 22,
    height: 22,
    minWidth: 22,
    minHeight: 22,
  },
});
