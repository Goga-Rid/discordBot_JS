const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  roleId: {
    type: String,
    required: true,
  },
  roleName: {
    type: String,
    required: true,
  },
  requiredMessageCount: {
    type: Number,
    required: true,
  },
});

const RoleModel = mongoose.model('Role', roleSchema);

module.exports = RoleModel;
