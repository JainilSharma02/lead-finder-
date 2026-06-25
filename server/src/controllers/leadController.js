const Lead = require('../models/Lead');
const Search = require('../models/Search');
const { searchLeads } = require('../services/leadProvider');
const { Parser: CsvParser } = require('json2csv');
const ExcelJS = require('exceljs');

// POST /api/leads/search  { keyword, location }
const createSearch = async (req, res, next) => {
  try {
    const { keyword, location, platform } = req.body;
    
    if (!keyword?.trim() || !location?.trim()) {
      return res.status(400).json({ success: false, message: 'Both keyword and location are required' });
    }

    const { results, provider } = await searchLeads({ 
      keyword: keyword.trim(), 
      location: location.trim(),
      providerOverride: platform 
    });

    const search = await Search.create({
      user: req.user._id,
      keyword: keyword.trim(),
      location: location.trim(),
      resultCount: results.length,
      provider,
    });

    const leadDocs = results.map((r) => ({
      user: req.user._id,
      searchId: search._id,
      ...r,
    }));

    const inserted = leadDocs.length ? await Lead.insertMany(leadDocs) : [];

    res.status(201).json({
      success: true,
      search: { id: search._id, keyword: search.keyword, location: search.location, provider },
      leads: inserted,
      count: inserted.length,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/leads  ?status=&search=&searchId=&page=&limit=
const getLeads = async (req, res, next) => {
  try {
    const { status, search, searchId, page = 1, limit = 50 } = req.query;

    const filter = { user: req.user._id };
    if (status && ['new', 'contacted', 'ignored'].includes(status)) {
      filter.status = status;
    }
    if (searchId) {
      filter.searchId = searchId;
    }
    if (search) {
      const re = new RegExp(search.trim(), 'i');
      filter.$or = [{ businessName: re }, { address: re }, { phone: re }, { category: re }];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(200, Math.max(1, parseInt(limit, 10) || 50));

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Lead.countDocuments(filter),
    ]);

    res.json({
      success: true,
      leads,
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/leads/stats
const getStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const [total, contacted, ignored] = await Promise.all([
      Lead.countDocuments({ user: userId }),
      Lead.countDocuments({ user: userId, status: 'contacted' }),
      Lead.countDocuments({ user: userId, status: 'ignored' }),
    ]);

    res.json({
      success: true,
      stats: {
        total,
        contacted,
        remaining: total - contacted - ignored,
        ignored,
      },
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/leads/:id/status  { status }
const updateLeadStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['new', 'contacted', 'ignored'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const lead = await Lead.findOne({ _id: req.params.id, user: req.user._id });
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    lead.status = status;
    lead.contactedAt = status === 'contacted' ? new Date() : lead.contactedAt;
    await lead.save();

    res.json({ success: true, lead });
  } catch (err) {
    next(err);
  }
};

// PUT /api/leads/bulk-status  { ids: [], status }
const bulkUpdateStatus = async (req, res, next) => {
  try {
    const { ids, status } = req.body;
    if (!Array.isArray(ids) || !ids.length) {
      return res.status(400).json({ success: false, message: 'ids must be a non-empty array' });
    }
    if (!['new', 'contacted', 'ignored'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const update = { status };
    if (status === 'contacted') update.contactedAt = new Date();

    const result = await Lead.updateMany({ _id: { $in: ids }, user: req.user._id }, update);

    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/leads/:id
const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, message: 'Lead deleted' });
  } catch (err) {
    next(err);
  }
};

const EXPORT_FIELDS = [
  { label: 'Business Name', value: 'businessName' },
  { label: 'Phone', value: 'phone' },
  { label: 'WhatsApp Number', value: 'whatsappNumber' },
  { label: 'Website', value: 'website' },
  { label: 'Address', value: 'address' },
  { label: 'Google Maps Link', value: 'mapsLink' },
  { label: 'Category', value: 'category' },
  { label: 'Rating', value: 'rating' },
  { label: 'Status', value: 'status' },
];

// GET /api/leads/export/csv  ?ids=id1,id2 (optional, exports all if omitted)
const exportCsv = async (req, res, next) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.ids) {
      filter._id = { $in: req.query.ids.split(',') };
    }
    const leads = await Lead.find(filter).lean();

    const parser = new CsvParser({ fields: EXPORT_FIELDS });
    const csv = parser.parse(leads);

    res.header('Content-Type', 'text/csv');
    res.attachment(`leads-export-${Date.now()}.csv`);
    res.send(csv);
  } catch (err) {
    next(err);
  }
};

// GET /api/leads/export/excel  ?ids=id1,id2
const exportExcel = async (req, res, next) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.ids) {
      filter._id = { $in: req.query.ids.split(',') };
    }
    const leads = await Lead.find(filter).lean();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Leads');

    sheet.columns = EXPORT_FIELDS.map((f) => ({ header: f.label, key: f.value, width: 24 }));
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };

    leads.forEach((lead) => sheet.addRow(lead));

    res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.attachment(`leads-export-${Date.now()}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    next(err);
  }
};

// GET /api/leads/searches  - search history
const getSearchHistory = async (req, res, next) => {
  try {
    const searches = await Search.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, searches });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createSearch,
  getLeads,
  getStats,
  updateLeadStatus,
  bulkUpdateStatus,
  deleteLead,
  exportCsv,
  exportExcel,
  getSearchHistory,
};
