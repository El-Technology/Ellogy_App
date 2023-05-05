import { Box, Stack, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";

export const TicketForm = () => {
  const { register, watch } = useFormContext();
  const { t } = useTranslation(["common", "inputs", "createTicket"]);

  return (
    <>
      <Stack
        sx={{
          mb: "15px",
          width: { xs: "100%", md: "50%", },
          height: "100%",
        }}
      >
        <Typography
          className="rtl-able"
          sx={{
            mb: "26px",
            fontFamily: "Arvo",
            fontSize: "24px",
            fontWeight: 400,
            lineHeight: "30px",
          }}
        >
          {t("createTicket:welcome")}
        </Typography>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexGrow: 1,
            height: "100%",
            flexDirection: {
              xs: "column",
            },
          }}
        >
          <TextField
            className="rtl-able"
            {...register("title")}
            dir={
              watch("title") &&
              watch("title").match("[\u0600-\u06FF\u0750-\u077F]")
                ? "rtl"
                : "ltr"
            }
            sx={{
              width: "100%",
              mb: {
                xs: "15px",
                sm: "26px",
                md: "26px",
                xl: "26px",
              },
            }}
            placeholder={t("inputs:title") || ""}
          />
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: { xs: "column", tablet: "row" },
              justifyContent: { xs: "center", tablet: "space-between" },
              alignItems: { xs: "center", sm: "flex-start" },
              columnGap: { sm: "25px", md: "50px" },
              width: "100%",
            }}
          >
            <Box sx={{ width: { xs: "100%", tablet: "48%" }, height: "100%" }}>
              <TextField
                className="rtl-able"
                {...register("description")}
                multiline
                dir={
                  watch("description") &&
                  watch("description").match("[\u0600-\u06FF\u0750-\u077F]") //rtl
                    ? "rtl"
                    : "ltr"
                }
                placeholder={t("inputs:ticketDesc") || ""}
                inputProps={{
                  sx: {
                    "& > textarea": {
                      height: "100%",
                    },
                    shrink: true,
                  },
                }}
                sx={{
                  height: "100%",
                  width: "100%",
                  "& .MuiInputBase-root": {
                    height: "100%",
                    boxSizing: "content-box",
                    padding: "14px",
                    "& textarea": {
                      overflow: "unset !important",
                      height: "100% !important",
                    },
                  },
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "15px",
                }}
              ></Box>
            </Box>
          </Box>
        </Box>
      </Stack>
    </>
  );
};
