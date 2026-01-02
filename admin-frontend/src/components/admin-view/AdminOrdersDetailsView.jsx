/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { SheetContent, SheetHeader, SheetTitle, SheetFooter } from "../ui/sheet";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  adminCreateOrderReturns,
  adminCreateRefundRequest,
  adminGetAllOrders,
  adminRequestTryCreateManifest,
  adminRequestTryPickUp,
  adminSendOrderCancel,
  adminUpdateUsersOrdersById,
  adminGetUsersOrdersById,
} from "@/store/admin/order-slice";
import {
  capitalizeFirstLetterOfEachWord,
  getStatusDescription,
} from "@/config";
import { useSettingsContext } from "@/Context/SettingsContext";
import { Button } from "../ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Truck,
  Package,
  CreditCard,
  MapPin,
  Clock,
  Map,
  Info,
  RotateCcw,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle as CardTitleComponent,
} from "@/components/ui/card";

const initialFormData = {
  status: "",
};

const AdminOrdersDetailsView = ({ order: initialOrder }) => {
  const { checkAndCreateToast } = useSettingsContext();
  const [formData, setFormData] = useState(initialFormData);
  const dispatch = useDispatch();
  const { orderDetails } = useSelector((state) => state.adminOrder);

  // Use orderDetails from Redux if available and matches the ID, otherwise fallback to prop
  const order = orderDetails && orderDetails._id === initialOrder?._id ? orderDetails : initialOrder;

  const handleStatusChange = (value) => {
    setFormData({ ...formData, status: value });
  };

  const handleSubmitStatus = async () => {
    if (!formData.status) return;
    const { status } = formData;
    const data = await dispatch(
      adminUpdateUsersOrdersById({ orderId: order?._id, status })
    );
    if (data?.payload?.Success) {
      checkAndCreateToast(
        "success",
        "Order Status Updated Successfully: " + data?.payload?.message
      );
      setFormData(initialFormData);
      dispatch(adminGetAllOrders());
      handleFetchOrderDetails(order?._id);
    }
  };

  const handleFetchOrderDetails = async (orderId) => {
    await dispatch(adminGetUsersOrdersById(orderId));
  };

  const handleInitiateRefund = async (e) => {
    e.preventDefault();
    const response = await dispatch(
      adminCreateRefundRequest({ orderId: order._id })
    );
    if (response) {
      checkAndCreateToast("success", "Refund Request Initiated Successfully");
      dispatch(adminGetAllOrders());
    } else {
      checkAndCreateToast("error", "Failed to initiate refund request");
    }
    handleFetchOrderDetails(order?._id);
  };

  const handlePickupResponse = async () => {
    const response = await dispatch(
      adminRequestTryPickUp({
        orderId: order._id,
        BestCourior: order?.BestCourior,
        ShipmentCreatedResponseData: order?.ShipmentCreatedResponseData,
      })
    );
    if (response.payload?.error) {
      checkAndCreateToast("error", response.payload?.error);
    } else {
      checkAndCreateToast("success", "Successfully created response");
    }
    handleFetchOrderDetails(order?._id);
  };

  const createCancelOrder = async (e) => {
    e.preventDefault();
    if (!order?.IsCancelled) {
      const response = await dispatch(
        adminSendOrderCancel({ orderId: order?._id })
      );
      if (response) {
        if (order?.IsCancelled) {
          checkAndCreateToast("success", "Order Cancelled Successfully");
        } else {
          checkAndCreateToast("success", "Order Refunded Successfully");
        }
      } else {
        checkAndCreateToast("error", "Failed to Cancel Order");
      }
    }
    handleFetchOrderDetails(order?._id);
  };

  const handleCreateManifest = async () => {
    const response = await dispatch(
      adminRequestTryCreateManifest({ orderId: order._id })
    );
    if (response.payload?.error) {
      checkAndCreateToast("error", response.payload?.error);
    } else {
      checkAndCreateToast("success", "Successfully created manifest");
    }
    handleFetchOrderDetails(order?._id);
  };

  const createOrderReturnFromUser = async () => {
    const response = await dispatch(
      adminCreateOrderReturns({ orderId: order?._id, userId: order?.userId })
    );
    if (response) {
      if (order?.IsReturning) {
        checkAndCreateToast("success", "Order Cancelled Successfully");
      } else {
        checkAndCreateToast("success", "Order Refunded Successfully");
      }
    } else {
      checkAndCreateToast("error", "Failed to Cancel Order");
    }
    handleFetchOrderDetails(order?._id);
  };

  return (
    <SheetContent side="right" className="w-full sm:w-full md:w-[85vw] lg:w-[70vw] max-w-none overflow-y-auto bg-gray-50 flex flex-col p-0">
      <SheetHeader className="px-4 sm:px-6 pt-6 pb-4 border-b bg-white sticky top-0 z-10">
        <SheetTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xl font-bold">
          <div className="flex items-center gap-3">
            <span className="text-base sm:text-xl">Order #{order?.order_id}</span>
            <Badge className={getStatusColorClass(order?.status)}>
              {order?.status}
            </Badge>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 pr-14">
            {order?.trackingUrl && (
              <a
                href={order?.trackingUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
              >
                Track Shipment <Map className="w-4 h-4" />
              </a>
            )}
            <span className="text-xs sm:text-sm font-normal text-gray-500">
              {new Date(order?.createdAt).toLocaleString()}
            </span>
          </div>
        </SheetTitle>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column: Status, Details, Items, Logistics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Update Card */}
            {/* <Card>
              <CardHeader className="pb-3">
                <CardTitleComponent className="text-base font-semibold">
                  Update Status
                </CardTitleComponent>
              </CardHeader>
              <CardContent className="flex items-end gap-4">
                <div className="flex-1 space-y-2">
                  <Label>Order Status</Label>
                  <Select
                    onValueChange={handleStatusChange}
                    value={formData.status}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select New Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Confirmed",
                        "Processing",
                        "Shipped",
                        "Delivered",
                        "Canceled",
                        "RTS",
                        "OFD",
                      ].map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSubmitStatus} disabled={!formData.status}>
                  Update Status
                </Button>
              </CardContent>
            </Card> */}

            {/* Detailed Order Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitleComponent className="text-base font-semibold flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Order Details
                </CardTitleComponent>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <OrderDetailItem label="Database ID" value={order?._id} />
                <OrderDetailItem label="Channel ID" value={order?.channel_id} />
                <OrderDetailItem
                  label="Convenience Fees"
                  value={order?.ConveenianceFees}
                />
                <OrderDetailItem label="Shipment ID" value={order?.shipment_id} />
                <OrderDetailItem
                  label="Current Status"
                  value={
                    <Badge variant="secondary">
                      {order?.current_status || "-"}
                    </Badge>
                  }
                />
                <OrderDetailItem
                  label="ETD"
                  value={
                    order?.etd ? new Date(order?.etd).toDateString() : "-"
                  }
                />
                <OrderDetailItem
                  label="Shipment Status"
                  value={
                    <Badge variant="outline">
                      {getStatusDescription(order?.shipment_status)}
                    </Badge>
                  }
                />
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitleComponent className="text-base font-semibold flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Order Items
                </CardTitleComponent>
              </CardHeader>
              <CardContent className="space-y-4">
                {order?.orderItems?.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    {item?.productId?.image && (
                      <img
                        src={item?.productId?.image}
                        alt={item?.productId?.title}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {item?.productId?.title}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                        <span>
                          Size:{" "}
                          <span className="font-medium text-gray-700">
                            {item?.size}
                          </span>
                        </span>
                        <span>
                          Color:{" "}
                          <span className="font-medium text-gray-700">
                            {item?.color?.name}
                          </span>
                        </span>
                        <span>
                          SKU:{" "}
                          <span className="font-medium text-gray-700">
                            {item?.color?.sku}
                          </span>
                        </span>
                        <span>
                          Qty:{" "}
                          <span className="font-medium text-gray-700">
                            {item?.quantity}
                          </span>
                        </span>
                        <span>
                          HSN:{" "}
                          <span className="font-medium text-gray-700">
                            {item?.productId?.hsn}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ₹ {item?.productId?.salePrice || item?.productId?.price}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Logistics Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitleComponent className="text-base font-semibold flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Logistics & Actions
                </CardTitleComponent>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      order?.PicketUpData && order?.status === "Delivered"
                    }
                    onClick={handlePickupResponse}
                  >
                    {order?.PicketUpData
                      ? "Pickup Response Sent"
                      : "Send Pickup Response"}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={order?.manifest}
                    onClick={handleCreateManifest}
                  >
                    {order?.manifest ? "Manifest Generated" : "Create Manifest"}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={createOrderReturnFromUser}
                  >
                    {order?.IsReturning ? "Return Generated" : "Try Return Order"}
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={order?.IsCancelled}
                    onClick={createCancelOrder}
                  >
                    {order?.IsCancelled ? "Order Canceled" : "Cancel Order"}
                  </Button>

                  {order?.paymentMode === "prepaid" && (
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={order?.IsCancelled && order?.RefundData}
                      onClick={handleInitiateRefund}
                    >
                      {!order?.IsCancelled && !order?.RefundData
                        ? "Initiate Refund"
                        : "Refund Initiated"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tracking Activity */}
            {order?.tracking_Activity && order?.tracking_Activity.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitleComponent className="text-base font-semibold">
                    Tracking Activity
                  </CardTitleComponent>
                </CardHeader>
                <CardContent>
                  <DeliveryTrackingActivity
                    TrackingActivity={order?.tracking_Activity}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Customer, Payment, Summary, Logistics Details, Returns */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitleComponent className="text-base font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Shipping Address
                </CardTitleComponent>
              </CardHeader>
              <CardContent className="text-sm space-y-1.5">
                {order?.address &&
                  Object.keys(order.address).map((key, index) => (
                    <div key={index} className="flex items-baseline gap-2">
                      <span className="font-medium text-gray-700 text-sm">
                        {capitalizeFirstLetterOfEachWord(key)}:
                      </span>
                      <span className="text-gray-900">
                        {order.address[key] || "-"}
                      </span>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitleComponent className="text-base font-semibold flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Payment Information
                </CardTitleComponent>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Method</span>
                  <Badge variant="outline" className="capitalize">
                    {order?.paymentMode}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment ID</span>
                  <span className="font-mono text-xs">
                    {order?.paymentId || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Razorpay Order ID</span>
                  <span className="font-mono text-xs">
                    {order?.razorpay_order_id || "N/A"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitleComponent className="text-base font-semibold">
                  Order Summary
                </CardTitleComponent>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>₹ {order?.TotalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>₹ {order?.TotalAmount}</span>
                </div>
              </CardContent>
            </Card>

            {/* Logistics Details (Manifest, Pickup) */}
            {(order?.manifest || order?.PicketUpData) && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitleComponent className="text-base font-semibold">
                    Logistics Details
                  </CardTitleComponent>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {order?.manifest && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Manifest</span>
                      <a
                        href={order?.manifest?.invoice_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        Download Invoice
                      </a>
                    </div>
                  )}
                  {order?.PicketUpData && (
                    <div className="space-y-2 pt-2 border-t">
                      <p className="font-medium text-xs text-gray-500 uppercase">
                        Pickup Info
                      </p>
                      <div className="grid grid-cols-1 gap-1">
                        <div className="flex justify-between">
                          <span className="text-gray-500">AWB</span>
                          <span className="font-mono">
                            {order?.PicketUpData?.awbCode}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Status</span>
                          <span>
                            {order?.PicketUpData?.picketUpResponseData?.data ||
                              "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Scheduled</span>
                          <span className="text-xs text-right">
                            {order?.PicketUpData?.picketUpResponseData
                              ?.pickup_scheduled_date
                              ? new Date(
                                order.PicketUpData.picketUpResponseData.pickup_scheduled_date
                              ).toLocaleString()
                              : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Generated</span>
                          <span className="text-xs text-right">
                            {order?.PicketUpData?.picketUpResponseData
                              ?.pickup_generated_date?.date
                              ? new Date(
                                order.PicketUpData.picketUpResponseData.pickup_generated_date.date
                              ).toLocaleString()
                              : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Token</span>
                          <span className="font-mono">
                            {
                              order?.PicketUpData?.picketUpResponseData
                                ?.pickup_token_number
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Return Info */}
            {order?.ReturningData && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitleComponent className="text-base font-semibold flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Return Info
                  </CardTitleComponent>
                </CardHeader>
                <CardContent className="text-sm space-y-1.5">
                  {Object.keys(order.ReturningData).map((key, index) => (
                    <div key={index} className="flex items-baseline gap-2">
                      <span className="font-medium text-gray-700 text-sm">
                        {capitalizeFirstLetterOfEachWord(key)}:
                      </span>
                      <span className="text-gray-900">
                        {order.ReturningData[key] || "-"}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <SheetFooter className="px-4 sm:px-6 py-4 border-t bg-white sticky bottom-0 z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-2 sm:gap-0">
          <div className="text-xs sm:text-sm text-gray-500">
            Order placed on {new Date(order?.createdAt).toLocaleDateString()}
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-xs">
              Items: {order?.orderItems?.length || 0}
            </Badge>
            <Badge variant="secondary" className="text-xs font-semibold">
              Total: ₹{order?.TotalAmount}
            </Badge>
          </div>
        </div>
      </SheetFooter>
    </SheetContent>
  );
};

const OrderDetailItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-xs font-medium text-gray-500 uppercase">{label}</span>
    <div className="text-gray-900 font-medium">{value || "-"}</div>
  </div>
);

const getStatusColorClass = (status) => {
  const colors = {
    Confirmed: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    Processing: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    Shipped: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    Delivered: "bg-green-100 text-green-800 hover:bg-green-200",
    Canceled: "bg-red-100 text-red-800 hover:bg-red-200",
  };
  return colors[status] || "bg-gray-100 text-gray-800 hover:bg-gray-200";
};

const DeliveryTrackingActivity = ({ TrackingActivity }) => {
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const scroll = (direction) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: direction * 300, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group">
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-md"
        onClick={() => scroll(-1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div
        ref={sliderRef}
        className="flex gap-4 overflow-x-auto pb-4 pt-2 scrollbar-hide cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {TrackingActivity.map((detail, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[280px] p-4 bg-white border rounded-lg shadow-sm space-y-3"
          >
            <div className="flex justify-between items-start">
              <span className="font-medium text-sm text-gray-900 line-clamp-2">
                {detail?.activity}
              </span>
              <Badge variant="secondary" className="text-[10px] shrink-0">
                {Number.isInteger(Number(detail?.status))
                  ? getStatusDescription(detail?.status)
                  : detail?.status}
              </Badge>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {detail?.date ? new Date(detail?.date).toLocaleString() : "N/A"}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {detail?.location}
              </div>
            </div>

            <div className="pt-2 border-t space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">SR Status:</span>
                <span className="font-medium">
                  {getStatusDescription(detail["sr-status"])}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Label:</span>
                <span className="font-medium">
                  {detail["sr-sr-status-label"]}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Coords:</span>
                <span className="font-mono text-[10px]">
                  {detail?.latitude}, {detail?.longitude}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-md"
        onClick={() => scroll(1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default AdminOrdersDetailsView;
