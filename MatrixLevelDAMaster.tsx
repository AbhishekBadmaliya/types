import React, { useState } from "react";

import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import OmniTable from "@components/OmniTable";
import useOmniTable from "@components/OmniTable/useOmniTable";
import { PiPlusBold } from "react-icons/pi";
import { FaEdit } from "react-icons/fa";
import scss from "./matrixLevelDAMaster.module.scss";
import MatrixLevelMasterForm from "./MatrixLevelDAMasterForm";

export type Masters = {
  id: number;
  pay_commission: string;
  da_rate_in_percentage: string;
  effective_date: string;
  formula_to_calculate_da: string;
  status: string;
};

const cols = createColumnHelper<Masters>();

const MatrixLevelMaster = () => {
  const payMatrixLevelDisc = useDisclosure();
  const [selectedPayMatrixMaster, setSelectedPayMatrixMaster] =
    useState<Masters | null>(null);
  const [showStatusField, setShowStatusField] = useState(false);
  const tableState = useOmniTable({
    apiPath: "/da-master/get-da-master-info",
  });
  const { pageSize, activePage } = tableState.paginationState;

  const columns = [
    cols.display({
      header: "SR.No",
      size: 10,
      cell: (ctx) => activePage * pageSize + ctx.row.index + 1,
    }),
    cols.accessor("pay_commission", { header: "Pay Commission" }),
    cols.accessor("da_rate_in_percentage", { header: "DA Rate in % Percentage" }),
    cols.accessor("effective_date", { header: "Effective Date" }),
    cols.accessor("formula_to_calculate_da", { header: "Formula to calculate DA" }),
    cols.accessor("status", { header: "Status" }),
    cols.display({
      header: "Action",
      cell: ({ row }) => {
        return (
          <>
            <Button
              onClick={() => {
                setSelectedPayMatrixMaster(row.original);
                setShowStatusField(true);
                payMatrixLevelDisc.onOpen();
              }}
              className={scss.action_btn}>
              <FaEdit />
            </Button>
          </>
        );
      },
    }),
  ];
  const handleAddNewClick = () => {
    setSelectedPayMatrixMaster(null);
    setShowStatusField(false);
    payMatrixLevelDisc.onOpen();
  };
  const refresh = () => {
    tableState.resetToFirstPage();
  };

  return (
    <>
      <div className="w-100 d-flex flex-column h-100">
        <div className="d-flex flex-grow-1 w-100 min-h-0 overflow-y-hidden h-100">
          <div className="flex flex-col gap-2 w-100">
            <Card
              width="100%"
              flexBasis="100%"
              height="98%"
              shadow="md"
              style={{ border: "1px solid rgba(128, 128, 128, 0.601)" }}>
              <CardBody width="inherit" height="100%">
                <div className="row ">
                  <OmniTable
                    title="DA Master Table"
                    columns={columns}
                    state={tableState}
                    canSearch
                    // canExport
                  >
                    <div>
                      <Button
                        style={{ backgroundColor: "#3870FF", color: "white" }}
                        _hover={{}}
                        className="btn-primary"
                        leftIcon={<PiPlusBold strokeWidth={10} size={14} />}
                        onClick={handleAddNewClick}>
                        Add New DA Rate
                      </Button>
                    </div>
                  </OmniTable>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      <Modal
        size="3xl"
        closeOnEsc={false}
        closeOnOverlayClick={false}
        isOpen={payMatrixLevelDisc.isOpen}
        onClose={payMatrixLevelDisc.onClose}
        scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader style={{ backgroundColor: "#f9f9f9", color: "#3870FF" }}>
            {selectedPayMatrixMaster
              ? "Update Pay Marix Level Master Form"
              : "Marix Level DA Master Form"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="p-0" overflow={"hidden"}>
            <MatrixLevelMasterForm
              close={payMatrixLevelDisc.onClose}
              refresh={refresh}
              payMatrixMasterData={selectedPayMatrixMaster}
              showStatusField={showStatusField}
              isEditMode={!!selectedPayMatrixMaster}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MatrixLevelMaster;
