import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";
import { ArrowBack, FileDownload } from "@mui/icons-material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { tokenPayload } from "@/helper";
import { getApi } from "@/core/apis/api";
import { urls } from "@/core/Constant/urls";

const payload = tokenPayload();

const LedgerReportPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [ledgerData, setLedgerData] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get parameters from URL
  const modelType = searchParams.get("modelType");
  const modelId = searchParams.get("modelId");
  const entityName = searchParams.get("entityName");
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");

  useEffect(() => {
    const fetchLedgerData = async () => {
      if (!modelType || !modelId) {
        setError("Missing required parameters");
        setLoading(false);
        return;
      }

      try {
        const params = new URLSearchParams({
          companyId: payload._id,
          modelType,
          modelId,
        });

        if (fromDate) params.append("fromDate", fromDate);
        if (toDate) params.append("toDate", toDate);

        const res = await getApi(`${urls.AccountsReceivable.getAccountLedger}?${params}`);
        
        console.log('API Response:', res); // Debug log
        
        // Handle the new nested API response structure
        if (res.success && res.data) {
          // Check if data has nested structure (data.data)
          if (res.data.data && Array.isArray(res.data.data)) {
            setLedgerData(res.data.data);
            setSummary(res.data.summary || {});
          }
          // Check if data.data is the report array directly
          else if (Array.isArray(res.data)) {
            setLedgerData(res.data);
          }
          // Check if data has report property
          else if (res.data.report && Array.isArray(res.data.report)) {
            setLedgerData(res.data.report);
            setSummary(res.data.summary || {});
          }
          else {
            console.warn('Unexpected data structure:', res.data);
            setLedgerData([]);
          }
        } 
        // Fallback for direct array response
        else if (Array.isArray(res)) {
          setLedgerData(res);
        } 
        else {
          console.error('Unexpected API response format:', res);
          setError('Invalid response format from server');
          setLedgerData([]);
        }
      } catch (err) {
        console.error("Ledger fetch failed", err);
        setError("Failed to fetch ledger data");
      } finally {
        setLoading(false);
      }
    };

    fetchLedgerData();
  }, [modelType, modelId, fromDate, toDate]);

  const calculateTotals = () => {
    // Add safety check to ensure ledgerData is an array
    if (!Array.isArray(ledgerData)) {
      console.warn('ledgerData is not an array:', ledgerData);
      return { totalDebit: 0, totalCredit: 0, finalBalance: 0, hasPropertyVouchers: false };
    }

    // Check if we have Property vouchers that need recalculation
    const hasPropertyVouchers = ledgerData.some(row => row.referenceId?.propertyType);

    // If we have Property vouchers, always calculate manually
    // Otherwise, use API summary if available
    if (!hasPropertyVouchers && summary && Object.keys(summary).length > 0) {
      return {
        totalDebit: summary.totalDebits || 0,
        totalCredit: summary.totalCredits || 0,
        finalBalance: summary.closingBalance || 0,
        hasPropertyVouchers: false
      };
    }

    // Manual calculation for Property vouchers or as fallback
    let totalDebit = 0;
    let totalCredit = 0;
    let runningBalance = summary.openingBalance || 0;

    ledgerData.forEach(row => {
      // Handle Property vouchers - only apply correction to maintenance charges (debit entries)
      let debitAmount = row.debit;
      if (row.referenceId?.propertyType && row.debit && row.debit !== "" && row.debit !== null) {
        // Only correct debit amounts (maintenance charges), not credit amounts (payments)
        debitAmount = (row.referenceId.maintenanceAmount || 0) + (row.referenceId.surchargeAmount || 0);
      }
      
      const creditAmount = row.credit;
      
      if (debitAmount !== "" && debitAmount !== undefined && debitAmount !== null) {
        totalDebit += Number(debitAmount);
        runningBalance += Number(debitAmount);
      }
      if (creditAmount !== "" && creditAmount !== undefined && creditAmount !== null) {
        totalCredit += Number(creditAmount);
        runningBalance -= Number(creditAmount);
      }
    });

    return { 
      totalDebit, 
      totalCredit, 
      finalBalance: runningBalance,
      hasPropertyVouchers 
    };
  };

  const generatePDF = () => {
    if (!Array.isArray(ledgerData) || ledgerData.length === 0) {
      alert('No data available for PDF generation');
      return;
    }

    const doc = new jsPDF();
    const { totalDebit, totalCredit, finalBalance, hasPropertyVouchers } = calculateTotals();

    // Company header
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Company Ledger Report", 105, 20, { align: "center" });
    
    // Report title
    doc.setFontSize(14);
    doc.text("Detailed Ledger Statement", 105, 35, { align: "center" });

    // Account details
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Account: ${entityName || "N/A"}`, 20, 50);
    doc.text(`Criteria: ${modelType || "N/A"}`, 20, 58);
    
    const dateRange = fromDate && toDate 
      ? `From ${new Date(fromDate).toLocaleDateString()} To ${new Date(toDate).toLocaleDateString()}`
      : "All Dates";
    doc.text(`Date: ${dateRange}`, 20, 66);

    // Opening balance info
    if (summary.openingBalance !== undefined) {
      doc.text(`Opening Balance: ${Number(summary.openingBalance || 0).toFixed(2)}`, 20, 80);
    }

    // Calculate running balances for display when we have Property vouchers
    const calculateRunningBalances = () => {
      if (!hasPropertyVouchers) return ledgerData;
      
      let runningBalance = summary.openingBalance || 0;
      return ledgerData.map(row => {
        let debitAmount = row.debit;
        if (row.referenceId?.propertyType && row.debit && row.debit !== "" && row.debit !== null) {
          // Only correct debit amounts (maintenance charges), not credit amounts (payments)
          debitAmount = (row.referenceId.maintenanceAmount || 0) + (row.referenceId.surchargeAmount || 0);
        }
        
        const creditAmount = row.credit;
        
        if (debitAmount !== "" && debitAmount !== undefined && debitAmount !== null) {
          runningBalance += Number(debitAmount);
        }
        if (creditAmount !== "" && creditAmount !== undefined && creditAmount !== null) {
          runningBalance -= Number(creditAmount);
        }
        
        return {
          ...row,
          calculatedBalance: runningBalance
        };
      });
    };

    const displayData = calculateRunningBalances();

    // Prepare table data
    const tableData = displayData.map(row => {
      // For Property maintenance charges (debit entries), use referenceId amounts
      let debitAmount = row.debit;
      if (row.referenceId?.propertyType && row.debit && row.debit !== "" && row.debit !== null) {
        debitAmount = (row.referenceId.maintenanceAmount || 0) + (row.referenceId.surchargeAmount || 0);
      }
      
      const balanceToShow = hasPropertyVouchers ? row.calculatedBalance : row.balance;
      
      return [
        row.particulars === "Opening Balance" ? "Opening Balance" : new Date(row.date).toLocaleDateString(),
        row.voucherNo || "-",
        row.particulars || "-",
        (debitAmount !== "" && debitAmount != null) ? Number(debitAmount).toFixed(2) : "-",
        (row.credit !== "" && row.credit != null) ? Number(row.credit).toFixed(2) : "-",
        Number(balanceToShow || 0).toFixed(2),
      ];
    });

    // Add total row
    tableData.push([
      "Total:",
      "",
      "",
      totalDebit.toFixed(2),
      totalCredit.toFixed(2),
      finalBalance.toFixed(2),
    ]);

    // Use autoTable function
    autoTable(doc, {
      head: [["Date", "Document", "Description", "Debit", "Credit", "Balance"]],
      body: tableData,
      startY: summary.openingBalance !== undefined ? 90 : 80,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 25 }, // Date
        1: { cellWidth: 30 }, // Document
        2: { cellWidth: 50 }, // Description
        3: { cellWidth: 25, halign: "right" }, // Debit
        4: { cellWidth: 25, halign: "right" }, // Credit
        5: { cellWidth: 25, halign: "right" }, // Balance
      },
      didParseCell: function (data) {
        // Make total row bold
        if (data.row.index === tableData.length - 1) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [240, 240, 240];
        }
      },
    });

    // Add page number
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(8);
    doc.text(`Page 1 of ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: "center" });

    // Save the PDF
    const fileName = `${entityName || "Ledger"}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  const formatCurrency = (amount) => {
    if (amount === "" || amount == null || amount === undefined) return "-";
    return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 2});
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  // Safety check before calculating totals
  const { totalDebit, totalCredit, finalBalance, hasPropertyVouchers } = calculateTotals();

  // Calculate running balances for display when we have Property vouchers
  const calculateRunningBalances = () => {
    if (!hasPropertyVouchers) return ledgerData;
    
    let runningBalance = summary.openingBalance || 0;
    return ledgerData.map(row => {
      let debitAmount = row.debit;
      if (row.referenceId?.propertyType && row.debit && row.debit !== "" && row.debit !== null) {
        // Only correct debit amounts (maintenance charges), not credit amounts (payments)
        debitAmount = (row.referenceId.maintenanceAmount || 0) + (row.referenceId.surchargeAmount || 0);
      }
      
      const creditAmount = row.credit;
      
      if (debitAmount !== "" && debitAmount !== undefined && debitAmount !== null) {
        runningBalance += Number(debitAmount);
      }
      if (creditAmount !== "" && creditAmount !== undefined && creditAmount !== null) {
        runningBalance -= Number(creditAmount);
      }
      
      return {
        ...row,
        calculatedBalance: runningBalance
      };
    });
  };

  const displayData = calculateRunningBalances();

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          variant="outlined"
        >
          Back to Filter
        </Button>
        <Button
          startIcon={<FileDownload />}
          onClick={generatePDF}
          variant="contained"
          color="primary"
          disabled={!Array.isArray(ledgerData) || ledgerData.length === 0}
        >
          Export PDF
        </Button>
      </Box>

      {/* Report Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom align="center">
            Detailed Ledger Statement
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2"><strong>Account:</strong> {entityName || "N/A"}</Typography>
              <Typography variant="body2"><strong>Type:</strong> {modelType || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2">
                <strong>Date Range:</strong> {fromDate && toDate 
                  ? `${new Date(fromDate).toLocaleDateString()} - ${new Date(toDate).toLocaleDateString()}`
                  : "All Dates"
                }
              </Typography>
              <Typography variant="body2">
                <strong>Generated:</strong> {new Date().toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>

          {/* Enhanced Summary Information */}
          {summary && Object.keys(summary).length > 0 && (
            <Box mt={3}>
              <Typography variant="h6" gutterBottom>Summary</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center" p={2} bgcolor="blue.50" borderRadius={1}>
                    <Typography variant="h6" color="primary">
                      {formatCurrency(summary.openingBalance)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Opening Balance
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center" p={2} bgcolor="green.50" borderRadius={1}>
                    <Typography variant="h6" color="success.main">
                      {formatCurrency(hasPropertyVouchers ? totalDebit : summary.totalDebits)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Debits
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center" p={2} bgcolor="red.50" borderRadius={1}>
                    <Typography variant="h6" color="error.main">
                      {formatCurrency(hasPropertyVouchers ? totalCredit : summary.totalCredits)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Credits
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center" p={2} bgcolor="grey.50" borderRadius={1}>
                    <Typography variant="h6" color={finalBalance >= 0 ? "success.main" : "error.main"}>
                      {formatCurrency(finalBalance)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Closing Balance
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Ledger Table */}
      {Array.isArray(ledgerData) && ledgerData.length > 0 ? (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Document</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>Reference Details</strong></TableCell>
                <TableCell align="right"><strong>Debit</strong></TableCell>
                <TableCell align="right"><strong>Credit</strong></TableCell>
                <TableCell align="right"><strong>Balance</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayData.map((row, idx) => {
                return (
                  <TableRow 
                    key={idx} 
                    hover
                    sx={{
                      backgroundColor: row.particulars === "Opening Balance" ? "#e3f2fd" : "inherit"
                    }}
                  >
                    <TableCell>
                      {row.particulars === "Opening Balance"
                        ? "Opening Balance"
                        : new Date(row.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {row.voucherNo ? (
                        <Box
                          component="span"
                          sx={{
                            backgroundColor: row.voucherNo.startsWith('PUR') ? '#e8f5e8' : '#fff3e0',
                            color: row.voucherNo.startsWith('PUR') ? '#2e7d32' : '#f57c00',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 'medium'
                          }}
                        >
                          {row.voucherNo}
                        </Box>
                      ) : "-"}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={row.particulars === "Opening Balance" ? "bold" : "normal"}>
                        {row.particulars || "-"}
                      </Typography>
                      {row.details && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          {row.details}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {row.referenceId ? (
                        <Box>
                          {/* Property voucher details */}
                          {row.referenceId.propertyType && (
                            <>
                              <Typography variant="body2" fontWeight="medium">
                                Property: {row.referenceId.propertyType}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Maintenance Month: {row.referenceId.maintenanceMonth}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Due Date: {new Date(row.referenceId.dueDate).toLocaleDateString()}
                              </Typography>
                              <Typography variant="caption" color="primary" display="block">
                                Maintenance: {formatCurrency(row.referenceId.maintenanceAmount)}
                              </Typography>
                              {row.referenceId.surchargeAmount > 0 && (
                                <Typography variant="caption" color="warning.main" display="block">
                                  Surcharge: {formatCurrency(row.referenceId.surchargeAmount)}
                                </Typography>
                              )}
                            </>
                          )}
                          {/* Vendor/Product voucher details */}
                          {row.referenceId.productName && (
                            <>
                              <Typography variant="body2" fontWeight="medium">
                                {row.referenceId.productName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Vendor: {row.referenceId.vendorName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Qty: {row.referenceId.quantity} × {formatCurrency(row.referenceId.unitPerPrice)}
                              </Typography>
                              {row.referenceId.billNumber && (
                                <Typography variant="caption" color="primary" display="block">
                                  Bill: {row.referenceId.billNumber}
                                </Typography>
                              )}
                            </>
                          )}
                        </Box>
                      ) : "-"}
                    </TableCell>
                    <TableCell align="right">
                      <Typography 
                        variant="body2" 
                        color={row.debit ? "success.main" : "text.disabled"}
                        fontWeight={row.debit ? "medium" : "normal"}
                      >
                        {/* For Property maintenance charges (debit entries), show maintenance amount + surcharge */}
                        {row.referenceId?.propertyType && row.debit && row.debit !== "" && row.debit !== null ? 
                          formatCurrency((row.referenceId.maintenanceAmount || 0) + (row.referenceId.surchargeAmount || 0)) :
                          formatCurrency(row.debit)
                        }
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography 
                        variant="body2" 
                        color={row.credit ? "error.main" : "text.disabled"}
                        fontWeight={row.credit ? "medium" : "normal"}
                      >
                        {formatCurrency(row.credit)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography 
                        variant="body2" 
                        color={(hasPropertyVouchers ? row.calculatedBalance : row.balance) >= 0 ? "success.main" : "error.main"}
                        fontWeight="medium"
                      >
                        {formatCurrency(hasPropertyVouchers ? row.calculatedBalance : row.balance)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
              {/* Total Row */}
              <TableRow sx={{ backgroundColor: "#f0f0f0", fontWeight: "bold" }}>
                <TableCell colSpan={4}><strong>Total:</strong></TableCell>
                <TableCell align="right">
                  <strong>{formatCurrency(totalDebit)}</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>{formatCurrency(totalCredit)}</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>{formatCurrency(finalBalance)}</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Alert severity="info">No ledger data found for the selected criteria.</Alert>
      )}
    </Box>
  );
};

export default LedgerReportPage;