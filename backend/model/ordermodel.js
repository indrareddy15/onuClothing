import mongoose from 'mongoose'

const ordersSchema = new mongoose.Schema({
    order_id: { type: String },
    shipment_id: { type: String },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    orderItems: [{
        type: Object,
        required: true,
    }],
    razorpay_order_id: { type: String },
    picketUpLoactionWareHouseName: { type: Object, default: null },
    paymentId: { type: String },
    TotalAmount: { type: Number, required: true },
    address: { type: Object, required: true },
    ConveenianceFees: { type: Number, default: 0 },
    channel_id: { type: Number, default: 6217390 },
    paymentMode: { type: String, default: "prepaid", required: true },
    status: { type: String, default: "Processing", required: true },
    current_status: { type: String, default: "Processing" },
    current_timestamp: { type: String, },
    courier_name: { type: String, default: "" },
    scans: [{ type: Object, default: [] }],
    etd: { type: String, default: '' },
    shipment_status: { type: Number, default: 0 },
    manifest: Object,
    awb_code: Number,
    ShipmentCreatedResponseData: { type: Object, default: null },
    BestCourior: { type: Object, default: null },
    PicketUpData: { type: Object, default: null },
    IsReturning: { type: Boolean, default: false },
    IsInExcnage: { type: Boolean, default: false },
    IsCancelled: { type: Boolean, default: false },
    RefundData: { type: Object, default: null },
    trackingUrl: { type: String, default: '' },
    ReturningData: { type: Object },
    RefundData: Object,
    tracking_Activity: [{ type: mongoose.Schema.Types.Mixed }],
    orderError: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true })

const OrderModel = mongoose.model('order', ordersSchema)

export default OrderModel