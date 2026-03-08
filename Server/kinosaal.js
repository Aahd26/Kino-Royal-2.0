import mongoose from 'mongoose';

const KinosaalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sitzreihen: { type: Number, required: true },
  sitzeProReihe: { type: Number, required: true }
});

export default mongoose.model('Kinosaal', KinosaalSchema);
