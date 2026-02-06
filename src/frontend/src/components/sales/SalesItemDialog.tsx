import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAddSalesItem, useUpdateSalesItem } from '../../hooks/useQueries';
import type { SalesItem } from '../../backend';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle } from 'lucide-react';

interface SalesItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  item?: SalesItem;
}

export default function SalesItemDialog({ open, onOpenChange, mode, item }: SalesItemDialogProps) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('lead');
  const [amount, setAmount] = useState('');
  const [validationError, setValidationError] = useState('');

  const addMutation = useAddSalesItem();
  const updateMutation = useUpdateSalesItem();

  useEffect(() => {
    if (mode === 'edit' && item) {
      setName(item.name);
      setStatus(item.status);
      setAmount(item.amount.toString());
    } else {
      setName('');
      setStatus('lead');
      setAmount('');
    }
    setValidationError('');
  }, [mode, item, open]);

  const validate = () => {
    if (!name.trim()) {
      setValidationError('Name is required');
      return false;
    }
    if (!amount.trim()) {
      setValidationError('Amount is required');
      return false;
    }
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) {
      setValidationError('Amount must be a valid number');
      return false;
    }
    if (amountNum < 0) {
      setValidationError('Amount cannot be negative');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!validate()) {
      return;
    }

    try {
      if (mode === 'create') {
        await addMutation.mutateAsync({
          name: name.trim(),
          status,
          amount: parseFloat(amount),
        });
      } else if (mode === 'edit' && item) {
        await updateMutation.mutateAsync({
          ...item,
          name: name.trim(),
          status,
          amount: parseFloat(amount),
        });
      }
      onOpenChange(false);
    } catch (error: any) {
      setValidationError(error.message || 'Failed to save sales item');
    }
  };

  const mutation = mode === 'create' ? addMutation : updateMutation;
  const isLoading = mutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add Sales Item' : 'Edit Sales Item'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Add a new sales item to track revenue and generate reports'
              : 'Update the details of this sales item'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {validationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Enterprise Deal"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus} disabled={isLoading}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
                <SelectItem value="closed-won">Closed Won</SelectItem>
                <SelectItem value="closed-lost">Closed Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              disabled={isLoading}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : mode === 'create' ? 'Add Item' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
