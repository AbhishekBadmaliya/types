import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetcher } from "@services/fetcher";
import { useUserStore } from "@stores/user-store";
import { generateUuid } from "@utils/token";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import scss from "./matrixLevelDAMaster.module.scss";
import { clsx } from "@utils/string";

const payMatrixSchema = z.object({
  payCommission: z.string().min(1, { message: "Required" }),
  daRateInPercentage: z.string().min(1, { message: "Required" }),
  effectiveDate: z.string().min(1, { message: "Required" }),
  formulaToCalculateDa: z.string().min(1, { message: "Required" }),
  status: z.string().optional(),
});

type PayMatrixSchema = z.infer<typeof payMatrixSchema>;

const PayMatrixLevelMasterForm = ({
  close,
  refresh,
  payMatrixMasterData,
  showStatusField,
  isEditMode,
}: any) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    clearErrors,
  } = useForm<PayMatrixSchema>({
    resolver: zodResolver(payMatrixSchema),
    mode: "onChange",
    defaultValues: {
      payCommission: isEditMode ? payMatrixMasterData?.pay_commission : "",
      daRateInPercentage: isEditMode ? payMatrixMasterData?.da_rate_in_percentage : "",
      effectiveDate: isEditMode ? payMatrixMasterData?.effective_date : "",
      formulaToCalculateDa: isEditMode
        ? payMatrixMasterData?.formula_to_calculate_da
        : "",
      status: payMatrixMasterData?.status || "",
    },
  });

  const onSubmit = async (data: any) => {
    console.log("dataaaaaaaaaaaaa", data);
    // const payload = payMatrixMasterData
    //   ? { id: payMatrixMasterData.id, status: data.status } // Only send status for update
    //   : { ...data }; // Send all data for new entry
    const payload = {
      ...data,
      id: payMatrixMasterData?.id,
    };
    console.log("payload", payload);
    try {
      const result = await fetcher(
        {
          path: payMatrixMasterData
            ? "/da-master/update-status"
            : "/da-master/save-da-component",
        },
        {
          json: payload,
        }
      );

      if (typeof result === "string") {
        toast.success(result);
        close();
        refresh();
      } else if (result?.error) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("An error occurred while saving the data.");
    }
    generateUuid();
  };

  useEffect(() => {
    generateUuid();
  }, []);

  useEffect(() => {
    if (payMatrixMasterData) {
      setValue("status", payMatrixMasterData.status);
      // Set other fields only if not in edit mode
      if (!isEditMode) {
        setValue("payCommission", payMatrixMasterData.pay_commission);
        setValue("daRateInPercentage", payMatrixMasterData.da_rate_in_percentage);
        setValue("effectiveDate", payMatrixMasterData.effective_date);
        setValue("formulaToCalculateDa", payMatrixMasterData.formula_to_calculate_da);
      }
    }
  }, [payMatrixMasterData, setValue, isEditMode]);
  return (
    <>
      <form
        className={clsx(scss.custom_form, "w-100")}
        noValidate
        onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4 form_control">
          {!isEditMode && (
            <>
              <div>
                <FormControl isRequired isInvalid={!!errors.payCommission}>
                  <FormLabel>Pay Commission</FormLabel>
                  <Input
                    placeholder="Enter Pay Commission"
                    {...register("payCommission")}
                  />
                  <FormErrorMessage>{errors.payCommission?.message}</FormErrorMessage>
                </FormControl>
              </div>

              <div>
                <FormControl isRequired isInvalid={!!errors.daRateInPercentage}>
                  <FormLabel>DA Rate in % Percentage</FormLabel>
                  <Input
                    placeholder="Enter DA Rate in % Percentage"
                    {...register("daRateInPercentage")}
                  />
                  <FormErrorMessage>
                    {errors.daRateInPercentage?.message}
                  </FormErrorMessage>
                </FormControl>
              </div>

              <div>
                <FormControl isRequired isInvalid={!!errors.effectiveDate}>
                  <FormLabel>Effective Date</FormLabel>
                  <Input
                    placeholder="Enter Effective Date"
                    {...register("effectiveDate")}
                  />
                  <FormErrorMessage>{errors.effectiveDate?.message}</FormErrorMessage>
                </FormControl>
              </div>

              <div>
                <FormControl isRequired isInvalid={!!errors.formulaToCalculateDa}>
                  <FormLabel>Formula to calculate DA</FormLabel>
                  <Input
                    placeholder="Enter Formula to calculate DA"
                    {...register("formulaToCalculateDa")}
                  />
                  <FormErrorMessage>
                    {errors.formulaToCalculateDa?.message}
                  </FormErrorMessage>
                </FormControl>
              </div>
            </>
          )}

          {showStatusField && ( // Conditionally render only the Status field
            <div>
              <FormControl isRequired isInvalid={!!errors.status}>
                <FormLabel>Status</FormLabel>
                <Select
                  placeholder="Select Status"
                  {...register("status")}
                  onChange={(e) => {
                    setValue("status", e.target.value);
                    clearErrors("status");
                  }}>
                  <option value="active">Active</option>
                  <option value="inactive">InActive</option>
                </Select>
                <FormErrorMessage>{errors.status?.message}</FormErrorMessage>
              </FormControl>
            </div>
          )}
        </div>

        <div className="col-span-2 flex justify-center items-center mt-2">
          <Button _hover={""} className={scss.form_btn} type="submit">
            {payMatrixMasterData ? "Update Pay Marix Level Master" : "submit"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default PayMatrixLevelMasterForm;
