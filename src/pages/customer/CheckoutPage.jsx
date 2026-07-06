// CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { placeOrder } from '../../services/orderService';
import CustomerLayout from '../../components/layout/CustomerLayout';
import { formatCurrency } from '../../utils/formatCurrency';
import { ArrowLeft, Wallet, CreditCard, ShoppingBag, ShieldAlert, Sun, Moon } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { token, isLoggedIn, user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [deliveryCity, setDeliveryCity] = useState(user?.city || '');
  const [deliveryLatitude, setDeliveryLatitude] = useState(user?.latitude || '');
  const [deliveryLongitude, setDeliveryLongitude] = useState(user?.longitude || '');
  const [deliveryErrors, setDeliveryErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Default to premium dark theme
  const [isDarkMode, setIsDarkMode] = useState(true);

  const navigate = useNavigate();

  // Guard route
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
    } else if (cartItems.length === 0) {
      navigate('/menu', { replace: true });
    }
  }, [isLoggedIn, cartItems, navigate]);

  useEffect(() => {
    if (user) {
      setDeliveryAddress(user.address || '');
      setDeliveryCity(user.city || '');
      setDeliveryLatitude(user.latitude || '');
      setDeliveryLongitude(user.longitude || '');
    }
  }, [user]);

  const validateDelivery = () => {
    const newErrors = {};
    if (!deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required.';
    }
    if (!deliveryCity.trim()) {
      newErrors.deliveryCity = 'City is required.';
    }
    setDeliveryErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmOrder = async () => {
    if (cartItems.length === 0) return;
    if (!validateDelivery()) return;

    setLoading(true);
    setErrorMessage('');

    const itemsPayload = cartItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));

    try {
      const response = await placeOrder(
        {
          items: itemsPayload,
          payment_method: paymentMethod,
          delivery_address: deliveryAddress,
          delivery_city: deliveryCity,
          delivery_latitude: deliveryLatitude || null,
          delivery_longitude: deliveryLongitude || null,
        },
        token
      );

      const cartSnapshot = [...cartItems];
      clearCart();

      navigate('/confirmation', {
        state: {
          order: response.order || { id: response.order_id, total_amount: response.total_amount, payment_method: paymentMethod, status: 'Pending', created_at: new Date().toISOString() },
          items: cartSnapshot,
        },
        replace: true
      });
    } catch (err) {
      console.error('Order checkout placement failed:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to place order. Please review your server logs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerLayout>
      <div className={`relative overflow-hidden min-h-screen transition-colors duration-500 ${
        isDarkMode 
          ? 'bg-[#070b13] text-slate-100 -mx-4 -my-8 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-8' 
          : 'bg-[#fafaf9] text-slate-900 -mx-4 -my-8 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-8'
      }`}>
        
        {/* Glow Spots */}
        <div className={`absolute top-1/4 left-10 w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none z-0 transition-colors duration-500 ${
          isDarkMode ? 'bg-orange-500/10' : 'bg-orange-300/15'
        }`} />
        <div className={`absolute bottom-1/4 right-10 w-[350px] h-[350px] rounded-full blur-[100px] pointer-events-none z-0 transition-colors duration-500 ${
          isDarkMode ? 'bg-amber-500/5' : 'bg-amber-300/10'
        }`} />

        <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
          {/* Header */}
          <div className={`flex items-center justify-between pb-4 border-b transition-colors duration-500 ${
            isDarkMode ? 'border-slate-900' : 'border-slate-200'
          }`}>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => navigate('/cart')}
                variant="outline"
                size="sm"
                className="px-2.5 py-1.5"
              >
                <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
              </Button>
              <h2 className="text-base font-black uppercase tracking-wider">Checkout Billing</h2>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="px-2.5 py-1.5"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 flex items-start space-x-2 text-red-400 text-xs font-bold leading-relaxed">
              <ShieldAlert className="h-5 w-5 text-red-500 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Left panel: Form */}
            <div className="md:col-span-3 space-y-6">
              {/* Delivery Details */}
              <Card isDarkMode={isDarkMode} className="p-6 border-slate-100 dark:border-slate-850/60 shadow-sm space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wide">Delivery Details</h3>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Pre-filled from your profile credentials</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Delivery Address</label>
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => {
                        setDeliveryAddress(e.target.value);
                        if (deliveryErrors.deliveryAddress) {
                          setDeliveryErrors((prev) => ({ ...prev, deliveryAddress: '' }));
                        }
                      }}
                      rows={3}
                      placeholder="e.g. House No. 4, Street 12, Sector F-8"
                      className={`block w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 bg-white/50 dark:bg-[#090d16]/40 backdrop-blur-sm transition-all duration-200 ${
                        deliveryErrors.deliveryAddress
                          ? 'border-red-300 focus:ring-red-950/30 focus:border-red-500'
                          : 'border-slate-200 dark:border-slate-800 focus:ring-orange-100 dark:focus:ring-orange-950/30 focus:border-orange-500 dark:text-white'
                      }`}
                    />
                    {deliveryErrors.deliveryAddress && <p className="text-xs text-red-450 font-bold mt-1">{deliveryErrors.deliveryAddress}</p>}
                  </div>

                  <Input
                    label="City"
                    value={deliveryCity}
                    onChange={(e) => {
                      setDeliveryCity(e.target.value);
                      if (deliveryErrors.deliveryCity) {
                        setDeliveryErrors((prev) => ({ ...prev, deliveryCity: '' }));
                      }
                    }}
                    type="text"
                    placeholder="e.g. Islamabad"
                    error={deliveryErrors.deliveryCity}
                  />
                </div>
              </Card>

              {/* Payment Method Selector */}
              <Card isDarkMode={isDarkMode} className="p-6 border-slate-100 dark:border-slate-850/60 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wide">Payment Method</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label
                    className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all duration-300 ${
                      paymentMethod === 'Cash'
                        ? 'border-orange-500 bg-orange-500/5 ring-2 ring-orange-500/10'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-xl ${paymentMethod === 'Cash' ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                        <Wallet className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wide">Cash on Delivery</span>
                        <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Pay cash upon delivery</span>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      value="Cash"
                      checked={paymentMethod === 'Cash'}
                      onChange={() => setPaymentMethod('Cash')}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 dark:bg-slate-900 border-slate-800"
                    />
                  </label>
                </div>
              </Card>

              {/* Confirm order button */}
              <Button
                onClick={handleConfirmOrder}
                disabled={loading || cartItems.length === 0}
                className="w-full py-4 text-xs uppercase tracking-widest font-black"
              >
                {loading ? 'Placing order...' : `Confirm Order (${formatCurrency(cartTotal)})`}
              </Button>
            </div>

            {/* Right panel: Order Basket details */}
            <div className="md:col-span-2 space-y-6">
              <Card isDarkMode={isDarkMode} className="p-6 border-slate-100 dark:border-slate-850/60 shadow-sm space-y-4 sticky top-24">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white flex items-center space-x-1.5 pb-2 border-b border-slate-100 dark:border-slate-850/60">
                  <ShoppingBag className="h-4.5 w-4.5 text-orange-500" />
                  <span>Order Basket</span>
                </h3>

                <div className="divide-y divide-slate-100 dark:divide-slate-850/50 max-h-[40vh] overflow-y-auto pr-2 scrollbar-none">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between py-3 text-xs font-bold text-slate-550 dark:text-slate-400">
                      <div className="flex flex-col pr-4 min-w-0">
                        <span className="text-slate-800 dark:text-white truncate font-extrabold">{item.name}</span>
                        <span className="text-[9px] text-slate-400 font-semibold uppercase mt-0.5">Quantity: x{item.quantity}</span>
                      </div>
                      <span className="text-slate-850 dark:text-white flex-shrink-0 font-extrabold">
                        {formatCurrency(parseFloat(item.price) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-850/60 space-y-2.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-slate-850 dark:text-white font-extrabold">{formatCurrency(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span className="text-emerald-500 font-extrabold uppercase tracking-wide">Free</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-850 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-850/60">
                    <span>Grand Total</span>
                    <span className="text-orange-500 text-base">{formatCurrency(cartTotal)}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CheckoutPage;
