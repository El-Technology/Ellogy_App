import { Box, Stack, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";

export const UserStories = () => {
  const { watch, getValues } = useFormContext();
  const { t } = useTranslation(["common", "inputs", "createTicket"]);

  return (
    <>
      <Stack
        sx={{
          mb: "15px",
          height: "inherit",
          width: "100%",
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
          {t("createTicket:summary")}
        </Typography>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexGrow: 1,
            height: "inherit",
            justifyContent: "space-between",
            flexDirection: {
              xs: "column",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", tablet: "row" },
              justifyContent: { xs: "center", tablet: "space-between" },
              alignItems: { xs: "center", sm: "flex-start" },
              columnGap: { sm: "25px", md: "50px" },
              width: "100%",
            }}
          >
            <Box sx={{ width: { xs: "100%", tablet: "48%" } }}>
              <TextField
                multiline
                value={getValues("summary")}
                dir={
                  watch("summary") &&
                  watch("summary").match("[\u0600-\u06FF\u0750-\u077F]") //rtl
                    ? "rtl"
                    : "ltr"
                }
                inputProps={{
                  sx: {
                    "& > textarea": {
                      height: "100%",
                    },
                    shrink: true,
                  },
                  readOnly: true,
                }}
                sx={{
                  height: {
                    xs: "250px",
                    sm: "350px",
                    tablet: "450px",
                    md: "500px",
                    xl: "50vh",
                  },
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
            </Box>
          </Box>
        </Box>
      </Stack>
    </>
  );
};
