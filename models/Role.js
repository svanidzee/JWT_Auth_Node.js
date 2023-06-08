import mongoose from 'mongoose';

const RoleChema = new mongoose.Schema({
  value: { type: String, unique: true, default: 'USER' },
});

export const Role = mongoose.model('Role', RoleChema);
