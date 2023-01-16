import { Orders, PangolinOrdersProps, PangolinTWAPProps, TWAP } from "@orbs-network/twap-ui-pangolin";
import { DappLayout, Popup } from "./Components";
import { StyledLayoutPangolin, StyledModalList, StyledModalListItem, StyledLayoutPangolinDaas } from "./styles";
import _ from "lodash";
import { erc20s } from "@defi.org/web3-candies";
import { useWeb3React } from "@web3-react/core";
import { useQuery } from "@tanstack/react-query";
import { Configs } from "@orbs-network/twap";
import { Dapp } from "./Components";
import { useConnectWallet, useNetwork, useTheme } from "./hooks";
import { Components } from "@orbs-network/twap-ui";
import { pangolinDarkTheme, pangolinLightTheme } from "./themes";

interface TokenSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCurrencySelect: (token: any) => void;
}

const config = Configs.Pangolin;

const nativeToken = {
  decimals: 18,
  name: "Avalanche",
  symbol: "AVAX",
  "_constructor-name_": "Currency",
};

const nativeTokenLogo = "https://raw.githubusercontent.com/pangolindex/sdk/master/src/images/chains/avax.png";

const chainId = config.chainId;

const useDappTokens = () => {
  const { account } = useWeb3React();
  const { isInValidNetwork } = useNetwork(chainId);

  return useQuery(
    ["useDappTokens", chainId],
    async () => {
      const response = await fetch(`https://raw.githubusercontent.com/pangolindex/tokenlists/main/pangolin.tokenlist.json`);
      const tokenList = await response.json();

      const parsed = tokenList.tokens.map(({ symbol, address, decimals, logoURI, name }: any) => ({
        decimals,
        symbol,
        name,
        chainId,
        address,
        tokenInfo: { symbol, address, decimals, logoURI: (logoURI as string)?.replace("/logo_24.png", "/logo_48.png"), name, chainId },
        tags: [],
      }));
      const candiesAddresses = _.map(erc20s.avax, (t) => t().address);

      const _tokens = _.sortBy(parsed, (t: any) => {
        const index = candiesAddresses.indexOf(t.address);
        return index >= 0 ? index : Number.MAX_SAFE_INTEGER;
      });

      return { native: nativeToken, ..._.mapKeys(_tokens, (t) => t.address) };
    },
    {
      enabled: !!account && !isInValidNetwork,
    }
  );
};

const TokenSelectModal = ({ isOpen, onClose, onCurrencySelect }: TokenSelectModalProps) => {
  const { data: tokensList } = useDappTokens();

  if (!tokensList) return null;

  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <StyledModalList>
        {_.map(tokensList, (token: any) => {
          if (!token.tokenInfo) {
            return (
              <StyledModalListItem onClick={() => onCurrencySelect(token)} key={token.symbol}>
                <img src={nativeTokenLogo} width={30} height={30} alt="" />
                {token.symbol}
              </StyledModalListItem>
            );
          }
          return (
            <StyledModalListItem onClick={() => onCurrencySelect(token)} key={token.tokenInfo.address}>
              <Components.TokenLogo
                logo={token.tokenInfo.logoURI}
                alt={token.tokenInfo.symbol}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
              {token.tokenInfo.symbol}
            </StyledModalListItem>
          );
        })}
      </StyledModalList>
    </Popup>
  );
};
const logo = "https://s2.coinmarketcap.com/static/img/coins/64x64/8422.png";
const PangolinComponent = () => {
  const { account, library: provider, chainId } = useWeb3React();
  const { data: dappTokens } = useDappTokens();
  const { isDarkTheme } = useTheme();

  const connect = useConnectWallet();

  const twapProps: PangolinTWAPProps = {
    account,
    TokenSelectModal,
    srcToken: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7", //WAVAX
    dstToken: "0x340fE1D898ECCAad394e2ba0fC1F93d27c7b717A", // ORBS
    dappTokens,
    provider,
    onSrcTokenSelected: (token: any) => console.log(token),
    onDstTokenSelected: (token: any) => console.log(token),
    connect,
    connectedChainId: chainId,
    theme: isDarkTheme ? pangolinDarkTheme : pangolinLightTheme,
  };
  const ordersProps: PangolinOrdersProps = { account, dappTokens, provider, isDarkTheme };

  return (
    <DappLayout name={config.partner}>
      <StyledLayoutPangolin mode={isDarkTheme ? "dark" : "light"}>
        <TWAP {...twapProps} />
      </StyledLayoutPangolin>
      <StyledLayoutPangolin mode={isDarkTheme ? "dark" : "light"}>
        <Orders {...ordersProps} />
      </StyledLayoutPangolin>
    </DappLayout>
  );
};

const PangolinDaasComponent = () => {
  const { account, library: provider, chainId } = useWeb3React();
  const { data: dappTokens } = useDappTokens();
  const { isDarkTheme } = useTheme();

  const connect = useConnectWallet();

  const twapProps: PangolinTWAPProps = {
    account,
    TokenSelectModal,
    srcToken: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7", //WAVAX
    dstToken: "0x340fE1D898ECCAad394e2ba0fC1F93d27c7b717A", // ORBS
    dappTokens,
    provider,
    onSrcTokenSelected: (token: any) => console.log(token),
    onDstTokenSelected: (token: any) => console.log(token),
    connect,
    connectedChainId: chainId,
    theme: isDarkTheme ? pangolinDarkTheme : pangolinLightTheme,
    partnerDaas: "0xFA1c2Ae5c52a02cbaD6A05CdcA89f032Fa3a4D0d",
  };
  const ordersProps: PangolinOrdersProps = { account, dappTokens, provider, isDarkTheme };

  return (
    <DappLayout name={config.partner}>
      <StyledLayoutPangolinDaas mode={isDarkTheme ? "dark" : "light"}>
        <TWAP {...twapProps} />
      </StyledLayoutPangolinDaas>
      <StyledLayoutPangolinDaas mode={isDarkTheme ? "dark" : "light"}>
        <Orders {...ordersProps} />
      </StyledLayoutPangolinDaas>
    </DappLayout>
  );
};

const pangolin: Dapp = {
  Component: PangolinComponent,
  logo,
  config,
};

const pangolinDaas: Dapp = {
  Component: PangolinDaasComponent,
  logo,
  config: Configs.PangolinDaas,
  invertLogo: true,
};

export { pangolin, pangolinDaas };
