const APIFeatures = require('../utils/apiFeatures');

exports.createOne = (Model) => async (req, res, next) => {
  try {
    // validation
    if (!req.body) {
      return res.status(404).json({
        status: 'error',
        message: 'Entered no/wrong data!',
      });
    }
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { doc },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      data: { message: err.message },
    });
  }
};

exports.getAll = (Model) => async (req, res, next) => {
  try {
    console.log(req.query);
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitField()
      .paginator()
      .populate();
    const doc = await features.query;

    if (doc.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Document not found!',
      });
    }

    res.status(200).json({
      status: 'success',
      total: doc.length,
      data: doc,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      data: { message: err.message },
    });
  }
};

exports.getDocById = (Model) => async (req, res, next) => {
  if (!req.params.id) {
    return res.status(404).json({
      status: 'error',
      message: 'Entered no/wrong url/id!',
    });
  }
  try {
    const docId = req.params.id;
    const doc = await Model.findById(docId);
    if (!doc) {
      return res.status(404).json({
        status: 'error',
        message: 'Document not found!',
      });
    }
    res.status(200).json({
      status: 'success',
      data: { data: doc },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

exports.updateDocById = (Model) => async (req, res, next) => {
  if (!req.params.id) {
    return res.status(404).json({
      status: 'error',
      message: 'Entered no/wrong url!',
    });
  }
  try {
    const docId = req.params.id;
    const doc = await Model.findByIdAndUpdate(docId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return res.status(404).json({
        status: 'error',
        message: 'Document not found',
      });
    }
    res.status(200).json({
      status: 'success',
      data: { doc },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

exports.deleteDocById = (Model) => async (req, res, next) => {
  if (!req.params.id) {
    return res.status(404).json({
      status: 'error',
      message: 'Entered no/wrong url!',
    });
  }
  try {
    const docId = req.params.id;
    const doc = await Model.findByIdAndRemove(docId);
    if (!doc) {
      return res.status(404).json({
        status: 'error',
        message: 'doc not found',
      });
    }
    res.status(200).json({
      status: 'success',
      message: 'Document was successfully removed',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};
