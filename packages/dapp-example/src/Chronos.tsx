import { StyledChronos, StyledChronosLayout, StyledModalContent } from "./styles";
import { Orders, TWAP, Limit, ChronosTWAPProps, ChronosOrdersProps, ChronosRawToken } from "@orbs-network/twap-ui-chronos";
import { useConnectWallet, useTheme } from "./hooks";
import { Configs } from "@orbs-network/twap";
import { useWeb3React } from "@web3-react/core";
import { Dapp, TokensList, UISelector } from "./Components";
import { Popup } from "./Components";
import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { erc20s, zeroAddress } from "@defi.org/web3-candies";
import { TokenListItem } from "./types";
const config = { ...Configs.QuickSwap };
config.partner = "Chronos";
// const nativeTokenLogo = "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png";

const getTokenLogoURL = (symbol: string) => {
  return `https://dexapi.chronos.exchange/tokens/${symbol}.png`;
};

export const useDappTokens = () => {
  const { account } = useWeb3React();
  // const { isInValidNetwork } = useNetwork(config.chainId);

  return useQuery(
    ["useDappTokens", config.chainId],
    async () => {
      const response = await fetch(`https://raw.githubusercontent.com/viaprotocol/tokenlists/main/tokenlists/polygon.json`);

      // const data = (await response.json()).data;
      // const tokenList = data.tokens;
      const tokenList = await response.json();

      const parsed = tokenList
        // .filter((t: any) => t.chainId === config.chainId)
        .map(({ symbol, address, decimals, name }: any) => ({
          decimals,
          symbol,
          name,
          address,
          logoURI: getTokenLogoURL(symbol),
        }));

      const candiesAddresses = [zeroAddress, ..._.map(erc20s.poly, (t) => t().address)];

      return _.sortBy(parsed, (t: any) => {
        const index = candiesAddresses.indexOf(t.address);
        return index >= 0 ? index : Number.MAX_SAFE_INTEGER;
      });
    },
    { enabled: !!account }
  );
};

interface TokenSelectModalProps {
  open: boolean;
  selectToken: (token: any) => void;
  setOpen: () => void;
}

const parseList = (rawList?: any): TokenListItem[] => {
  return _.map(rawList, (rawToken) => {
    return {
      token: {
        address: rawToken.address,
        decimals: rawToken.decimals,
        symbol: rawToken.symbol,
        logoUrl: rawToken.logoURI,
      },
      rawToken,
    };
  });
};

const TokenSelectModal = ({ open, selectToken, setOpen }: TokenSelectModalProps) => {
  const { data: tokensList } = useDappTokens();

  const tokensListSize = _.size(tokensList);
  const parsedList = useMemo(() => parseList(tokensList), [tokensListSize]);

  return (
    <Popup isOpen={open} onClose={setOpen}>
      <StyledModalContent>
        <TokensList tokens={parsedList} onClick={selectToken} />
      </StyledModalContent>
    </Popup>
  );
};
const logo = "https://s2.coinmarketcap.com/static/img/coins/64x64/8206.png";
const DappComponent = () => {
  const { account, library } = useWeb3React();
  const connect = useConnectWallet();
  const { data: dappTokens = [] } = useDappTokens();
  const { isDarkTheme } = useTheme();

  const twapProps: ChronosTWAPProps = {
    connect,
    account,
    srcToken: zeroAddress,
    dstToken: "0x614389EaAE0A6821DC49062D56BDA3d9d45Fa2ff", //ORBS
    dappTokens,
    TokenSelectModal,
    provider: library,
    getTokenLogoURL,
  };
  const ordersProps: ChronosOrdersProps = { account, dappTokens, provider: library, getTokenLogoURL, isDarkTheme };

  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkTheme]);

  return (
    <StyledChronos isDarkMode={isDarkTheme ? 1 : 0}>
      <StyledChronosLayout name={config.partner}>
        <UISelector
          options={[
            {
              title: "TWAP",
              component: <TWAP {...twapProps} />,
            },
            {
              title: "LIMIT",
              component: <Limit {...twapProps} />,
            },
          ]}
        />
        <Orders {...ordersProps} />
      </StyledChronosLayout>
    </StyledChronos>
  );
};

const dapp: Dapp = {
  Component: DappComponent,
  logo,
  config,
};

export default dapp;
