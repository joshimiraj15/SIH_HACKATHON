// src/components/views/OrdersView.jsx
import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  MapPin, 
  ShieldCheck, 
  DollarSign, 
  FileText,
  User,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';
import '../../styles/OrdersView.css';

const OrdersView = ({ currentUser, showToast }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  const role = currentUser?.role || 'farmer';

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.orders.getMyOrders();
      if (res?.data) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentUser]);

  const handleUpdateStatus = async (orderId, nextStatus, note) => {
    try {
      const res = await api.orders.updateStatus(orderId, nextStatus, note);
      if (res.success) {
        if (nextStatus === 'delivered' || nextStatus === 'completed') {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
          });
          if (showToast) showToast('🎉 Order delivered & Escrow funds released to farmer!');
        } else {
          if (showToast) showToast(`Order updated to ${nextStatus}.`);
        }
        fetchOrders();
      }
    } catch (err) {
      console.error('Error updating order:', err);
      if (showToast) showToast(err.message || 'Failed to update order');
    }
  };

  return (
    <div className="orders-view-container">
      <div className="view-header-strip">
        <div>
          <h2>Marketplace Orders & Escrow Fulfillment</h2>
          <p>
            {role === 'farmer'
              ? 'Manage confirmed sales orders, confirm loading, and track buyer release of payments'
              : 'Track dispatched agricultural produce shipments, verify deliveries, and release payments'}
          </p>
        </div>
        <button className="btn-refresh" onClick={fetchOrders}>
          <RefreshCw size={15} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <RefreshCw size={28} className="spin-anim" />
          <p>Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <Package size={48} />
          <h3>No active orders found</h3>
          <p>When an offer is accepted or a direct purchase is made, orders will track here.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const isFarmer = role === 'farmer';
            const otherParty = isFarmer ? order.buyer : order.farmer;

            return (
              <div key={order._id} className="order-item-card">
                <div className="order-card-header">
                  <div className="order-ref">
                    <span className="tracking-number">Tracking: {order.trackingNumber || 'KS-849201'}</span>
                    <span className="order-date">Placed: {new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="order-badges">
                    <span className={`badge-pill status-${order.orderStatus}`}>
                      {order.orderStatus?.toUpperCase()}
                    </span>
                    <span className={`badge-pill payment-${order.paymentStatus}`}>
                      <ShieldCheck size={13} /> {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="order-crop-summary">
                    <h4>{order.crop?.cropName || 'Produce Batch'}</h4>
                    <p className="crop-meta">
                      Quantity: <strong>{order.quantity} {order.unit || 'quintal'}</strong> @ ₹{order.pricePerUnit}/qtl
                    </p>
                    <div className="total-amount-tag">
                      Total: ₹ {order.totalAmount?.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="order-party-summary">
                    <div className="party-line">
                      <User size={15} />
                      <span>{isFarmer ? 'Buyer' : 'Farmer'}: <strong>{otherParty?.name || 'Verified Partner'}</strong></span>
                    </div>
                    <div className="party-line">
                      <MapPin size={15} />
                      <span>Destination: {order.shippingAddress?.district || 'Rajkot'}, {order.shippingAddress?.state || 'Gujarat'}</span>
                    </div>
                  </div>

                  {/* Status Progression Bar */}
                  <div className="order-stepper">
                    {['placed', 'confirmed', 'in_transit', 'delivered'].map((step, idx) => {
                      const stepOrder = ['placed', 'confirmed', 'in_transit', 'delivered', 'completed'];
                      const currentIdx = stepOrder.indexOf(order.orderStatus);
                      const isComplete = currentIdx >= idx;
                      const isCurrent = order.orderStatus === step;

                      return (
                        <div key={step} className={`step-item ${isComplete ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                          <div className="step-circle">
                            {isComplete ? <CheckCircle size={14} /> : idx + 1}
                          </div>
                          <span className="step-label">{step.replace('_', ' ')}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="order-card-footer">
                  <button 
                    className="btn-invoice"
                    onClick={() => setSelectedInvoiceOrder(order)}
                  >
                    <FileText size={15} />
                    <span>View Invoice Receipt</span>
                  </button>

                  <div className="footer-status-actions">
                    {isFarmer && order.orderStatus === 'confirmed' && (
                      <button 
                        className="btn-action-dispatch"
                        onClick={() => handleUpdateStatus(order._id, 'in_transit', 'Produce dispatched by farmer')}
                      >
                        <Truck size={15} />
                        <span>Dispatch & Mark In-Transit</span>
                      </button>
                    )}

                    {!isFarmer && (order.orderStatus === 'in_transit' || order.orderStatus === 'confirmed') && (
                      <button 
                        className="btn-action-deliver"
                        onClick={() => handleUpdateStatus(order._id, 'delivered', 'Produce received & verified by buyer')}
                      >
                        <CheckCircle size={15} />
                        <span>Confirm Receipt & Release Escrow</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoiceOrder && (
        <div className="invoice-modal-backdrop" onClick={() => setSelectedInvoiceOrder(null)}>
          <div className="invoice-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="invoice-header">
              <div className="invoice-brand">
                <h3>KisanSetu Official Trade Invoice</h3>
                <span>Govt. APMC Compliant Electronic Bill</span>
              </div>
              <button className="btn-close-invoice" onClick={() => setSelectedInvoiceOrder(null)}>✕</button>
            </div>

            <div className="invoice-details-grid">
              <div>
                <strong>Tracking ID:</strong> {selectedInvoiceOrder.trackingNumber}
              </div>
              <div>
                <strong>Date:</strong> {new Date(selectedInvoiceOrder.createdAt).toLocaleDateString('en-IN')}
              </div>
              <div>
                <strong>Farmer:</strong> {selectedInvoiceOrder.farmer?.name} ({selectedInvoiceOrder.farmer?.phone})
              </div>
              <div>
                <strong>Buyer:</strong> {selectedInvoiceOrder.buyer?.name} ({selectedInvoiceOrder.buyer?.businessName})
              </div>
            </div>

            <table className="invoice-items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{selectedInvoiceOrder.crop?.cropName || 'Crop Produce Batch'}</td>
                  <td>{selectedInvoiceOrder.quantity} {selectedInvoiceOrder.unit || 'quintal'}</td>
                  <td>₹ {selectedInvoiceOrder.pricePerUnit}</td>
                  <td>₹ {selectedInvoiceOrder.totalAmount?.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>

            <div className="invoice-footer">
              <div className="invoice-stamp">
                <ShieldCheck size={20} className="text-emerald" />
                <span>Verified by KisanSetu Digital Escrow System</span>
              </div>
              <button className="btn-primary" onClick={() => window.print()}>
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersView;
