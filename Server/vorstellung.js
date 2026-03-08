import mongoose from 'mongoose';

const VorstellungSchema = new mongoose.Schema({
  filmName: { type: String, required: true },
  genre: { type: String, required: true },
  ageRating: { type: Number, required: true },
  duration: { type: Number, required: true },
  description: { type: String, required: true },
  startTime: { type: Date, required: true },
  kinosaal: { type: mongoose.Schema.Types.ObjectId, ref: 'Kinosaal', required: true }
});

export default mongoose.model('Vorstellung', VorstellungSchema);
