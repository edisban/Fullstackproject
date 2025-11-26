/**
 * Search bar component for filtering students by code or name.
 * Displays search results count and provides reset functionality.
 */
import React, { memo } from "react";
import { Paper, Stack, Box, Typography, TextField, Button } from "@mui/material";
import { UseFormReturn } from "react-hook-form";

interface StudentSearchBarProps {
  searchForm: UseFormReturn<{ query: string }>;
  onSearch: (data: { query: string }) => void;
  onReset: () => void;
  searchMessage?: string;
}

const StudentSearchBar = memo<StudentSearchBarProps>(
  ({ searchForm, onSearch, onReset, searchMessage }) => {
    return (
      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Stack
          component="form"
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", md: "flex-end" }}
          onSubmit={searchForm.handleSubmit(onSearch)}
        >
          <Box width="100%">
            <Typography variant="body2" color="text.secondary" mb={1} fontWeight={500}>
              🔍 Search (Student ID or Name)
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g. 123456789 or John"
              aria-label="Search students by ID or name"
              {...searchForm.register("query", {
                required: "Enter a search term",
              })}
              error={Boolean(searchForm.formState.errors.query)}
              helperText={searchForm.formState.errors.query?.message || ""}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: "1.05rem",
                  py: 0.5,
                },
              }}
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              minHeight: "48px",
            }}
          >
            Search
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            onClick={onReset}
            fullWidth
            size="large"
            sx={{
              textTransform: "none",
              minHeight: "48px",
            }}
          >
            Show all
          </Button>
        </Stack>
        {searchMessage && (
          <Typography variant="body2" color="text.secondary" mt={1}>
            {searchMessage}
          </Typography>
        )}
      </Paper>
    );
  }
);

StudentSearchBar.displayName = "StudentSearchBar";

export default StudentSearchBar;
