const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createSearch,
  getLeads,
  getStats,
  updateLeadStatus,
  bulkUpdateStatus,
  deleteLead,
  exportCsv,
  exportExcel,
  getSearchHistory,
} = require('../controllers/leadController');

router.use(protect);

router.post('/search', createSearch);
router.get('/', getLeads);
router.get('/stats', getStats);
router.get('/searches', getSearchHistory);
router.get('/export/csv', exportCsv);
router.get('/export/excel', exportExcel);
router.put('/bulk-status', bulkUpdateStatus);
router.put('/:id/status', updateLeadStatus);
router.delete('/:id', deleteLead);

module.exports = router;
