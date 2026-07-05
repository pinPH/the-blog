import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Button, Text } from "../atoms";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  errorMessage?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
  "data-testid"?: string;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isConfirming,
  errorMessage,
  onConfirm,
  onCancel,
  "data-testid": dataTestId,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      fullWidth
      maxWidth="xs"
      data-testid={dataTestId}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {description && <Text secondary>{description}</Text>}
        {errorMessage && (
          <Text sx={{ color: "error.main", fontSize: "0.85rem", mt: 1 }}>
            {errorMessage}
          </Text>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          variant="text"
          onClick={onCancel}
          disabled={isConfirming}
          data-testid={dataTestId ? `${dataTestId}-cancel` : undefined}
        >
          {cancelLabel}
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          isLoading={isConfirming}
          sx={{
            backgroundColor: "error.main",
            "&:hover": { backgroundColor: "error.dark" },
          }}
          data-testid={dataTestId ? `${dataTestId}-confirm` : undefined}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
