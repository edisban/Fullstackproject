/**
 * Loading skeleton component displayed during data fetching.
 * Provides visual placeholder matching dashboard/tasks page layout.
 */
import React, { memo } from "react";
import { Box, Skeleton as MuiSkeleton, Paper, Stack } from "@mui/material";

const Skeleton: React.FC = memo(() => {
  return (
    <Box p={{ xs: 2, sm: 3, md: 4 }}>
      <MuiSkeleton variant="text" width={300} height={50} sx={{ mb: 3 }} />
      
      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <MuiSkeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
        <Stack direction="row" spacing={2}>
          <MuiSkeleton variant="rectangular" width={100} height={36} />
          <MuiSkeleton variant="rectangular" width={100} height={36} />
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={2}>
          <MuiSkeleton variant="rectangular" height={80} />
          <MuiSkeleton variant="rectangular" height={80} />
          <MuiSkeleton variant="rectangular" height={80} />
          <MuiSkeleton variant="rectangular" height={80} />
          <MuiSkeleton variant="rectangular" height={80} />
          <MuiSkeleton variant="rectangular" height={80} />
        </Stack>
      </Paper>
    </Box>
  );
});

Skeleton.displayName = "Skeleton";

export default Skeleton;
