import Modal from "@mui/material/Modal";
import { ReactNode, useState } from "react";
import { Helmet } from "react-helmet";
import { AiOutlineClose } from "react-icons/ai";
import {
  StyledCloseIcon,
  StyledDappLayout,
  StyledDrawerContent,
  StyledMenuDrawer,
  StyledMenuList,
  StyledMenuListItemButton,
  StyledMenuLogo,
  StyledMenuMobileToggle,
  StyledThemeToggle,
} from "./styles";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import useMediaQuery from "@mui/material/useMediaQuery";
import { FiMenu } from "react-icons/fi";
import Backdrop from "@mui/material/Backdrop";
import { Fade } from "@mui/material";
import { Config } from "@orbs-network/twap";
import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs";
import { dapps } from "./config";
import { Status } from "./Status";
import { useSelectedDapp, useTheme } from "./hooks";

const FAVICON = "https://github.com/orbs-network/twap-ui/raw/66e183e804002fe382d9b0070caef060ad2e21ac/logo/64.png";

export interface Dapp {
  config: Config;
  logo: string;
  Component: any;
  invertLogo?: boolean;
}

export const Popup = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: ReactNode }) => {
  return (
    <Modal open={isOpen} onClose={onClose} onBackdropClick={onClose}>
      <>
        <StyledCloseIcon onClick={onClose}>
          <AiOutlineClose className="icon" />
        </StyledCloseIcon>
        {children}
      </>
    </Modal>
  );
};

export const MetaTags = ({ title }: { title: string }) => {
  return (
    <Helmet>
      <link rel="icon" href={FAVICON} />
      <title>TWAP On {title}</title>
    </Helmet>
  );
};

const ToggleTheme = () => {
  const size = 18;
  const { setTheme, isDarkTheme } = useTheme();
  return (
    <StyledThemeToggle>
      <button
        style={{
          opacity: isDarkTheme ? 0.5 : 1,
        }}
        onClick={() => setTheme("light")}
      >
        <BsFillSunFill style={{ width: size, height: size }} />
      </button>
      <button
        style={{
          opacity: !isDarkTheme ? 0.5 : 1,
        }}
        onClick={() => setTheme("dark")}
      >
        <BsFillMoonFill style={{ width: size, height: size }} />
      </button>
    </StyledThemeToggle>
  );
};

interface DappsMenuProps {
  onSelect: (dapp: Dapp) => void;
}
const drawerWidth = 260;

export const DappsMenu = ({ onSelect }: DappsMenuProps) => {
  const { isSelected, selectedDapp } = useSelectedDapp();

  const isMobile = useMediaQuery("(max-width:1100px)");
  const [isOpen, setIsOpen] = useState(false);

  const open = !isMobile ? true : isMobile && isOpen;

  const handleDrawerToggle = () => {
    setIsOpen(!isOpen);
  };

  const onSelectClick = (dapp: Dapp) => {
    if (isMobile) {
      setIsOpen(false);
    }
    onSelect(dapp);
  };

  return (
    <>
      {isMobile && (
        <StyledMenuMobileToggle color="inherit" edge="start" onClick={handleDrawerToggle}>
          <FiMenu />
        </StyledMenuMobileToggle>
      )}
      <StyledMenuDrawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "rgb(16, 23, 38)",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Backdrop open={isMobile && isOpen} onClick={() => setIsOpen(false)} />

        <StyledDrawerContent>
          <ToggleTheme />
          <StyledMenuList>
            {dapps.map((dapp) => (
              <ListItem onClick={() => onSelectClick(dapp)} key={dapp.config.partner.toLowerCase()} disablePadding selected={isSelected(dapp)}>
                <StyledMenuListItemButton>
                  <StyledMenuLogo
                    src={dapp.logo}
                    style={{
                      filter: dapp.invertLogo ? "invert(100%)" : "unset",
                    }}
                  />
                  <ListItemText primary={dapp.config.partner} />
                </StyledMenuListItemButton>
              </ListItem>
            ))}
          </StyledMenuList>
          <Status />
        </StyledDrawerContent>
      </StyledMenuDrawer>
    </>
  );
};

export const DappLayout = ({ children, name }: { children: ReactNode; name: string }) => {
  return (
    <>
      <MetaTags title={name} />
      <Fade in>
        <StyledDappLayout>{children}</StyledDappLayout>
      </Fade>
    </>
  );
};
