import { model, models, Schema } from "mongoose";

const enquirySchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
  goal: { type: String, required: true, trim: true, maxlength: 120 },
  message: { type: String, trim: true, maxlength: 500, default: "" },
}, { timestamps: true });

export default models.Enquiry || model("Enquiry", enquirySchema);
