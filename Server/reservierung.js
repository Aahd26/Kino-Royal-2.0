import mongoose from 'mongoose';

const ReservierungSchema = new mongoose.Schema({
  kundenName: { type: String, required: true },
  vorstellung: { type: mongoose.Schema.Types.ObjectId, ref: 'Vorstellung', required: true },
  kinosaal: { type: mongoose.Schema.Types.ObjectId, ref: 'Kinosaal', required: true },
  sitze: [
    {
      reihe: { type: Number, required: true },
      platz: { type: Number, required: true }
    }
  ],
  qrCode: { type: String },
  erstelltAm: { type: Date, default: Date.now }
});

export default mongoose.model('Reservierung', ReservierungSchema);
