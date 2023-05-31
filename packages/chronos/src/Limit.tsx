import { GlobalStyles } from "@mui/material";
import { Components, hooks, Translations, TwapAdapter, Styles as TwapStyles, store } from "@orbs-network/twap-ui";
import { useEffect, useState } from "react";
import { AdapterContextProvider, config, parseToken } from "./hooks";
import translations from "./i18n/en.json";
import { ChronosTWAPProps } from "./types";
import { Box } from "@mui/system";
import { ChangeTokensOrder, Container, OrderSummary, TokenPanel } from "./Components";
import { configureStyles, StyledColumnFlex, StyledPoweredBy } from "./styles";

const storeOverride = {
  isLimitOrder: true,
  chunks: 1,
  customDuration: { resolution: store.TimeResolution.Days, amount: 90 },
  customFillDelay: { resolution: store.TimeResolution.Minutes, amount: 2 },
};

const Limit = (props: ChronosTWAPProps) => {
  const parsedTokens = hooks.useParseTokens(props.dappTokens, (rawToken) => parseToken(props.getTokenLogoURL, rawToken));
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    setAppReady(true);
  }, []);

  if (!appReady) return null;
  return (
    <Box className="adapter-wrapper">
      <TwapAdapter
        connect={props.connect ? props.connect : () => {}}
        config={config}
        maxFeePerGas={props.maxFeePerGas}
        priorityFeePerGas={props.priorityFeePerGas}
        translations={translations as Translations}
        provider={props.provider}
        account={props.account}
        tokenList={parsedTokens}
        storeOverride={storeOverride}
        srcToken={props.srcToken}
        dstToken={props.dstToken}
      >
        <GlobalStyles styles={configureStyles() as any} />
        <AdapterContextProvider value={props}>
          <div className="twap-container">
            <StyledColumnFlex>
              <TwapStyles.StyledColumnFlex gap={10}>
                <TokenPanel isSrcToken={true} />
                <ChangeTokensOrder />
                <TokenPanel />
              </TwapStyles.StyledColumnFlex>

              <StyledColumnFlex>
                <Components.MarketPrice />
                <LimitPrice />
                <Components.SubmitButton isMain />
              </StyledColumnFlex>
            </StyledColumnFlex>
            <OrderSummary>
              <TwapStyles.StyledColumnFlex>
                <Components.OrderSummaryDetailsDeadline />
                <Components.OrderSummaryDetailsOrderType />
                <Components.OrderSummaryDetailsChunkSize />
                <Components.OrderSummaryDetailsMinDstAmount />
              </TwapStyles.StyledColumnFlex>
            </OrderSummary>
            <StyledPoweredBy />
          </div>
        </AdapterContextProvider>
      </TwapAdapter>
    </Box>
  );
};

export default Limit;

const LimitPrice = () => {
  const twapStore = store.useTwapStore();

  if (!twapStore.srcToken || !twapStore.dstToken) return null;
  return (
    <>
      <Container className="twap-limit-price">
        <TwapStyles.StyledColumnFlex>
          <TwapStyles.StyledRowFlex justifyContent="space-between">
            <Components.Labels.LimitPriceLabel />
          </TwapStyles.StyledRowFlex>
          <Components.LimitPriceInput placeholder="0" />
        </TwapStyles.StyledColumnFlex>
      </Container>
    </>
  );
};