import { styled } from "@mui/material";
import React, { useCallback, useEffect, useMemo } from "react";
import { useWizardStore, WizardAction, WizardActionStatus } from "../store";
import { StyledColumnFlex, StyledText } from "../styles";
import { Modal, Spinner } from "./base";

import { FaCheckCircle } from "@react-icons/all-files/fa/FaCheckCircle";
import { MdError } from "@react-icons/all-files/md/MdError";

// import { States } from "./../../../../../../states/dispatcher/states"
// import { TransactionStatus } from "../../../../../../states/data/transactionStatus";
import { TransactionHandlers } from "../../../../../../requests"
import { stateStore, updateStateStore } from "../../../../../../states/stateStore";
import { TransactionWindowContentBuilder } from "../../../../../../components/windows/transactionStatusWindow";
import { TransactionWindow } from "../../../../../../states/dispatcher/transactionWindow";
import { States } from "../../../../../../states/dispatcher/states";
import { TransactionStatus } from "../../../../../../states/data/transactionStatus";
export function Wizard() {
  const store = useWizardStore();
  const content = useContent();

  useEffect(() => {
    console.log('wizard action:', store.action, 'wizard status:', store.status, 'wizard error:', store.error)
    setTranscationWindow();

  }, [store])

  function setTranscationWindow() {
    let errorMsg, pendingMsg, successMsg;
    
    switch (store.status) {
      case WizardActionStatus.PENDING:
        pendingMsg = "Pending";
        if (store.action) {
          switch (store.action) {
            case WizardAction.APPROVE:
              pendingMsg = "Approving";
              break;
            case WizardAction.CREATE_ORDER:
              pendingMsg = "Submitting order";
              break;
            case WizardAction.WRAP:
              pendingMsg = "Wrapping";
              break;
            case WizardAction.UNWRAP:
              pendingMsg = "Unwrapping";
              break;
          }
        }
        TransactionWindow.render(TransactionWindowContentBuilder.create(pendingMsg));
        break;
      case WizardActionStatus.ERROR:
        errorMsg = store.error;
        if (!store.error) {
          switch (store.action) {
            case WizardAction.APPROVE:
              errorMsg = "Approval failed";
              break;
            case WizardAction.CREATE_ORDER:
              errorMsg = "Submit order failed";
              break;
            case WizardAction.WRAP:
              errorMsg = "Wrap failed";
              break;
            case WizardAction.UNWRAP:
              errorMsg = "Unwrap failed";
              break;
          }
        }

        TransactionHandlers.createErrorHandler()(errorMsg);
        break;

      case WizardActionStatus.SUCCESS:
        successMsg = "Operation successful";
        switch (store.action) {
          case WizardAction.APPROVE:
            successMsg = "Approval successful";
            break;
          case WizardAction.CREATE_ORDER:
            successMsg = "Order submitted successfully";
            break;
          case WizardAction.WRAP:
            successMsg = "Wrap successful";
            break;
          case WizardAction.UNWRAP:
            successMsg = "Unwrap successful";
            break;
        }
        // TransactionHandlers.createErrorHandler()(successMsg);
        stateStore().currentTransaction.windowContent = {
          main: successMsg,
          subtitle: ''
        }
        States.setTransactionStatus(TransactionStatus.CUSTOM_SUCCESSED);
        break;

      default:

        break;
    }
    updateStateStore();
  }

  const onClose = useCallback(() => {
    store.setOpen(false);
  }, []);

  return (
    <div style={{ display: 'none' }}>
      {false && <Modal open={store.open} onClose={onClose} >
        <StyledContainer>{content}</StyledContainer>
      </Modal>}
    </div>

    // <></>
  );
}

const useContent = () => {
  const store = useWizardStore();
  return useMemo(() => {
    const baseProps = {
      status: store.status,
      error: store.error,
    };
    if (store.action === WizardAction.APPROVE) {
      return <Message {...baseProps} errorMsg="Approval failed" pendingMsg="Approving" successMsg="Approval successful" />;
    }

    if (store.action === WizardAction.CREATE_ORDER) {
      return <Message {...baseProps} errorMsg="Submit order failed" pendingMsg="Submitting order" successMsg="Order submitted successfully" />;
    }
    if (store.action === WizardAction.WRAP) {
      return <Message {...baseProps} errorMsg="Wrap failed" pendingMsg="Wrapping" successMsg="Wrap successful" />;
    }
    if (store.action === WizardAction.UNWRAP) {
      return <Message {...baseProps} errorMsg="Unwrap failed" pendingMsg="Unwrapping" successMsg="Unwrap successful" />;
    }
  }, [store.action, store.status]);
};

const Message = ({
  status,
  error,
  successMsg,
  errorMsg,
  pendingMsg,
}: {
  status?: WizardActionStatus;
  error?: string;
  successMsg: string;
  errorMsg: string;
  pendingMsg: string;
}) => {
  if (status === WizardActionStatus.PENDING) {
    return (
      <>
        <StyledSpinner />
        <StyledTitle>{pendingMsg}</StyledTitle>
      </>
    );
  }

  if (status === WizardActionStatus.SUCCESS) {
    return (
      <>
        <FaCheckCircle className="twap-icon twap-success-icon" />
        <StyledTitle>{successMsg}</StyledTitle>
      </>
    );
  }

  if (status === WizardActionStatus.ERROR) {
    return (
      <>
        <MdError className="twap-icon twap-error-icon" />
        <StyledTitle>{errorMsg}</StyledTitle>
        <StyledMessage>{error}</StyledMessage>
      </>
    );
  }

  return null;
};

const StyledSpinner = styled(Spinner)({
  width: "45px!important",
  height: "45px!important",
});

const StyledTitle = styled(StyledText)({
  fontSize: 22,
  fontWeight: 500,
  textAlign: "center",
  width: "100%",
});

const StyledContainer = styled(StyledColumnFlex)({
  alignItems: "center",
  gap: 12,
  ".twap-icon": {
    width: 60,
    height: 60,
  },
  ".twap-error-icon": {
    "*": {
      color: "#FF3233!important",
    },
  },
  ".twap-success-icon": {
    "*": {
      color: "#28a745!important",
    },
  },
});

const StyledMessage = styled(StyledText)({
  fontSize: 16,
  textAlign: "center",
  width: "100%",
  marginTop: 10,
});
