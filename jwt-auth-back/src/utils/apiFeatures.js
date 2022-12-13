class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    let queryObject = { ...this.queryStr };
    const excludeFields = ['sort', 'limit', 'page', 'fields', 'pop'];
    excludeFields.forEach((el) => delete queryObject[el]);
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gt|lt|gte|lte)\b/, (match) => `$${match}`);
    queryObject = JSON.parse(queryStr);

    this.query = this.query.find(queryObject);

    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      let sortBy = this.queryStr.sort;
      sortBy = sortBy.replace(/,/g, ' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('createdAt');
    }

    return this;
  }

  limitField() {
    if (this.queryStr.fields) {
      let fieldsRequired = this.queryStr.fields;
      fieldsRequired = fieldsRequired.replace(/,/g, ' ');
      this.query = this.query.select(fieldsRequired);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginator() {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 40;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  populate() {
    if (this.queryStr.pop) {
      let toPopulate = this.queryStr.pop;
      toPopulate = toPopulate.replace(/,/g, ' ');
      this.query = this.query.populate(toPopulate);
    }

    return this;
  }
}

module.exports = APIFeatures;
